import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, catchError, map, of, switchMap, tap } from 'rxjs';
import { CustomPromoProduct, CustomPromoThreshold } from 'src/app/models';
import { ProductService } from 'src/app/services';
import { IncrementInputComponent } from 'src/app/shared/components/inputs/increment-input/increment-input.component';
import { DialogService } from 'src/app/shared/services';
import { FilterService } from 'src/app/shared/services/filter.service';
import { uniqueId } from '../../shared/utils/uniqueId';
import Swiper from 'swiper';
import { PromoCategory, PromoCategoryName, PromoMethodName, ResponseCode, SubMethod, SubMethodName } from 'src/app/enums';
import { Title } from '@angular/platform-browser';
import { AnalyticsService } from 'src/app/services/analytics.service';

interface ICustomPromoProduct extends CustomPromoProduct {
  countOption: {
    type: string;
    _label: string;
    label: string;
    inputType: string;
    name: string;
    class: string;
    _value: number;
    _step: number;
    _min: number;
    _max: number;
    _wrap: boolean;
    color: string;
  };
  showSelectButton: boolean;
}
@Component({
  selector: 'app-optional-purchase',
  templateUrl: './optional-purchase.component.html',
  styleUrls: ['./optional-purchase.component.scss'],
})
export class OptionalPurchaseComponent implements OnInit, AfterViewInit {
  thisSubInventoryCode="";
  subMethod: number = 0;
  promoId: string | null = null;
  filterSub = new Subscription();
  // slide
  textItems: { promoId: string; tag: string; title: string; subMethod: SubMethod; }[] = [];

  options: { subInventoryCode: string; subInventoryName: string }[] = [];
  subInventoryQty : {itemId : number; name: string; subInventory:{ subInventoryCode: string; qty: number }[]}[] = [];
  isLoading: boolean = false;
  thresholds: CustomPromoThreshold[] = [];
  group!: FormGroup;
  currentQty = 0;
  countdown: number = 0;
  interval: any;
  isShow: boolean | undefined;
  @ViewChild('incrementInput')
  incrementInput!: IncrementInputComponent;
  clickedSlideIndex: any;
  startDate = new Date();
  endDate = new Date();
  addressOption = 'I01';
  ABlock = true;
  AblockItemAmt = 0;
  BBlockItemAmt = 0;
  showCartDetail = false;
  oldThresholdsLevel : number = 0;
  summary = {
    count: 0,
    price: 0,
    bonusDiscount: 0,
    discount: 0,
    total: 0,
  };
  activeIndex: number | null = -1;
  isExtend = false;
  createCountOption(itemId: number, max: number = 0) {
    return {
      type: 'incrementInput',
      _label: '',
      label: '',
      inputType: 'number',
      name: 'buyQty_' + itemId,
      class: '',
      _value: 1,
      _step: 1,
      _min: 0,
      _max: max,
      _wrap: false,
      color: 'primary',
    };
  }

  productList: ICustomPromoProduct[] = [];
  cartAmountWithAll : number = 0;
  cartAmountWithA : number = 0;
  cartAmountWithB : number = 0;
  cartpriceAmountByAll : number = 0;
  cartpriceAmountByA : number = 0;
  cartpriceAmountBy : number = 0;
  isActive : boolean = true;
  cartProductList: ICustomPromoProduct[] = [];
  customPromoId: number = 0;

  constructor(
    public dialogservice: DialogService,
    private fb: FormBuilder,
    private filterService: FilterService,
    private productService: ProductService,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.promoId = params['promoId'];
    });
    this.loadContentManagement();
    this.group = this.fb.group({
      number: [1],
      promotion: [''],
      select: [''],
    });
    this.group.valueChanges.subscribe(() => this.updateSummary());
    if(localStorage.getItem('orgId') == '151'){
      this.title.setTitle('精豪電腦');
    }
    else{
    this.title.setTitle('精技電腦');
    }
  }
  loadSwiper(){
    const loop = this.textItems.length > 3;
    new Swiper('.text-swiper .swiper', {
      spaceBetween: 0,
      navigation: {
        nextEl: '.text-swiper .swiper-button-next',
        prevEl: '.text-swiper .swiper-button-prev',
      },
      loop: loop,
      breakpoints: {
        0: { slidesPerView: 2.5 },
        1200: { slidesPerView: 5 },
      },
    });
  }
  ngAfterViewInit(): void {
  }

  formatHour(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const formattedHours = hours < 10 ? `0${hours}` : hours;

    return `${formattedHours}`;
  }
  formatMin(seconds: number): string {
    const minutes = Math.floor((seconds % 3600) / 60);
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedMinutes}`;
  }
  formatSec(seconds: number): string {
    const remainingSeconds = seconds % 60;
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${formattedSeconds}`;
  }

  @HostListener('window:scroll')
  checkScroll() {
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    if (scrollPosition >= 100) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }

  changeQty(qty: number) {
    this.currentQty = qty;
  }

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  toggleButton(item: ICustomPromoProduct) {
    item.showSelectButton = !item.showSelectButton;
    this.cartProductList = [
      ...this.productList.filter((product) => product.showSelectButton),
    ];

    this.updateSummary();
  }

  toggleBlock() {
    this.ABlock = !this.ABlock;
  }

  toggleCart() {
    this.showCartDetail = !this.showCartDetail;
  }

  makeGroupingItems() {
    return [
      ...this.cartProductList?.map((e: any) => ({
        itemId: e.itemId as number,
        buyCount: e.countOption._value as number,
        customPromoArea: e.customPromoArea as string,
        uniqueId: uniqueId(),
      })),
    ];
  }
  checkHavestock(itemId : number):boolean{

    return this.subInventoryQty.filter((subInventoryItem) => subInventoryItem.itemId == itemId)
      .map(item =>{
        return item.subInventory.filter((subInverntory)=> subInverntory.subInventoryCode == this.addressOption).map(res => {return res.qty <= 0})
      }).flat()[0];
  }
  checkCanAddToCart(subInventoryCode: string){
    const products = this.makeGroupingItems();
    const subInventoryName = this.options.filter(subInverntoryInfo =>subInverntoryInfo.subInventoryCode == subInventoryCode).map(res => res.subInventoryName);
    const param = {
      promoId: this.customPromoId,
      subInventoryCode: this.thisSubInventoryCode,
      soldOutPlan: 3,
      products: products,
    };
    products.forEach((product) =>{
      const chkProduct=
      this.subInventoryQty.filter((subInventoryItem) => subInventoryItem.itemId == product.itemId)
      .map((item) =>{
        return{
          name: item.name,
          subInventoryInfo: item.subInventory.filter((subInverntory)=> subInverntory.subInventoryCode == subInventoryCode).filter((qty) => qty.qty >= product.buyCount)
        }
      });

      if(chkProduct[0].subInventoryInfo.length == 0){
        const modelOption = {
          modelName: 'simple-dialog',
          config: {
            data: {
              title: '無法加入購物車',
              StyleMargin: '0px',
              message: '商品「'+ chkProduct[0].name +'」'+ subInventoryName +'缺貨，請您選購其他倉庫的商品，謝謝',
              warning: true,
              displayFooter: true,
              confirmButton: '確認',
              confirm: () => {},
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
    })
  }
  addToCart() {
    let modelOption = { modelName: '', config: {} };
    if (this.customPromoId === 0) return;
    if(this.thisSubInventoryCode=='')
    {
      this.thisSubInventoryCode=this.options[0].subInventoryCode;
    }
    const products = this.makeGroupingItems();

    if (products.length === 0) {
      const modelOption = {
        modelName: 'simple-dialog',
        config: {
          data: {
            title: '無法加入購物車',
            StyleMargin: '0px',
            text: '未達任選門檻，須符合任購門檻才能加入購物車。',
            displayFooter: true,
            confirmButton: '確認',
            confirm: () => {
              return;
            },
          },
          width: '500px',
          height: '204px',
          hasBackdrop: true,
          autoFocus: false,
          enterAnimationDuration: '300ms',
          exitAnimationDuration: '300ms',
          panelClass: 'changeDialog',
        },
      };
      this.dialogservice.openLazyDialog(
        modelOption.modelName,
        modelOption.config
      );
      return
    }
    const param = {
      promoId: this.customPromoId,
      subInventoryCode: this.thisSubInventoryCode,
      soldOutPlan: 3,
      products: products,
      source: "custom-promo",
      sourceId: this.customPromoId
    };

    this.isLoading = true;

    this.productService
      .customPromoAddToCart(param)
      .pipe(
        catchError(() => {this.isLoading = false; return of();}),
        tap(() => {this.isLoading = false; }),
        tap(async (res) => {
          if (res['responseCode'] !== ResponseCode.Success) {
            const modelOption = {
              modelName: 'simple-dialog',
              config: {
                data: {
                  title: '無法加入購物車',
                  StyleMargin: '0px',
                  message: res.responseMessage,
                  warning: true,
                  displayFooter: true,
                  confirmButton: '確認',
                  confirm: () => {},
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
          modelOption.modelName = 'product-added-to-shopping-cart';
          modelOption.config = {
            data: {
              title: '',
              StyleMargin: '0px',
              text: '商品已加入購物車',
            },
            width: '368px',
            height: '179px',
            hasBackdrop: true,
            autoFocus: false,
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            panelClass: '',
          };

          const dialogRef = await this.dialogservice.openLazyDialog(
            modelOption.modelName,
            modelOption.config
          )
          dialogRef.afterClosed().subscribe((confirmed) => {
            if (confirmed.action === 2) {
              this.router.navigate(['/ShoppingCart'])
            } else {
              this.clearSelectedProducts()
            }
          });
        })
      )
      .subscribe();

    // if (action == 0) {
    //
    // } else if (action == 1) {
    //   const prouctName = 'ASUS PRO-UX425EA';
    //   modelOption = {
    //     modelName: 'simple-dialog',
    //     config: {
    //       data: {
    //         title: '商品缺貨',
    //         StyleMargin: '0px',
    //         text: '商品「' + prouctName + '」缺貨，系統將自動刪除商品。',
    //         displayFooter: true,
    //         confirmButton: '確認',
    //         confirm: () => {
    //           return;
    //         },
    //       },
    //       width: '500px',
    //       height: '204px',
    //       hasBackdrop: true,
    //       autoFocus: false,
    //       enterAnimationDuration: '300ms',
    //       exitAnimationDuration: '300ms',
    //       panelClass: 'changeDialog',
    //     },
    //   };
    // } else if (action == 2) {
    //   const prouctName = 'ASUS PRO-UX425EA';
    //   modelOption = {
    //     modelName: 'simple-dialog',
    //     config: {
    //       data: {
    //         title: '商品庫存不足',
    //         StyleMargin: '0px',
    //         text:
    //           '商品「' +
    //           prouctName +
    //           '」庫存量不足，若要加入購物車，請修改數量。',
    //         displayFooter: true,
    //         confirmButton: '確認',
    //         confirm: () => {
    //           return;
    //         },
    //       },
    //       width: '500px',
    //       height: '204px',
    //       hasBackdrop: true,
    //       autoFocus: false,
    //       enterAnimationDuration: '300ms',
    //       exitAnimationDuration: '300ms',
    //       panelClass: 'changeDialog',
    //     },
    //   };
    // } else if (action == 3) {
    //   modelOption = {
    //     modelName: 'simple-dialog',
    //     config: {
    //       data: {
    //         title: '無法加入購物車',
    //         StyleMargin: '0px',
    //         text: '此任購促銷已截止，系統將更新促銷，請您再次確認。',
    //         displayFooter: true,
    //         confirmButton: '確認',
    //         confirm: () => {
    //           return;
    //         },
    //       },
    //       width: '500px',
    //       height: '204px',
    //       hasBackdrop: true,
    //       autoFocus: false,
    //       enterAnimationDuration: '300ms',
    //       exitAnimationDuration: '300ms',
    //       panelClass: 'changeDialog',
    //     },
    //   };
    // } else if (action == 4) {
    //   modelOption = {
    //     modelName: 'simple-dialog',
    //     config: {
    //       data: {
    //         title: '無法加入購物車',
    //         StyleMargin: '0px',
    //         text: '未達任選門檻，須符合任購門檻才能加入購物車。',
    //         displayFooter: true,
    //         confirmButton: '確認',
    //         confirm: () => {
    //           return;
    //         },
    //       },
    //       width: '500px',
    //       height: '204px',
    //       hasBackdrop: true,
    //       autoFocus: false,
    //       enterAnimationDuration: '300ms',
    //       exitAnimationDuration: '300ms',
    //       panelClass: 'changeDialog',
    //     },
    //   };
    // }
    // this.dialogservice.openLazyDialog(
    //   modelOption.modelName,
    //   modelOption.config
    // );
  }

  changeStorage(action: any) {
    this.thisSubInventoryCode=action;//更新參數
    this.checkCanAddToCart(action);
    // let modelOption = { modelName: '', config: {} };
    // if (action == 0) {
    //   const prouctName = 'ASUS PRO-UX425EA';
    //   modelOption = {
    //     modelName: 'simple-dialog',
    //     config: {
    //       data: {
    //         title: '變更倉別提醒',
    //         StyleMargin: '0px',
    //         text:
    //           '商品「' +
    //           prouctName +
    //           '」在高雄倉庫存量不足，請確認是否要切換倉別。',
    //         displayFooter: true,
    //         confirmButton: '確認',
    //         cancelButton: '取消',
    //         confirm: () => {
    //           return;
    //         },
    //       },
    //       width: '500px',
    //       height: '204px',
    //       hasBackdrop: true,
    //       autoFocus: false,
    //       enterAnimationDuration: '300ms',
    //       exitAnimationDuration: '300ms',
    //       panelClass: 'changeDialog',
    //     },
    //   };
    // } else if (action == 1) {
    //   const prouctName = 'ASUS PRO-UX425EA';
    //   modelOption = {
    //     modelName: 'simple-dialog',
    //     config: {
    //       data: {
    //         title: '變更倉別提醒',
    //         StyleMargin: '0px',
    //         text:
    //           '商品「' +
    //           prouctName +
    //           '」在高雄倉缺貨，若要切換倉別將會刪除此商品，請確認是否要切換倉別。',
    //         displayFooter: true,
    //         confirmButton: '確認',
    //         cancelButton: '取消',
    //         confirm: () => {
    //           return;
    //         },
    //       },
    //       width: '500px',
    //       height: '204px',
    //       hasBackdrop: true,
    //       autoFocus: false,
    //       enterAnimationDuration: '300ms',
    //       exitAnimationDuration: '300ms',
    //       panelClass: 'changeDialog',
    //     },
    //   };
    // }
    // this.dialogservice.openLazyDialog(
    //   modelOption.modelName,
    //   modelOption.config
    // );
  }
  //取得活動資訊
  private loadContentManagement() {
    this.isLoading = true;
    this.filterSub = this.filterService.filterParams$
      .pipe(
        catchError(() => {this.isLoading = false; return of();}),
        switchMap((param) => {
          this.isLoading = true;
          return this.productService.getCustomPromoList().pipe(
            catchError(() => {
              this.isLoading = false;
              return of();
            })
          );
        }),
        tap(() => {this.isLoading = false;}),
        tap((res) => {
          let result: any;
          result = res.result;
          if (res.responseCode === '0000' && Array.isArray(result?.tabs)) {
            const periodSaleList = result.tabs;
            this.textItems = [];

            this.textItems = periodSaleList
              .flatMap((list: any) => list) // Flatten the array
              .map((item: any) => {
                return {
                  tag: item.upperText,
                  title: item.lowerText,
                  promoId: item.promoId,
                  subMethod: item.subMethod
                };
              })
              .sort(
                (a: { promoId: number }, b: { promoId: number }) =>
                  a.promoId - b.promoId
              );

            this.textItems.forEach(tab => this.analyticsService.event("promo_view", {
              promo_category: PromoCategoryName[PromoCategory.CustomisedOffer],
              promo_method: SubMethodName[tab.subMethod == 5 ? SubMethod.AnyChoice : SubMethod.MutliAreas],
              promo_id: tab.promoId
            }))
            //預設一進來要抓取第一筆資訊
            this.loadContentManagement2(
              this.promoId || this.textItems[0].promoId
            );
          } else {
            // Handle the case where res.responseCode is not '0000' or res.result.periodSales is not an array.
          }
        })
      )
      .subscribe(res => this.loadSwiper());
  }

  //點選呼叫該活動並刷新葉面資訊
  loadContentManagement2(promoId: string) {
    this.clickedSlideIndex = this.textItems.findIndex(text => text.promoId === promoId);
    this.customPromoId = Number(promoId);
    this.filterSub = this.filterService.filterParams$
      .pipe(
        tap(() => {this.isLoading = true;}),
        switchMap((param) => {
          return this.productService.getCustomPromoDetail(Number(promoId)).pipe(
            catchError(() => {
              this.isLoading = false;
              return of();
            })
          );
        }),
        tap(() => {this.isLoading = false;}),
        tap((res) => {
          const result = res.result.customPromo;
          if (res.responseCode === '0000') {

            this.analyticsService.event("promo_selection", 
            {
              promo_category: PromoCategoryName[PromoCategory.CustomisedOffer],
              promo_method: SubMethodName[result.subMethod == 5 ? SubMethod.AnyChoice : SubMethod.MutliAreas],
              promo_id: promoId
            });

            //ToDo
            //點選後 呼叫API成功並刷新頁面個區塊資訊

            result.products.forEach((product) => {
              this.group.addControl(
                `buyQty_${product.itemId}`,
                new FormControl(0)
              );
            });

            result.products.forEach((product)=>{
              const newItem = {itemId : product.itemId,name :product.name, subInventory:product.subInventory}
              this.subInventoryQty.push(newItem);
            })
            const addressOption = result.subInventories[0].subInventoryCode;
            this.startCountdown(result.endDate);
            this.thresholds = result.thresholds;
            this.productList = result.products.map((product) => ({
              ...product,
              countOption: this.createCountOption(
                product.itemId,
                product.subInventory.find(
                  (inventory) => inventory.subInventoryCode === addressOption
                )?.qty || 0
              ),
              showSelectButton: false,
            }));
            this.options = result.subInventories;

            this.startDate = result.startDate;
            this.endDate = result.endDate;
            this.addressOption = addressOption;
            this.ABlock = true;
            (this.AblockItemAmt = this.productList.filter(
              (product) => product.customPromoArea === 'A'
            ).length),
              (this.BBlockItemAmt = this.productList.filter(
                (product) => product.customPromoArea === 'B'
              ).length),
              (this.showCartDetail = false);
            this.subMethod = result.subMethod;
            this.cartProductList = [];
            this.oldThresholdsLevel = 0;
          } else {
            // Handle the case where res.responseCode is not '0000' or res.result.periodSales is not an array.
          }
        })
      )
      .subscribe();
  }

  private startCountdown(endDate: Date) {
    clearInterval(this.interval);

    this.countdown = Math.floor(
      (new Date(endDate).getTime() - new Date().getTime()) / 1000
    );

    this.interval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(this.interval);
      }
    }, 1000);
  }
  private updateSummary() {
    let count = 0;
    let price = 0;
    let countbyAreaA = 0;
    let countbyAreaB = 0;
    let pricebyAreaA = 0;
    let pricebyAreaB = 0;
    let discount = 0;
    let bonusDiscount = 0;
    this.cartProductList.forEach(
      (product) => {
        if (product.customPromoArea == 'A') {
          count += product.countOption._value;
          price += product.price * product.countOption._value
          countbyAreaA += product.countOption._value;
          pricebyAreaA += product.price * product.countOption._value
        }
        else if(product.customPromoArea == 'B'){
          count += product.countOption._value;
          price += product.price * product.countOption._value
          countbyAreaB += product.countOption._value;
          pricebyAreaB += product.price * product.countOption._value
        }
        else{
          count += product.countOption._value;
          price += product.price * product.countOption._value
        }
      }
    );

    this.cartAmountWithA = countbyAreaA;
    this.cartAmountWithB = countbyAreaB;
    this.cartAmountWithAll = count;
    this.cartpriceAmountByA = pricebyAreaA;
    this.cartpriceAmountBy = pricebyAreaB;
    this.cartpriceAmountByAll = price;
    this.summary = {
      count,
      price,
      bonusDiscount,
      discount,
      total: price - discount + bonusDiscount,
    };
    this.cdRef.detectChanges();
  }

  private updateTotal() {
    if(this.oldThresholdsLevel != 0){
      switch(this.thresholds[this.oldThresholdsLevel - 1].offerMethod){
        case 1:
          this.summary.discount = this.thresholds[this.oldThresholdsLevel - 1].offerValue;
          this.summary.total = this.summary.price - this.summary.discount + this.summary.bonusDiscount;
          break;
        case 2:
          this.summary.discount = (this.summary.price * this.thresholds[this.oldThresholdsLevel - 1].offerValue/100);
          this.summary.total = this.summary.price - this.summary.discount +this.summary.bonusDiscount;
          break;

        case 3:
          this.summary.discount =  this.summary.price - this.thresholds[this.oldThresholdsLevel - 1].offerValue;
          this.summary.total = (this.summary.price - this.summary.discount + this.summary.bonusDiscount) * this.summary.count;
          break;

        case 4:
          this.summary.discount = 0;
          if(this.thresholds[this.oldThresholdsLevel - 1].bonusDiscount !== null){
            this.summary.bonusDiscount = this.thresholds[this.oldThresholdsLevel - 1].bonusDiscount ?? 0;
          }
          this.summary.total = this.summary.price - this.summary.discount + this.summary.bonusDiscount;
          break;
      }
      }
  }
  // conditionValueA 在 任選 時 只有conditionValueAny會有值
  checkBonusThreshold(state:string,conditionMethod : number,level:number,conditionValueAny: number | null,conditionValueA: number | null,conditionValueB:number | null, index: number | null){
    var result : Boolean;
      if(this.subMethod == 5 && conditionValueAny != null){
        if(conditionMethod == 1){
          if(state == 'not-available'){
            result =  this.oldThresholdsLevel > level;
          }else{
            result =  this.cartAmountWithAll >= conditionValueAny;
            if(result){
              this.oldThresholdsLevel = level;
              (index || 0) > (this.activeIndex || 0) ? this.activeIndex = index : index = index;
              this.updateTotal();
            } else if(this.activeIndex === index && this.activeIndex) {
              this.activeIndex -= 1;
            }
          }
          if(this.oldThresholdsLevel == level && this.cartAmountWithAll < conditionValueAny){
            this.oldThresholdsLevel--;
          }
          return result;
        }else if(conditionMethod == 2){
          if(state == 'not-available'){
            result =  this.oldThresholdsLevel > level;
          }else{
            result =  this.cartpriceAmountByAll >= conditionValueAny;
            if(result){
              this.oldThresholdsLevel = level;
              (index || 0) > (this.activeIndex || 0) ? this.activeIndex = index : index = index;
              this.updateTotal()
            } else if(this.activeIndex === index && this.activeIndex) {
              this.activeIndex -= 1;
            }
          }
          if(this.oldThresholdsLevel == level && this.cartpriceAmountByAll < conditionValueAny){
            this.oldThresholdsLevel--;
          }
          return result;
        }
      }
      if(this.subMethod == 6 && conditionValueA != null && conditionValueB != null){
        if(conditionMethod == 1){
          if(state == 'not-available'){
            result = this.oldThresholdsLevel > level;
          }else{
            result = this.cartAmountWithA >= conditionValueA && this.cartAmountWithB >= conditionValueB;
            if(result){
              this.oldThresholdsLevel = level;
              (index || 0) > (this.activeIndex || 0) ? this.activeIndex = index : index = index;
              this.updateTotal()
            } else if(this.activeIndex === index && this.activeIndex) {
              this.activeIndex -= 1;
            }
          }
          if(this.oldThresholdsLevel == level && (this.cartAmountWithA < conditionValueA || this.cartAmountWithB < conditionValueB)){
            this.oldThresholdsLevel--;
          }
          return result;
        }else if(conditionMethod == 2){
          if(state == 'not-available'){
            result = this.oldThresholdsLevel > level;
          }else{
            result = this.cartpriceAmountByA >= conditionValueA && this.cartpriceAmountBy >= conditionValueB;
            if(result){
              this.oldThresholdsLevel = level;
              (index || 0) > (this.activeIndex || 0) ? this.activeIndex = index : index = index;
              this.updateTotal()
            } else if(this.activeIndex === index && this.activeIndex) {
              this.activeIndex -= 1;
            }
          }
          if(this.oldThresholdsLevel == level && (this.cartpriceAmountByA >= conditionValueA || this.cartpriceAmountBy >= conditionValueB)){
            this.oldThresholdsLevel--;
          }
          return result;
        }
      }
      return false;
      }

  clearSelectedProducts() {
    this.productList.forEach(p => p.showSelectButton = false);
    this.cartProductList = [];
    this.updateSummary();
  }
  
  canOrder() {
    const canOrder = JSON.parse(localStorage.getItem('canOrder') ?? 'true');
    return canOrder;
  }
}
