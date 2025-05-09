import { Brand } from 'src/app/models/product.model';
import { startWith } from 'rxjs';
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
import { CurrencyPipe, ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { promoTagLabel } from 'src/app/constants/product.constants';
import { PromoMethod, SubMethod } from 'src/app/enums/promotion.enum';
import { CartService, ProductService, MemberService } from 'src/app/services';
import { SharedService } from 'src/app/core/services/shared.service';

import {
  DialogService,
  LayoutService,
  NotifierService,
} from 'src/app/shared/services';
import {
  BehaviorSubject,
  catchError,
  concatMap,
  filter,
  finalize,
  from,
  map,
  mergeMap,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { AddToCartReplaceItem, FilterForm } from 'src/app/models';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { clone, indexOf } from 'ramda';
import { GuessYouLike } from '../../models/shopping-cart.model';
import { DialogAction, ResponseCode } from 'src/app/enums';
import { CheckoutService } from '../../services/checkout.service';
import { ValidateCheckout } from '../../models/checkout.model';
import { StorageService } from 'src/app/core/services/storage.service';
import { StorageEnum } from '../../enums/storage.enum';
import { CheckoutUtilService } from '../../services/checkout-util.service';
import { Title } from '@angular/platform-browser';
import {
  AddToCartCodeMap,
  AddToCartModalOptionMap,
  CheckoutCodeMap,
  CheckoutModalOptionMap,
} from '../../services/shopping-cart.service.config';
import { uniqueId } from '../../shared/utils/uniqueId';
import { POP_UP } from 'src/app/shared/utils/popUpUtilities';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
  providers: [CheckoutUtilService, CartService],
})
export class ShoppingCartComponent implements OnInit {
  currentSelectWarehouse: any;
  currentSelectWarehouseId: number = 0;
  thisSelectWarehouseId: any;
  selectedWarehouseMobile: any;
  isMobile: boolean = false;
  PromoMethod: typeof PromoMethod = PromoMethod;
  SubMethod: typeof SubMethod = SubMethod;
  isLoading = true;
  promoTagLabel: typeof promoTagLabel = promoTagLabel;
  currentPage = 1;
  // TODO remove
  testDialogCount = 0;
  testInit = true;
  warehouses: {
    id: number;
    title: string;
    no: string;
    selected: boolean;
    subInventoryCode: string;
    productGroups: {
      purchaseItemId: number;
      id?: number;
      name: string;
      desc: string;
      imgSrc: string;
      price: number;
      priceWithTax: number;
      totalPrice: number;
      qty: number;
      mainItemQty: number;
      stepQuantities?: number;
      availableQuantities?: number;
      maxQuantities?: number;
      mainProductId?: number;
      promotionMethod: PromoMethod;
      subMethod?: SubMethod;
      priceError?: string;
      qtyError?: string;
      selected: boolean;
      follow: boolean;
      replaced?: boolean;
      canReplace?: boolean;
      hasError?: boolean;
      tagName?: string;
      ration?: number;
      ratio?: number;
    }[][];
  }[] = [];

  guessYouLikes: any[] = [];
  recommended: any[] = [];
  private additionalItems: any[] = [];
  private filterFormData!: Partial<FilterForm>;
  private initialPageData = {
    page: 1,
    pageSize: 10,
    sortField: 'unitPrice',
    isUnitPrice: true,
  };
  keyword = '';
  isSearchPage = false;
  pageData: Partial<FilterForm> = clone(this.initialPageData);
  data: any[] = [];
  totalItems!: number;
  filterForm = new BehaviorSubject<Partial<FilterForm> | null>(null);
  filterForm$ = this.filterForm.asObservable();
  shoppingData$ = this.filterForm$;
  selectAdditionItem: any = {};
  awards: any = [];
  awardsChecked: number[] = [];

  nowWarehouse: any = [];
  nowWarehouseIndex: number = 0;
  emptyWarehouseHint: string = "讀取中"

  sharedMapper = (e: any) => {
    return {
      itemId: e.itemId,
      itemNumber: e.itemNumber,
      itemName: e.itemName,
      description: e.description,
      prodImg: e.prodImg,
      unitPrice: e.unitPrice,
      priceWithTax: e.priceWithTax,
      isHot: e.isHot,
      isLimit: e.isLimit,
      productDisplayStatus: e.productDisplayStatus,
      productTag: e.productTag,
      promoInfos: e.promoInfos?.map((info: any) => {
        return {
          promoString: e.promoString,
          id: e.id,
          name: e.name,
          remark: e.remark,
          promoCategory: e.promoCategory,
          displayArea: e.displayArea,
          promoMethod: info.promoMethod,
          subMethod: info.subMethod,
          marketType: e.marketType,
          status: e.status,
          startDate: e.startDate,
          endDate: e.endDate,
          discConditionQty: e.discConditionQty,
          discConditionMultiple: e.discConditionMultiple,
          isLimitQty: e.isLimitQty,
          price: e.price,
          listLineId: e.listLineId,
        };
      }),
    } as GuessYouLike;
  };

  getMin(info: any): number {
    let result = info.discConditionQty ? info.discConditionQty : info.minSafeQuantity;
    if(info.subMethod == SubMethod.GeneralCombo){
      let mainItemQty = info.mainItemQty ?? 1;
      result = Math.max(result,mainItemQty);
    }
    return result;
  }

  getStep(info: any): number{
    let result = info.discConditionMultiple ? info.discConditionMultiple : info.stepQuantities;
    if(info.subMethod == SubMethod.GeneralCombo){
      let mainItemQty = info.mainItemQty ?? 1;
      result = (info.discConditionMultiple ?? 1 ) * mainItemQty;
    }
    return result;
  }

  extraProducts$ = this.filterForm$.pipe(
    filter((filterFormParams) => filterFormParams !== null),
    switchMap((params) => {
      return this.shoppingCartService.getExtraProducts(params as FilterForm);
    }),
    tap((response: any) => {
      this.data = response?.result?.data;
      this.totalItems = response?.result?.pagination?.total;
      const { guessYouLike, recommended } = response.result;
      this.recommended = recommended.map(this.sharedMapper);
      this.guessYouLikes = guessYouLike.map(this.sharedMapper);
    })
  );
  warehouseList$ = this.filterForm$.pipe(
    filter((filterFormParams) => filterFormParams !== null),
    switchMap((params) => {
      try {
        this.isLoading = true;
        return this.shoppingCartService.getLists();
      } finally {
        this.isLoading = false;
      }
    }),
    tap((response: any) => {
      const result = response.result;
      this.warehouses = result.map((e: any) => {
        return {
          id: e.id,
          title: e.subInventoryName,
          subInventoryCode: e.subInventoryCode,
          no: e.purchaseNo,
          selected: false,
          productGroups: [],
        };
      });
      this.emptyWarehouseHint = "您的購物車是空的。"
      this.selectWarehouse(this.warehouses[0], 0);
    })
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    public layoutService: LayoutService,
    public dialogservice: DialogService,
    private cartService: CartService,
    private viewportScroller: ViewportScroller,
    private notifierService: NotifierService,
    private shoppingCartService: ShoppingCartService,
    private checkoutService: CheckoutService,
    private storageService: StorageService,
    private checkoutUtilService: CheckoutUtilService,
    private currencyPipe: CurrencyPipe,
    private memberService: MemberService,
    private sharedService: SharedService,
    private title: Title,
  ) {
    this.shoppingData$.subscribe();
    this.extraProducts$.subscribe();
    this.activatedRoute.queryParams
      .pipe(
        tap(({ keyword }) => {
          this.pageData = clone(this.initialPageData);
          this.isSearchPage = !!keyword;
          this.keyword = keyword ? keyword : '';
          this.pageDataChange({ keyword });
        }),
        filter(({ keyword }) => keyword),
        tap(({ keyword }) => {
          this.pageData = {
            ...this.pageData,
            keyword,
          };
          this.pageDataChange({ keyword });
        })
      )
      .subscribe();
  }

  private lastInitiatedDetailId?: number | null = null;

  ngOnInit(): void {
    this.isLoading = false;
    this.isMobile = window.innerWidth <= 768;
    this.warehouseList$.subscribe(() => {
      if (this.notEmptyWarehouses.length > 0) {
        this.selectedWarehouseMobile = this.notEmptyWarehouses[0];
        this.warehouses[0].selected = true;
      }
    });
    if (localStorage.getItem('orgId') == '151') {
      this.title.setTitle('精豪電腦');
    }
    else {
      this.title.setTitle('精技電腦');
    }
  }

  get selectedWarehouse() {
    return this.warehouses.find((item: any) => item.selected);
  }

  get selectedWarehouseMainProductCount() {
    const selectedWarehouse = this.selectedWarehouse;
    if (!selectedWarehouse) {
      return 0;
    }

    return selectedWarehouse.productGroups.reduce((totalCount, products) => {
      return (
        totalCount +
        products.filter((item) => this.isMainProduct(item) && item.selected)
          .length
      );
    }, 0);
  }

  get totalPrice() {
    if (!this.selectedWarehouse) {
      return 0;
    }

    return this.selectedWarehouse.productGroups
      // 主商品有被勾的
      .filter(products => products.some(main => (this.isMainProduct(main)) && main.selected))
      .reduce(
        (totalPrice, products) => {
          return (
            totalPrice +
            products
              .reduce((productTotalPrice, product) => {
                if (product.availableQuantities !== undefined) {
                  return productTotalPrice + product.totalPrice;
                } else {
                  return productTotalPrice;
                }
              }, 0)
          );
        },
        0
      );
  }

  get productTotalCount() {
    if (!this.selectedWarehouse) {
      return 0;
    }

    return this.selectedWarehouse.productGroups.reduce(
      (productTotalCount, products) => {
        return (
          productTotalCount +
          products.filter(
            (product) => this.isMainProduct(product) && product.selected
          ).length
        );
      },
      0
    );
  }

  get notEmptyWarehouses() {
    return this.warehouses;
  }

  get selectedWarehouseAllProductSelected() {
    const selectedWarehouse = this.selectedWarehouse;
    if (!selectedWarehouse) {
      return false;
    }

    return selectedWarehouse.productGroups.reduce(
      (allSelected: boolean, products: any[]) => {
        return (
          allSelected &&
          products.every(
            (item) =>
              (this.isMainProduct(item) && item.selected) ||
              (!this.isMainProduct(item) && !item.selected) ||
              item.hasError
          )
        );
      },
      true
    );
  }

  getPromotionTag(promotionMethod: number, promoCategory: number) {
    if (promotionMethod && promoCategory) return promoTagLabel[promoCategory][promotionMethod];
    return {
      text: '',
      label: '',
      color: '',
    };
  }

  toggleModalOptionMap(isAddToCart: boolean = false) {
    this.cartService.modalOptionMap = isAddToCart
      ? AddToCartModalOptionMap
      : CheckoutModalOptionMap;
    this.cartService.addToCartCheckCodeMap = isAddToCart
      ? AddToCartCodeMap
      : CheckoutCodeMap;
  }

  updateDetail(element: any, e: any): void {
    const { subInventories, awards, hasDeleteInfo, deleteInfo } = e.result;

    if (e.result.hasDeleteInfo) {
      const modelOption = {
        modelName: 'simple-dialog',
        config: {
          data: {
            StyleMargin: '0px',
            text: deleteInfo,
            textAlign: 'center',
          },
          width: 'auto',
          height: 'auto',
          hasBackdrop: false,
          autoFocus: false,
          enterAnimationDuration: '300ms',
          exitAnimationDuration: '300ms',
          panelClass: 'dark',
        },
      };
      this.dialogservice.openLazyDialog(
        modelOption.modelName,
        modelOption.config
      );
    }

    const products: any[] = [];
    subInventories.forEach((firstSubInventory: any) => {

      firstSubInventory.productBatches.forEach((e: any) => {
        let group: any[] = [];
        let hasCustomPromo: boolean = e.customPromo === null ? false : true;
        if (hasCustomPromo) {
          group.push({
            purchaseItemId: e.customPromo.promoId,
            id: e.customPromo.promoId,
            name: e.customPromo.title,
            desc: e.customPromo.description,
            price: e.customPromo.sum,
            priceWithTax: e.customPromo.sum,
            totalPrice: e.customPromo.sum,
            qty: 1,
            availableQuantities: 0,
            promotionMethod: 6,
            promoCategory: e.mainProducts[0].promoCategory,
            subMethod: null,
            selected: false,
            follow: false,
            useOverridePromoPriceText: false,
            overridePromoPriceText: null,
            isPromo: 1,
            discConditionQty: e.mainProducts[0].discConditionQty,
            discConditionMultiple: e.mainProducts[0].discConditionMultiple,
            mainItemQty: e.mainProducts[0].mainItemQty,
            min: this.getMin(e.mainProducts[0]),
            step: this.getStep(e.mainProducts[0]),
            hasError: e.hasError,
            tagName: e.mainProducts[0].tagName,
            canEditQuantity: false,
            canDelete: true,
            errorMessage: e.mainProducts[0].errorMessage,
            minSafeQuantity: e.mainProducts[0].minSafeQuantity,
            hasPromoLimitation: e.mainProducts[0].hasPromoLimitation || false,
          })
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
            totalPrice: hasCustomPromo ? 0 : main.totalPrice,
            ration: main.ratio,
            ratio: main.ratio,
            availableQuantities: main.purchaseLimit,
            promotionMethod: hasCustomPromo ? 1 : main.promotionMethod,
            subMethod: main.subMethod,
            promoCategory: main.promoCategory,
            selected: false,
            follow: false,
            useOverridePromoPriceText: main.tagName === '任購' ? true : main.useOverridePromoPriceText,
            overridePromoPriceText: main.tagName === '任購' ? 0 : main.overridePromoPriceText,
            mainProductId: hasCustomPromo ? 1111 : false,
            discConditionQty: e.mainProducts[0].discConditionQty,
            discConditionMultiple: e.mainProducts[0].discConditionMultiple,
            mainItemQty: e.mainProducts[0].mainItemQty,
            min: this.getMin(e.mainProducts[0]),
            step: this.getStep(e.mainProducts[0]),
            tagName: main.tagName,
            hasError: e.hasError,
            canEditQuantity: main.canEditQuantity,
            canDelete: main.canDelete,
            errorMessage: main.errorMessage,
            minSafeQuantity: main.minSafeQuantity,
            hasPromoLimitation: main.hasPromoLimitation || false,
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
              totalPrice: hasCustomPromo ? 0 : sub.totalPrice,
              ration: sub.ratio,
              availableQuantities: sub.purchaseLimit,
              promotionMethod: sub.promoMethod,
              subMethod: sub.subMethod,
              promoCategory: sub.promoCategory,
              selected: false,
              follow: false,
              mainProductId: main.itemId,
              useOverridePromoPriceText: sub.tagName === '任購' ? true : sub.useOverridePromoPriceText,
              overridePromoPriceText: sub.tagName === '任購' ? 0 : sub.overridePromoPriceText,
              discConditionQty: sub.discConditionQty,
              discConditionMultiple: sub.discConditionMultiple,
              mainItemQty: sub.mainItemQty,
              min: sub.discConditionQty ? sub.discConditionQty : sub.minSafeQuantity,
              step: sub.discConditionMultiple ? sub.discConditionMultiple : sub.stepQuantities,
              tagName: sub.tagName,
              hasError: e.hasError,
              canEditQuantity: sub.canEditQuantity,
              canDelete: sub.canDelete,
              errorMessage: sub.errorMessage,
              minSafeQuantity: sub.minSafeQuantity,
              hasPromoLimitation: sub.hasPromoLimitation || false,
              ratio: sub.ratio
            });
          });
        });
        products.push(group);
      });
    });
    element.productGroups = products;

    // 結帳加購從另一個端點取得

    this.shoppingCartService.getAdditionals(element.id)
      .subscribe((e: any) => {
        let additionalProductPromos = e.result.data;

        let additionalItems: any = [];
        additionalProductPromos.forEach((promo: any) => {
          additionalItems = [
            ...additionalItems,
            ...promo.products.map((e: any) => {
              return {
                promo: promo,
                id: e.itemId,
                name: e.itemName,
                title: e.brandName + ' ' + e.itemNumber,
                brandName: e.brandName,
                itemNumber: e.itemNumber,
                // name: e.brandName + ' ' + e.itemNumber,
                desc: e.description,
                imgSrc: e.prodImg[0],
                price: e.promoPrice,
                priceWithTax: e.unitPrice,
                purchaseLimit: e.purchaseLimit,
                purchaseLimitString: e.purchaseLimitString,
                totalPrice: e.totalPrice,
                limitQtyPerAccount: 0,
                limitQtyPerOrder: 0,
                limitQtyPerMonth: 3,
                qty: 0,
                useOverridePromoPriceText: e.useOverridePromoPriceText,
                overridePromoPriceText: e.overridePromoPriceText,
              };
            }),
          ];
        });
        const allProducts = element.productGroups.flat();

        this.additionalItems = additionalItems.map((item: any) => {
          return {
            ...item,
            hide:
              allProducts.find(
                (p: any) =>
                  p.promoMethod == PromoMethod.AdditionalItem && p.id == item.id
              ) != null,
          };
        });
      });

    this.awards = awards;

    if (this.lastInitiatedDetailId != e.result.shoppingListId) {
      // 第一次進入一張採購清單時，全部達成禮預設勾選
      this.awardsChecked = this.awardsChecked = this.awards.map((item: any) => item.giftListId);
      this.lastInitiatedDetailId = e.result.shoppingListId;
    }
  }

  selectWarehouse(element: any, index: number, newDetail: any = null) {
    this.currentSelectWarehouse = element;
    this.currentSelectWarehouseId = index;
    this.thisSelectWarehouseId = element.id;
    this.toggleModalOptionMap(false);
    this.warehouses.forEach((item) => (item.selected = false));

    if (!newDetail) {
      this.isLoading = true;
      this.shoppingCartService.getSingle(element.id).subscribe((e: any) => {
        this.updateDetail(element, e);
        this.isLoading = false;
      });

    }
    else {
      this.isLoading = true;
      this.updateDetail(element, { result: newDetail });
      this.isLoading = false;
    }

    this.warehouses[index].selected = true;
  }

  warehouseSelected() {
    const selectedWarehouse = this.selectedWarehouseMobile;

    if (selectedWarehouse) {
      this.warehouses.forEach((item) => (item.selected = false));
      this.shoppingCartService
        .getSingle(selectedWarehouse.id)
        .subscribe((e: any) => {
          const { subInventories, awards, hasDeleteInfo, deleteInfo } = e.result;

          if (e.result.hasDeleteInfo) {
            const modelOption = {
              modelName: 'simple-dialog',
              config: {
                data: {
                  StyleMargin: '0px',
                  text: deleteInfo,
                  textAlign: 'center',
                },
                width: 'auto',
                height: 'auto',
                hasBackdrop: false,
                autoFocus: false,
                enterAnimationDuration: '300ms',
                exitAnimationDuration: '300ms',
                panelClass: 'dark',
              },
            };
            this.dialogservice.openLazyDialog(
              modelOption.modelName,
              modelOption.config
            );
          }


          const products: any[] = [];
          const firstSubInventory: any = subInventories[0];
          firstSubInventory.productBatches.forEach((e: any) => {
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
                ration: main.ratio,
                availableQuantities: main.purchaseLimit,
                promotionMethod: main.promoMethod,
                subMethod: main.subMethod,
                selected: false,
                follow: false,
                useOverridePromoPriceText: main.useOverridePromoPriceText,
                overridePromoPriceText: main.overridePromoPriceText,
                totalPrice: main.totalPrice,
                tagName: main.tagName,
                ratio: main.ratio
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
                  ration: sub.ratio,
                  availableQuantities: sub.purchaseLimit,
                  promotionMethod: sub.promoMethod,
                  subMethod: sub.subMethod,
                  selected: false,
                  follow: false,
                  mainProductId: main.itemId,
                  useOverridePromoPriceText: sub.useOverridePromoPriceText,
                  overridePromoPriceText: sub.overridePromoPriceText,
                  totalPrice: sub.totalPrice,
                  tagName: sub.tagName,
                  ratio: sub.ratio
                });
              });
              products.push(group);
            });
          });
          selectedWarehouse.productGroups = products;

          this.shoppingCartService.getAdditionals(selectedWarehouse.id)
            .subscribe((e: any) => {
              let additionalProductPromos = e.result.data;

              let additionalItems: any = [];
              additionalProductPromos.forEach((promo: any) => {
                additionalItems = [
                  ...additionalItems,
                  ...promo.products.map((e: any) => {
                    return {
                      promo: promo,
                      id: e.itemId,
                      name: e.itemName,
                      title: e.brandName + ' ' + e.itemNumber,
                      brandName: e.brandName,
                      itemNumber: e.itemNumber,
                      desc: e.description,
                      imgSrc: e.prodImg[0],
                      price: e.promoPrice,
                      priceWithTax: e.unitPrice,
                      purchaseLimit: e.purchaseLimit,
                      purchaseLimitString: e.purchaseLimitString,
                      limitQtyPerAccount: 0,
                      limitQtyPerOrder: 0,
                      limitQtyPerMonth: 3,
                      qty: 0,
                      useOverridePromoPriceText: e.useOverridePromoPriceText,
                      overridePromoPriceText: e.overridePromoPriceText,
                      totalPrice: e.totalPrice
                    };
                  }),
                ];
              });

              const allProducts = selectedWarehouse.productGroups.flat();

              this.additionalItems = additionalItems.map((item: any) => {
                return {
                  ...item,
                  hide:
                    allProducts.find(
                      (p: any) =>
                        p.promoMethod === PromoMethod.AdditionalItem &&
                        p.id === item.id
                    ) != null,
                };
              });
            });

          this.awards = awards;
          if (this.lastInitiatedDetailId != e.result.shoppingListId) {
            // 第一次進入一張採購清單時，全部達成禮預設勾選
            this.awardsChecked = this.awardsChecked = this.awards.map((item: any) => item.giftListId);
            this.lastInitiatedDetailId = e.result.shoppingListId;
          }
        });
      selectedWarehouse.selected = true;
    }
  }

  toPrice(num: number) {
    return this.currencyPipe.transform(
      num ? num : 0,
      '',
      'symbol',
      '1.0-0'
    ) as string;
  }

  isMainProduct(product: any) {
    return (
      !product.mainProductId
    );
  }

  isGiftInCombo(product: any){
    console.log(product)
    return (
      product.promotionMethod == PromoMethod.Combo
       && product.name?.startsWith('紅利折扣')
    );
  }
  getAdditionalItems() {
    return this.additionalItems.filter((item) => !item.hide);
  }

  getCurrentAdditionalItems(perPage: number) {
    const startIndex = (this.currentPage - 1) * perPage;
    const endIndex = Math.min(
      startIndex + perPage,
      this.getAdditionalItems().length
    );
    return this.getAdditionalItems().slice(startIndex, endIndex);
  }

  getLeftAdditionalItems(perPage: number) {
    const items = this.getCurrentAdditionalItems(perPage);
    return items.filter((item, index) => index % 2 == 0);
  }

  getRightAdditionalItems(perPage: number) {
    const items = this.getCurrentAdditionalItems(perPage);
    return items.filter((item, index) => index % 2 == 1);
  }

  getTotalPage(perPage: number) {
    return Math.ceil(this.getAdditionalItems().length / perPage) || 1;
  }

  getPageRanges() {
    return [...Array(this.getTotalPage(10)).keys()].map((i) => ++i);
  }

  toggleSelectAll(event: any) {
    event.preventDefault();
    const allSelected = this.selectedWarehouseAllProductSelected;
    this.selectedWarehouse?.productGroups.forEach((products) => {
      products.forEach((item) => {
        if (this.isMainProduct(item)) {
          item.selected = !allSelected;
        } else {
          item.selected = false;
        }

        if (item.hasError) {
          item.selected = false;
        }
      });
    });
  }

  addToCart(product: any) {
    if (!this.selectedWarehouse) return;

    if (product.qty == 0) {
      return;
    }

    this.toggleModalOptionMap(false);
    this.selectAdditionItem = product;

    const param = {
      shoppingListId: this.selectedWarehouse?.id!,
      attachedItems: {
        promoId: product.promo ? product.promo.id : null,
        uniqueId: uniqueId(),
        itemId: product.id,
        listLineId: product.promo ? product.promo.listLineId ?? '' : '',
        qty: product.qty,
      },
      comboItems: [],
      giftItems: [],
      accessoryItems: [],
      subinventoryCode: this.selectedWarehouse.subInventoryCode,
      additionalItems: [],
      //mainItem: []
    };

    this.productService
      .checkCart(param)
      .pipe(
        map((res: any) => {
          if (res.responseCode === ResponseCode.Success) {
            return {
              responseCode: res.responseCode,
              option: this.cartService.getCartCheckModalOption(res),
              result: res.result
            };
          } else {
            return {
              responseCode: res.responseCode,
              option: this.cartService.getCartCheckModalOption(res),
              result: res.result
            };
          }
        }),
        concatMap((res: any) => {
          if (res.responseCode === ResponseCode.Success) {
            return this.productService.addToCart(param); // 假設這是加入購物車的 API 調用
          } else {
            return of(res); // 不執行 addToCart，直接返回原來的 res
          }
        }),
        map((res: any) => {
          if (res.responseCode === ResponseCode.Success) {
            return {
              responseCode: res.responseCode,
              option: this.cartService.getCartCheckModalOption(res),
              result: res.result
            };
          } else {
            if (res.option?.modelName) {
              return res;
            } else {
              return {
                responseCode: res.responseCode,
                option: this.cartService.getCartCheckModalOption(res),
                result: res.result
              };
            }
          }
        }),
      )
      .subscribe((res: any) => {
        if (res.responseCode != ResponseCode.Success) {
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
        }
        this.postCheckCart(res)
      });
  }

  addToCartMain(
    additionalItemId: number,
    productQty: number,
    mainProduct: any
  ) {
    const shoppingListId = this.selectedWarehouse?.id!;
    const shoppingListItems = [
      {
        purchaseItemId: mainProduct.purchaseItemId,
        quantity: productQty,
      },
    ];
    // updateCart 會回傳每個 shoppingListItemId 的新單價
    // 反映到目前的購物車上
    this.isLoading = true;
    this.shoppingCartService
      .updateCart(shoppingListId, shoppingListItems)
      .subscribe((res: any) => {
        let json = res.result.newSinglePrices;
        this.selectWarehouse(this.currentSelectWarehouse, this.currentSelectWarehouseId, res.result.detail);
        this.isLoading = false;
        // 沒有回傳新單價資訊，不做任何事
        if (!json)
          return;

        let newSinglePrices = new Map(Object.entries(json));

        if (!newSinglePrices)
          return;

        let newSinglePrice = newSinglePrices.get(mainProduct.purchaseItemId);

        // 沒找到對應的單價資訊，不做任何事
        if (!newSinglePrice)
          return;

        mainProduct.promoPrice = newSinglePrice ?? mainProduct.promoPrice;
      });
  }


  follow(product: any) {
    if (product.follow) {
      this.memberService.deleteWishList(product.id).subscribe((resp: any) => {
        if (resp.responseCode === ResponseCode.Success) {
          const currentCount = localStorage.getItem('tracingItems');
          const newCount = currentCount ? parseInt(currentCount, 10) - 1 : 1;
          this.sharedService.updateTracingItems(newCount);
          this.followDialog('商品已移除追蹤');
        } else {
          this.notifierService.showInfoNotification(resp.responseMessage);
        }
      })
    } else {
      this.memberService.addWishList(product.id).subscribe((resp: any) => {
        if (resp.responseCode === ResponseCode.Success) {
          const currentCount = localStorage.getItem('tracingItems');
          const newCount = currentCount ? parseInt(currentCount, 10) + 1 : 1;
          this.sharedService.updateTracingItems(newCount);
          this.followDialog('商品已加入追蹤');
        } else {
          this.notifierService.showInfoNotification(resp.responseMessage);
        }
      })
    };
    product.follow = !product.follow;
    this.dialogservice.closeAll();
  }
  followDialog(text: string) {
    const modelOption = {
      modelName: 'simple-dialog',
      config: {
        data: {
          StyleMargin: '0px',
          text: text,
          textAlign: 'center',
        },
        width: '368px',
        height: '119px',
        hasBackdrop: false,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: 'dark',
      },
    };

    this.dialogservice.openLazyDialog(
      modelOption.modelName,
      modelOption.config
    );
  }
  private isWarehouseCompletelyEmpty(): boolean {
    return (
      !this.selectedWarehouse ||
      this.selectedWarehouse.productGroups.every(group => group.length === 0)
    );
  }

  deletePurchaseItem(
    purchaseItemId: number,
    toast: boolean = true,
    productId: number
  ) {
    const foundAdditionalItem = this.additionalItems.find(
      (item) => item.hide && item.id == productId
    );

    if (foundAdditionalItem) {
      foundAdditionalItem.hide = false;
    }

    if (purchaseItemId) {
      // const isDeletingLastOne = (this.selectedWarehouse?.productGroups.length ?? 0) <= 1;

      this.isLoading = true;
      this.shoppingCartService
        .removeFromCart(this.selectedWarehouse?.id!, [purchaseItemId])
        .subscribe((resp) => {
          // this.selectWarehouse(this.currentSelectWarehouse, this.currentSelectWarehouseId);
          // if (isDeletingLastOne) {
          //   this.removeEmptyWarehouse();
          // }
          this.updateDetail(this.currentSelectWarehouse, resp);

          if (this.isWarehouseCompletelyEmpty()) {
            this.removeEmptyWarehouse();
          }
          this.isLoading = false;

          const modelOption = {
            modelName: 'simple-dialog',
            config: {
              data: {
                StyleMargin: '0px',
                text: '商品已成功刪除',
                textAlign: 'center',
              },
              width: '368px',
              height: '119px',
              hasBackdrop: false,
              autoFocus: false,
              enterAnimationDuration: '300ms',
              exitAnimationDuration: '300ms',
              panelClass: 'dark',
            },
          };
          if (toast) {
            this.dialogservice.openLazyDialog(
              modelOption.modelName,
              modelOption.config
            );
          }
        });
    }
  }

  private removeEmptyWarehouse() {

    const indexOfEmptyWarehouse = this.warehouses.indexOf(
      this.selectedWarehouse!
    );

    this.warehouses.splice(indexOfEmptyWarehouse, 1);

    const nextWarehouse = this.warehouses[0];

    if (!nextWarehouse)
      return;

    nextWarehouse.selected = true;
    this.selectWarehouse(nextWarehouse, 0);
  }

  findIndexByPurchaseItemId(purchaseItemId: number): number {
    const productGroups = this.selectedWarehouse?.productGroups;
    if (!productGroups) return -1;

    for (let i = 0; i < productGroups.length; i++) {
      const group = productGroups[i];
      const itemIndex = group.findIndex(
        (item: any) => item.purchaseItemId === purchaseItemId
      );
      if (itemIndex !== -1) {
        return i;
      }
    }
    return -1;
  }

  deleteProduct(id: number) {
    if (!this.selectedWarehouse) return;
    let product: any = null;
    for (
      let index = 0;
      index < this.selectedWarehouse.productGroups.length;
      index++
    ) {
      const products = this.selectedWarehouse.productGroups[index];
      product = products.find((product) => product.id == id);
      if (product) break;
    }

    if (!product) {
      return;
    }

    const cloneProductGroups = this.selectedWarehouse.productGroups.slice(0);
    if (product.promotionMethod == PromoMethod.AdditionalItem) {
      for (
        let index = 0;
        index < this.selectedWarehouse.productGroups.length;
        index++
      ) {
        const cloneProducts =
          this.selectedWarehouse.productGroups[index].slice(0);
        const foundIdx = cloneProducts.findIndex(
          (item) => item.id == product.id
        );
        if (foundIdx > -1) {
          cloneProducts.splice(foundIdx, 1);
          this.selectedWarehouse.productGroups[index] = cloneProducts;
          break;
        }
      }
    } else {
      this.selectedWarehouse.productGroups = cloneProductGroups.map(
        (products) => {
          return products.filter(
            (item) => item.mainProductId != product.id && item.id != product.id
          );
        }
      );
    }

    this.selectedWarehouse.productGroups =
      this.selectedWarehouse.productGroups.filter(
        (products) => products.length > 0
      );

    const isSelectedWarehouseEmpty =
      this.selectedWarehouse.productGroups.reduce(
        (productTotalCount, products) => productTotalCount + products.length,
        0
      ) == 0;
    if (isSelectedWarehouseEmpty) {
      const index = this.warehouses.indexOf(this.selectedWarehouse);
      this.warehouses.splice(index, 1);
      if (this.warehouses.length > 0) {
        this.selectWarehouse(this.warehouses[0], 0);
      }
    }

    this.shoppingCartService
      .removeSingleFromCart(this.selectedWarehouse.id, product.purchaseItemId)
      .subscribe();
  }

  deleteProductDialog(product: any) {
    const self = this;
    this.dialogservice.closeAll();
    const modelOption = {
      modelName: 'simple-dialog',
      config: {
        data: {
          title: '刪除商品',
          StyleMargin: '0px',
          text: '請確認是否要刪除此商品，刪除後商品將不會留存。',
          displayFooter: true,
          confirmButton: '刪除',
          cancelButton: '取消',
          color: 'warn',
          confirm: () => {
            this.deletePurchaseItem(
              product.purchaseItemId,
              false,
              product.itemId
            );
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

    this.dialogservice.openLazyDialog(
      modelOption.modelName,
      modelOption.config
    );
  }

  deleteAllProductsDialog() {
    const self = this;
    this.dialogservice.closeAll();

    const modelOption = {
      modelName: 'simple-dialog',
      config: {
        data: {
          title: '全部刪除',
          StyleMargin: '0px',
          text: '請確認是否要刪除全部商品，刪除後商品將不會留存。',
          displayFooter: true,
          confirmButton: '刪除',
          cancelButton: '取消',
          color: 'warn',
          confirm: () => {
            this.shoppingCartService
              .deleteAllShoppingList(this.thisSelectWarehouseId)
              .subscribe((res: any) => {
                if (res.responseCode === ResponseCode.Success) {
                  this.notifierService.showInfoNotification('全部商品已刪除');
                }
              });

            if (!self.selectedWarehouse) return;

            const idsToRemove: number[] = [];
            self.selectedWarehouse.productGroups.forEach((e: any) => {
              e.forEach((product: any) => {
                idsToRemove.push(product.purchaseItemId);
              });
            });

            idsToRemove.forEach((purchaseItemId: any) => {
              const indexToRemove =
                this.findIndexByPurchaseItemId(purchaseItemId);
              if (indexToRemove !== -1) {
                this.selectedWarehouse?.productGroups.splice(indexToRemove, 1);
              }
            });
            if (this.selectedWarehouse?.productGroups.length === 0) {
              this.removeEmptyWarehouse();
            }

            this.shoppingCartService
              .removeFromCart(this.selectedWarehouse?.id!, idsToRemove)
              .subscribe((resp) => {
                const modelOption = {
                  modelName: 'simple-dialog',
                  config: {
                    data: {
                      StyleMargin: '0px',
                      text: '商品已成功刪除',
                      textAlign: 'center',
                    },
                    width: '368px',
                    height: '119px',
                    hasBackdrop: false,
                    autoFocus: false,
                    enterAnimationDuration: '300ms',
                    exitAnimationDuration: '300ms',
                    panelClass: 'dark',
                  },
                };
                /*
                this.dialogservice.openLazyDialog(
                  modelOption.modelName,
                  modelOption.config
                );*/
              });
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

    this.dialogservice.openLazyDialog(
      modelOption.modelName,
      modelOption.config
    );
  }

  checkout() {
    this.submit();
    //this.router.navigate(['/CheckoutProcess']);
  }

  getSelectedProductIds(): number[] {
    return this.checkoutUtilService.flatSelectedPurchaseItemIds(
      this.selectedWarehouse?.productGroups
    );
  }

  submit(): void {
    if (
      // this.group.valid &&
      // this.currentSubInventory &&
      // this.currentPromotion !== undefined
      true
    ) {
      const selectedProductIds = this.getSelectedProductIds();

      const param: ValidateCheckout = {
        purchaseId: this.selectedWarehouse?.id!,
        purchaseItemIds: selectedProductIds,
      };
      this.storageService.set(StorageEnum.checkoutList, {
        ...param,
        awardGiftListIds: this.awardsChecked,
      });

      const itemsToUpdate: any[] = [];
      this.productHandler(
        (item: any) => item.selected,
        (item: any) => {
          itemsToUpdate.push({
            purchaseItemId: item.purchaseItemId,
            quantity: item.qty,
          });
        }
      );
      this.isLoading = true;

      this.shoppingCartService
        .updateCart(this.selectedWarehouse?.id!, itemsToUpdate)
        .subscribe(() => {
          this.checkoutService
            .validateCheckout(param)
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
                    data: this.cartService.getCartCheckModalOption(res),
                  });
                } else {
                  return from(
                    this.dialogservice.openLazyDialog(
                      this.cartService.getCartCheckModalOption(res).modelName,
                      this.cartService.getCartCheckModalOption(res).config
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
            .subscribe((res: any) => this.postValidateCheck(res));
        });
    }
  }

  /** 結帳檢查後作業 */
  postValidateCheck(data: {
    action: DialogAction;
    item: AddToCartReplaceItem;
    responseCode: string;
  }): void {
    switch (data.responseCode) {
      case '0000':
        this.router.navigate(['/CheckoutProcess'], {
          queryParams: { purchaseId: this.selectedWarehouse?.id! },
        })
          .then(() => location.reload());
        break;
      case '10091':
        // this.tooltip.show(0);
        // this.incrementInput.setInputFocus();
        break;
      case '10090':
        // this.currentSubInventory = undefined;
        // this.countOption._value = 0;
        break;
      case '10081':
        // this.tooltip.show(0);
        // this.incrementInput.setInputFocus();
        break;
      case '1008':
        // this.currentPromotion = undefined;
        // this.currentSubInventory = undefined;
        // this.countOption._value = 0;
        break;
      case '1007':
        this.viewportScroller.scrollToAnchor('subinventory');
        break;
      case '1006':
        this.viewportScroller.scrollToAnchor('promoInfo');
        break;
      case '20081':
        if (data.item.purchaseItemId) {
          this.handleErrorProduct(
            data.item.purchaseItemId,
            (hasErrorProduct: any) => {
              hasErrorProduct.qtyError = `不符合加購限制，請調整或刪除商品`;
            }
          );
        }
        break;
      case '1005':
      case '2006':
      case '2007':
      case '2009':
        if (data.item.purchaseItemId) {
          this.deletePurchaseItem(
            data.item.purchaseItemId,
            false,
            data.item.itemId
          );
        }
        break;
      case '1004':
        // TODO Anchor到加購專區，不符合加購限制或庫存不足的商品Error狀態
        // 庫存不足的加價購商品跳Error狀態
        break;
      case '1003':
        if (data.action === DialogAction.Save) {
          // TODO 加入購物車
        }
        if (data.action === DialogAction.Cancel) {
          // TODO 自動取消選購缺貨的加價購商品
          // 但缺貨的加價購商品依然會呈現在下方，並呈現「補貨中」
        }
        break;
      case '2002':
        if (data.item.purchaseItemId) {
          this.handleErrorProduct(
            data.item.purchaseItemId,
            (hasErrorProduct: any) => {
              hasErrorProduct.qtyError = `副商品庫存：${hasErrorProduct.availableQuantities}，請調整主商品數量`;
            }
          );
          if (data.action === DialogAction.Cancel) {
            this.handleErrorProduct(
              data.item.purchaseItemId,
              (hasErrorProduct: any) => {
                this.productService
                  .contactMe({
                    itemNumber: hasErrorProduct.id,
                    itemName: hasErrorProduct.name,
                  })
                  .subscribe((res) => {
                    if (res.responseCode === ResponseCode.Success) {
                      this.notifierService.showInfoNotification(res.result);
                    }
                  });
              }
            );
          }
        }
        break;
      case '10011':
        if (data.action === DialogAction.Save) {
          // const item = this.accessories.find(
          //   (acc) => acc.uniqueId === data.item.uniqueId
          // );
          // if (item) {
          //   item.soldOutPlan = 1;
          // }
          this.submit();
        }
        break;
      case '10012':
        if (data.action === DialogAction.Save) {
          // const item = this.accessories.find(
          //   (acc) => acc.uniqueId === data.item.uniqueId
          // );
          // if (item) {
          //   item.itemId = data.item.replaceItemId;
          // }
          this.submit();
        }
        break;
      case '10020':
        if (data.action === DialogAction.Save) {
          // this.giftItems = this.giftItems.filter(
          //   (gift) => gift.uniqueId !== data.item.uniqueId
          // );
          this.submit();
        }
        break;
      case '10021':
        if (data.action === DialogAction.Save) {
          // const item = this.giftItems.find(
          //   (gift) => gift.uniqueId === data.item.uniqueId
          // );
          // if (item) {
          //   item.soldOutPlan = 1;
          // }
          this.submit();
        }
        break;
      case '10022':
        if (data.action === DialogAction.Save) {
          // const item = this.giftItems.find(
          //   (gift) => gift.uniqueId === data.item.uniqueId
          // );
          // if (item) {
          //   item.itemId = data.item.replaceItemId;
          // }
          this.submit();
        }
        if (data.action === DialogAction.Cancel) {
          // const item = this.giftItems.find(
          //   (gift) => gift.uniqueId === data.item.uniqueId
          // );
          // if (item) {
          //   item.soldOutPlan = 3;
          // }
          this.submit();
        }
        break;
      case '20011':
        if (data.action === DialogAction.Save) {
          this.router.navigate(['/CheckoutProcess'], {
            queryParams: { purchaseId: this.selectedWarehouse?.id! },
          });
        }
        break;
      case '20012':
        if (data.action === DialogAction.Save) {
          this.shoppingCartService.replaceItem(this.getSelectedProductIds(), data.item)
            .pipe(take(1),
              tap(_ => { this.isLoading = true; }),
              catchError(err => { this.isLoading = false; throw err }),
              map(res => {
                this.isLoading = false;
                if (res.responseCode === ResponseCode.Success) {
                  this.submit();
                }
              })
            )
            .subscribe();
        }
        break;
      case '20022':
        if (data.action === DialogAction.Save) {
          this.shoppingCartService.replaceItem(this.getSelectedProductIds(), data.item)
            .pipe(take(1),
              tap(_ => { this.isLoading = true; }),
              catchError(err => { this.isLoading = false; throw err }),
              map(res => {
                this.isLoading = false;
                if (res.responseCode === ResponseCode.Success) {
                  this.submit();
                }
              })
            )
            .subscribe();
        }
        break;
      case '20080':
        if (data.item.purchaseItemId) {
          if (data.action === DialogAction.Delete) {
            this.deletePurchaseItem(
              data.item.purchaseItemId,
              false,
              data.item.itemId
            );

            const modelOption = {
              modelName: 'simple-dialog',
              config: {
                data: {
                  StyleMargin: '0px',
                  text: '商品已成功刪除',
                  textAlign: 'center',
                },
                width: '368px',
                height: '119px',
                hasBackdrop: false,
                autoFocus: false,
                enterAnimationDuration: '300ms',
                exitAnimationDuration: '300ms',
                panelClass: 'dark',
              },
            };

            this.dialogservice.openLazyDialog(
              modelOption.modelName,
              modelOption.config
            );
          } else if (data.action === DialogAction.Notify) {
            this.handleErrorProduct(
              data.item.purchaseItemId,
              (hasErrorProduct: any) => {
                const modelOption = {
                  modelName: 'arrival-notice',
                  config: {
                    data: {
                      title: '貨到通知',
                      StyleMargin: '0px',
                      text: '目前庫存已完售 (暫無確切交期)，若有需求請洽業務排單，待貨到後再行通知。謝謝！',
                      isIcon: false,
                      itemId: hasErrorProduct.id,
                      itemName: hasErrorProduct.name,
                      itemSeg: hasErrorProduct.desc,
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
            );
          }
        }
        break;
      default:
        break;
    }
  }

  async replaceProduct(hasErrorProductId: number) {
    if (!this.selectedWarehouse) {
      return;
    }
    const self = this;
    let hasErrorProduct: any = null;
    for (let i = 0; i < this.selectedWarehouse.productGroups.length; i++) {
      const products = this.selectedWarehouse.productGroups[i];
      hasErrorProduct = products.find(
        (product) => product.id == hasErrorProductId
      );
      if (hasErrorProduct) break;
    }

    if (!hasErrorProduct) {
      return;
    }

    // TODO replace
    const replaceProduct = {
      purchaseItemId: 0,
      id: 90,
      name: 'ASUS 90XB0450-BMU000 (藍)',
      desc: 'ASUS WT300 無線光電滑鼠',
      imgSrc:
        'https://service.unitech.com.tw/upload/product/pic/Product_Pic20210426084518M95GAF.jpg',
      price: 0,
      priceWithTax: 1550,
      qty: 1,
      mainItemQty: 1,
      promotionMethod: PromoMethod.Gift,
      mainProductId: 99,
      selected: false,
      follow: false,
      totalPrice: 0
    };

    const modelOption = {
      modelName: 'product-commodity-plan',
      config: {
        data: {
          title: '商品替換方案',
          StyleMargin: '0px',
          text: '商品無庫存，請確認是否要替代其他商品。',
          isIcon: false,
          replaceItem: {
            purchaseItemId: hasErrorProduct.purchaseItemId,
            mainItemId: hasErrorProduct.id,
            mainItemImg: hasErrorProduct.imgSrc,
            mainItemName: hasErrorProduct.name,
            mainQty: hasErrorProduct.qty,
            replaceItemId: replaceProduct.id,
            replaceItemImg: replaceProduct.imgSrc,
            replaceItemName: replaceProduct.name,
            replaceQty: replaceProduct.qty,
          },
        },
        width: '500px',
        height: '424px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: 'replacePlan',
      },
    };

    const dialogRef = await this.dialogservice.openLazyDialog(
      modelOption.modelName,
      modelOption.config
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (!self.selectedWarehouse) return;

      let foundProduct = null;

      if (result.action == DialogAction.Save) {
        for (
          let index = 0;
          index < self.selectedWarehouse.productGroups.length;
          index++
        ) {
          const products = self.selectedWarehouse.productGroups[index].slice(0);
          foundProduct = products.find(
            (product) => product.id == hasErrorProductId
          );
          if (foundProduct) {
            foundProduct.replaced = true;
            foundProduct.canReplace = false;
            foundProduct.priceError = '商品已贈完，已替代其他商品';
            products.push(replaceProduct);
            self.selectedWarehouse.productGroups[index] = products;
            break;
          }
        }
      } else {
        for (
          let index = 0;
          index < self.selectedWarehouse.productGroups.length;
          index++
        ) {
          const products = self.selectedWarehouse.productGroups[index];
          foundProduct = products.find(
            (product) => product.id == hasErrorProductId
          );
          if (foundProduct) {
            foundProduct.canReplace = true;
            foundProduct.priceError = '商品已贈完';
            break;
          }
        }
      }
    });
  }

  pageDataChange($event: any) {
    this.pageData = {
      ...this.pageData,
      ...$event,
      page: 1,
    };
    this.filterForm.next({
      ...this.filterFormData,
      ...this.pageData,
    });
  }
  async typing($event: any, product: any) {
    if($event != product.qty)
      {
        product.selected = false;
      }
  }
  async qtyChange($event: any, product: any, updateCart: boolean = true) {
    if($event == product.qty)
    {
      return;
    }
    if($event == 0 || $event == ""){
      product.qtyError = "請輸入數量";
      product.selected = false;
      product.hasError = true;
      product.qty = $event;
      return;
    }
    if(product.step != null && $event % (product.step ?? 1) != 0){
      if(product.tagName == "組合價"){
        this.notifierService.showInfoNotification(
          `${product.mainItemQty ?? 1}入一組，一次需購買: ${product.discConditionMultiple ?? 1}組(共${product.step}個)`
        );
      }else{
        this.notifierService.showInfoNotification('購買倍數為: ' + (product.step ?? 1));
      }
      product.selected = false;
      return;
    }
    else if(product.stepQuantities != null && $event % (product.stepQuantities ?? 1)){
      this.notifierService.showInfoNotification('購買倍數為: ' + (product.stepQuantities ?? 1));
      return;
    }

    const previousQty = product.qty;
    product.qty = $event;
    this.selectedWarehouse?.productGroups.forEach((pro) => {
      pro.forEach((pro) => {
        if (pro.mainProductId === product.id
          // 附屬加價購和贈品, 不自動隨主商品調整數量
          && !(pro.promotionMethod == PromoMethod.AdditionalItem
            && pro.subMethod == SubMethod.AttachedAdditional)
          && pro.promotionMethod != PromoMethod.Gift
        ){
          // pro.qty = $event;
          if(pro.tagName === '配件'){
            pro.qty = $event * ( pro.ratio ?? 1) ;
          }else if(pro.tagName === '組合價'){
            pro.qty = Math.floor($event / ( pro.mainItemQty ?? 1 )) * ( pro.ratio ?? 1) ;
          }
          else{
            pro.qty = $event;
          }
        }

      })
    })
    if (product.qty < product.minSafeQuantity && !product.minSafeQuantityCheck) {
      const modelOption = {
        modelName: 'simple-dialog',
        config: {
          data: {
            title: '購買量限制',
            StyleMargin: '0px',
            text: `${product.name}調整數量後將不符合促銷購買限制，請確定是否修改。`,
            displayFooter: true,
            confirmButton: '確定',
            cancelButton: '取消',
            color: 'warn',
          },
          width: '368px',
          height: '220px',
          hasBackdrop: false,
          autoFocus: false,
          enterAnimationDuration: '300ms',
          exitAnimationDuration: '300ms',
        },
      };

      const dialogRef = await this.dialogservice.openLazyDialog(
        modelOption.modelName,
        modelOption.config
      );

      dialogRef.afterClosed().subscribe((confirm) => {
        if (confirm) {
          product.minSafeQuantityCheck = true;
          this.qtyChange($event, product); //重新觸發API
          return
        }
        product.qty = previousQty;
      })
      return;
    }

    if (updateCart)
      this.addToCartMain(product.id, product.qty, product);
  }

  handleErrorProduct(purchaseItemId: number, errorHandler: any) {
    this.productGroupHandler((products: any[]) => {
      return products.find(
        (product: any) => product.purchaseItemId == purchaseItemId
      );
    }, errorHandler);
  }

  productGroupHandler(predict: any, foundHandler: any) {
    if (!this.selectedWarehouse) return;
    let foundProduct;
    for (
      let index = 0;
      index < this.selectedWarehouse?.productGroups.length;
      index++
    ) {
      const products = this.selectedWarehouse.productGroups[index];
      foundProduct = products.find(() => {
        return predict(products);
      });
      if (foundProduct) {
        foundHandler(foundProduct);
        break;
      }
    }
  }

  productHandler(predict: any, foundHandler: any) {
    if (!this.selectedWarehouse) return;
    let foundProduct;
    for (
      let index = 0;
      index < this.selectedWarehouse?.productGroups.length;
      index++
    ) {
      const products = this.selectedWarehouse.productGroups[index];
      products.filter(predict).forEach((product: any) => {
        foundHandler(product);
      });
    }
  }

  /** 購物車檢查後作業 */
  postCheckCart(data: {
    action: DialogAction;
    item: AddToCartReplaceItem;
    responseCode: string;
    result: any;
  }): void {
    switch (data.responseCode) {
      case '0000':
        // this.selectAdditionItem.hide = true;

        // let foundProduct: any = null;
        // this.productHandler(
        //   (item: any) => item.id === this.selectAdditionItem.id,
        //   (item: any) => {
        //     foundProduct = item;
        //   }
        // );

        // if (foundProduct) {
        //   foundProduct.qty += this.selectAdditionItem.qty;
        // } else {
        //   this.selectedWarehouse?.productGroups.push([
        //     {
        //       ...this.selectAdditionItem,
        //       qty: this.selectAdditionItem.qty,
        //       maxQuantities: 99,
        //       availableQuantities: 99,
        //       promotionMethod: PromoMethod.Discount,
        //       selected: true,
        //       follow: false,
        //       purchaseItemId: data.result.purchaseItemId,
        //       mainProductId: false,
        //       canEditQuantity: true,
        //     },
        //   ]);
        // }

        this.selectWarehouse(this.currentSelectWarehouse, this.currentSelectWarehouseId);
        this.dialogservice.closeAll();
        this.notifierService.showInfoNotification('商品已成功加購');

        break;
      case '10091':
        break;
      case '10090':
        break;
      case '10081':
        break;
      case '1008':
        break;
      case '1007':
        break;
      case '1006':
        break;
      case '1005':
        break;
      case '1004':
        break;
      case '1003':
        break;
      case '1002':
        break;
      case '10011':
        break;
      case '10012':
        break;
      case '10020':
        break;
      case '10021':
        break;
      case '10022':
        break;
      default:
        break;
    }
  }

  selectFunction(event: { checked: boolean; giftListId: number }) {
    if (event.checked) this.awardsChecked.push(event.giftListId);
    else {
      const index = this.awardsChecked.findIndex(
        (item) => item === event.giftListId
      );
      this.awardsChecked.splice(index, 1);
    }
  }

  selectAllFunction(checked: boolean) {
    if (checked)
      this.awardsChecked = this.awards.map((item: any) => item.giftListId);
    else this.awardsChecked = [];
  }

  promoTagLabelIndexModify(element: any): number {
    if (element == null || element == undefined) {
      return 1;
    }
    return element;
  }
}
