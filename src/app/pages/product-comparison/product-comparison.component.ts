import { CurrencyPipe, Location } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  Subject,
  filter,
  iif,
  map,
  of,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs';
import { promoTagLabel } from 'src/app/constants/product.constants';
import { StorageService } from 'src/app/core/services/storage.service';
import { StorageEnum } from 'src/app/enums/storage.enum';
import {
  CompareItem,
  CompareProduct,
  Product2,
  ProductDetail,
} from 'src/app/models';
import { MemberService, ProductService } from 'src/app/services';
import { DialogService } from 'src/app/shared/services';

@Component({
  selector: 'app-product-comparison',
  templateUrl: './product-comparison.component.html',
  styleUrls: ['./product-comparison.component.scss'],
})
export class ProductComparisonComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  isHomePage!: boolean;
  isMobile: boolean = false;
  isCategoryLayout!: boolean;
  currentScreenSize: string = '';
  isChecked: boolean = false;
  recommended: ProductDetail[] = [];
  promoTagLabel: typeof promoTagLabel = promoTagLabel;
  guessYouLikes: ProductDetail[] = [];
  item: any;
  isCompareHidden = true;
  triggerPosition = 200;
  isDesktop = window.innerWidth > 768;
  isMobileLimit = window.innerWidth < 768;

  compare: CompareProduct[] = [];
  compareItem: CompareItem[] = [];

  constructor(
    private dialogservice: DialogService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private currencyPipe: CurrencyPipe,
    private storageService: StorageService,
    private memberService: MemberService
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        startWith(null),
        filter((event) => !event || event instanceof NavigationEnd),
        switchMap(() => this.route.queryParams),
        map((queryParams) =>
          queryParams['compareItems']
            ?.split('+')
            .map(Number)
            .filter((item: any) => !!item)
        ),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((compareItemIds: number[]) => {
        this.productService
          .getProductList({ itemIds: compareItemIds, ignoreWelfareOrNot: true })
          .subscribe((response) => {
            if ('result' in response) {
              // Assuming response has a 'result' property
              const data: Product2[] = response['result']['data'];
              const dataMap: { [itemId: string]: Product2 } = {};
              if (Array.isArray(data)) {
                data.forEach((item) => {
                  dataMap[item.itemId] = item;
                });

                this.compare = compareItemIds
                  .map((itemId) => dataMap[itemId])
                  .map((item) => ({
                    itemId: item.itemId,
                    imgUrl: item.prodImg,
                    name: item.itemName,
                    itemNumber:item.itemNumber,
                    //Added by Kelsier on 2025/01/24 for AR:20250020
                    price: item.productDisplayStatus != 3 ? this.currencyPipe.transform(item.priceWithTax) || '' : '暫不提供' ,
                    favorite: item.favorite,
                  }));
              }
            }
          });
        this.productService
          .getCompareProductList(compareItemIds)
          .subscribe((response) => {
            if ('result' in response) {
              this.compareItem = response['result']['comparison'];
            }
          });
        this.loadContentManagement2();
        this.loadContentManagement3();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  toggleFavorite(item: CompareProduct) {
    of('')
      .pipe(
        switchMap(() =>
          iif(
            () => item.favorite,
            this.memberService.deleteWishList(item.itemId),
            this.memberService.addWishList(item.itemId)
          )
        )
      )
      .subscribe(() => {
        item.favorite = !item.favorite;
      });
  }

  toggleMenuType(isCategoryLayout: boolean) {
    this.isCategoryLayout = isCategoryLayout;
  }

  getPromotionTag(promotionMethod: number) {
    if (promotionMethod) return promoTagLabel[promotionMethod];
    return {
      text: '',
      label: '',
      color: '',
    };
  }

  isDifferent(arr: string[]): boolean {
    return arr.some((value, index) => {
      return this.isChecked && value !== arr[0];
    });
  }

  clearDialog() {
    this.dialogservice.closeAll();
    const modelOption = {
      modelName: 'simple-dialog',
      config: {
        data: {
          title: '全部清除',
          StyleMargin: '0px',
          text: '請確認是否要清除商品比較，清除後紀錄將不會留存。',
          displayFooter: true,
          confirmButton: '全部清除',
          cancelButton: '取消',
          color: 'warn',
          confirm: () => {
            this.storageService.set(StorageEnum.ComparingItems, []);
            this.router.navigate(['/']);
          },
        },
        width: '500px',
        height: 'auto',
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

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    if (scrollPosition >= 200) {      // Modify by Tako on 2025/03/11 for IR-114070
      this.isCompareHidden = false
    } else{
      this.isCompareHidden = true;
    }
  }

  limitedCompare(arr: any[]): any[] {
    if (this.isDesktop) {
      return arr.slice(0, 4);
    } else {
      return arr.slice(0, 2);
    }
  }

  lastPage() {
    this.location.back();
  }

  removeProduct(index: number) {
    this.compare.splice(index, 1);
    this.compareItem.forEach((item) => item.values.splice(index, 1));
    this.storageService.set(StorageEnum.ComparingItems, this.compare);
  }

  exportExcel(compareProducts: CompareProduct[]) {
    this.productService
      .getCompareProductExcel(compareProducts.map((item) => item.itemId))
      .subscribe((response: Blob) => {
        const a = document.createElement('a');
        a.download = '商品規格比較表.xlsx';
        a.href = window.URL.createObjectURL(response);
        a.click();
      });
  }

  private loadContentManagement2() {
    this.productService.getGuessYouLikeList({}).subscribe((resp) => {
      this.guessYouLikes = resp.result.guessYouLike;
    });
  }

  private loadContentManagement3() {
    this.productService.getRecommendedList({}).subscribe((resp) => {
      this.recommended = resp.result.recommended;
    });
  }
}
