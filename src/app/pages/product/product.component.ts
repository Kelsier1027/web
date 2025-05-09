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
import { ViewportScroller } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as moment from 'moment';
import { AnyConstructor, forEach, ifElse, not } from 'ramda';
import {
  Observable,
  Subscription,
  catchError,
  concatMap,
  filter,
  from,
  iif,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { promoTagLabel } from 'src/app/constants/product.constants';
import { Pagination } from 'src/app/core/model';
import { SharedService } from 'src/app/core/services/shared.service';
import { StorageService } from 'src/app/core/services/storage.service';
import {
  AccessoryType,
  DialogAction,
  PromoCategory,
  PromoCategoryName,
  PromoMethod,
  PromoMethodName,
  ResponseCode,
  SoldOutPlan,
  SubMethod,
} from 'src/app/enums';
import {
  BrandEnum,
  StorageCapacityUnitEnum,
  StorageEnum,
} from 'src/app/enums/storage.enum';
import { PromoInfo, SubItem } from 'src/app/models';
import {
  AddToCartAccessory,
  AddToCartGift,
  AddToCartReplaceItem,
  CompareProduct2,
  Product,
  ProductDetail,
  SubInventory,
  SubPromoInfo,
} from 'src/app/models/product.model';
import { CartService, MemberService, ProductService } from 'src/app/services';
import { IncrementInputComponent } from 'src/app/shared/components/inputs/increment-input/increment-input.component';
import { ProductComparisonComponent } from 'src/app/shared/components/product-comparison/product-comparison.component';
import {
  DialogService,
  LayoutService,
  NotifierService,
} from 'src/app/shared/services';
import { FilterService } from 'src/app/shared/services/filter.service';
import { uniqueId } from 'src/app/shared/utils/uniqueId';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as e from 'express';
import { Title } from '@angular/platform-browser';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { TRACK_PARAMS } from 'src/app/shared/utils/trackParamUtilities';
import { URL_UTIL } from 'src/app/shared/utils/urlUtilities';
import { POP_UP } from 'src/app/shared/utils/popUpUtilities';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers: [CartService],
})
export class ProductComponent implements OnInit, AfterViewChecked {
  filterSub = new Subscription();
  pagination?: Pagination;
  dataSourceAward!: any;
  dataSourceGuessYouLike!: any;
  dataSourceRecommended!: any;

  isHovering: boolean = false;
  comparsionText = '比較';
  isWish = false;
  public info: any;
  protected readonly PromoMethod = PromoMethod;
  protected readonly SubMethod = SubMethod;
  isShowMobilePromotion = false;
  isShowMobileAddition = false;
  isLoading = true;
  currentQty = 1;
  initialSubInventory!: SubInventory;
  currentSubInventory?: SubInventory;
  _currentPromotion?: PromoInfo | null | undefined;

  get currentPromotion(): PromoInfo | null | undefined {
    return this._currentPromotion;
  }

  set currentPromotion(value: PromoInfo | null | undefined) {
    if (this._currentPromotion == value) return;

    this._currentPromotion = value;
    this.handlePromotionSelectionEvent();
  }

  handlePromotionSelectionEvent() {
    // 如果是有具體促銷資訊的方案，發一次 GA
    if (
      this.currentPromotion?.id &&
      this.currentPromotion.promoMethod != PromoMethod.Distribution
    ) {
      const promoCategory =
        PromoCategoryName[this.currentPromotion.promoCategory];
      const promoMethod = PromoMethodName[this.currentPromotion.promoMethod];

      this.analyticsService.event('promo_selection', {
        promo_category: promoCategory,
        promo_method: promoMethod,
        promo_id: this.currentPromotion?.id,
      });
    }
  }

  links!: { name: string; url: string; queryParams?: Params | null }[];
  promotionOptionValue!: PromoInfo | '經銷價';
  detail$!: Observable<ProductDetail>;
  detail!: ProductDetail;
  @ViewChild('incrementInput')
  incrementInput!: IncrementInputComponent;
  @ViewChild('tooltip') tooltip!: MatTooltip;
  giftItems!: AddToCartGift[];
  comboItems!: AddToCartGift[];
  additionalItems!: AddToCartGift[];
  attachedItems!: AddToCartGift[];
  accessories!: AddToCartAccessory[];
  mobileAdditionSelectedCount = 0;
  selectedBrand?: BrandEnum;
  isUnitPrice = true;
  isCanBuyMultiple: boolean[] = [];
  selectpromoCategory: number = 0;
  compareItems: any = [];
  isComparesInSubscription: Subscription | undefined;
  productDisplayStatus: number = 1;
  mobileGroupBuyStatus: number = 0;
  tempCapacityOptions: {
    index: number;
    storageCapacity: number;
    storageCapacityUnit: StorageCapacityUnitEnum;
    storageCount: number;
  }[] = [];
  Infinity = Infinity;
  purchaseLimit = Infinity;

  mainMaxCount = 1;
  countOption = {
    type: 'incrementInput',
    _label: '',
    label: '',
    inputType: 'number',
    name: 'number',
    class: '',
    _value: 0,
    _step: 1,
    _min: 1,
    _max: this.currentSubInventory ? this.currentSubInventory.qty : 1,
    _wrap: false,
    color: 'primary',
  };

  promoTagLabel = promoTagLabel;
  group!: FormGroup;
  mobileGroup!: FormGroup;
  html = "<a href=''>查看所有加購</a><span>></span>";
  showMoreGift = false;
  normalAdditionalItemsblocks: any;
  normalAdditionalItems: {
    countOption: any;
    title: string;
    price: string;
    priceHint: string;
    hint: string;
    priceWithTax: string;
    discount: string;
    checked: boolean;
    buyQty: number;
    subInventoryBuyCount: number;
    prodImg: string;
    useOverridePromoPriceText: boolean;
    overridePromoPriceText: string;
  }[] = [];
  giveAways: any | null = [];

  ignoredUniqueId: string[] = [];

  @ViewChild(ProductComparisonComponent)
  comparisonComp?: ProductComparisonComponent;

  shopItems: { text: string; path: string[]; promoId: number | null }[] = [];

  @ViewChild('mainProduct')
  mainProduct?: ElementRef;

  @ViewChild('promotionDetailsCards')
  promotionDetailsCards?: ElementRef;

  @ViewChild('spacer')
  spacer?: ElementRef;

  source?: string | null;
  sourceId?: number | null;

  /** 勾選/取消 加購 */
  promoCheckChange(checked: boolean, controlIndex: number, innerIndex: number) {
    const innerItems = this.normalAdditionalItems2.at(
      controlIndex
    ) as FormArray;

    const thisItemCountOption = innerItems.at(innerIndex).value.countOption;
    if (checked) {
      if (thisItemCountOption._value <= 0) thisItemCountOption._value = 1;

      this.isCanBuyMultiple[controlIndex] =
        !!this.currentPromotion?.subPromoInfo[controlIndex]
          ?.canBuyMultipleTypesOfAdditionalItems;
    } else {
      thisItemCountOption._value = 0;
      this.isCanBuyMultiple[controlIndex] = true;
    }
    this.validatePromo();
  }

  // 提醒我
  remindMeDialog(detail: ProductDetail) {
    const modelOption = {
      modelName: 'product-remind-me',
      config: {
        data: {
          title: '提醒我',
          StyleMargin: '0px',
          text: '目前非特定期間促銷時段，系統將在活動開始前10分鐘寄發Email通知給指定通知對象。',
          isIcon: false,
          itemId: detail.itemId,
          promoId: this.currentPromotion,
        },
        width: '429px',
        height: '476px',
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

  // 微軟軟體(ESD)數位下載版訂購說明
  directionsDialog() {
    const modelOption = {
      modelName: 'product-directions',
      config: {
        data: {
          title: '',
          StyleMargin: '0px',
          text: '',
          isIcon: false,
          confirm: () => {
            this.continueWithLogic();
          },
        },
        width: '820px',
        height: '500px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: 'directionsDialog',
      },
    };

    this.dialogservice.openLazyDialog(
      modelOption.modelName,
      modelOption.config
    );
  }

  // 福利品
  data = {
    title: 'ASUS GLADIUS-III-WL-AP-WHT',
    hint: 'GLADIUS-III-WIRELESS-AIMPOINT-WHT 無線電競滑鼠(白)/902734',
    price: '$3,458',
    discount: '$3,158',
    priceHint: '(未)',
  };
  welfareProductsDialog() {
    const modelOption = {
      modelName: 'welfare-products',
      config: {
        data: {
          title: '',
          StyleMargin: '0px',
          text: '',
          isIcon: false,
          confirm: () => {
            this.continueWithLogic();
          },
        },
        width: '820px',
        height: '549px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: 'directionsDialog',
      },
    };

    this.dialogservice.openLazyDialog(
      modelOption.modelName,
      modelOption.config
    );
  }

  overAdditionalItemLimitDialog() {
    const modelOption = {
      modelName: 'simple-dialog',
      config: {
        data: {
          title: '無法加購商品',
          StyleMargin: '0px',
          text: '已達到加購上限，請重新修改數量並再次確認。',
          displayFooter: true,
          confirmButton: '確認',
          isIcon: false,
        },
        width: '500px',
        height: '204px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: 'directionsDialog',
      },
    };

    this.dialogservice.openLazyDialog(
      modelOption.modelName,
      modelOption.config
    );
  }

  overAdditionalItemMultipleTypeDialog() {
    const modelOption = {
      modelName: 'simple-dialog',
      config: {
        data: {
          title: '無法加購商品',
          StyleMargin: '0px',
          text: '此商品只能選購單一加購商品，請重新修改數量並再次確認。',
          displayFooter: true,
          confirmButton: '確認',
          isIcon: false,
        },
        width: '500px',
        height: '204px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: 'directionsDialog',
      },
    };

    this.dialogservice.openLazyDialog(
      modelOption.modelName,
      modelOption.config
    );
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private productService: ProductService,
    public layoutService: LayoutService,
    public dialogservice: DialogService,
    private cartService: CartService,
    private viewportScroller: ViewportScroller,
    private notifierService: NotifierService,
    private memberService: MemberService,
    private sharedService: SharedService,
    private storageService: StorageService,
    private filterService: FilterService,
    private sanitizer: DomSanitizer,
    private title: Title,
    private analyticsService: AnalyticsService,
    private renderer: Renderer2
  ) { }

  ngAfterViewChecked(): void {
    const mainProduct = this.mainProduct?.nativeElement;
    const promotionDetailsCards = this.promotionDetailsCards?.nativeElement;
    const spacer = this.spacer?.nativeElement;

    if (!mainProduct || !promotionDetailsCards || !spacer) return;
    let height = 0;
    if (mainProduct.clientHeight > promotionDetailsCards.clientHeight) {
      height = mainProduct.clientHeight - promotionDetailsCards.clientHeight;
    }
    if (height === spacer.clientHeight) return;
    this.renderer.setStyle(spacer, 'height', height + 'px');
  }

  ngOnInit(): void {
    this.group = this.fb.group({
      number: [1],
      promotion: [''],
      select: [''],
    });
    this.mobileGroup = this.fb.group({
      select: [''],
    });
    this.getDetail(true);
    this.sharedService.isUnitPrice$.subscribe((isUnitPrice) => {
      this.isUnitPrice = isUnitPrice;
    });
    this.loadContentManagement();
    this.loadContentManagement2();
    this.loadContentManagement3();

    this.isComparesInSubscription = this.storageService
      .valueChanged()
      .subscribe((res) => {
        this.compareItems = this.storageService.get(StorageEnum.ComparingItems);
      });

    if (localStorage.getItem('orgId') == '151') {
      this.title.setTitle('精豪電腦');
    } else {
      this.title.setTitle('精技電腦');
    }
    //this.compareItems = this.comparisonComp?.items || [];

    this.currentQty = this.getMin();
  }

  getAdditionalItemsTotalPrice() {
    return (
      this.normalAdditionalItems2?.value
        .flat(1)
        .filter((e: any) => e.checked)
        .reduce(
          (
            productTotalPrice: any,
            product: { price: number; discount: number; countOption: any }
          ) => {
            return (
              productTotalPrice +
              product.discount * (product.countOption._value || 0)
            );
          },
          0
        ) || 0
    );
  }

  onWishList(productId: number): void {
    const param = { page: 1, pageSize: 1, keyword: productId };
    this.memberService
      .getWishList(param)
      .pipe(
        catchError(() => of()),
        tap((res) => {
          if (res.responseCode === ResponseCode.Success) {
            if (res.result.traceList[0].itemId == productId) {
              this.detail.favorite = true;
            }
          }
        })
      )
      .subscribe();
  }

  isSales(): boolean {
    return JSON.parse(localStorage.getItem('isSales') ?? 'true');
  }

  canOrder(): boolean {
    return JSON.parse(localStorage.getItem('canOrder') ?? 'true');
  }

  canUseAddToCartButton(): boolean {
    return this.canOrder();
  }

  toggleFavorite(item: any) {
    if (this.isUsingDealerView()) {
      this.showDealerViewError();
      return;
    }

    if (this.isSales()) {
      const hint = [
        '很抱歉，您的身分組無法使用此功能。',
        '如有疑問，請聯絡您的帳戶管理員，或聯絡線上客服。',
      ];
      POP_UP.showMessage(this.dialogservice, '您的身分組不支援此功能', hint);
      return;
    }

    of('')
      .pipe(
        switchMap(() =>
          iif(
            () => item.favorite,
            this.memberService.deleteWishList(item.itemId).pipe(
              tap(() => {
                this.notifierService.showInfoNotification('已移除追蹤清單');
                const currentCount = localStorage.getItem('tracingItems');
                const newCount = currentCount
                  ? parseInt(currentCount, 10) - 1
                  : 0;
                localStorage.setItem('tracingItems', newCount.toString());
                this.sharedService.updateTracingItems(newCount);
              })
            ),
            this.memberService.addWishList(item.itemId).pipe(
              tap(() => {
                this.notifierService.showInfoNotification('已加入追蹤清單');
                const currentCount = localStorage.getItem('tracingItems');
                const newCount = currentCount
                  ? parseInt(currentCount, 10) + 1
                  : 1; // Increment if currentCount exists, else set to 1
                localStorage.setItem('tracingItems', newCount.toString());
                this.sharedService.updateTracingItems(newCount);
              })
            )
          )
        )
      )
      .subscribe(() => {
        item.favorite = !item.favorite;
      });
  }

  /** open 貨到通知 modal */
  arrivalNoticeDialog() {
    const modelOption = {
      modelName: 'arrival-notice',
      config: {
        data: {
          title: '貨到通知',
          StyleMargin: '0px',
          text: '目前庫存已完售 (暫無確切交期)，若有需求請洽業務排單，待貨到後再行通知。謝謝！',
          isIcon: false,
          itemId: '',
          itemName: '',
          itemSeg: '',
        },
        width: '500px',
        height: '654px',
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

  getDealerView(): string | null {
    return URL_UTIL.getDealerView(this.route.snapshot);
  }
  isUsingDealerView(): boolean {
    return !!this.getDealerView()?.length;
  }

  showDealerViewError(): void {
    POP_UP.showMessage(
      this.dialogservice,
      '您正在檢視經銷商中',
      '檢視經銷商不支援此功能，請先退出檢視經銷商模式後再操作。'
    );
  }

  submit(): void {
    if (this.isUsingDealerView()) {
      this.showDealerViewError();
      return;
    }

    if (this.detail.productTag === '福利') {
      this.welfareProductsDialog();
    } else if (this.detail.productTag === '數位') {
      this.directionsDialog();
    } else {
      this.continueWithLogic();
    }
  }

  continueWithLogic(): void {
    this.group.markAllAsTouched();
    if (
      (true ||
        //團購不驗證
        ((!this.currentPromotion ||
          this.currentPromotion?.isInMarketTimeRange) &&
          this.selectpromoCategory == 4)) &&
      //團購不驗證
      this.currentSubInventory &&
      this.currentPromotion !== undefined
    ) {
      const promo = this.currentPromotion;
      const limit = this.currentQty * (promo?.mainAndAdditionalRatio ?? 1);
      const comboGroupCount = Math.floor(
        this.currentQty / (promo != null ? promo.mainItemQty ?? 1 : 1)
      );

      const param = {
        source: this.source,
        sourceId: this.sourceId,
        mainItem: {
          promoId: this.currentPromotion ? this.currentPromotion.id : null,
          uniqueId: uniqueId(),
          itemId: this.detail?.itemId!,
          listLineId: this.currentPromotion
            ? this.currentPromotion.listLineId ?? ''
            : '',
          qty: this.countOption._value,
          mainItemQty: this.currentPromotion ? this.currentPromotion.mainItemQty ?? 1 : 1,
        },
        //comboItems: this.comboItems,
        comboItems: this.comboItems?.map((item) => ({
          ...item,
          qty: item.qty * ( item.storageCount ?? 1) * comboGroupCount,
        })),
        giftItems: this.giftItems,
        accessoryItems: this.accessories,
        subinventoryCode: this.currentSubInventory?.subinventoryCode!,
        additionalItems: this.additionalItems,
        attachedItems: this.normalAdditionalItems2.value
          .flat(1)
          .filter(
            (e: any) =>
              e.checked &&
              (!e.uniqueId ||
                !this.ignoredUniqueId.some((id) => id == e.uniqueId)) &&
              e.countOption._value > 0
          )
          .map((e: any) => {
            return {
              promoId: e.promoId,
              uniqueId: e.uniqueId,
              itemId: e.itemId,
              listLineId: e.currentPromotion?.listLineId,
              qty: e.countOption._value,
            };
          }),
      };
      const groupBuyParam = {
        itemId: this.detail?.itemId!,
        promoId: this.currentPromotion?.id || 0,
        orderQuantity: this.countOption._value,
        subInventoryCode: this.currentSubInventory?.subinventoryCode!,
        source: this.source,
        sourceId: this.sourceId,
      };
      //
      //團購邏輯ToDo fix:3154 呼叫 addToCartGroupBuy
      //
      if (
        (!this.currentPromotion ||
          this.currentPromotion?.isInMarketTimeRange) &&
        this.selectpromoCategory == 4
      ) {
        this.productService
          .addToCartGroupBuy(groupBuyParam)
          .pipe(
            map((res: any) => {
              if (res.responseCode === ResponseCode.Success) {
                this.analyticsService.event('add_to_cart_group_by', {
                  itemId: this.detail.itemId,
                  itemName: this.detail.itemName,
                  qty: this.countOption._value,
                  promo: {
                    promoId: this.currentPromotion?.id,
                    promoName: this.currentPromotion?.name,
                  },
                  add_to_cart_source: this.source,
                  add_to_cart_source_id: this.sourceId,
                });

                this.storageService.set(StorageEnum.GroupOrder, {
                  addToCart: groupBuyParam,
                  ...res.result,
                });
                const url = `/GrooupByProcess?itemId=${this.detail.itemId}&promoId=${groupBuyParam.promoId}`;
                TRACK_PARAMS.combine(url, this.source, this.sourceId);

                window.location.href = url;
                return;
              } else {
                return {
                  responseCode: res.responseCode,
                  option: this.cartService.getCartCheckModalOption(res),
                };
              }
            }),
            mergeMap((res: any) =>
              from(
                this.dialogservice.openLazyDialog(
                  res.option.modelName,
                  res.option.config
                )
              ).pipe(
                switchMap((ref: any) => ref.afterClosed()),
                map((data: any) => {
                  return { ...data, responseCode: res.responseCode };
                })
              )
            )
          )
          .subscribe();
      } else {
        this.isLoading = true;
        this.productService
          .checkCart(param)
          .pipe(
            tap(() => (this.isLoading = false)),
            map((res: any) => {
              if (res.responseCode === ResponseCode.Success) {
                this.analyticsService.event('add_to_cart', {
                  itemId: this.detail.itemId,
                  itemName: this.detail.itemName,
                  qty: this.countOption._value,
                  promo: {
                    promoId: this.currentPromotion?.id,
                    promoName: this.currentPromotion?.name,
                  },
                  add_to_cart_source: this.source,
                  add_to_cart_source_id: this.sourceId,
                });
                return {
                  responseCode: res.responseCode,
                  option: this.cartService.getCartCheckModalOption(res),
                };
              } else {
                return {
                  responseCode: res.responseCode,
                  option: this.cartService.getCartCheckModalOption(res),
                };
              }
            }),
            concatMap((res: any) => {
              if (res.responseCode === ResponseCode.Success) {
                this.isLoading = true;
                return this.productService.addToCart(param); // 假設這是加入購物車的 API 調用
              } else {
                return of(res); // 不執行 addToCart，直接返回原來的 res
              }
            }),
            catchError((_) => {
              this.isLoading = false;
              return of();
            }),
            map((res: any) => {
              this.isLoading = false;
              if (res.responseCode === ResponseCode.Success) {
                return {
                  responseCode: res.responseCode,
                  option: this.cartService.getCartCheckModalOption(res),
                };
              } else {
                if (res.option.modelName) {
                  return res;
                } else {
                  return {
                    responseCode: res.responseCode,
                    option: this.cartService.getCartCheckModalOption(res),
                  };
                }
              }
            }),
            mergeMap((res: any) =>
              from(
                this.dialogservice.openLazyDialog(
                  res.option.modelName,
                  res.option.config
                )
              ).pipe(
                switchMap((ref: any) => ref.afterClosed()),
                map((data: any) => {
                  return { ...data, responseCode: res.responseCode };
                })
              )
            )
          )
          .subscribe((res: any) => this.postCheckCart(res));
      }
    } else {
      if (
        !(
          (!this.currentPromotion ||
            this.currentPromotion?.isInMarketTimeRange) &&
          this.selectpromoCategory == 4
        ) && //非團購
        this.currentSubInventory &&
        this.group.value.number > this.currentSubInventory.qty
      ) {
        const modelOption = {
          modelName: 'simple-dialog',
          config: {
            data: {
              title: '商品異動',
              StyleMargin: '0px',
              message: `本商品「${this.detail.itemName}」${this.currentSubInventory.subinventoryName}缺貨，請您選購其他倉的商品，謝謝。`,
              warning: true,
              displayFooter: true,
              confirmButton: '確認',
              confirm: () => { },
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
    }
  }

  showMobilePromotion() {
    this.isShowMobilePromotion = true;
  }

  /** 購物車檢查後作業 */
  postCheckCart(data: {
    action: DialogAction;
    item: AddToCartReplaceItem;
    responseCode: string;
  }): void {
    switch (data.responseCode) {
      case '0000':
        if (data.action === DialogAction.Save) {
          // 前往購物車
          this.router.navigate(['/ShoppingCart']);
        } else {
          // 留在商品頁
          this.currentPromotion = undefined;
          this.currentSubInventory = undefined;
          this.countOption._value = 0;
          this.ignoredUniqueId = [];
          this.getDetail();
        }
        break;
      case '10091':
        this.tooltip.show(0);
        this.incrementInput.setInputFocus();
        break;
      case '10090':
        this.currentSubInventory = undefined;
        this.countOption._value = 0;
        break;
      case '10081':
        this.tooltip.show(0);
        this.incrementInput.setInputFocus();
        break;
      case '1008':
        this.currentPromotion = undefined;
        this.currentSubInventory = undefined;
        this.countOption._value = 0;
        break;
      case '1007':
        this.viewportScroller.scrollToAnchor('subinventory');
        break;
      case '1006':
        this.viewportScroller.scrollToAnchor('promoInfo');
        break;
      case '1005':
        this.router.navigate(['/']);
        break;
      case '1004':
        // TODO Anchor到加購專區，不符合加購限制或庫存不足的商品Error狀態
        // 庫存不足的加價購商品跳Error狀態
        break;
      case '1003':
        if (data.action === DialogAction.Save) {
          this.ignoredUniqueId.push(data.item.uniqueId);
          this.submit();
        }
        break;
      case '1002':
        if (data.action === DialogAction.Save) {
          this.incrementInput.setInputFocus();
        }
        if (data.action === DialogAction.Cancel) {
          this.productService
            .contactMe({
              itemNumber: this.detail.itemNumber,
              itemName: this.detail.itemName,
            })
            .subscribe((res) => {
              if (res.responseCode === ResponseCode.Success) {
                this.notifierService.showInfoNotification(res.result);
              }
            });
        }
        break;
      case '10011':
        if (data.action === DialogAction.Save) {
          // 貨到補寄時，前端和後端的順序會相同
          // 並且後端每次從頭開始檢查，第一個遇到尚未確認貨到補寄但已經沒貨的，就會拿來丟回 10011
          // 也就是說，每次對 10011 按確認後，針對該商品與該商品之前的商品都會是已經確認貨到補寄的貨品
          // 因為每次確認後會重新整理，soldOutPlan 會重置
          // 所以每次確認後都從頭開始到指定的商品為止，設定 soldOutPlan = 1，再送出一次
          const itemIndex = this.accessories.findIndex(
            (acc) => acc.uniqueId === data.item.uniqueId
          );

          this.accessories
            .slice(0, (itemIndex ?? 0) + 1)
            .forEach((item) => (item.soldOutPlan = 1));

          this.submit();
        }
        break;
      case '10012':
        if (data.action === DialogAction.Save) {
          const item = this.accessories.find(
            (acc) => acc.uniqueId === data.item.uniqueId
          );
          if (item) {
            item.itemId = data.item.replaceItemId;
          }
          this.submit();
        }
        break;
      case '10020':
        if (data.action === DialogAction.Save) {
          this.giftItems = this.giftItems.filter(
            (gift) => gift.uniqueId !== data.item.uniqueId
          );
          this.submit();
        }
        break;
      case '10021':
        if (data.action === DialogAction.Save) {
          // 這邊的處理緣由參考配件貨到補寄 (10011)

          const itemIndex = this.giftItems.findIndex(
            (gift) => gift.uniqueId === data.item.uniqueId
          );

          this.giftItems
            .slice(0, (itemIndex ?? 0) + 1)
            .forEach((item) => (item.soldOutPlan = 1));

          this.submit();
        }
        break;
      case '10022':
        if (data.action === DialogAction.Save) {
          const item = this.giftItems.find(
            (gift) => gift.uniqueId === data.item.uniqueId
          );
          if (item) {
            item.itemId = data.item.replaceItemId;
          }
          this.submit();
        }
        if (data.action === DialogAction.Cancel) {
          const item = this.giftItems.find(
            (gift) => gift.uniqueId === data.item.uniqueId
          );
          if (item) {
            item.soldOutPlan = 3;
          }
          this.submit();
        }
        break;
      default:
        break;
    }
  }

  makeGroupingItems(info: PromoInfo | null) {
    const items: AddToCartGift[] = [];

    items.push(
      ...info?.products.map((e: any) => {
        return {
          uniqueId: uniqueId(),
          itemId: e.itemId,
          listLineId: info.listLineId ?? '',
          qty: 1,
          promoId: info.id,
          soldOutPlan: 0,
          storageCount: e.storageCount
        } as AddToCartGift;
      })
    );
    return items;
  }

  makeGroupingItemsForGift(info: PromoInfo | null) {
    const items: AddToCartGift[] = [];

    items.push(
      ...info?.productsOfGift.map((e: any) => {
        return {
          uniqueId: uniqueId(),
          itemId: e.itemId,
          listLineId: info.listLineId ?? '',
          qty: 1,
          promoId: info.id,
          soldOutPlan: 0,
          storageCount: e.storageCount
        } as AddToCartGift;
      })
    );
    return items;
  }

  processGiftItems(info: PromoInfo | null) {
    if (!info) {
      return;
    }
    if (info.subMethod === null) {
      for (let i = 0; i < info.products.length; i++) {
        this.giveAways.push({
          promoString: info.promoString,
          imageUrl: info.products[i].prodImg[0],
          productName: info.products[i].itemName,
          description: info.products[i].description,
          price: info.products[i].unitPrice,
          useOverridePromoPriceText: info.products[i].useOverridePromoPriceText,
          overridePromoPriceText: info.products[i].overridePromoPriceText,
          discount: info.products[i].promoPrice,
          startDate: info.startDate,
          endDate: info.endDate,
          promoName: info.name,
          promoRemark: info.remark,
          itemNumber: info.products[i].itemNumber?.endsWith('.')
            ? info.products[i].itemNumber.slice(0, -1)
            : info.products[i].itemNumber || '',
        });
        console.log('giveaway data:', info.products[i]);
      }
    }
    if (info.subMethod === SubMethod.AttachedAdditional) {
      for (let i = 0; i < info.productsOfGift.length; i++) {
        this.giveAways.push({
          promoString: info.promoString,
          imageUrl: info.productsOfGift[i].prodImg[0],
          productName: info.productsOfGift[i].itemName,
          description: info.productsOfGift[i].description,
          price: info.productsOfGift[i].unitPrice,
          useOverridePromoPriceText: info.productsOfGift[i].useOverridePromoPriceText,
          overridePromoPriceText: info.productsOfGift[i].overridePromoPriceText,
          discount: info.productsOfGift[i].promoPrice,
          startDate: info.startDate,
          endDate: info.endDate,
          promoName: '[加購商品專屬贈品]\n' + info.name,
          promoRemark: info.remark,
          itemNumber: info.productsOfGift[i].itemNumber?.endsWith('.')
            ? info.productsOfGift[i].itemNumber.slice(0, -1)
            : info.productsOfGift[i].itemNumber || '',
        });
        console.log('giveaway data:', info.productsOfGift[i]);
      }
      //   this.giveAways = this.giveAways.filter((item: unknown, index: number, self: unknown[]) =>
      //   index === self.findIndex((t) => (
      //     (t as any).promoString === (item as any).promoString
      //   ))
      // );
    }
  }

  processPromotionItems(info: PromoInfo | null) {
    if (!info) {
      return;
    }
    if (info.subPromoInfo != null) {
      info.subPromoInfo.forEach((sub) => {
        sub.promoMethod;
        if (sub.promoMethod === PromoMethod.Gift
        ) {
          this.giveAways = null;
          const newItems = this.makeGroupingItems(sub);

          // 如果 giftItems 還沒初始化，給個空陣列
          if (!this.giftItems) this.giftItems = [];

          this.giftItems.push(...newItems);
        }
        if (sub.promoMethod === PromoMethod.AdditionalItem
        ) {
          this.giveAways = null;
          const newItems = this.makeGroupingItemsForGift(sub);

          // 如果 giftItems 還沒初始化，給個空陣列
          if (!this.giftItems) this.giftItems = [];

          this.giftItems.push(...newItems);
        }
      });
    }
    if (info.promoMethod === PromoMethod.AdditionalItem) {
      this.giveAways = null;

      if (info.subMethod === SubMethod.ChosenAdditional) {
        this.additionalItems = this.makeGroupingItems(info);
      }
    }
    if (info.promoMethod === PromoMethod.Combo) {
      this.comboItems =
        info.subMethod === SubMethod.GeneralCombo
          ? this.makeGroupingItems(info)
          : [];
      this.giveAways = null;
    }
  }

  selectPromotion(info: PromoInfo | null) {
    this.currentPromotion = info;
    if (
      this.currentPromotion?.purchaseLimit &&
      this.currentPromotion.subInventoryBuyCount
    ) {
      this.purchaseLimit =
        this.currentSubInventory?.subinventoryCode === 'I01'
          ? this.currentPromotion?.subInventoryBuyCount[0].value
          : this.currentPromotion?.subInventoryBuyCount[1].value;
    }
    if (this.currentPromotion != null) {
      this.selectpromoCategory = this.currentPromotion.promoCategory;
    }
    this.setInputCount(info, !this.currentSubInventory?.qty);
    this.promotionOptionValue = !info ? '經銷價' : info;

    if (this.currentPromotion?.subMethod !== SubMethod.ChosenAdditional) {
      this.giftItems = [];
      this.additionalItems = [];
      this.comboItems = [];
      if (this.currentPromotion?.subMethod === SubMethod.SynologyCombo) {
        this.detail.brandOptions = this.currentPromotion?.products
          ?.map((item: any) => ({
            brandId: item?.brandId,
            itemId: item?.itemId,
            name: item?.brandName,
            selected: false,
          }))
          ?.reduce((arr: Array<any>, next: any) => {
            if (!arr.find((item) => item.name == next.name)) {
              arr.push(next);
            }
            return arr;
          }, []);
      } else {
        this.detail.brandOptions = [];
      }
    }
    if (this.currentPromotion?.promoMethod != null) {
      this.processPromotionItems(this.currentPromotion);
    }

    if (this.currentPromotion?.subPromoInfo) {
      this.giveAways = [];
      this.currentPromotion.subPromoInfo.forEach((subInfo) => {
        this.processGiftItems(subInfo as PromoInfo);
      });
    }

    this.group.setControl(
      'normalAdditionalItems',
      this.fb.array(this.createNormalAdditionalItems())
    );
    this.normalAdditionalItems = this.getNormalAdditionalItems();
    this.validatePromo();
  }

  get normalAdditionalItems2() {
    return this.group.controls['normalAdditionalItems'] as FormArray;
  }

  setInputCount(info: PromoInfo | null, isSoldOut?: boolean) {
    const isZero = isSoldOut || info === undefined;
    const discConditionMultiple = info?.discConditionMultiple || 1;
    const mainItemQty = info?.mainItemQty || 1;
    this.countOption._step = info ? (info.subMethod == SubMethod.GeneralCombo ? mainItemQty * discConditionMultiple : discConditionMultiple) : 1;
    this.countOption._min = this.getMin();
    this.currentQty = isZero ? 0 : Math.max(this.countOption._min, 1);
    this.countOption._value = this.currentQty;

    this.changeQty(this.currentQty);
  }

  async selectSubInventory(subinventory: SubInventory | string) {
    const previousSub = this.currentSubInventory;
    let subInventoryFlag: SubInventory;
    if (typeof subinventory === 'string') {
      subInventoryFlag = this.detail.subInventory?.find(
        (item) => item.subinventoryCode === subinventory
      )!;
    } else {
      subInventoryFlag = subinventory;
    }

    this.currentSubInventory = subInventoryFlag;
    this.countOption._max =
      this.selectpromoCategory === 4 ? Infinity : subInventoryFlag.qty;
    this.mainMaxCount = subInventoryFlag.qty;
    this.setInputCount(this.currentPromotion!, subInventoryFlag.qty === 0);
    this.normalAdditionalItems = this.getNormalAdditionalItems();
    if (this.checkAdditionalItemsChose() && this.checkPromoHasAdd()) {
      await this.onQtyChange(previousSub as SubInventory, false);
    }
  }

  private sendPromoViewEvent(promoInfos: PromoInfo[]) {
    promoInfos
      .filter((pi) => pi.promoMethod != PromoMethod.Distribution)
      .forEach((pi) =>
        this.analyticsService.event('promo_view', {
          promo_category: PromoCategoryName[pi.promoCategory],
          promo_method: PromoMethodName[pi.promoMethod],
          promo_id: pi.id,
        })
      );

    promoInfos
      .flatMap((pi) => pi.subPromoInfo)
      .forEach((spi) =>
        this.analyticsService.event('promo_view', {
          promo_category: PromoCategoryName[spi.promoCategory],
          promo_method: PromoMethodName[spi.promoMethod],
          promo_id: spi.id,
        })
      );
  }

  private getDetail(whenInit = false) {
    this.route.queryParams
      .pipe(
        tap(({ itemId, source, sourceId }) => {
          this.onSetStorageRecentlyViewed(itemId);
          !this.isLoading && (this.isLoading = true);
          !itemId && this.router.navigate(['/']);
          this.source = source;
          this.sourceId = sourceId;
        }),
        switchMap(({ itemId, dealerView }) =>
          this.productService.getProductDetail(itemId, dealerView)
        ),
        tap((response) => {
          if (response.responseCode != ResponseCode.Success) {
            POP_UP.showMessage(
              this.dialogservice,
              '查無商品',
              response.responseMessage
            );
            this.router.navigateByUrl('/');
          }
        }),
        filter((response) => response.responseCode == ResponseCode.Success),
        map((response) => response.result)
      )
      .subscribe((result) => {
        this.sendPromoViewEvent(result.promoInfos);

        this.isLoading = false;
        this.setMoreCustomPromos(result);
        this.setPromotion(result);
        this.setSubInventory(result);
        this.setBreadCrumb(result);
        this.onWishList(result.itemId);
        this.detail && (this.detail.prodImg = []);
        this.detail = result;

        if (localStorage.getItem('orgId') == '151') {
          this.title.setTitle(`${this.detail.itemName} - 精豪電腦`);
        } else {
          this.title.setTitle(`${this.detail.itemName} - 精技電腦`);
        }

        this.checksubInventoryQty();
        //if(this.detail.subInventory[0].qty === 0 && this.detail.subInventory[1].qty === 0) {
        //this.detail.productDisplayStatus = 2;
        //}
        this.productDisplayStatus = result.productDisplayStatus;
        this.detail.brandOptions = [
          { name: 'Seagate', selected: true },
          { name: 'Western Digital (WD)', selected: false },
          { name: 'TOSHIBA', selected: false },
        ];
        this.detail.capacityOptions = [];
        this.detail.productNumberOptions = [];
        this.detail.promoInfos.forEach((e) => {
          e.subPromoInfo && (e.subPromoInfo = this.sortSubPromInfos(e));
        });

        this.detail.comboAccessories = [
          {
            id: 0,
            itemId: 0,
            orgId: 0,
            accessoryType: AccessoryType.Main,
            accessoryItemId: 0,
            accessorySeg: '460-BCZT',
            accessorySubSeg: '',
            accessoryName: 'Dell Essential單肩包鼠組',
            type: '',
            quantity: 1,
            soldOutPlan: SoldOutPlan.Replace,
            replaceStartDate: '',
            availableQty: 0,
            prodImg:
              'https://service.unitech.com.tw/upload/product/pic/Product_Pic20190316095549vU63dT.jpg',
            description: '配件說明',
          },
          {
            id: 0,
            itemId: 0,
            orgId: 0,
            accessoryType: AccessoryType.Main,
            accessoryItemId: 0,
            accessorySeg: '90MA0000-P00360',
            accessorySubSeg: '',
            accessoryName: '滑鼠 Wired optical mouse',
            type: '',
            quantity: 1,
            soldOutPlan: SoldOutPlan.Replace,
            replaceStartDate: '',
            availableQty: 0,
            prodImg:
              'https://service.unitech.com.tw/upload/product/pic/Product_Pic20190316095549vU63dT.jpg',
            description: '配件說明',
          },
        ];
        this.accessories = this.detail?.accessories.map((accessory) => {
          return {
            promoId: accessory.id,
            uniqueId: uniqueId(),
            itemId: accessory.accessoryItemId,
            listLineId: '',
            qty: accessory.quantity,
            soldOutPlan: 0,
          };
        });
        if (whenInit) {
          if (this.detail?.promoInfos.length === 1) {
            this.selectPromotion(this.detail.promoInfos[0]);
          }

          this.analyticsService.event('view_product_item', {
            source: this.source,
            sourceId: this.sourceId,
            itemId: result.itemId,
            itemName: result.itemName,
            brandName: result.brandName,
            itemNumber: result.itemNumber,
            type1Name: result.type1Name,
            type2Name: result.type2Name,
            promoInfos: result.promoInfos.map((promo) => {
              const promoTag =
                promoTagLabel[
                  this.promoTagLabelIndexModify(promo.promoCategory)
                ][this.promoTagLabelIndexModify(promo.promoMethod)]?.label;

              return {
                promoTag,
                promoId: promo.id,
                promoName: promo.name,
              };
            }),
          });
        }
      });
  }
  checksubInventoryQty() {
    for (let i = 0; i < this.detail.subInventory.length; i++) {
      if (this.detail.subInventory[i].qty != 0) {
        this.productDisplayStatus = 0; //加入購物車
      } else {
        this.productDisplayStatus = 1; //貨到通知我
      }
      //==2 我要訂購
    }
  }
  private onSetStorageRecentlyViewed(itemId: string) {
    const reviewedList: {
      itemId: string;
      lastViewedTime: number;
      refreshAfter: number;
    }[] = (this.storageService.get(StorageEnum.RecentlyViewed) || []) as any;

    const productIndex = reviewedList.findIndex(
      (item) => item.itemId === itemId
    );

    const now = moment();

    if (productIndex !== -1) {
      // 有找到 => 更新有找到的，順序改為第一個
      const newProduct = {
        itemId: reviewedList[productIndex].itemId,
        lastViewedTime: now.valueOf(),
        refreshAfter: now.add(5, 'minutes').valueOf(),
      };
      reviewedList.splice(productIndex, 1);
      reviewedList.unshift(newProduct);
    } else {
      if (reviewedList.length >= 20) reviewedList.pop(); // 沒找到，瀏覽超過20筆 => 把最後一筆踢出 list、塞入 list 第一筆
      reviewedList.unshift({
        itemId: itemId,
        lastViewedTime: now.valueOf(),
        refreshAfter: now.add(5, 'minutes').valueOf(),
      });
    }

    this.storageService.set(StorageEnum.RecentlyViewed, reviewedList);
  }

  private sortSubPromInfos(e: SubPromoInfo) {
    let sorted: SubPromoInfo[] = [];
    sorted = [
      ...sorted,
      ...e.subPromoInfo.filter((e) => e.promoMethod !== PromoMethod.Gift),
    ];
    sorted = [
      ...sorted,
      ...e.subPromoInfo.filter((e) => e.promoMethod === PromoMethod.Gift),
    ];
    return sorted;
  }
  onSynologyComboSelectionChange(selection: { value: number; name: string }) {
    if (selection.name == 'Brand') {
      this.selectBrand(selection.value);
    } else if (selection.name == 'Capacity') {
      this.selectCapacity(selection.value);
    } else if (selection.name == 'ProductNumber') {
      this.selectProductNumber(selection.value);
    }
  }
  selectBrand(idx: number) {
    this.detail.brandOptions.forEach((item, index) => {
      if (idx == index) {
        item.selected = true;
        return;
      }
      item.selected = false;
    });

    this.selectedBrand = idx;
    this.detail.capacityOptions = [];
    this.detail.productNumberOptions = [];
    this.tempCapacityOptions = [];

    // 清空送表單組合項
    if (this.currentPromotion?.promoMethod === PromoMethod.Combo) {
      this.comboItems = [];
    }

    const name = this.detail.brandOptions[this.selectedBrand].name;
    let subitems =
      this.currentPromotion?.synologyComboBrandNameToSubItems?.[name];

    if (subitems) {
      // Modify by Tako on 2025/02/18 for N0.2024030301
      // 加入排序：根據 storageCapacity 排序
      subitems = subitems.sort((a, b) => a.storageCapacity - b.storageCapacity);
      subitems.forEach((item, index) => {
        const name = `${item.storageCapacity ?? ''}${StorageCapacityUnitEnum[item.storageCapacityUnit]
          }`;

        if (
          !this.detail.capacityOptions.filter((option) => option.name === name)
            .length
        ) {
          this.tempCapacityOptions.push({
            index,
            storageCapacity: item.storageCapacity,
            storageCapacityUnit: item.storageCapacityUnit,
            storageCount: item.storageCount,
          });
          this.detail.capacityOptions.push({
            name: name,
            selected: false,
            storageCapacity: item.storageCapacity,
            storageCapacityUnit: item.storageCapacityUnit,
          });
        }
      });

      // 加入排序：根據 storageCapacity 排序
      this.detail.capacityOptions.sort((a, b) => a.storageCapacity - b.storageCapacity);
    }
  }

  get storageCapacityUnits() {
    let items: SubItem[] | undefined = [];
    if (this.selectedBrand === BrandEnum.Seagate) {
      items = this.currentPromotion?.seagateItems;
    } else if (this.selectedBrand === BrandEnum.WesternDigital) {
      items = this.currentPromotion?.westernDigitalItems;
    } else if (this.selectedBrand === BrandEnum.TOSHIBA) {
      items = this.currentPromotion?.toshibaItems;
    }

    if (items) {
      return items.reduce(
        (result: Record<string, SubItem[]>, currentItem: SubItem) => {
          const groupKey = `${currentItem.storageCapacity}${StorageCapacityUnitEnum[currentItem.storageCapacityUnit]
            }`;
          if (!result[groupKey]) {
            result[groupKey] = [];
          }
          result[groupKey].push(currentItem);
          return result;
        },
        {}
      );
    }
    return {};
  }

  selectCapacity(idx: number) {
    let value = '';
    this.detail.capacityOptions.forEach((item, index) => {
      if (idx == index) {
        value = item.name;
        item.selected = true;
        return;
      }
      item.selected = false;
    });
    this.detail.productNumberOptions = [];
    if (this.currentPromotion?.promoMethod === PromoMethod.Combo) {
      this.comboItems = [];
    }
    const tempOption = this.tempCapacityOptions[idx];
    const name = this.detail.brandOptions[this.selectedBrand ?? -1]?.name;
    const subitems = name
      ? this.currentPromotion?.synologyComboBrandNameToSubItems?.[name]
      : undefined;
    if (subitems) {
      subitems.forEach((item, index) => {
        if (
          item.storageCapacity === tempOption.storageCapacity &&
          item.storageCapacityUnit === tempOption.storageCapacityUnit
        ) {
          this.detail.productNumberOptions.push({
            name: item.itemNumber,
            selected: false,
          });
        }
      });
    }
  }

  selectProductNumber(idx: number) {
    this.detail.productNumberOptions.forEach((item, index) => {
      if (idx == index) {
        item.selected = true;
        let selectedItem = this.currentPromotion?.products.find(
          (x: any) => x.itemNumber === item.name
        );
        this.currentPromotion!.promoPrice =
          (selectedItem?.promoPrice ?? 0) * (selectedItem?.storageCount ?? 1);
        return;
      }
      item.selected = false;
    });

    if (this.currentPromotion?.promoMethod === PromoMethod.Combo) {
      const name = this.detail.brandOptions.find((item) => item.selected)?.name;
      const subitems =
        this.currentPromotion?.synologyComboBrandNameToSubItems?.[name ?? ''];
      // const capacity = this.tempCapacityOptions[this.detail.capacityOptions.findIndex(item => item.selected)];
      const itemNumber = this.detail.productNumberOptions.find(
        (item) => item.selected
      )?.name;
      const comboItems = itemNumber
        ? subitems?.filter((item) => item.itemNumber == itemNumber)
        : [];
      this.comboItems = this.makeGroupingItems({
        ...this.currentPromotion,
        products: comboItems,
      });
    }
  }

  get selectedProductNumber() {
    return (
      this.detail.productNumberOptions.find(
        (productNumberOption) => productNumberOption.selected
      )?.name || ''
    );
  }

  private setBreadCrumb(result: ProductDetail) {
    const params = {
      ...this.route.snapshot.queryParams,
      itemId: null,
      type1Id: result.type1Id,
      type2Id: result.type2Id,
    };

    this.links = [
      { name: result.type1Name, url: '/' },
      {
        name: result.type2Name,
        url: `/ProductList`,
        queryParams: params,
      },
      {
        name: result.brandName,
        url: `/ProductList`,
        queryParams: { ...params, brandId: result.brandId },
      },
    ];
  }

  private setMoreCustomPromos(result: ProductDetail) {
    if (!result.promoInfos) return;
    for (let i = 0; i < result.customPromos.length; i++) {
      this.shopItems.push({
        text: result.customPromos[i].name,
        path: ['/OptionalPurchase?' + result.customPromos[i].promoId],
        promoId: result.customPromos[i].promoId,
      });
    }

    if (result?.hasMoreCustomPromos === true) {
      // 推一個 dummy 當成第三個元素，讓 app-shopping-chip 知道要輸出查看更多。這個 dummy 不會實際顯示。
      this.shopItems.push({
        text: '查看更多',
        path: ['/OptionalPurchase?' + result.customPromos[0].promoId], // 如果需要指定 path，可以在這裡進行設定
        promoId: result.customPromos[0].promoId,
      });
    }
  }

  private setPromotion(result: ProductDetail) {
    if (!result.promoInfos) {
      this.selectPromotion(null);
    }
  }

  private setSubInventory(result: ProductDetail) {
    const linKou = result.subInventory.find(
      (item) => item.subinventoryName === '林口倉'
    );
    const kaohsiung = result.subInventory.find(
      (item) => item.subinventoryName === '高雄倉'
    );

    // Modify by Tako on 2025/04/23 for IR-114103
    if (linKou) {
      this.currentSubInventory = linKou.qty > 0 ? linKou : kaohsiung && kaohsiung.qty > 0 ? kaohsiung : linKou;
    } else {
      this.currentSubInventory = kaohsiung;
    }
  }

  checkPromoCheck() {
    return (
      this.normalAdditionalItems2?.value.flat(1).filter((e: any) => e.checked)
        .length === 0
    );
  }

  checkPromoHasAdd() {
    if (this.currentPromotion) {
      return (
        this.currentPromotion.subPromoInfo.filter((e: any) => e.subMethod === 1)
          .length > 0
      );
    }
    return false;
  }

  checkAdditionalItemsChose() {
    if (this.normalAdditionalItems2) {
      let items = this.normalAdditionalItems2.value.flat(1);
      return (
        items.filter((e: any) => e.checked && e.countOption._value > 0).length >
        0
      );
    }
    return false;
  }

  async changeQty(qty: number) {
    const previousQty = this.currentQty;
    this.currentQty = qty;
    if (this.checkAdditionalItemsChose() && this.checkPromoHasAdd()) {
      await this.onQtyChange(previousQty, true);
    }
    this.validatePromo();
  }

  normalAdditionalItemsChange() {
    this.validatePromo();
  }

  get totalPrice() {
    return ifElse(
      not,
      () =>
        this.currentQty *
        (this.isUnitPrice ? this.detail.unitPrice : this.detail.priceWithTax),
      () => this.getDiscountPrice()
    )(this.currentPromotion);
  }

  get additionalItemLink() {
    return window.location.href.split('#')[0] + '#additional-item-container';
  }

  private getDiscountPrice() {
    const discountPrice = this.currentPromotion?.price as number;
    const discConditionQty = this.currentPromotion?.discConditionQty as number;
    let all = this.currentQty % discConditionQty === 0;
    if (discConditionQty === null) all = true;

    return all ? this.currentQty * discountPrice : this.getRestDiscountPrice();
  }

  private getRestDiscountPrice() {
    const discountPrice = this.currentPromotion?.price as number;
    const discConditionQty = this.currentPromotion?.discConditionQty as number;
    const rest = this.currentQty % discConditionQty;
    const discounts = (this.currentQty - rest) * discountPrice;

    return (
      discounts +
      rest *
      (this.isUnitPrice ? this.detail.unitPrice : this.detail.priceWithTax)
    );
  }

  /** 一般位置 附屬加價購 綁定商品 */
  getNormalAdditionalItems() {
    const promos = this.detail.promoInfos.filter((promo) =>
      this.currentPromotion
        ? promo.id === this.currentPromotion.id
        : promo.id === 0
    );
    if (promos.length == 0) {
      let items: any = [];
      let checkPrice: boolean; //是否經銷價
      checkPrice = false;
      if (promos.length == 0) {
        checkPrice = true;
      }

      this.currentPromotion = this.detail.promoIdToAdditionalBlocks.find(
        (promo) => promo.promoId === 0
      );
    }

    const promo = this.currentPromotion as SubPromoInfo;
    if (!promo) return [];

    if (this.detail.bindingProductAttachedPromoInfos || promos) {
      let items: any = [];
      if (this.detail.bindingProductAttachedPromoInfos.length > 0) {
        this.detail.bindingProductAttachedPromoInfos.forEach((promo: any) => {
          if (promo?.products) {
            let products: Product[] = promo?.products;
            items = [
              ...items,
              ...products.map((e, index) => {
                const subInventoryBuyCount =
                  e.subInventoryBuyCount
                    ?.filter((e) => {
                      return (
                        e.key === this.currentSubInventory?.subinventoryCode
                      );
                    })
                    .reduce((accumulator, object) => {
                      return accumulator + object.value;
                    }, 0) ?? 0;
                return {
                  itemId: e.itemId,
                  title: e.itemName,
                  hint: e.description,
                  price: e.unitPrice,
                  //price: e.useOverridePromoPriceText==false?e.unitPrice:e.overridePromoPriceText,
                  priceWithTax: e.priceWithTax,
                  //priceWithTax: e.useOverridePromoPriceText==false?e.priceWithTax:e.overridePromoPriceText,
                  discount: e.promoPrice,
                  priceHint: '未稅',
                  checked: false,
                  buyQty: 0,
                  countOption: this.createCountOption(index.toString()),
                  subInventoryBuyCount: subInventoryBuyCount,
                  prodImg: e.prodImg?.[0] ?? '',
                  useOverridePromoPriceText: e.useOverridePromoPriceText,
                  overridePromoPriceText: e.overridePromoPriceText,
                };
              }),
            ];
          }
        });
        return items;
      } else {
        promos.forEach((promo: any) => {
          if (promo?.subMethod === 1 && promo?.products) {
            // 檢查 promo.subMethod 是否等於1
            let products: Product[] = promo?.products;
            items = [
              ...items,
              ...products.map((e, index) => {
                const subInventoryBuyCount =
                  e.subInventoryBuyCount
                    ?.filter((e) => {
                      return (
                        e.key === this.currentSubInventory?.subinventoryCode
                      );
                    })
                    .reduce((accumulator, object) => {
                      return accumulator + object.value;
                    }, 0) ?? 0;
                return {
                  itemId: e.itemId,
                  title: e.itemName,
                  hint: e.description,
                  price: e.unitPrice,
                  priceWithTax: e.priceWithTax,
                  discount: e.promoPrice,
                  priceHint: '未稅',
                  checked: false,
                  buyQty: 0,
                  countOption: this.createCountOption(index.toString()),
                  subInventoryBuyCount: subInventoryBuyCount,
                  prodImg: e.prodImg?.[0] ?? '',
                  useOverridePromoPriceText: e.useOverridePromoPriceText,
                  overridePromoPriceText: e.overridePromoPriceText,
                };
              }),
            ];
          }
        });
        return items;
      }
    } else {
      if (!promo.subPromoInfo) return [];
      let items: Product[] = promo.subPromoInfo?.reduce(
        (products: any[], subPromoInfo) => {
          if (!subPromoInfo.products) {
            return products;
          }

          if (
            subPromoInfo.promoMethod == PromoMethod.AdditionalItem &&
            subPromoInfo.products.length > 0
          ) {
            return products.concat(subPromoInfo.products);
          }
          return products;
        },
        []
      );

      return items.map((e, index) => {
        const subInventoryBuyCount =
          e.subInventoryBuyCount
            ?.filter((e) => {
              return e.key === this.currentSubInventory?.subinventoryCode;
            })
            .reduce((accumulator, object) => {
              return accumulator + object.value;
            }, 0) ?? 0;
        return {
          itemId: e.itemId,
          title: e.itemName,
          hint: e.description,
          price: e.unitPrice,
          //price: e.useOverridePromoPriceText==false?e.unitPrice:e.overridePromoPriceText,
          priceWithTax: e.priceWithTax,
          discount: e.promoPrice,
          priceHint: '未稅',
          checked: false,
          buyQty: 0,
          countOption: this.createCountOption(index.toString()),
          subInventoryBuyCount: subInventoryBuyCount,
          prodImg: e.prodImg?.[0] ?? '',
          useOverridePromoPriceText: e.useOverridePromoPriceText,
          overridePromoPriceText: e.overridePromoPriceText,
        };
      });
    }
  }

  get findSubPromInfoAdditionalItemLastIndex() {
    if (!this.currentPromotion || !this.currentPromotion.products) {
      return -1;
    }

    return (this.currentPromotion.subPromoInfo as any).findLastIndex(
      (subPromoInfo: any) =>
        subPromoInfo.promoMethod == PromoMethod.AdditionalItem
    );
  }

  purchaseValueChange($event: any) {
    if ($event.checked) {
      this.mobileAdditionSelectedCount += 1;
    } else {
      this.mobileAdditionSelectedCount -= 1;
    }
  }

  private createNormalAdditionalItems() {
    const promo = this.currentPromotion as SubPromoInfo;
    if (!promo) return [];

    // const promos =
    //   this.detail.bindingProductAttachedPromoInfos.length === 0
    //     ? []
    //     : this.detail.bindingProductAttachedPromoInfos;

    // const promos2 = this.detail.promoInfos.filter(
    //   (promo) => promo.id === this.currentPromotion?.id
    // );

    const promos = this.currentPromotion?.subPromoInfo;

    const results: any[] = [];
    promos
      ?.filter(
        (promo: PromoInfo) => promo.promoMethod === PromoMethod.AdditionalItem
      )
      .forEach((promo: PromoInfo) => {
        let items = promo.products as Product[];
        const innerArray = [
          ...items.map((item, index) => {
            const subInventoryBuyCount =
              this.calculateSubInventoryBuyCount(item);
            const id = `${promo.id}_${item.itemId}_${index}`;
            this.group.addControl(`buyQty_${id}`, new FormControl(0));
            return this.createFormGroupFromProduct(
              item,
              id,
              subInventoryBuyCount,
              promo,
              promo.id
            );
          }),
        ];
        results.push(this.fb.array(innerArray));
      });

    return results;
  }

  getProductsFromSubPromos(
    subPromoInfo: SubPromoInfo[] | undefined
  ): Product[] {
    if (!subPromoInfo) return [];

    return subPromoInfo.reduce((products: Product[], subPromo) => {
      if (!subPromo.products) {
        return [...products.map((e) => ({ ...e, promoId: subPromo.id }))];
      }

      if (
        subPromo.promoMethod === PromoMethod.AdditionalItem &&
        subPromo.products.length > 0
      ) {
        return products.concat(
          subPromo.products.map((e) => ({ ...e, promoId: subPromo.id }))
        );
      }

      return [...products.map((e) => ({ ...e, promoId: subPromo.id }))];
    }, []);
  }

  validatePromo() {
    const promos = this.currentPromotion?.subPromoInfo;

    promos?.forEach((promo: PromoInfo, index) => {
      if (
        promo.discConditionAmount === null &&
        promo.discConditionQty === null
      ) {
        this.isCanBuyMultiple[index] = true;
      } else if (
        this.totalPrice >= (promo.discConditionAmount || 0) &&
        this.currentQty >= (promo.discConditionQty || 0)
      ) {
        this.isCanBuyMultiple[index] = true;
      } else {
        this.isCanBuyMultiple[index] = false;
      }
    });
  }

  calculateSubInventoryBuyCount(product: Product): number {
    return (
      product.subInventoryBuyCount
        ?.filter((e) => e.key === this.currentSubInventory?.subinventoryCode)
        .reduce((accumulator, object) => accumulator + object.value, 0) ?? 0
    );
  }

  private createFormGroupFromProduct(
    product: Product,
    index: string,
    subInventoryBuyCount: number,
    promo: SubPromoInfo,
    promoId: number
  ): FormGroup {
    return this.fb.group({
      itemId: product.itemId,
      // title: product.itemName,
      title: product.brandName + ' ' + product.itemNumber,
      hint: product.description,
      price: product.unitPrice,
      priceWithTax: product.priceWithTax,
      discount: product.promoPrice,
      priceHint: '未稅',
      checked: false,
      buyQty: 0,
      countOption: this.createCountOption(index),
      subInventoryBuyCount,
      prodImg: product.prodImg[0],
      promoId: promoId,
      useOverridePromoPriceText: product.useOverridePromoPriceText,
      overridePromoPriceText: product.overridePromoPriceText,
      canBuyMultipeTypesOfadditionalItems:
        promo.canBuyMultipleTypesOfAdditionalItems,
      mainAndAdditionalRatio: promo.mainAndAdditionalRatio,
      uniqueId: uniqueId(),
    });
  }

  private createCountOption(index: string) {
    let _max = 1;
    if (this.currentSubInventory) _max = this.currentSubInventory.qty;
    if (this.selectpromoCategory === 4) _max = Infinity;

    return {
      type: 'incrementInput',
      _label: '',
      label: '',
      inputType: 'number',
      name: `buyQty_${index}`,
      class: '',
      _value: 0,
      _step: 1,
      _min: 0,
      _max: _max,
      _wrap: false,
      color: 'primary',
    };
  }

  getProducts(promoInfo: PromoInfo): any[] {
    const subPromoInfo = promoInfo as SubPromoInfo;

    if (subPromoInfo === null || subPromoInfo.products === null) {
      return [];
    }

    if (promoInfo.promoMethod === 4) {
      const selectedCapacityOption = this.detail?.capacityOptions?.find(
        (option) => option.selected
      );

      if (selectedCapacityOption) {
        const filteredProducts = subPromoInfo.products.filter((e) => {
          return (
            e.storageCapacity == selectedCapacityOption.storageCapacity &&
            e.storageCapacityUnit == selectedCapacityOption.storageCapacityUnit
          );
        });

        return filteredProducts.map((e) => ({
          itemName: e.brandName + ' ' + e.itemNumber,
          description: e.description,
          unitPrice: e.unitPrice,
          priceWithTax: e.priceWithTax,
          ratio: e.storageCount ?? 1
        }));
      }
    }

    // 如果未進行過濾，或者無法找到選定的容量選項，則返回所有產品
    return subPromoInfo.products.map((e) => ({
      itemName: e.brandName + ' ' + e.itemNumber,
      description: e.description,
      unitPrice: e.unitPrice,
      priceWithTax: e.priceWithTax,
      promoPrice: e.promoPrice,
      ratio: e.storageCount ?? 1
    }));
  }

  get hasAttachedPromoInfos() {
    return this.detail.bindingProductAttachedPromoInfos.length > 0;
  }

  onSelectionChange() {
    const modelOption = {
      modelName: 'simple-dialog',
      config: {
        data: {
          title: '到貨說明',
          StyleMargin: '0px',
          text: `倉別將依據您結帳的到貨地址不同的到貨時間、運費<BR><a class="detail-search"
              href="https://service.unitech.com.tw/Distribution/DistributionInfo.aspx">
              配送時效查詢
          </a>`,
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

  async onQtyChange(previous: number | SubInventory, changeQty: boolean) {
    const modelOption = {
      modelName: 'simple-dialog',
      config: {
        data: {
          title: changeQty ? '變更商品數量' : '變更倉庫',
          StyleMargin: '0px',
          text: changeQty
            ? '請確認是否要變更商品數量，變更後加價購商品將會重置。'
            : '請確認是否要變更倉庫，變更後加購價商品將會重置。',
          displayFooter: true,
          cancelButton: '取消',
          confirmButton: '確認',
          cancel: () => {
            if (changeQty) {
              this.currentQty = previous as number;
            } else {
              this.currentSubInventory = previous as SubInventory;
            }
          },
          confirm: () => {
            this.ignoredUniqueId = [];
            this.normalAdditionalItems2.value
              .flat(1)
              .filter((x: any) => x.checked || x.countOption._value != 0)
              .forEach((x: any) => {
                x.checked = false;
                x.countOption._value = 0;
              });
            this.isCanBuyMultiple = Array(this.isCanBuyMultiple.length).fill(
              true
            );
            this.validatePromo();
          },
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

    const dialogRef = await this.dialogservice.openLazyDialog(
      modelOption.modelName,
      modelOption.config
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result != true) {
        if (changeQty) {
          this.currentQty = previous as number;
        } else {
          this.currentSubInventory = previous as SubInventory;
        }
      }
    });
  }

  loadContentManagement() {
    this.filterSub = this.route.queryParams
      .pipe(
        switchMap((params) => {
          const itemId = params['itemId'];
          return this.productService
            .getProductAwards(itemId, URL_UTIL.getDealerView(params))
            .pipe(
              catchError(() => {
                // handle api error and continue operation
                return of();
              })
            );
        }),

        tap((res) => {
          if (res.responseCode === '0000' && Array.isArray(res.result)) {
            const List = res.result as any[];
            if (Array.isArray(List)) {
              this.dataSourceAward = List.map((item) => {
                return {
                  promoteId: item.promoteId,
                  title: item.title,
                  startDate: item.startDate,
                  endDate: item.endDate,
                  detailUrl: item.detailUrl,
                  rewardActivityDate: item.rewardActivityDate,
                };
              });
            }
          } else {
            // Handle other cases if needed
          }
        })
      )
      .subscribe();
  }
  loadContentManagement2() {
    this.filterSub = this.route.queryParams
      .pipe(
        switchMap((params) => {
          const itemId = params['itemId'];
          return this.productService.getGuessYouLikeList(params).pipe(
            catchError(() => {
              // handle api error and continue operation
              return of();
            })
          );
        }),

        tap((res) => {
          if (
            res.responseCode === '0000' &&
            Array.isArray(res.result.guessYouLike)
          ) {
            const List = res.result.guessYouLike as any[];
            if (Array.isArray(List)) {
              this.dataSourceGuessYouLike = List;
            }
          } else {
          }
        })
      )
      .subscribe();
  }
  loadContentManagement3() {
    this.filterSub = this.route.queryParams
      .pipe(
        switchMap((params) => {
          const itemId = params['itemId'];
          return this.productService.getRecommendedList(params).pipe(
            catchError(() => {
              return of();
            })
          );
        }),
        tap((res) => {
          if (
            res.responseCode === '0000' &&
            Array.isArray(res.result.recommended)
          ) {
            const List = res.result.recommended as any[];
            if (Array.isArray(List)) {
              this.dataSourceRecommended = List;
            }
          } else {
          }
        })
      )
      .subscribe();
  }

  loadContentManagementGetWelfareDesc() {
    this.filterSub = this.route.queryParams
      .pipe(
        switchMap((params) => {
          return this.productService.getWelfareDesc().pipe(
            catchError(() => {
              // handle API error and continue operation
              return of();
            })
          );
        }),

        tap((res) => {
          if (
            res.responseCode === '0000' &&
            res.result &&
            res.result.welfareDesc
          ) {
            // Open the dialog with the fetched content
            this.welfareProductsDialog();
          } else {
            // Handle other cases if needed
          }
        })
      )
      .subscribe();
  }

  isCompareAddOrRemove(data: any): boolean {
    return !(this.comparisonComp?.items ?? [])?.find(
      (item: { name: any }) => item.name === data?.itemName
    );
  }

  onCompare(element: any): void {
    if (!this.comparisonComp) return;
    if (this.isUsingDealerView()) {
      this.showDealerViewError();
      return;
    }

    if (this.isCompareAddOrRemove(element)) {
      this.comparisonComp.add(
        element.itemName,
        element.unitPrice || element.priceWithTax,
        element.prodImg,
        element.itemId
      );
      if (
        this.comparisonComp?.items.find(
          (item: { itemId: any }) => item.itemId === element.itemId
        )
      ) {
        this.notifierService.showInfoNotification(
          `已加入比價（${this.comparisonComp.items.length}/${this.comparisonComp.maxCompareCount}）`
        );
      }
    } else {
      this.comparisonComp.remove(element, true);
      this.notifierService.showInfoNotification(`已移除比較`);
    }
    //  this.compareItems = this.comparisonComp?.items || [];
  }
  promoTagLabelIndexModify(element: any): number {
    if (element == null || element == undefined) {
      return 1;
    }
    return element;
  }
  showproductTag(promoCategory: any): string {
    if (promoCategory == 4) {
      return '團購';
    } else if (promoCategory == 2) {
      return '預購';
    }
    return '';
  }

  preorderAddToCart() {
    this.route.queryParams
      .pipe(
        switchMap(({ itemId }) => {
          const params = {
            itemId: parseInt(itemId) || 0,
            promoId: this.currentPromotion?.id ?? 0,
            orderQuantity: this.currentQty,
            subInventoryCode: this.currentSubInventory?.subinventoryCode,
          };
          return this.productService.preOrderAddToCart(params);
        }),
        tap((res) => {
          if (res['responseCode'] !== ResponseCode.Success) {
            const modelOption = {
              modelName: 'simple-dialog',
              config: {
                data: {
                  title: '商品異動',
                  StyleMargin: '0px',
                  message: `本商品「${this.detail.itemName}」${this.currentSubInventory?.subinventoryName}缺貨，請您選購其他倉的商品，謝謝。`,
                  warning: true,
                  displayFooter: true,
                  confirmButton: '確認',
                  confirm: () => { },
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
            return;
          }
          this.analyticsService.event('add_to_cart_pre_order', {
            itemId: this.detail.itemId,
            itemName: this.detail.itemName,
            qty: this.countOption._value,
            promo: {
              promoId: this.currentPromotion?.id,
              promoName: this.currentPromotion?.name,
            },
          });

          const itemId =
            parseInt(this.route.snapshot.queryParams['itemId']) || 0;
          const param = {
            addToCart: {
              itemId: itemId,
              promoId: this.currentPromotion?.id ?? 0,
              orderQuantity: this.currentQty,
              subInventoryCode: this.currentSubInventory?.subinventoryCode!,
            },
            ...res.result,
          };

          this.storageService.set(StorageEnum.Preorder, param);

          this.router.navigate(['/PreorderProcess'], {
            queryParams: {
              itemId: itemId,
              source: this.source,
              sourceId: this.sourceId,
            },
          });
        })
      )
      .subscribe();
  }

  // 補貨中
  get isRestocking() {
    return (
      this.currentSubInventory?.qty === 0 &&
      this.selectpromoCategory != 4 &&
      this.selectpromoCategory != 2
    );
  }
  // 判斷是不是要顯示團購優惠，並且只顯示一個
  mobileCheckPreOrderBuy(selectpromoCategory: number) {
    if (
      selectpromoCategory == 2 &&
      this.isShowMobilePromotion &&
      this.mobileGroupBuyStatus == 0
    ) {
      this.mobileGroupBuyStatus = 1;
      return true;
    } else {
      this.mobileGroupBuyStatus = 0;
      return false;
    }
  }
  // 判斷是不是要顯示團購優惠，並且只顯示一個
  mobileCheckGroupBuy(selectpromoCategory: number) {
    if (
      selectpromoCategory == 4 &&
      this.isShowMobilePromotion &&
      this.mobileGroupBuyStatus == 0
    ) {
      this.mobileGroupBuyStatus = 1;
      return true;
    } else {
      this.mobileGroupBuyStatus = 0;
      return false;
    }
  }

  // 加購專區顯示用：取得附屬促銷的促銷編號
  getPromoString(controlIndex: number) {
    if (
      this.currentPromotion &&
      this.currentPromotion.subPromoInfo &&
      this.currentPromotion.subPromoInfo[controlIndex]
    ) {
      return this.currentPromotion.subPromoInfo[controlIndex].promoString || '';
    }
    return '';
  }

  // 加購專區限制各商品最大數量
  getSubInventoryBuyCount(
    controlIndex: number,
    currentQty: number,
    itemId?: string
  ) {
    // 沒促銷資訊時，提早返回 0
    if (
      !this.currentPromotion ||
      !this.currentPromotion.subPromoInfo ||
      !this.currentPromotion.subPromoInfo[controlIndex]
    ) {
      return 0;
    }

    let mainProductQty = currentQty ?? 0;
    let mainAndAdditionalRatio =
      this.currentPromotion.subPromoInfo[controlIndex].mainAndAdditionalRatio ??
      1;
    let promoAllowed = mainProductQty * mainAndAdditionalRatio;

    // 沒有 itemId 的時候，提早返回（用在頂部紅字的情況）
    let hasItemId = itemId != null && itemId != undefined && itemId != '';

    if (!hasItemId) return promoAllowed;

    const subInventoryBuyCounts = this.currentPromotion.subPromoInfo[
      controlIndex
    ].products?.map((res) => {
      if (res.itemId == itemId) {
        const result = res.subInventoryBuyCount.find(
          (item: { key: string }) =>
            item.key === this.currentSubInventory?.subinventoryCode
        );
        return result ? result.value : 0;
      }
    });

    const result = subInventoryBuyCounts?.filter((res) => res !== undefined)[0];

    // 不可以買超過加購品的庫存
    // 不可以買超過主商品 * 加購促銷比例
    return Math.min(result, promoAllowed);
  }

  // 顯示按鈕狀態
  // 加入購物車/預購/貨到通知我/聯絡業務/團購
  get buttonStatus():
    | 'addToCart'
    | 'preOrder'
    | 'notifyMeOnDelivery'
    | 'contactSales'
    | 'groupBuy'
    | undefined {
    if (
      this.currentSubInventory?.qty != 0 &&
      (!this.currentPromotion || this.currentPromotion?.isInMarketTimeRange) &&
      this.selectpromoCategory != 4 &&
      this.selectpromoCategory != 2 &&
      this.detail.productTag !== '預購'
    )
      return 'addToCart';

    if (this.detail.productTag == '預購') return 'preOrder';

    if (
      this.currentSubInventory?.qty === 0 &&
      this.selectpromoCategory != 4 &&
      this.selectpromoCategory != 2 &&
      this.currentSubInventory.productDisplayStatus === 1
    )
      return 'notifyMeOnDelivery';

    if (
      this.currentSubInventory?.qty === 0 &&
      this.selectpromoCategory != 4 &&
      this.selectpromoCategory != 2 &&
      this.currentSubInventory.productDisplayStatus === 2
    )
      return 'contactSales';

    if (
      (!this.currentPromotion || this.currentPromotion?.isInMarketTimeRange) &&
      this.selectpromoCategory == 4
    )
      return 'groupBuy';

    return 'addToCart';
  }
  getAwardActivityUrl(promoteId: string): void {
    this.productService.awardActivityUrl(promoteId).subscribe((res) => {
      if (res.responseCode === ResponseCode.Success) {
        const form = document.createElement('form');

        // 設置表單屬性
        form.method = 'POST';
        form.action = res.result.url;
        form.target = '_blank';

        const iterator = Object.entries(res.result.formData);

        for (const [key, value] of iterator) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        }
        document.body.appendChild(form);

        form.submit();

        document.body.removeChild(form);
      }
    });
  }

  /** helper method for html，用於確保限制顯示數字的最小值 */
  defaultOrAbove(defNum: number, num?: number | null): number {
    return Math.max(num ?? 0, defNum);
  }

  /** 是否可按下加入購物車 */
  canPurchase(): boolean {
    const max = this.getMax();
    const min = this.getMin();

    return min <= this.currentQty && this.currentQty <= max;
  }

  /** 基於當前促銷與選倉，取得可購買的最大數量 */
  getMax(): number {
    if (this.selectpromoCategory === 4 || this.selectpromoCategory === 2)
      return Infinity;

    let result = this.currentSubInventory?.qty!;

    if (this.currentPromotion?.products?.length)
      result = Math.min(
        result,
        this.currentPromotion?.products[0].purchaseLimit
      );

    if (result == undefined) {
      result = 0;
    }

    return result;
  }
  getMin(): number {
    // 如果沒得買，回傳 0
    if (this.getMax() <= 0) return 0;

    // 最小數量有幾種可能性
    // 1. 商品本身的最小購買量
    // 2. 促銷-最少購買數量
    // 3. 促銷-最少購買金額 / 當前單價
    // 4. 促銷-最少購買倍數
    // 5. 促銷-主商品數量(目前一般組合價可設定)

    let result = this.defaultOrAbove(1, this.detail?.minBuyCount);

    if (!this.currentPromotion) return result;

    if (this.currentPromotion.discConditionQty)
      result = Math.max(result, this.currentPromotion.discConditionQty);

    if (this.currentPromotion.discConditionMultiple)
      result = Math.max(result, this.currentPromotion.discConditionMultiple);

    if (this.currentPromotion.discConditionAmount)
      result = Math.max(
        result,
        Math.round(
          this.currentPromotion.discConditionAmount /
          this.getCurrentSinglePrice()
        )
      );

    if (this.currentPromotion.mainItemQty)
      result = Math.max(result, this.currentPromotion.mainItemQty * this.currentPromotion.discConditionMultiple);

    return result;
  }

  /** 基於當前促銷，取得目前單組價格 */
  getCurrentSinglePrice(): number {
    // 這個方法主要用在計算促銷 -> 單次購買金額 -> 數量元件最小數
    // 因為就目前設計，量購沒有單次購買金額，所以不考慮折價參數隨著數量變動的情況
    // 但如果量購開放單次購買金額，這個方法會需要針對量購調整

    return this.currentPromotion?.price ?? this.detail.unitPrice;
  }

  /** 數量下方的購買限制資訊 */
  getPurchaseLimitString(): string {
    const canBuy = this.defaultOrAbove(0, this.getMax() - this.currentQty);
    const min = this.getMin();
    const mulitplier = this.defaultOrAbove(
      1,
      this.currentPromotion?.discConditionMultiple
    );

    let result = "";
    if (isFinite(canBuy)) {
      result = `尚可購買${canBuy}個；`;
    }
    result += `最少購買${min}個`;
    if(this.currentPromotion?.subMethod == SubMethod.GeneralCombo){
      result += `；此組合為 ${this.currentPromotion.mainItemQty ?? 1}入一組`;
      result += `；一次需購買${mulitplier}組`;
    }else{
      result += `；購買單位倍數為${mulitplier}倍`;
    }

    return result;
  }

  showArrivalNoticeDialog() {
    if (this.isUsingDealerView()) {
      this.showDealerViewError();
      return;
    }

    this.dialogservice.arrivalNoticeDialog(this.detail);
  }

  showContactBusinessDialog() {
    if (this.isUsingDealerView()) {
      this.showDealerViewError();
      return;
    }

    this.dialogservice.contactBusinessDialog(this.detail);
  }
  allOptionsSelected(): boolean {
    return (
      (this.detail.brandOptions?.length
        ? this.detail.brandOptions.some((option) => option.selected)
        : true) &&
      (this.detail.capacityOptions?.length
        ? this.detail.capacityOptions.some((option) => option.selected)
        : true) &&
      (this.detail.productNumberOptions?.length
        ? this.detail.productNumberOptions.some((option) => option.selected)
        : true)
    );
  }

  get hasAdditionalItems(): boolean {
    return this.normalAdditionalItems2?.controls?.length > 0;
  }
}
