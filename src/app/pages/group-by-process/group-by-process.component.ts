import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { promoTagLabel } from 'src/app/constants/product.constants';
import { StorageService } from 'src/app/core/services/storage.service';
import { PromoMethod } from 'src/app/enums';
import { MemberService, ProductService } from 'src/app/services';
import { CheckoutUtilService } from 'src/app/services/checkout-util.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductGroupService, Warehouse } from 'src/app/services/product-group.service';
import { DialogService, LayoutService, NotifierService } from 'src/app/shared/services';
import { DialogAction, ResponseCode } from 'src/app/enums';
import { City, CityArea } from 'src/app/models';
import { filter, map, tap, switchMap, mergeMap, from, of, catchError } from 'rxjs';
import { StorageEnum } from 'src/app/enums/storage.enum';
import { Validators } from '@angular/forms';
import { STRING_UTIL } from 'src/app/shared/utils/stringUtilities';

export interface PeriodicElement {
  name: string;
  type: string;
  product: string;
  qty: number
  date: string;
}

@Component({
  selector: 'app-group-by-process',
  templateUrl: './group-by-process.component.html',
  styleUrls: ['./group-by-process.component.scss'],
  providers: [CheckoutUtilService]
})
export class GroupByProcessComponent implements OnInit {


  Thisgroup: any[] = [];
  ThisitemId: number = 0;
  ThispromoId: number = 0;

  qty: number = 0;
  bonusPoints: number = 0;
  dividendDiscount: number = 0;
  inputDividendDiscount: number = 0;
  isLoading = true;
  selectedWarehouse!: Warehouse;
  ShowList: boolean = true;
  ShowListColumns: String[] = ['activityName', 'number'];
  awardGiftListIds: number[] = [];
  awards: PeriodicElement[] = [];
  isAddress1 = false;
  isAddress2 = false;
  isAddress3 = false;
  specifiedDeliveryFeeExemptedThreshold: number = 0;
  specifiedDeliveryFee: number = 0;
  freight: string = '免運';
  isQualifiedForCloudInvoice: boolean = false;
  purchaserJobTitle: string = '';
  purchaserName: string = '';
  purchaseId: number = 0;
  commonlyUsedAddrLength = 0;
  thisHasPurchaserRemarks = false;
  thisLatestPurchaserRemark: any;
  defaultBarcode: string | null = null;
  groupOrder: any;

  productGroupService?: ProductGroupService;

  shippingMethods: {
    label: string;
    value: number;
  }[] = [];

  cityOption?: City[];
  cityAreaOption?: CityArea[];

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
      phoneNo: ''
    },
    customDeliverInfo: {
      fullAddr: '',
      addrCity: '',
      addrCityArea: '',
      addrName: '',
      receiver: '',
      addr: '',
      contactNo: '',
      phoneNo: '',
      cityCode: '0',
      distCode: '0'
    },
    commentOption: 1,
    commentInfo: {
      comment: ''
    },
    customCommentInfo: {
      id: 1,
      title: '尚未有常用出貨備註',
      comment: ''
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
    savePurchaserRemark: false,
  };

  options = {
    addresses: [
      {
        label: '',
        value: 1
      },
      {
        label: '',
        value: 2
      }
    ],
    receivers: [
      {
        label: '',
        value: 1
      },
      {
        label: '',
        value: 2
      }
    ],
    receiptAddresses: [
      {
        label: '',
        value: 1
      },
      {
        label: '',
        value: 2
      }
    ],
    receiptReceivers: [
      {
        label: '',
        value: 1
      },
      {
        label: '',
        value: 2
      }
    ]
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
        distCode: ''
      },
      mobileBarcode: '',
      receivers: '',
      receiptReceivers: '',
    };

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
    private memberService: MemberService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.purchaseId = this.route.snapshot.queryParams['purchaseId'];
        const groupOrder: any = this.storageService.get(StorageEnum.GroupOrder);
        this.awardGiftListIds = groupOrder?.awards || [];
        let products: any[] = [];
        this.route.queryParams
          .pipe(
            tap(({ itemId, promoId }) => {
              !itemId && this.router.navigate(['/']);
              this.ThisitemId = promoId;
            })
          )
          .subscribe();

        this.memberService
          .getAddrManage()
          .pipe(
            filter((res) => res.responseCode === ResponseCode.Success),
            map((res) => res.result)
          )
          .subscribe((res) => {
            this.form.addressOption = res.defaultAddr.defaultShipAddrId;

            this.options.receivers = res.shipContactList.map((e: any) => {
              return {
                value: e.id,
                label: [e.jobTitle, e.name].join(' - '),
              };
            });
            this.form.receiverOption =
            addressesAndContacts.defaultAddr.defaultShipContact;

            this.options.receiptAddresses = res.billAddrList.map((e: any) => {
              return {
                value: e.id,
                label: e.fullAddr,
              };
            });

            this.form.receiptAddressOption = res.defaultAddr.defaultBillAddrId;

          this.options.receiptReceivers = res.billContactList.map((e: any) => {
            return {
              value: e.id,
              label: [e.jobTitle, e.name].join(' - '),
              mobileBarCode: e.mobileBarCode,
            }
          });
          this.form.receiptReceiverOption =
          addressesAndContacts.defaultAddr.defaultBillContact;
        })
        this.checkoutService.getDelivery()
          .subscribe((res) => {
            this.shippingMethods = this.createShippingMethods(res.result);
          })
        this.memberService.getCommonAddress({})
          .subscribe((res) => {
            this.commonlyUsedAddrLength = res.result.commonUsedAddrList.length;
          })

        const {
          subInventory,
          addressesAndContacts,
          bonusPoints,
          usableBonusPoints,
          specifiedDeliveryFeeExemptedThreshold,
          specifiedDeliveryFee,
          commonlyUsedAddr,
          hasPurchaserRemarks,
          latestPurchaserRemark,
          purchaserEmail,
          purchaserJobTitle,
          purchaserName,
          isQualifiedForCloudInvoice,
          defaultBarcode,
          awards,
        } = groupOrder;

        subInventory.productBatches.forEach((e: any) => {
          e.mainProducts.forEach((main: any) => {
            const group: any[] = [];
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
              useOverridePromoPriceText: main.useOverridePromoPriceText,
              overridePromoPriceText: main.overridePromoPriceText,
              tagName: main.tagName,
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
                useOverridePromoPriceText: sub.useOverridePromoPriceText,
                overridePromoPriceText: sub.overridePromoPriceText,
              });
            });
            products.push(group);
          });
        });

        this.selectedWarehouse = {
          id: subInventory.code,
          title: subInventory.chineseName,
          productGroups: products,
        };
        this.bonusPoints = bonusPoints;
        this.dividendDiscount = usableBonusPoints;
        this.inputDividendDiscount = this.form.isChecked
          ? usableBonusPoints
          : 0;
        //this.useBonusPoint = this.form.isChecked ? usableBonusPoints : 0;
        this.specifiedDeliveryFeeExemptedThreshold =
          specifiedDeliveryFeeExemptedThreshold;
        this.specifiedDeliveryFee = specifiedDeliveryFee;
        this.commonlyUsedAddrLength = commonlyUsedAddr.length;
        this.thisHasPurchaserRemarks = hasPurchaserRemarks;
        this.thisLatestPurchaserRemark = latestPurchaserRemark;
        this.purchaserJobTitle = purchaserJobTitle;
        this.purchaserName = purchaserName;
        this.awards = awards;
        this.form.email = purchaserEmail;
        this.defaultBarcode = defaultBarcode || '';
        this.isQualifiedForCloudInvoice = isQualifiedForCloudInvoice;
        if (this.isQualifiedForCloudInvoice)
          this.onCarrierCategoryChange(2);
        this.form.mobileBarcode = this.isQualifiedForCloudInvoice
          ? this.defaultBarcode || ''
          : '';

          if (this.thisLatestPurchaserRemark && this.thisLatestPurchaserRemark.content.length > 0) {

            this.form.customCommentInfo.title = this.thisLatestPurchaserRemark.title;
            this.form.customCommentInfo.comment = this.thisLatestPurchaserRemark.content;

          }
          // this.shippingMethods = this.createShippingMethods(e.result);

        this.productGroupService = new ProductGroupService(
          this.selectedWarehouse
        );
        this.form.deliverInfo = commonlyUsedAddr[0]; // 2024/11/26 Add by Tako for 2024024202
        this.options.addresses = addressesAndContacts.shipAddrList.map(
          (e: any) => {
            return {
              value: e.id,
              label: e.fullAddr,
            };
          }
        );
        this.form.addressOption =
          addressesAndContacts.defaultAddr.defaultShipAddrId;

        this.options.receivers = addressesAndContacts.shipContactList.map(
          (e: any) => {
            return {
              value: e.id,
              label: [e.jobTitle, e.name].join(' - '),
            };
          }
        );
        this.form.receiverOption = 0;

        this.options.receiptAddresses = addressesAndContacts.billAddrList.map(
          (e: any) => {
            return {
              value: e.id,
              label: e.fullAddr,
            };
          }
        );
        this.form.receiptAddressOption =
          addressesAndContacts.defaultAddr.defaultBillAddrId;

        this.options.receiptReceivers =
          addressesAndContacts.billContactList.map((e: any) => {
            return {
              value: e.id,
              label: [e.jobTitle, e.name].join(' - '),
              mobileBarCode: e.mobileBarCode,
            };
          });
        this.form.receiptReceiverOption = 0;
      }
    });

  }

  ngOnInit(): void {
    this.isLoading = false;
    this.memberService.getCity().pipe(
      filter((res) => res.responseCode === ResponseCode.Success),
      map((res) => {
        this.cityOption = res.result.data || "";
      })
    ).subscribe();
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
    return this.datePipe.transform(
      nextSaturday,
      'yyyy/MM/dd'
    )
  }

  private createShippingMethods(result: any) {
    const shippingMethods = [];
    shippingMethods.push(this.defaultDelivery);
    if (result.isQualifiedForNightlyDelivery) {
      shippingMethods.push(this.nightlyDelivery);
    }
    if (result.isQualifiedForSaturdayDelivery) {
      shippingMethods.push({
        label: `${this.thisSaturday} 到貨`,
        value: 2,
      });
    }
    if (result.isQualifiedForDesignatedDelivery) {
      shippingMethods.push(this.designatedDelivery);
    }
    return shippingMethods;
  }

  getCityArea(city: any): void {
    this.memberService.getCityArea(city.source.selected.viewValue).pipe(
      filter((res) => res.responseCode === ResponseCode.Success),
      map((res) => {
        this.cityAreaOption = res.result.data || "";
      })
    ).subscribe();
  }

  isMainProduct(product: any) {
    return (
      !product.mainProductId ||
      product.promotionMethod == PromoMethod.AdditionalItem
    );
  }

  getPromotionTag(promotionMethod: number, promoCategory: number,tagName: string | null) {
    if(tagName == '團購'){
      return {
        text: '團購',
        label: '團購',
        color: 'airblue',
      };
    }
    if (promotionMethod != null) return promoTagLabel[4][promotionMethod];
    return {
      text: '',
      label: '',
      color: '',
    };
  }

  get totalTax() {
    return Math.round(this.totalPrice * 0.05);
  }

  get totalPrice() {
    return this.selectedWarehouse?.productGroups.reduce(
      (totalPrice, products) => {
        return (
          totalPrice +
          products
            .filter((product) => product)
            .reduce((productTotalPrice, product) => {
              return productTotalPrice +
                (product.price != null ? product.price * product.qty : product.priceWithTax * product.qty);
            }, 0)
        );
      },
      0
    );
  }

  get totalPriceWithTax() {
    let defaultPrice = this.totalPrice + this.totalTax;

    if (this.form.isChecked) defaultPrice -= this.inputDividendDiscount;
    const specificDeliveryFee = this.totalPrice < this.specifiedDeliveryFeeExemptedThreshold
      ? this.specifiedDeliveryFee
      : 0;

    if (this.form.clazz === 2) defaultPrice += specificDeliveryFee;

    return defaultPrice;
  }

  get productTotalCount() {
    const ids = this.checkoutUtilService.flatSelectedPurchaseItemIds(
      this.selectedWarehouse?.productGroups,
      false
    )

    return ids.length;
  }

  freightText() {
    if (isNaN(Number(this.freight))) return this.freight;
    else return `+${this.toPrice(Number(this.freight))}`;
  }

  toPrice(num: number) {
    return this.currencyPipe.transform(
      num ? num : 0,
      '',
      'symbol',
      '1.0-0'
    ) as string;
  }

  toPrice2(price: any, qty: any, priceWithTax: any) {
    if (price !== null) {
      return price * qty;
    } else {
      return priceWithTax * qty;
    }
  }

  onCarrierCategoryChange(value: number) {
    this.form.carrierCategoryOption = value;
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
    }
    else {
      this.ShowListColumns = [];
    }
  }

  validateOtherInfo() {
    const emailResp = Validators.email({
      value: this.form.email
    } as any);

    const emailRequiredResp = Validators.required({
      value: this.form.email
    } as any);

    const receiversRequiredResp = Validators.required({
      value: !this.form.receiverOption ? '' : true
    } as any);

    const receiptReceiverRequiredResp = Validators.required({
      value: !this.form.receiptReceiverOption ? '' : true
    } as any);

    const emailNotMatchFormat = emailResp ? emailResp['email'] : false;
    const emailNotRequired = emailRequiredResp
      ? emailRequiredResp['required']
      : false;
    const receiversNotRequired = receiversRequiredResp
      ? receiversRequiredResp['required']
      : false;

    const receiptReceiversNotRequired = receiptReceiverRequiredResp
      ? receiptReceiverRequiredResp['required']
      : false;

    if (emailNotMatchFormat) {
      this.error.email = 'Email格式不正確';
    } else if (emailNotRequired) {
      this.error.email = '必填欄位';
    }

    if (receiversNotRequired) {
      this.error.receivers = '必填欄位';
    } else {
      this.error.receivers = '';
    }

    if (receiptReceiversNotRequired) {
      this.error.receiptReceivers = '必填欄位';
    } else {
      this.error.receiptReceivers = '';
    }

    return (
      this.error.email.length === 0 &&
      this.error.receivers.length === 0
    )
  }

  validateAgreeTerm() {
    const agreeTermsResp = Validators.requiredTrue({
      value: this.form.agreeTerms
    } as any);

    this.error.agreeTerms = (
      agreeTermsResp ? agreeTermsResp['required'] : false
    )
      ? '必填欄位'
      : '';

    return this.error.agreeTerms.length === 0;
  }

  validateDeliveryInfo() {
    const addrName = this.form.customDeliverInfo.addrName;
    this.error.customDeliverInfo['addrName'] =
      !addrName || addrName.length === 0 ? '必填欄位' : '';

    this.error.customDeliverInfo['cityCode'] =
      this.form.customDeliverInfo.cityCode === '0' ? '必選欄位' : '';

    this.error.customDeliverInfo['distCode'] =
      this.form.customDeliverInfo.distCode === '0' ? '必選欄位' : '';

    const addr = this.form.customDeliverInfo.addr;

    this.error.customDeliverInfo['addr'] = !addr || addr.length === 0 ? '必填欄位' : '';

    const receiver = this.form.customDeliverInfo.receiver;
    this.error.customDeliverInfo['receiver'] =
      !receiver || receiver.length === 0 ? '必填欄位' : '';
    const hasEnglishReceiver = /[a-zA-Z]/.test(receiver);
    this.error.customDeliverInfo['receiver'] += hasEnglishReceiver ? '' : '';
    const hasSpecialCharactersReceiver = /[^\u4E000-u9FA5\d]/.test(receiver);
    this.error.customDeliverInfo['receiver'] += hasSpecialCharactersReceiver ? '只能輸入中文字元' : '';

    const contactNo = this.form.customDeliverInfo.contactNo;
    this.error.customDeliverInfo['contactNo'] =
      !contactNo || contactNo.length === 0 ? '必填欄位' : '';

    if (this.error.customDeliverInfo['contactNo'].length === 0) {
      this.error.customDeliverInfo['contactNo'] = !(
        (contactNo.match(/^\((0\d+)\)(\d{4})-(\d{4})(?:(?:#)(\d+))?$/) || [])
          .length > 0
      )
        ? '電話號碼格式錯誤'
        : '';
    }

    const phoneNo = this.form.customDeliverInfo.phoneNo;

    this.error.customDeliverInfo['phoneNo'] =
      phoneNo &&
        !((phoneNo.match(/^(\d{4})-(\d{3})-()\d{3}$/) || []).length > 0)
        ? '行動電話號碼格式錯誤'
        : '';

    return Object.keys(this.error.customDeliverInfo).some((prop) => {
      return this.error.customDeliverInfo[prop].length === 0;
    });
  }

  validateReceiptInfo() {
    if (this.form.carrierCategoryOption === 1) {
      this.error.mobileBarcode = '';
      return true
    }

    if (this.form.carrierCategoryOption === 2) {
      this.error.mobileBarcode = !(
        (this.form.mobileBarcode.match(/\/[0-9A-Z\.\-\+]{7}/) || []).length
      )
        ? '手機條碼格式錯誤'
        : '';
    }

    return this.error.mobileBarcode.length === 0;
  }



  onSelectionChange(value: number) {
    this.form.clazz = value
    if (this.form.clazz === 2) {
      if (this.totalPrice < this.specifiedDeliveryFeeExemptedThreshold) {
        const modelOption = {
          modelName: 'simple-dialog',
          config: {
            data: {
              title: '指送未達免運門檻',
              StyleMargin: '0px',
              text: `指送未達免運門檻，將額外酌收運費${this.specifiedDeliveryFee}元`,
              displayFooter: true,
              confirmButton: '確認'
            },
            width: '500px',
            height: '204px',
            hasBackdrop: true,
            autoFocus: false,
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            panelClass: ''
          }
        };

        this.dialogservice.openLazyDialog(
          modelOption.modelName,
          modelOption.config
        );
        this.freight = this.specifiedDeliveryFee.toString();
      } else {
        this.freight = '免運';
      }
    }
  }

  async deliveryAddressesDialog() {
    const modalOption = {
      modelName: 'common-address-dialog',
      config: {
        data: {
          title: '常用指送地址'
        },
        width: '1052px',
        height: '500px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: ''
      }
    };

    const dialogRef = await this.dialogservice.openLazyDialog(
      modalOption.modelName,
      modalOption.config
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result.action == DialogAction.Save) {
        this.form.deliverInfo = {
          ...result.data
        };
      }
    });
  }

  async deliveryRemarkDialog() {
    const modelOption = {
      modelName: 'delivery-remark-dialog',
      config: {
        data: {
          title: '常用出貨備註'
        },
        width: '1052px',
        height: '500px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: 'delivery-remark'
      }
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
            'margin-left': '32px'
          }
        },
        width: '820px',
        height: '500px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: ''
      }
    };

    this.dialogservice.openLazyDialog(
      modelOption.modelName,
      modelOption.config
    );
  }

  submit() {
    this.error.email = '';
    this.error.agreeTerms = '';

    Object.keys(this.error.customDeliverInfo).forEach((prop) => {
      this.error.customDeliverInfo[prop] = '';
    })

    let deliverInfoHasError = false;
    if (this.form.clazz === 3) {
      deliverInfoHasError = !this.validateDeliveryInfo();
      if (deliverInfoHasError) {
        document.querySelector('#header-delivery-info')?.scrollIntoView();
      }
    }

    if (this.form.clazz === 2 && this.commonlyUsedAddrLength === 0) {
      deliverInfoHasError = true;
      const modelOption = {
        modelName: 'simple-dialog',
        config: {
          data: {
            title: '尚未常用指送地址',
            StyleMargin: '0px',
            text: `您尚未儲存任何常用指送地址，請選擇其他配送類別。`,
            displayFooter: true,
            confirmButton: '確認'
          },
          width: '500px',
          height: '204px',
          hasBackdrop: true,
          autoFocus: false,
          enterAnimationDuration: '300ms',
          exitAnimationDuration: '300ms',
          panelClass: ''
        },
      };

      this.dialogservice.openLazyDialog(
        modelOption.modelName,
        modelOption.config
      );
    }

    const receiptInfoHasError = !this.validateDeliveryInfo();
    if (receiptInfoHasError) {
      document.querySelector('#header-receipt-info')?.scrollIntoView();
    }

    const otherInfoHasError = !this.validateOtherInfo();
    if (otherInfoHasError) {
      document.querySelector('#header-other-info')?.scrollIntoView();
    }

    const agreeTermsHasError = !this.validateAgreeTerm();
    if (agreeTermsHasError) {
      document.querySelector('#check-agree-terms')?.scrollIntoView();
    }

    if (
      !otherInfoHasError &&
      !agreeTermsHasError &&
      !deliverInfoHasError &&
      !receiptInfoHasError
    ) {
      const { addToCart }: any = this.storageService.get(StorageEnum.GroupOrder);

      const param = {
        addToCart: addToCart,
        shipAddressId: this.form.addressOption,
        invoiceAddressId: this.form.receiptAddressOption,
        shipContactId: this.form.receiverOption,
        shipContactPhone: this.form.customDeliverInfo.phoneNo,
        invoiceContactId: this.form.receiptReceiverOption,
        customerPoNumber: this.form.poNo,
        purchaserRemarkId: this.form.commentOption === 1 ? 0 : this.form.customCommentInfo.id,
        purchaserRemarkTitle: this.form.commentOption === 1 ? null : this.form.customCommentInfo.title,
        purchaserRemark: this.form.commentOption === 1 ? this.form.commentInfo.comment : this.form.customCommentInfo.comment,
        email: this.form.email,
        shippingMethod: this.form.shippingMethod,
        commonlyUsedAddr: this.form.clazz === 3 ? {
          // id: 24118,
          // createdBy: "5347",
          addrName: this.form.customDeliverInfo.addrName,
          fullAddr: this.form.customDeliverInfo.fullAddr,
          addrCity: this.form.customDeliverInfo.addrCity,
          addrCityArea: this.form.customDeliverInfo.addrCityArea,
          addrZipCode: this.form.customDeliverInfo.cityCode,
          addr: this.form.customDeliverInfo.addr,
          receiver: this.form.customDeliverInfo.receiver,
          contactNo: this.form.customDeliverInfo.contactNo,
          phoneNo: this.form.customDeliverInfo.phoneNo,
        } :
          // 常用指送地址 Add by Tako for 2024024202
          this.form.clazz === 2 ?
            this.form.deliverInfo :
            undefined as any,
        invoiceType: this.form.carrierCategoryOption === 2 ? '手機條碼' : '無',
        carrierId: this.form.carrierCategoryOption === 2 ? this.form.mobileBarcode : '',
        SavePurchaserRemark: this.form.savePurchaserRemark,
      }
      this.isLoading = true;
      this.checkoutService.createGroupOrder(param)
        .pipe(
          tap(_ => this.isLoading = false),
          catchError(_ => {
            this.isLoading = false;
            return of();
          }),
          mergeMap((res: any) => {
            if (res.responseCode === ResponseCode.Success) {
              return of({
                responseCode: res.responseCode,
                data: this.orderService.getModalOption(res),
                result: res.result,
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
                    result: res.result,
                  };
                })
              )
            }
          })
        )
        .subscribe((res: any) => {
          if (res.responseCode === "0000") {
            this.storageService.set(StorageEnum.GroupCheckoutResult, res.result);
            //this.router.navigate(['/OrderComplete'])
            this.purchaseId = this.route.snapshot.queryParams['purchaseId'];
            this.router.navigate(['/OrderComplete'], { queryParams: { type: 'groupOrder' } })
            .then(() => {
              window.location.reload();
            });
          }
        })
    }
  }

  back(e: MouseEvent) {
    e.preventDefault();
    const itemId = this.route.snapshot.queryParams['itemId'];
    this.router.navigate(
      ['/Product'],
      { queryParams: { itemId } }
    );
  }

  getFreightTooltip(): string {
    const threshold = STRING_UTIL.priceToString(this.specifiedDeliveryFeeExemptedThreshold);
    const fee = STRING_UTIL.priceToString(this.specifiedDeliveryFee);
    return `• 單筆訂單未滿${threshold}元(未)酌收${fee}元\n• 運費暫不配送離島、偏遠地區 & 郵政信箱。偏遠地區明細請參考重要公告`;
  }
}
