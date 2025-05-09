/** --------------------------------------------------------------------------------
 *-- Description：選擇商品內容
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { concatMap, from, map, mergeMap, of, switchMap } from 'rxjs';
import { PromoMethod, ResponseCode, SubMethod } from 'src/app/enums';
import {
  AddToCartGift,
  Product,
  ProductDetail,
  PromoInfo,
  SubInventory,
  SubPromoInfo,
} from 'src/app/models';
import { CartService, ProductService } from 'src/app/services';
import { Options } from 'src/app/shared/models';
import { DialogService } from 'src/app/shared/services';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { DialogAction } from 'src/app/enums';
import { promoTagLabel } from 'src/app/constants/product.constants';
import { uniqueId } from 'src/app/shared/utils/uniqueId';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-product',
  templateUrl: './select-product.component.html',
  styleUrls: ['./select-product.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
  providers: [CartService],
})
export class SelectProductComponent implements OnInit {
  number = Number;
  countOption = {
    type: 'incrementInput',
    _label: '',
    label: '',
    inputType: 'number',
    name: 'orderCount',
    class: '',
    _value: 1,
    _step: 1,
    _min: 1,
    _max: this.currentSubInventory ? this.currentSubInventory.qty : 1,
    _wrap: false,
    color: 'primary',
  };
  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 50,
    navigation: false,
    pagination: true,
    scrollbar: { draggable: true },
    virtual: true,
  };
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  group!: FormGroup;
  detail!: ProductDetail;
  promoInfoOption!: Options[];
  subInventoryOption!: Options[];
  promoTagLabel = promoTagLabel;
  currentPromotion?: PromoInfo | null;
  currentSubInventory?: SubInventory;
  protected readonly PromoMethod = PromoMethod;
  protected readonly SubMethod = SubMethod;
  promotionOptionValue!: PromoInfo | '經銷價';
  giftItems!: AddToCartGift[];
  comboItems!: AddToCartGift[];
  additionalItems!: AddToCartGift[];
  attachedItems!: AddToCartGift[];
  subInventory: string = '';
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
  }[] = [];
  maxBuyMessage: string = '';
  currentQty = 0;
  isShowMobileAddition = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      itemId: number;
    },
    public dialogRef: MatDialogRef<SelectProductComponent>,
    private fb: FormBuilder,
    public layoutService: LayoutService,
    private productService: ProductService,
    private cartService: CartService,
    private dialogservice: DialogService,
    private router: Router
  ) { }
  resetinput() {
    this.subInventory = '';
    this.currentPromotion = undefined;
  }
  /** confirm click */
  onSubmit(): void {
    this.group.markAllAsTouched();
    if (this.group.valid) {
      const promoInfo = this.group.get('promoId')?.value
        ? this.detail?.promoInfos.find(
          (info) => info.id === this.group.get('promoId')?.value
        )
        : null;
      const param = {
        mainItem: {
          promoId: this.group.get('promoId')?.value,
          uniqueId: uniqueId(),
          itemId: this.detail?.itemId!,
          listLineId: promoInfo?.listLineId ?? '',
          qty: this.countOption._value,
        },
        subinventoryCode: this.group.get('subinventoryCode')?.value,
      };
      this.productService
        .checkCart(param)
        .pipe(
          map((res) => {
            if (res.responseCode === ResponseCode.Success) {
              // TODO 加入購物車
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
          mergeMap((res) =>
            from(
              this.dialogservice.openLazyDialog(
                res.option.modelName,
                res.option.config
              )
            ).pipe(
              switchMap((ref) => ref.afterClosed()),
              map((data) => {
                return { ...data, responseCode: res.responseCode };
              })
            )
          )
        )
        .subscribe((res) => {
          this.postCheckCart(res);
          this.resetinput();
        });
    }
  }

  ngOnInit(): void {
    document.body.classList.add('select-product-body');
    this.productService.getProductDetail(this.data.itemId).subscribe((res) => {
      if (res.responseCode === ResponseCode.Failed) {
        this.dialogRef.close();
      }
      if (res.responseCode === ResponseCode.Success) {
        this.detail = res.result;
        this.setSubInventory(res.result);
        if (this.detail.promoInfos) {
          this.promoInfoOption = this.detail.promoInfos
            .filter((item) => item.id !== 0)
            .map((info) => {
              return { value: info.id, label: info.name };
            });
          this.promoInfoOption.unshift({ value: 0, label: '經銷價' });
        } else {
          this.promoInfoOption = [{ value: 0, label: '經銷價' }];
        }
        this.detail.subInventory &&
          (this.subInventoryOption = this.detail.subInventory.map(
            (inventory) => {
              return {
                value: inventory.subinventoryCode,
                label: inventory.subinventoryName,
              };
            }
          ));
      }
    });
    this.group = this.fb.group({
      promoId: ['', Validators.required],
      subinventoryCode: ['', Validators.required],
      orderCount: [0],
    });
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

  selectPromotion(info: PromoInfo | null) {
    this.currentPromotion = info;
    this.group.patchValue({
      promoId: info?.id,
    });
    this.setInputCount(info);
    this.promotionOptionValue = !info ? '經銷價' : info;

    if (this.currentPromotion?.subMethod !== SubMethod.ChosenAdditional) {
      this.giftItems = [];
      this.additionalItems = [];
      this.comboItems = [];
    }
    if (this.currentPromotion?.promoMethod) {
      this.processPromotionItems(this.currentPromotion);
    }

    if (this.currentPromotion?.subPromoInfo) {
      this.currentPromotion.subPromoInfo.forEach((subInfo) => {
        this.processPromotionItems(subInfo as PromoInfo);
      });
    }

    this.group.setControl(
      'normalAdditionalItems',
      this.fb.array(this.createNormalAdditionalItems())
    );
    this.normalAdditionalItems = this.getNormalAdditionalItems();
    this.initBuyQtyControls();
    this.maxBuyMessage = this.getMaxBuyMessage();
    this.group.get('promoId')?.setValue(0);
  }

  setInputCount(info: PromoInfo | null, isSoldOut?: boolean) {
    const isZero = isSoldOut || info === undefined;
    const discConditionMultiple = info?.discConditionMultiple || 1;
    this.countOption._value = isZero ? 0 : info ? discConditionMultiple : 1;
    this.countOption._step = info ? discConditionMultiple : 1;
    this.countOption._min = info ? discConditionMultiple : 1;
    this.currentQty = isZero ? 0 : info !== null ? discConditionMultiple : 1;
  }

  processPromotionItems(info: PromoInfo | null) {
    if (!info) {
      return;
    }

    if (info.promoMethod === PromoMethod.Gift) {
      this.giftItems = this.makeGroupingItems(info);
    }
    if (info.promoMethod === PromoMethod.AdditionalItem) {
      if (info.subMethod === SubMethod.ChosenAdditional) {
        this.attachedItems = this.makeGroupingItems(info);
      }
    }
    if (info.promoMethod === PromoMethod.Combo) {
      this.comboItems = this.makeGroupingItems(info);
    }
  }

  createNormalAdditionalItems() {
    const promo = this.currentPromotion as SubPromoInfo;

    if (!promo) {
      return [];
    }

    const isAttachedAdditional =
      promo.promoMethod === PromoMethod.AdditionalItem &&
      promo.subMethod === SubMethod.AttachedAdditional;

    const promos =
      this.detail.bindingProductAttachedPromoInfos.length === 0
        ? []
        : this.detail.bindingProductAttachedPromoInfos;

    let results: any[] = [];
    promos.forEach((promo: PromoInfo) => {
      let items = promo.products as Product[];
      results = [
        ...results,
        ...items.map((e, index) => {
          const subInventoryBuyCount = this.calculateSubInventoryBuyCount(e);
          return this.createFormGroupFromProduct(
            e,
            e.itemId,
            subInventoryBuyCount,
            promo,
            promo.id
          );
        }),
      ];
    });
    return results;
  }

  createFormGroupFromProduct(
    product: Product,
    index: number,
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
      prodImg: product.prodImg ?? product.prodImg[0],
      promoId: promoId,
    });
  }

  createCountOption(index: number) {
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
      _max: this.currentSubInventory ? this.currentSubInventory.qty : 1,
      _wrap: false,
      color: 'primary',
    };
  }

  /** 一般位置 附屬加價購 綁定商品 */
  getNormalAdditionalItems() {
    const promo = this.currentPromotion as SubPromoInfo;
    if (!promo) return [];

    if (this.detail.bindingProductAttachedPromoInfos) {
      let items: any = [];
      this.detail.bindingProductAttachedPromoInfos.forEach((promo: any) => {
        if (promo?.products) {
          let products: Product[] = promo?.products;
          items = [
            ...items,
            ...products.map((e, index) => {
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
                priceWithTax: e.priceWithTax,
                discount: e.promoPrice,
                priceHint: '未稅',
                checked: false,
                buyQty: 0,
                countOption: this.createCountOption(index),
                subInventoryBuyCount: subInventoryBuyCount,
                prodImg: e.prodImg?.[0] ?? '',
              };
            }),
          ];
        }
      });
      return items;
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
          priceWithTax: e.priceWithTax,
          discount: e.promoPrice,
          priceHint: '未稅',
          checked: false,
          buyQty: 0,
          countOption: this.createCountOption(index),
          subInventoryBuyCount: subInventoryBuyCount,
          prodImg: e.prodImg?.[0] ?? '',
        };
      });
    }
  }

  initBuyQtyControls() {
    if (this.normalAdditionalItems !== undefined) {
      this.normalAdditionalItems.forEach((e: any, index) => {
        this.group.addControl(`buyQty_${e.itemId}`, new FormControl(0));
      });
    }
  }

  getMaxBuyMessage() {
    const promo = this.currentPromotion;
    const limit = this.currentQty * (promo?.mainAndAdditionalRatio ?? 1);
    if (promo?.canBuyMultipleTypesOfAdditionalItems) {
      return this.currentPromotion ? `可加購${limit}個，可複選商品` : '';
    } else {
      return this.currentPromotion ? `可加購${limit}個，限單選商品` : '';
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
        } as AddToCartGift;
      })
    );

    return items;
  }

  calculateSubInventoryBuyCount(product: Product): number {
    return (
      product.subInventoryBuyCount
        ?.filter((e) => e.key === this.currentSubInventory?.subinventoryCode)
        .reduce((accumulator, object) => accumulator + object.value, 0) ?? 0
    );
  }

  get additionalItemLink() {
    return window.location.href.split('#')[0] + '#additional-item-container';
  }

  getProducts(promoInfo: PromoInfo): any[] {
    const subPromoInfo = promoInfo as SubPromoInfo;
    return subPromoInfo === null || subPromoInfo.products === null
      ? []
      : subPromoInfo.products.map((e) => {
        return {
          itemName: e.itemName,
          description: e.description,
          unitPrice: e.unitPrice,
          priceWithTax: e.priceWithTax,
        };
      });
  }

  selectSubInventory(subinventoryCode: string) {
    const subInventory = this.detail.subInventory?.find(
      (item) => item.subinventoryCode === subinventoryCode
    )!;

    this.group.patchValue({
      subinventoryCode: subInventory.subinventoryCode,
    });
    this.subInventory = subinventoryCode;
    this.currentSubInventory = subInventory;
    this.countOption._max = subInventory.qty;
    this.setInputCount(this.currentPromotion!, subInventory.qty === 0);
    this.normalAdditionalItems = this.getNormalAdditionalItems();
  }

  changeQty(qty: number) {
    this.currentQty = qty;
    this.maxBuyMessage = this.getMaxBuyMessage();
  }

  getAdditionalItemsTotalPrice() {
    return (
      this.normalAdditionalItems2?.value
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

  get normalAdditionalItems2() {
    return this.group.controls['normalAdditionalItems'] as FormArray;
  }

  get promoId() {
    return this.group.get('promoId');
  }

  /** 購物車檢查後作業 */
  postCheckCart(data: { action: DialogAction; responseCode: string }): void {
    switch (data.responseCode) {
      case '0000':
        if (data.action === DialogAction.Save) {
          this.router.navigate(['/ShoppingCart']);
          this.dialogRef.close();
        } else {
          this.group.markAsUntouched();
          this.group.patchValue({
            promoId: '',
            subinventoryCode: '',
          });
          this.countOption._value = 0;
        }
        break;
      default:
        break;
    }
  }

  /** slide next */
  slideNext() {
    this.swiper?.swiperRef.slideNext(100);
  }

  /** slide previous */
  slidePrev() {
    this.swiper?.swiperRef.slidePrev(100);
  }

  /** 總計 */
  getTotal(): number {
    const promoInfo = this.detail?.promoInfos
      ? this.detail?.promoInfos.find(
        (info) => info.id === this.group.get('promoId')?.value
      )
      : null;
    const price = promoInfo ? promoInfo.price : this.detail?.unitPrice;
    return price ? price * this.countOption._value : 0;
  }

  ngOnDestroy(): void {
    document.body.classList.remove('select-product-body');
  }

  promoTagLabelIndexModify(element: any): number {
    if (element == null || element == undefined) {
      return 1;
    }
    return element;
  }
}
