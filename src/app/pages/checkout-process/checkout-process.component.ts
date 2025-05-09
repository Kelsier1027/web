/** --------------------------------------------------------------------------------
 *-- Description： product
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, OnInit, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { promoTagLabel } from 'src/app/constants/product.constants';
import { DialogAction, ResponseCode } from 'src/app/enums';
import { PromoMethod } from 'src/app/enums/promotion.enum';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { StorageEnum } from 'src/app/enums/storage.enum';
import { CheckoutUtilService } from 'src/app/services/checkout-util.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { catchError, filter, from, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { AddToCartReplaceItem, City, CityArea, Product } from 'src/app/models';
import { OrderService } from '../../services/order.service';
import { CreateOrderEnum, NotifyType } from 'src/app/enums/order.enum';
import { ProductService } from '../../services';
import { NotifierService } from '../../shared/services';
import {
  ProductGroupService,
  Warehouse,
} from 'src/app/services/product-group.service';
import { MemberService } from '../../services';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { PeriodicElement } from 'src/app/layouts/activity-bonus/activity-bonus.component';
import { STRING_UTIL } from 'src/app/shared/utils/stringUtilities';
import { FixedNavComponent } from 'src/app/layouts/components/fixed-nav/fixed-nav.component';
import { POP_UP } from 'src/app/shared/utils/popUpUtilities';

@Component({
  selector: 'app-checkout-process',
  templateUrl: './checkout-process.component.html',
  styleUrls: ['./checkout-process.component.scss'],
  providers: [CheckoutUtilService],
})
export class CheckoutProcessComponent implements OnInit {
  action = new EventEmitter();
  promoTagLabel: typeof promoTagLabel = promoTagLabel;
  commonlyUsedAddrLength = 0;
  thisHasPurchaserRemarks = false;
  thisLatestPurchaserRemark: any;
  isLoading = true;
  testCount = 0;
  purchaseId: number = 0;
  isUnitPrice = true;
  dataChange = new EventEmitter();
  isButtonVisible = true;
  awards: PeriodicElement[] = [];
  isAddress1 = false;
  isAddress2 = false;
  isAddress3 = false;
  ShowList: boolean = true;
  ShowListColumns: String[] = ['activityName', 'number'];
  cityOption?: City[];
  cityAreaOption!: CityArea[];
  saveCommonUseAddress? = false;
  addrOverLength = false;
  @ViewChild('addressInput') addressInput: any;
  @ViewChild(FixedNavComponent) fixedNav!: FixedNavComponent;

  canUseBonus: boolean = false;

  form = {
    email: '',
    agreeTerms: false,
    isChecked: false,
    clazz: 1,
    deliverInfo: {
      fullAddr: '',
      addrName: '',
      receiver: '',
      contactNo: '',
      phoneNo: '',
    },
    customDeliverInfo: {
      fullAddr: '',
      addrCity: '',
      addrCityArea: '',
      addrName: '',
      receiver: '',
      _addr: '',

      get addr(): string {
        return this._addr;
      },

      set addr(value: string | null | undefined) {
        // 因為這個畫面的輸入欄位實作上不是 app-label-input, 沒辦法用比較通用的驗證
        // 這邊手動處理地址長度的限制 (地址的長度需要用客戶指定的中文字特殊算法)

        if (!value)
          this._addr = '';

        this._addr = STRING_UTIL.spliceUntilUtf8Length(value!, 15);
      },

      contactNo: '',
      phoneNo: '',
      cityCode: '0',
      distCode: '0',
    },
    commentOption: 1,
    commentInfo: {
      comment: '',
    },
    customCommentInfo: {
      id: 1,
      title: '尚未有常用出貨備註',
      comment: '',
    },
    addressOption: 1,
    receiverOption: 1,
    receiptAddressOption: 1,
    receiptReceiverOption: 1,
    carrierCategoryOption: 1,
    shippingMethod: 1,
    mobileBarcode: '',
    loveCode: '',
    poNo: '',
    useBonusPoint: 0,
    savePurchaserRemark: false
  };

  options = {
    addresses: [
      {
        label: '',
        value: 1,
      }
    ],
    receivers: [
      {
        label: '',
        value: 1,
      }
    ],
    receiptAddresses: [
      {
        label: '',
        value: 1,
      }
    ],
    receiptReceivers: [
      {
        label: '',
        value: 1,
      }
    ],
  };

  error: {
    email: string;
    agreeTerms: string;
    customDeliverInfo: {
      [key: string]: string;
    };
    mobileBarcode: string;
    receivers: string;
    receiptReceivers: string;
  } = {
    email: '',
    agreeTerms: '',
    customDeliverInfo: {
      addrName: '',
      receiver: '',
      addr: '',
      contactNo: '',
      phoneNo: '',
      cityCode: '',
      distCode: '',
    },
    mobileBarcode: '',
    receivers: '',
    receiptReceivers: '',
  };

  selectedWarehouse!: Warehouse;
  productGroupService?: ProductGroupService;
  shippingMethods: {
    label: string;
    value: number;
  }[] = [];
  defaultDelivery = {
    label: '貨運',
    value: 1,
  };
  nightlyDelivery = {
    label: '夜配',
    value: 3,
  };
  designatedDelivery = {
    label: '賣場專車',
    value: 4,
  };
  bonusPoints: number = 0;
  dividendDiscount: number = 0;
  inputDividendDiscount: number = 0;
  useBonusPoint: number = 0;
  isHovering: boolean = false;
  specifiedDeliveryFeeExemptedThreshold: number = 0;
  specifiedDeliveryFee: number = 0;
  freight: string = '免運';
  purchaserJobTitle: string = '';
  purchaserName: string = '';
  awardGiftListIds: number[] = [];
  defaultBarcode: string | null = null;
  isQualifiedForCloudInvoice: boolean = false;
  continueWithGift = false;
  continueWithNoFreeShipping = false;
  addressAndContacts: any;
  result: any;

  userDefaultShipAddrId: number = 0;
  companyDefaultShipAddrId: number = 0;

  hasUserDefaultShipAddrInList: boolean = true;
  hasCompanyDefaultShipAddrInList: boolean = true;

  userDefaultBillAddrId: number = 0;
  companyDefaultBillAddrId: number = 0;

  hasUserDefaultBillAddrInList: boolean = true;
  hasCompanyDefaultBillAddrInList: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public layoutService: LayoutService,
    public dialogservice: DialogService,
    private checkoutService: CheckoutService,
    private storageService: StorageService,
    private checkoutUtilService: CheckoutUtilService,
    private currencyPipe: CurrencyPipe,
    private orderService: OrderService,
    private productService: ProductService,
    private notifierService: NotifierService,
    private datePipe: DatePipe,
    private memberService: MemberService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.purchaseId = this.route.snapshot.queryParams['purchaseId'];

        const checkoutList: any = this.storageService.get(
          StorageEnum.checkoutList
        );
        this.awardGiftListIds = checkoutList.awardGiftListIds || [];
        this.isLoading = true;
        this.checkoutService.getCheckout(checkoutList)
          .pipe(
            catchError(_ => {
            this.isLoading = false;
            return of();
          }))
          .subscribe((e) => {
          const {
            subInventory,
            addressesAndContacts,
            bonusPoints,
            usableBonusPoints,
            specifiedDeliveryFeeExemptedThreshold,
            specifiedDeliveryFee,
            awards,
          } = e.result;
          const products: any[] = [];
          subInventory.productBatches.forEach((e: any) => {
            const group: any[] = [];
            if (e.customPromo != null) {
              group.push({
                desc: e.customPromo?.description,
                promoId: e.customPromo?.promoId,
                sum: e.customPromo?.sum,
                price: null,
                name: e.customPromo?.title,
                promoCategory: e.mainProducts[0]?.promoCategory,
                promotionMethod: e.mainProducts[0]?.promotionMethod,
                isactivityName: true,
              });
            }
            e.mainProducts.forEach((main: any) => {
              group.push({
                purchaseItemId: main.purchaseItemId,
                id: main.itemId,
                name: main.name,
                desc: main.subtitle,
                price: main.promoPrice,
                priceWithTax: main.unitPrice,
                qty: main.count,
                availableQuantities: main.purchaseLimit,
                promotionMethod: main.promoMethod,
                subMethod: main.subMethod,
                promoCategory: main.promoCategory,
                selected: false,
                follow: false,
                useOverridePromoPriceText: main.tagName === '任購' ? true : main.useOverridePromoPriceText,
                overridePromoPriceText: main.tagName === '任購' ? 0 : main.overridePromoPriceText,
              });
              main.subProducts.forEach((sub: any) => {
                group.push({
                  purchaseItemId: sub.purchaseItemId,
                  id: sub.itemId,
                  name: sub.name,
                  desc: sub.subtitle,
                  price: sub.promoPrice,
                  priceWithTax: sub.unitPrice,
                  qty: sub.tagName === '配件' ? main.count * sub.ratio : sub.count,
                  availableQuantities: sub.purchaseLimit,
                  promotionMethod: sub.promoMethod,
                  subMethod: main.subMethod,
                  promoCategory: sub.promoCategory,
                  selected: false,
                  follow: false,
                  mainProductId: main.itemId,
                  useOverridePromoPriceText: sub.tagName === '任購' ? true : sub.useOverridePromoPriceText,
                  overridePromoPriceText: sub.tagName === '任購' ? 0 : sub.overridePromoPriceText,
                });
              });

              products.push(group);
            });
          });
          this.selectedWarehouse = {
            id: subInventory.code as unknown as number, // 這個欄位早期開成 number.
            title: subInventory.chineseName,
            productGroups: products,
          };
          this.bonusPoints = bonusPoints;
          this.dividendDiscount = usableBonusPoints;

          this.canUseBonus = e.result.canUseBonus;

          this.form.isChecked = this.canUseBonus;
          this.inputDividendDiscount = this.form.isChecked
            ? usableBonusPoints
            : 0;
          this.useBonusPoint = this.form.isChecked ? usableBonusPoints : 0;
          this.specifiedDeliveryFeeExemptedThreshold =
            specifiedDeliveryFeeExemptedThreshold;
          this.specifiedDeliveryFee = specifiedDeliveryFee;
          this.commonlyUsedAddrLength = e.result.commonlyUsedAddr.length;
          this.thisHasPurchaserRemarks = e.result.hasPurchaserRemarks;
          this.thisLatestPurchaserRemark = e.result.latestPurchaserRemark;
          this.purchaserJobTitle = e.result.purchaserJobTitle;
          this.purchaserName = e.result.purchaserName;
          this.awards = e.result.awards;
          this.form.email = e.result.purchaserEmail;
          this.defaultBarcode = e.result.defaultBarcode || '';
          this.isQualifiedForCloudInvoice = e.result.isQualifiedForCloudInvoice;
          this.addressAndContacts = addressesAndContacts;

          // 可用載具時，預設選中載具
          if (this.isQualifiedForCloudInvoice)
            this.onCarrierCategoryChange(2);

          this.form.mobileBarcode = this.isQualifiedForCloudInvoice
            ? this.defaultBarcode || ''
            : '';

          if (
            this.thisLatestPurchaserRemark &&
            this.thisLatestPurchaserRemark.content.length > 0
          ) {
            this.form.customCommentInfo.title =
              this.thisLatestPurchaserRemark.title;
            this.form.customCommentInfo.comment =
              this.thisLatestPurchaserRemark.content;
          }
          this.form.deliverInfo = e.result.commonlyUsedAddr[0];

          this.options.addresses = addressesAndContacts.shipAddrList.map(
            (e: any) => {
              return {
                value: e.id,
                label: e.fullAddr,
              };
            }
          );

          this.userDefaultShipAddrId = addressesAndContacts.defaultAddr.defaultShipAddrId;
          this.companyDefaultShipAddrId = addressesAndContacts.defaultAddr.companyDefaultShipAddrId;

          this.hasUserDefaultShipAddrInList = this.addressAndContacts.shipAddrList.some((addr: any) => addr.id == this.userDefaultShipAddrId);
          this.hasCompanyDefaultShipAddrInList = this.addressAndContacts.shipAddrList.some((addr: any) => addr.id == this.companyDefaultShipAddrId);


          this.form.addressOption = this.hasUserDefaultShipAddrInList
            ? this.userDefaultShipAddrId
            : this.companyDefaultShipAddrId;
          this.result = e.result;
          this.updateShippingMethods();
          this.productGroupService = new ProductGroupService(
            this.selectedWarehouse
          );

          this.options.receivers = addressesAndContacts.shipContactList.map(
            (e: any) => {
              return {
                value: e.id,
                label: [e.jobTitle, e.name].join(' - '),
              };
            }
          );
          this.form.receiverOption =
            addressesAndContacts.defaultAddr.defaultShipContact;

          // 避免沒有預設收貨人的情境
          if (!this.form.receiverOption)
            this.form.receiverOption = this.options.receivers[0]?.value;

          this.options.receiptAddresses = addressesAndContacts.billAddrList.map(
            (e: any) => {
              return {
                value: e.id,
                label: e.fullAddr,
              };
            }
          );

          this.userDefaultBillAddrId = addressesAndContacts.defaultAddr.defaultBillAddrId;
          this.companyDefaultBillAddrId = addressesAndContacts.defaultAddr.companyDefaultBillAddrId;

          this.hasUserDefaultBillAddrInList = this.addressAndContacts.billAddrList.some((addr: any) => addr.id == this.userDefaultBillAddrId);
          this.hasCompanyDefaultBillAddrInList = this.addressAndContacts.billAddrList.some((addr: any) => addr.id == this.companyDefaultBillAddrId);

          this.form.receiptAddressOption = this.hasUserDefaultBillAddrInList
            ? this.userDefaultBillAddrId
            : this.companyDefaultBillAddrId;

          this.options.receiptReceivers =
            addressesAndContacts.billContactList.map((e: any) => {
              return {
                value: e.id,
                label: [e.jobTitle, e.name].join(' - '),
                mobileBarCode: e.mobileBarCode,
              };
            });
          this.form.receiptReceiverOption =
            addressesAndContacts.defaultAddr.defaultBillContact;

          // 避免沒有預設發票收件人的情境
          if (!this.form.receiptReceiverOption)
            this.form.receiptReceiverOption = this.options.receiptReceivers[0]?.value;

          // 地址反應
          this.noDefaultAddressPopup();

          this.usingCompanyAddressPopup();

          this.isLoading = false;
        });
      }
    });
  }

  private usingCompanyAddressPopup(): boolean {
    const changedAddress = [
      !this.hasUserDefaultShipAddrInList && this.hasCompanyDefaultShipAddrInList ? "送貨地址" : "",
      !this.hasUserDefaultBillAddrInList && this.hasCompanyDefaultBillAddrInList ? "發票寄送地址" : ""
    ]
      .filter(addr => !!addr.length);

    if (changedAddress.length) {
      const changedAddressConcat = changedAddress.join('、');
      POP_UP.showMessage(this.dialogservice, `已使用公司預設${changedAddressConcat}`, `個人${changedAddressConcat}失效，為您改為公司${changedAddressConcat}，若需更新請至會員中心修改。`);
    }

    return !!changedAddress.length;
  }

  private noDefaultAddressPopup(): boolean {
    let completelyNoAddress = [];

    if (!this.hasUserDefaultShipAddrInList && !this.hasCompanyDefaultShipAddrInList)
    {
      this.form.addressOption = 0;
      completelyNoAddress.push('送貨地址');
    }

    if (!this.hasUserDefaultBillAddrInList && !this.hasCompanyDefaultBillAddrInList)
    {
      this.form.receiptAddressOption = 0;
      completelyNoAddress.push('發票寄送地址');
    }

    if (completelyNoAddress.length) {
      const completelyNoAddressConcat = completelyNoAddress.join('、');
      POP_UP.showMessage(this.dialogservice, `預設${completelyNoAddressConcat}已失效`, "公司預設地址變更申請中，如欲使用預設地址，請等待變更完畢或使用客服詢問。");
    }

    return !!completelyNoAddress.length;
  }

  get thisSaturday() {
    // 取得今天的日期
    const today = new Date();

    // 取得今天是星期幾（0 是星期日，1 是星期一，以此類推）
    const dayOfWeek = today.getDay();

    // 計算要加多少天才能到達下個星期六
    const daysUntilSaturday = 6 - dayOfWeek;

    // 複製今天的日期並加上天數，得到這週六的日期
    const nextSaturday = new Date(today);
    nextSaturday.setDate(today.getDate() + daysUntilSaturday);
    return this.datePipe.transform(nextSaturday, 'yyyy/MM/dd');
  }

  ngOnInit(): void {
    this.memberService
      .getCity()
      .pipe(
        filter((res) => res.responseCode === ResponseCode.Success),
        map((res) => {
          this.cityOption = res.result.data || '';
        })
      )
      .subscribe();
  }
  getCityArea(city: any): void {
    this.memberService
      .getCityArea(city.source.selected.viewValue)
      .pipe(
        filter((res) => res.responseCode === ResponseCode.Success),
        map((res) => {
          this.cityAreaOption = res.result.data || '';
        })
      )
      .subscribe();
  }
  get selectedWarehouseMainProductCount() {
    const selectedWarehouse = this.selectedWarehouse;
    if (!selectedWarehouse) {
      return 0;
    }

    return selectedWarehouse.productGroups.reduce((totalCount, products) => {
      return (
        totalCount + products.filter((item) => this.isMainProduct(item)).length
      );
    }, 0);
  }

  get totalPrice() {
    return this.selectedWarehouse?.productGroups.reduce(
      (totalPrice, products) => {
        return (
          totalPrice +
          products.reduce((productTotalPrice, product) => {
            if (!product.price && !product.priceWithTax) return productTotalPrice;
            return (
              productTotalPrice +
              (product.price != null
                ? product.price * product.qty
                : product.priceWithTax * product.qty)
            );
          }, 0)
        );
      },
      0
    );
  }

  get totalTax() {
    const usingBonus = this.form.isChecked
      ? this.inputDividendDiscount
      : 0;
    return Math.round((this.totalPrice - usingBonus) * 0.05);
  }

  get totalPriceWithTax() {
    let defaultPrice = this.totalPrice + this.totalTax;

    if (this.form.isChecked) defaultPrice -= this.inputDividendDiscount;

    defaultPrice += this.getFreightFree();

    return defaultPrice;
  }

  isMainProduct(product: any) {
    return (
      !product.mainProductId ||
      product.promotionMethod == PromoMethod.AdditionalItem
    );
  }

  getPromotionTag(promotionMethod: number, promoCategory: number) {
    if (promotionMethod && promoCategory)
      return promoTagLabel[promoCategory][promotionMethod];
    return {
      text: '',
      label: '',
      color: '',
    };
  }

  toPrice(num: number) {
    return this.currencyPipe.transform(
      num ? num : 0,
      '',
      'symbol',
      '1.0-0'
    ) as string;
  }

  onEmailChange(email: string) {
    this.form.email = email;
  }

  toggleIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  noFreeShippingDialog(submit = false) {
    const modelOption = {
      modelName: 'simple-dialog',
      config: {
        data: {
          title: '指送未達免運門檻',
          StyleMargin: '0px',
          text: `指送未達免運門檻，將額外酌收運費${this.specifiedDeliveryFee}元`,
          displayFooter: true,
          confirmButton: '確認',
          confirm: () => {
            if(submit) {
              this.continueWithNoFreeShipping = true;
              this.submit();
            }
          }
        },
        width: '500px',
        height: '204px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: '',
      }
    };

    this.dialogservice.openLazyDialog(
      modelOption.modelName,
      modelOption.config
    )
  }

  awardGiftRemindDialog(submit = false) {
    const modelOption = {
      modelName: 'simple-dialog',
      config: {
        data: {
          title: '隨單領取達成禮&贈品',
          StyleMargin: '0px',
          text: '您有勾選隨單領取達成禮或贈品，請確認是否將此商品送至指送地址，送出訂單後均無法取消。',
          displayFooter: true,
          confirmButton: '確認',
          cancelButton: '取消隨單領取',
          cancel: () => {
            this.awardGiftListIds = [],
            this.awards = []
          },
          confirm: () => { if(submit) {
            this.continueWithGift = true;
            this.submit();
          }},
        },
        width: '500px',
        height: '204px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: '',
      }
    };

    this.dialogservice.openLazyDialog(
      modelOption.modelName,
      modelOption.config,
    )
  }

  submit() {
    this.fixedNav.closeChat(); // 關閉客服視窗，讓使用者在後續流程選擇聯繫客服時能再度打開，引導使用者注目

    this.error.email = '';
    this.error.agreeTerms = '';

    Object.keys(this.error.customDeliverInfo).forEach((prop) => {
      this.error.customDeliverInfo[prop] = '';
    });

    // 送貨地址檢查
    // 1. 公司地址
    // 2. 指送 or 手動輸入

    if (this.form.clazz === 1 && !this.form.addressOption)
    {
      if (this.options.addresses.length)
      {
        POP_UP.showMessage(this.dialogservice, '欄位未填寫', '請選擇送貨地址。');
        return;
      } else {
        POP_UP.showMessage(this.dialogservice, '預設送貨地址變更申請中', '公司預設送貨地址變更申請中，請等待變更完畢或使用客服詢問。');
        return;
      }
    } else if (this.form.clazz !== 1){
      if (this.hasUserDefaultShipAddrInList || this.hasCompanyDefaultShipAddrInList)
      {
        this.form.addressOption = this.hasUserDefaultShipAddrInList
        ? this.userDefaultShipAddrId
        : this.companyDefaultShipAddrId;
      } else {
        POP_UP.showMessage(this.dialogservice, '預設送貨地址變更申請中', '公司預設送貨地址變更申請中，請等待變更完畢或使用客服詢問。');
        return;
      }
    }

    // 發票收件地址檢查

    if (!this.form.receiptAddressOption) {
      if (this.options.receiptAddresses.length)
        {
          POP_UP.showMessage(this.dialogservice, '欄位未填寫', '請選擇發票寄送地址。');
          return;
        } else {
          POP_UP.showMessage(this.dialogservice, '預設發票寄送地址變更申請中', '公司預設發票寄送地址變更申請中，請等待變更完畢或使用客服詢問。');
          return;
        }
    }

    let deliverInfoHasError = false;
    if (this.awardGiftListIds.length > 0 && (this.form.clazz === 2 || this.form.clazz === 3) && this.continueWithGift === false) {
      this.awardGiftRemindDialog(true)
      return;
    }

    if(this.form.clazz === 2 && (this.totalPrice < this.specifiedDeliveryFeeExemptedThreshold) && this.continueWithNoFreeShipping === false) {
      this.noFreeShippingDialog(true)
      return;
    }
    // if(this.continueWithNoFreeShipping === false) return;
    if (this.form.clazz == 3) {
      deliverInfoHasError = !this.validateDeliveryInfo();
      if (deliverInfoHasError) {
        document.querySelector('#header-delivery-info')?.scrollIntoView();
      } else if(this.saveCommonUseAddress === true) {
        if(this.addrOverLength){
          return;
        }
        const zipCode = this.cityAreaOption.find(
          (area) => area.area === this.form.customDeliverInfo.addrCityArea
        );
        const api = this.memberService.addCommonAddress({
          addrName: this.form.customDeliverInfo.addrName,
          addrCity: this.form.customDeliverInfo.addrCity,
          addrCityArea: this.form.customDeliverInfo.addrCityArea,
          addrZipCode: zipCode?.zipCode || '',
          addr: this.form.customDeliverInfo.addr,
          receiver: this.form.customDeliverInfo.receiver,
          contactNo: this.form.customDeliverInfo.contactNo,
          phoneNo: this.form.customDeliverInfo.phoneNo,
        })
        api.subscribe((res) => {
          if (res.responseCode === ResponseCode.Success) {
            this.notifierService.showInfoNotification(
              '常用指送地址已新增成功'
            )
          } else {
            this.notifierService.showErrorNotification(
              '常用指送地址新增失敗'
            )
          }
        })
      }
    }

    if (this.form.clazz == 2 && this.commonlyUsedAddrLength == 0) {
      deliverInfoHasError = true;
      const modelOption = {
        modelName: 'simple-dialog',
        config: {
          data: {
            title: '尚未常用指送地址',
            StyleMargin: '0px',
            text: `您尚未儲存任何常用指送地址，請選擇其他配送類別。`,
            displayFooter: true,
            confirmButton: '確認',
          },
          width: '500px',
          height: '204px',
          hasBackdrop: true,
          autoFocus: false,
          enterAnimationDuration: '300ms',
          exitAnimationDuration: '300ms',
          panelClass: '',
        },
      };

      this.dialogservice.openLazyDialog(
        modelOption.modelName,
        modelOption.config
      );
    }

    const receiptInfoHasError = !this.validateReceiptInfo();
    if (receiptInfoHasError) {
      document.querySelector('#header-receipt-info')?.scrollIntoView();
    }

    const otherInfoHasError = !this.validateOtherInfo();
    if (otherInfoHasError) {
      document.querySelector('#header-other-info')?.scrollIntoView();
    }

    const agreeTermsotherInfoHasError = !this.validateAgreeTerms();
    if (agreeTermsotherInfoHasError) {
      document.querySelector('#check-agree-terms')?.scrollIntoView();
    }

    if (
      !otherInfoHasError &&
      !agreeTermsotherInfoHasError &&
      !deliverInfoHasError &&
      !receiptInfoHasError
    ) {
      const ids = this.checkoutUtilService.flatSelectedPurchaseItemIds(
        this.selectedWarehouse?.productGroups,
        false
      );

      const param = {
        purchaseId: this.purchaseId,
        purchaseItemIds: ids,
        shipAddressId: this.form.addressOption,
        shipContactId: this.form.receiverOption,
        shipContactPhone: this.form.customDeliverInfo.phoneNo,
        invoiceAddressId: this.form.receiptAddressOption,
        invoiceContactId: this.form.receiptReceiverOption,
        customerPoNumber: this.form.poNo,
        purchaserRemarkId:
          this.form.commentOption === 1 ? 0 : this.form.customCommentInfo.id,
        purchaserRemarkTitle:
          this.form.commentOption === 1
            ? null
            : this.form.customCommentInfo.title,
        purchaserRemark:
          this.form.commentOption === 1
            ? this.form.commentInfo.comment
            : this.form.customCommentInfo.comment,
        email: this.form.email,
        shippingMethod: this.form.shippingMethod,
        useBonusPoint: this.form.isChecked ? this.inputDividendDiscount : 0,
        lastSeenBonusPoints: 0,
        loveCode: this.form.loveCode,
        carrierId:
          this.form.carrierCategoryOption === 2 ? this.form.mobileBarcode : '',
        citizenPersonalCertificate: '',
        invoiceType: this.form.carrierCategoryOption === 2 ? '手機條碼' : '無',
        awardGiftListIds: this.awardGiftListIds,
        commonlyUsedAddr:
          // 自行輸入
          this.form.clazz === 3
            ? {
                EXT_NAME: this.form.customDeliverInfo.addrName,
                EXT_CITY: this.form.customDeliverInfo.addrCity,
                EXT_CITY_AREA: this.form.customDeliverInfo.addrCityArea,
                //EXT_ZIP_CODE: this.form.customDeliverInfo.cityCode,
                EXT_ADDRESS: this.form.customDeliverInfo.addr,
                EXT_REVEIVER: this.form.customDeliverInfo.receiver,
                EXT_PHONE_NUM1: this.form.customDeliverInfo.contactNo,
                EXT_PHONE_NUM2: this.form.customDeliverInfo.phoneNo,
                ASSIGN_SEND: 'no',
                ADD_EXT_DELIVERY: true,
              }
            :
            // 常用指送地址
            this.form.clazz === 2
            ? this.form.deliverInfo
            : undefined,
        SavePurchaserRemark: this.form.savePurchaserRemark,
      };

      this.isLoading = true;

      this.checkoutService
        .createOrder(
          param
          // FIXME: remove mock data before the production
          //   {
          //   serverTime: '2023/08/25 00:00:00',
          //   responseCode: CreateOrderEnum.GiftsOrAccessoriesFullyGiven,
          //   responseMessage: '贈品、配件已贈完，將不會進行出貨',
          //   result: {
          //     purchaseItemId: 1,
          //   }
          // }
        )
        .pipe(
          catchError(_ => {
            this.isLoading = false;
            return of();
          }),
          mergeMap((res: any) => {
            this.isLoading = false;
            if (res.responseCode === ResponseCode.Success) {
              return of({
                responseCode: res.responseCode,
                data: this.orderService.getModalOption(res),
                item: res.result,
              });
            } else {
              return from(
                this.dialogservice.openLazyDialog(
                  this.orderService.getModalOption(res).modelName,
                  this.orderService.getModalOption(res).config
                )
              ).pipe(
                switchMap((ref: any) => ref.afterClosed()),
                map((data: any) => {
                  return {
                    ...data,
                    responseCode: res.responseCode,
                    item: res.result,
                  };
                })
              );
            }
          })
        )
        .subscribe((res: any) => this.postCreateOrderCheck(res, param));
    } else {
    }
  }

  createOrderPayLater(param: any) {
    const ids = this.checkoutUtilService.flatSelectedPurchaseItemIds(
      this.selectedWarehouse?.productGroups,
      false
    );

    this.isLoading = true;
    this.checkoutService
      .createOrder({...param, payLater: true})
      .pipe(
        catchError(_ => {
          this.isLoading = false;
          return of();
        }),
        mergeMap((res: any) => {
          this.isLoading = false;
          if (res.responseCode === ResponseCode.Success) {
            return of({
              responseCode: res.responseCode,
              data: this.orderService.getModalOption(res),
              item: res.result,
              serverTime: res.serverTime,
            });
          } else {
            return from(
              this.dialogservice.openLazyDialog(
                this.orderService.getModalOption(res).modelName,
                this.orderService.getModalOption(res).config
              )
            ).pipe(
              switchMap((ref: any) => ref.afterClosed()),
              map((data: any) => {
                return {
                  ...data,
                  responseCode: res.responseCode,
                  item: res.result,
                  serverTime: res.serverTime,
                };
              })
            );
          }
        })
      )
      .subscribe((res: any) => {
        this.storageService.set(StorageEnum.CheckoutResult, {
          ...res.item,
          serverTime: res.serverTime,
        });
        this.router.navigate(['/OrderIncomplete']);
      });
  }

  validateDeliveryInfo() {
    const addrName = this.form.customDeliverInfo.addrName;
    this.error.customDeliverInfo['addrName'] =
      !addrName || addrName.length == 0 ? '必填欄位' : '';

    this.error.customDeliverInfo['cityCode'] =
      this.form.customDeliverInfo.addrCity == '' ? '必選欄位' : '';
    this.error.customDeliverInfo['distCode'] =
      this.form.customDeliverInfo.addrCityArea == '' ? '必選欄位' : '';

    const addr = this.form.customDeliverInfo.addr;
    /*
    this.error.customDeliverInfo['addr'] =
      !addr || addr.length == 0 ? '必填欄位' : '';*/

    // 檢查 addr 是否為必填欄位
    this.error.customDeliverInfo['addr'] =
      !addr || addr.length === 0 ? '必填欄位' : '';

    const receiver = this.form.customDeliverInfo.receiver;
    this.error.customDeliverInfo['receiver'] =
      !receiver || receiver.length == 0 ? '必填欄位' : '';

    const contactNo = this.form.customDeliverInfo.contactNo;
    this.error.customDeliverInfo['contactNo'] =
      !contactNo || contactNo.length == 0 ? '必填欄位' : '';

    if (this.error.customDeliverInfo['contactNo'].length) {
      this.error.customDeliverInfo['contactNo'] = !(
        ((contactNo.replace(/[^-_#EXText().0-9]/g, '') || '').length != 0)
      )
        ? '電話號碼格式錯誤'
        : '';
    }

    const phoneNo = this.form.customDeliverInfo.phoneNo;

    this.error.customDeliverInfo['phoneNo'] =
      phoneNo &&
      !((phoneNo.match(/^(\d{4})-(\d{3})-(\d{3})$/) || []).length > 0)
        ? '行動電話號碼格式錯誤'
        : '';

    return Object.keys(this.error.customDeliverInfo).every((prop) => {
      return this.error.customDeliverInfo[prop].length == 0;
    });
  }

  validateContactNo() {
    const contactNo = this.form.customDeliverInfo.contactNo;
    this.error.customDeliverInfo['contactNo'] =
      !contactNo || contactNo.length === 0 ? '必填欄位' : '';

    if (this.error.customDeliverInfo['contactNo'].length === 0) {
      this.error.customDeliverInfo['contactNo'] = !(
        ((contactNo.replace(/[^-_#EXText().0-9]/g, '') || '').length != 0)
      )
        ? '電話號碼格式錯誤'
        : '';
    }
    return Object.keys(this.error.customDeliverInfo).some((prop) => {
      return this.error.customDeliverInfo[prop].length === 0;
    });
  }

  validatePhoneNo() {
    const phoneNo = this.form.customDeliverInfo.phoneNo;
    this.error.customDeliverInfo['phoneNo'] =
      phoneNo &&
      !((phoneNo.match(/^(\d{4})-(\d{3})-(\d{3})$/) || []).length > 0)
        ? '行動電話號碼格式錯誤'
        : '';

    return Object.keys(this.error.customDeliverInfo).some((prop) => {
      return this.error.customDeliverInfo[prop].length === 0;
    });
  }

  validateReceiptInfo() {
    if (this.form.carrierCategoryOption == 1) {
      this.error.mobileBarcode = '';
      return true;
    }
    if (this.form.carrierCategoryOption == 2) {
      this.error.mobileBarcode = !(
        (this.form.mobileBarcode.match(/\/[0-9A-Z\.\-\+]{7}/) || []).length > 0
      )
        ? '手機條碼格式錯誤'
        : '';
    }
    return this.error.mobileBarcode.length == 0;
  }

  validateOtherInfo() {
    const emailResp = Validators.email({
      value: this.form.email,
    } as any);

    const emailRequiredResp = Validators.required({
      value: this.form.email,
    } as any);

    const receiversRequiredResp = Validators.required({
      value: this.form.receiverOption || '',
    } as any);

    const receiptReceiverRequiredResp = Validators.required({
      value: this.form.receiptReceiverOption || '' ,
    } as any);


    const emailNotMatchFormat = emailResp ? emailResp['email'] : false;
    const emailNotRequired = emailRequiredResp
      ? emailRequiredResp['required']
      : false;
    const receiversNotRequired = receiversRequiredResp
      ? receiversRequiredResp['required']
      : false;
    const receiptReceiverNotRequired = receiptReceiverRequiredResp
      ? receiptReceiverRequiredResp['required']
      : false;

    this.error.email = ''
    this.error.receivers = ''
    this.error.receiptReceivers = ''

    if (emailNotMatchFormat) {
      this.error.email = 'Email格式不正確';
    } else if (emailNotRequired) {
      this.error.email = '必填欄位';
    }

    // 只有公司地址時需要檢查 ReceiverOption
    if (receiversNotRequired && this.form.clazz == 1) {
      this.error.receivers = '必填欄位';
    }

    if (receiptReceiverNotRequired) {
      this.error.receiptReceivers = '必填欄位';
    }

    return  this.error.email.length === 0 &&
            this.error.receivers.length === 0 &&
            this.error.receiptReceivers.length === 0;
  }

  validateAgreeTerms() {
    const agreeTermsResp = Validators.requiredTrue({
      value: this.form.agreeTerms,
    } as any);

    this.error.agreeTerms = (
      agreeTermsResp ? agreeTermsResp['required'] : false
    )
      ? '必填欄位'
      : '';
    return this.error.agreeTerms.length == 0;
  }

  async deliveryAddressesDialog() {
    const modalOption = {
      modelName: 'common-address-dialog',
      config: {
        data: {
          title: '常用指送地址',
        },
        width: '1052px',
        height: '500px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: '',
      },
    };

    const dialogRef = await this.dialogservice.openLazyDialog(
      modalOption.modelName,
      modalOption.config
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result.action == DialogAction.Save) {
        this.form.deliverInfo = {
          ...result.data,
        };
      }
    });
  }

  async deliveryRemarkDialog() {
    const modelOption = {
      modelName: 'delivery-remark-dialog',
      config: {
        data: {
          title: '常用出貨備註',
        },
        width: '1052px',
        height: '500px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: 'delivery-remark',
      },
    };

    const dialofRef = await this.dialogservice.openLazyDialog(
      modelOption.modelName,
      modelOption.config
    );
    dialofRef.afterClosed().subscribe((result) => {
      if (result.action == DialogAction.Save) {
        this.form.customCommentInfo = { ...result.data };
      }
    });
  }

  internetTradingTermsDialog() {
    const modelOption = {
      modelName: 'internet-trading-terms',
      config: {
        data: {
          title: '網路下單條款',
          titleStyle: {
            width: '100%',
            'margin-left': '32px',
          },
        },
        width: '820px',
        height: '500px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: '',
      },
    };

    this.dialogservice.openLazyDialog(
      modelOption.modelName,
      modelOption.config
    );
  }

  saveCommonAddressChange(event: MatCheckboxChange): void {
    this.saveCommonUseAddress = event.checked;
  }

  // TODO remove
  async testsubmit() {
    this.router.navigate(['/ShoppingCart']);
  }

  private postCreateOrderCheck(data: {
    action: DialogAction;
    item: AddToCartReplaceItem | any;
    responseCode: CreateOrderEnum;
    shippingMethod: number;
    data: any;
  }, param: any): void {
    let errorProduct = null;
    if (data.item) {
      errorProduct = this.findProductByPurchaseItemId(
        data.item.purchaseItemId!
      );
    }

    this.resetPriceErrors();
    switch (data.responseCode) {
      case CreateOrderEnum.Success:
        this.storageService.set(StorageEnum.CheckoutResult, data.item);
        this.router.navigate(['/OrderComplete']);
        break;
      case CreateOrderEnum.NightDeliveryTimeOverdue:
      case CreateOrderEnum.SaturdayDeliveryOverdue:
      case CreateOrderEnum.StoreDeliveryTruckOverdue:
        if (data.action === DialogAction.Save) {
          this.form.shippingMethod = data.data.shippingMethod;
        }
        break;
      case CreateOrderEnum.PurchaseAmountQualifiesFreeShipping:
        // TODO: Handle purchase amount qualifies free shipping case
        break;
      case CreateOrderEnum.GiftsOrAccessoriesOutOfStockLater:
        if (data.item != null) {
          this.setPriceError(errorProduct, '庫存量不足，將事後進行補貨');
        }
        break;
      case CreateOrderEnum.GiftsOrAccessoriesFullyGiven:
        this.setPriceError(errorProduct, '商品已贈完');
        break;
      case CreateOrderEnum.ReplaceGiftsOrAccessoriesOutOfStock:
        if (data.action === DialogAction.Cancel) {
          this.setPriceError(errorProduct, '商品已贈完');
        } else if (data.action === DialogAction.Save) {
          this.setPriceError(errorProduct, '商品已贈完，已替代其他商品');
        }
        break;
      case CreateOrderEnum.CreditBalanceCorrect:
        if (data.action === DialogAction.Save) {
          this.updateNotification(NotifyType.ContactSales);
        } else {
          this.updateNotification(NotifyType.AbandonOrder);
        }
        break;
      case CreateOrderEnum.CreditLimitSufficientDigitalProduct:
        if (data.action === DialogAction.Save) {
          this.updateNotification(NotifyType.ContactSales);
        } else {
          this.updateNotification(NotifyType.AbandonOrder);
        }
        break;
      case CreateOrderEnum.CreditLimitSufficientNonDigitalProduct:
        if (data.action === DialogAction.Cancel) {
          this.updateNotification(NotifyType.ContactSales);
          this.fixedNav.toggleCustomer();
          this.notifierService.showInfoNotification('已為您開啟線上客服');
        } else if (data.action === DialogAction.Save) {
          this.createOrderPayLater(param);
        } else {
          this.updateNotification(NotifyType.AbandonOrder);
        }
        break;
      default:
        if (data.action === DialogAction.Cancel) {
          this.router.navigate(['/ShoppingCart']);
        } else if (data.action === DialogAction.Save) {
          let selectedProduct: any;
          this.productGroupService?.productHandler(
            () => {
              return true;
            },
            (product: any) => {
              selectedProduct = product;
            }
          );
          if (selectedProduct) {
            this.setPriceError(errorProduct, '商品已贈完，已替代其他商品');
            this.productService
              .contactMe({
                itemNumber: selectedProduct.id,
                itemName: selectedProduct.name,
              })
              .subscribe((res) => {
                if (res.responseCode === ResponseCode.Success) {
                  this.notifierService.showInfoNotification(res.result);
                }
              });
          }
        }
        break;
    }
  }

  setPriceError(product: { priceError: string } | null, message: string) {
    if (product) {
      product.priceError = message;
    }
  }

  resetPriceErrors() {
    this.productGroupService?.productHandler(
      () => {
        return true;
      },
      (product: any) => {
        product.priceError = '';
      }
    );
  }

  findProductByPurchaseItemId(purchaseItemId: number): any | null {
    let product = null;
    this.productGroupService?.productHandler(
      (product: any) => product.purchaseItemId === purchaseItemId,
      (item: any) => {
        product = item;
      }
    );
    return product;
  }

  public updateShippingMethods(): void {
    this.shippingMethods = this.createShippingMethods(this.result);
    this.form.shippingMethod = this.defaultDelivery.value;
  }

  private createShippingMethods(result: any) {
    const shippingMethods = [];
    shippingMethods.push(this.defaultDelivery);

    // 配送方式可不可以選, 要看現在選中的送貨地址
    // 所以利用 addressOption (=地址 ID) 從 result.addressesAndContacts.shipAddrList 中拿

    const shipAddr = this.addressAndContacts.shipAddrList.filter((addr: any) => addr.id == this.form.addressOption)[0];

    if (!shipAddr)
      return shippingMethods;

    if (result.isQualifiedForNightlyDelivery && shipAddr.isQualifiedForNightlyDelivery) {
      shippingMethods.push(this.nightlyDelivery);
    }
    if (result.isQualifiedForSaturdayDelivery && shipAddr.isQualifiedForSaturdayDelivery) {
      shippingMethods.push({
        label: `${this.thisSaturday} 到貨`,
        value: 2,
      });
    }
    if (result.isQualifiedForDesignatedDelivery && shipAddr.isQualifiedForDesignatedDelivery) {
      shippingMethods.push(this.designatedDelivery);
    }

    return shippingMethods;
  }

  get productTotalCount() {
    const ids = this.checkoutUtilService.flatSelectedPurchaseItemIds(
      this.selectedWarehouse?.productGroups,
      false
    );
    return ids.length;
  }

  unitPriceChange(isUnitPrice: boolean) {
    this.isUnitPrice = isUnitPrice;
    this.dataChange.emit({
      isUnitPrice,
      sortField: isUnitPrice ? 'unitPrice' : 'priceWithTax',
    });
  }

  showFirstBlock(isShow: boolean) {
    this.isButtonVisible = !isShow;
  }
  toPrice2(price: any, qty: any, priceWithTax: any) {
    if (price !== null) {
      return price * qty;
    } else {
      return priceWithTax * qty;
    }
  }

  onDividendDiscountInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    if (Number(value) > this.dividendDiscount) {
      this.inputDividendDiscount = this.dividendDiscount;
      (event.target as HTMLInputElement).value =
        this.dividendDiscount.toString();
    } else {
      this.inputDividendDiscount = Number(value);
    }
  }

  onDividendDiscountChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    if (Number(value) > this.dividendDiscount) {
      this.inputDividendDiscount = this.dividendDiscount;
      (event.target as HTMLInputElement).value =
        this.dividendDiscount.toString();
    } else {
      this.inputDividendDiscount = Number(value);
      (event.target as HTMLInputElement).value = Number(value).toString();
    }
  }

  getFreightFree(): number {
    const lessThanNoFeeThreshold = this.totalPrice < this.specifiedDeliveryFeeExemptedThreshold;
    const isCompanyAddress = this.form.clazz === 1;

    return !isCompanyAddress && lessThanNoFeeThreshold ? this.specifiedDeliveryFee : 0;
  }

  onSelectionChange(value: number) {
    this.form.clazz = value;

    const wasNoFee = this.freight == '免運';

    const freightAmount = this.getFreightFree();
    const nowHasFee = freightAmount != 0;

    this.freight = nowHasFee ? this.getFreightFree().toString() : '免運';

    if (wasNoFee && nowHasFee) {
      this.noFreeShippingDialog();
    }

    if(this.awardGiftListIds.length > 0) {
      this.awardGiftRemindDialog();
    }
  }

  freightText() {
    if (isNaN(Number(this.freight))) return this.freight;
    else return `+${this.toPrice(Number(this.freight))}`;
  }

  onCarrierCategoryChange(value: number) {
    this.form.carrierCategoryOption = value;
  }

  onReceiptReceiverChange(id: number) {
    // 因應客戶需求, 不再自動代入手機條碼
    // 目前這裡不做任何事
  }

  ChangeAddressChoice(id: number) {
    this.isAddress1 = false;
    this.isAddress2 = false;
    this.isAddress3 = false;
    switch (id) {
      case 1:
        this.isAddress1 = true;
        this.form.clazz = 1;
        break;
      case 2:
        this.isAddress2 = true;
        this.form.clazz = 2;
        break;
      case 3:
        this.isAddress3 = true;
        this.form.clazz = 3;
    }
    if(this.awardGiftListIds.length > 0 && (this.form.clazz === 3 || this.form.clazz === 2)) {
      this.awardGiftRemindDialog();
    }
  }
  ChangecommentOptionChoice(id: number) {
    switch (id) {
      case 1:
        this.form.commentOption = 1;
        break;
      case 2:
        this.form.commentOption = 2;
    }
  }
  togglelist() {
    this.ShowList = !this.ShowList;
    if (this.ShowListColumns.length == 0) {
      this.ShowListColumns = ['activityName', 'number'];
    } else {
      this.ShowListColumns = [];
    }
  }

  getAddrLengthForView(): number {
    return STRING_UTIL.utf8LengthForView(this.form.customDeliverInfo.addr);
  }

  updateAddressInput(){
    if (!this.addressInput?.nativeElement)
      return;

    this.addressInput.nativeElement.value = this.form.customDeliverInfo.addr;
  }

  getFreightTooltip(): string {
    const threshold = STRING_UTIL.priceToString(this.specifiedDeliveryFeeExemptedThreshold);
    const fee = STRING_UTIL.priceToString(this.specifiedDeliveryFee);
    return `• 單筆訂單未滿${threshold}元(未)酌收${fee}元\n• 運費暫不配送離島、偏遠地區 & 郵政信箱。偏遠地區明細請參考重要公告`;
  }

  updateNotification(type: NotifyType) {
    const ids = this.checkoutUtilService.flatSelectedPurchaseItemIds(
      this.selectedWarehouse.productGroups,
      false
    );

    this.checkoutService.createNotify({
      purchaseId: this.purchaseId,
      purchaseItems: ids,
      notifyType: type,
      subTotal: this.totalPrice,
      freightCharge: this.getFreightFree(),
      tax: this.totalTax,
      total: this.totalPriceWithTax,
      giftListId: this.awardGiftListIds
    }).subscribe((res) => {
      if (res.responseCode === ResponseCode.Failed) {
        this.notifierService.showErrorNotification('通知失敗');
      }
    })
  }
}
export { PeriodicElement };

