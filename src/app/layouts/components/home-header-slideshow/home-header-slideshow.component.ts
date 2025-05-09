/** --------------------------------------------------------------------------------
 *-- Description： 首頁 Header Slider
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { catchError, of, Subscription, switchMap, tap } from 'rxjs';
import { CustomHomePageBannersList } from 'src/app/models';
import { MemberService, ProductService } from 'src/app/services';
import { DialogService, LayoutService } from 'src/app/shared/services';
import { FilterService } from 'src/app/shared/services/filter.service';
import { EnvConfig } from 'src/app/app.module';
import Swiper, { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { TRACK_PARAMS } from 'src/app/shared/utils/trackParamUtilities';

@Component({
  selector: 'app-home-header-slideshow',
  templateUrl: './home-header-slideshow.component.html',
  styleUrls: ['./home-header-slideshow.component.scss'],
})
export class HomeHeaderSlideshowComponent {
  @Input()
  isShowCard!: boolean;
  currentScreenSize: string = '';
  filterForm!: FormGroup;
  isCreatedByCurrentUser!: boolean;
  dataSource!: any;

  filterSub = new Subscription();
  slidesOption = [
    {
      mobile: '../../../../assets/images/banner1.png',
      pc: '../../../../assets/images/banner1_mobile.png',
      relatedUrl: '',
    },
    {
      mobile: '../../../../assets/images/banner1.png',
      pc: '../../../../assets/images/banner1_mobile.png',
      relatedUrl: '',
    },
  ];

  slidesOption2 = [
    [
      {
        id: 1,
        itemId: '123',
        name: 'ASUS X1403ZA-0171S1',
        type: '銀/i5-12500H/8G/512G_SSD',
        unitPrice: 30000,
        promoPrice: 25998,
        tag: [
          { value: '折', color: 'green' },
          { value: '贈', color: 'red' },
        ],
        images: {
          pc: 'https://fakeimg.pl/84x84/',
          mobile: '',
        },
        promoString: '11451419.12345678',
      },
      {
        id: 2,
        itemId: '234',
        name: 'ASUS X1403ZA-0171S1',
        type: '銀/i5-12500H/8G/512G_SSD',
        unitPrice: 30000,
        promoPrice: 25998,
        tag: [{ value: '折', color: 'green' }],
        images: {
          pc: 'https://fakeimg.pl/84x84/',
          mobile: '',
        },
        promoString: '11451419.12345678',
      },
    ],
    [
      {
        id: 3,
        itemId: '345',
        name: 'ASUS X1403ZA-0171S1',
        type: '銀/i5-12500H/8G/512G_SSD',
        unitPrice: 30000,
        promoPrice: 25998,
        tag: [
          { value: '折', color: 'green' },
          { value: '贈', color: 'red' },
        ],
        images: {
          pc: 'https://fakeimg.pl/84x84/',
          mobile: '',
        },
        promoString: '11451419.12345678',
      },
    ],
  ];

  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 50,
    navigation: false,
    autoplay: { delay: 5000 },
    pagination: { type: 'custom', clickable: true },
    scrollbar: { draggable: true },
    virtual: true,
  };
  currentIndex = 0;

  config2: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 50,
    navigation: false,
    pagination: {
      el: '.swiper-pagination-card',
      type: 'custom',
      clickable: true,
      renderCustom: function (swiper, current, total) {
        return `<span>${current}</span>  <span style="color: #ADADAD;">/ ${total}</span>`;
      },
    },
    scrollbar: { draggable: true },
    virtual: true,
  };
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  @ViewChild('swiper2', { static: false }) swiper2?: SwiperComponent;
  constructor(
    public layoutService: LayoutService,

    private productService: ProductService,
    public dialogservice: DialogService,

    private fb: FormBuilder,
    private filterService: FilterService,
    private memberService: MemberService,
    private envConfig: EnvConfig
  ) {}
  ngOnInit(): void {
    this.slidesOption = [];
    this.slidesOption2 = [];

    this.loadContentManagement();
    this.loadContentManagementHotSales();
  }
  loadContentManagement() {
    this.filterSub = this.filterService.filterParams$
      .pipe(
        switchMap((param) => {
          // const option1AsString = this.option1.toString();

          return this.productService.gethomePageBanners().pipe(
            catchError(() => {
              // handle api error and continue operation
              return of();
            })
          );
        }),
        tap((res) => {
          if (res.responseCode === '0000' && res.result) {
            let x: any;
            x = res.result;
            const bannersList = x as CustomHomePageBannersList;
            if (bannersList.topBanners.length === 0) {
              const modelOption = {
                modelName: 'simple-dialog',
                config: {
                  data: {
                    title: '尚未有特定促銷活動',
                    StyleMargin: '0px',
                    text: `目前尚未有任何特定促銷活動，請您參考Iorder其他產品，謝謝。`,
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
            } else {
              this.slidesOption = bannersList.topBanners.map((banner) => ({
                mobile: `${this.envConfig.baseApiUrl}${banner.imageUrlForMobile}`,
                pc: `${this.envConfig.baseApiUrl}${banner.imageUrlForPc}`,
                relatedUrl: banner.relatedUrl,
                bannerAdId: banner.bannerAdId,
                defaultAdId: banner.defaultAdId
              }));
            }
          } else {
            // Handle the case when responseCode is not '0000'
          }
        })
      )
      .subscribe();
  }
  loadContentManagementHotSales() {
    this.filterSub = this.filterService.filterParams$
      .pipe(
        switchMap((param) => {
          return this.productService.getHotSalesList().pipe(
            catchError(() => {
              return of({ hotSaleProducts: [] });
            })
          );
        }),
        tap((res: any) => {
          if (
            res.result.hotSaleProducts &&
            res.result.hotSaleProducts.length > 0
          ) {
            const hotSaleProducts = res.result.hotSaleProducts;

            const transformedData = hotSaleProducts.map((productGroup: any) => {
              return productGroup.products.map((product: any) => ({
                id: product.id,
                itemId: product.itemId, //ToDO將 itemId帶入轉頁跟參數    例如：/Product?itemId=XXXXXXX
                name: product.itemName,
                type: product.description,
                unitPrice: product.unitPrice,
                promoPrice: product.promoPrice,
                tag: product.promoMethods.map((promoMethod: number) => {
                  if (promoMethod === 1) {
                    return { value: '折', color: 'red' };
                  } else if (promoMethod === 2) {
                    return { value: '贈', color: 'green' };
                  } else if (promoMethod === 3) {
                    return { value: '加', color: 'purple' };
                  } else if (promoMethod === 4) {
                    return { value: '組', color: 'yellow' };
                  } else if (promoMethod === 5) {
                    return { value: '量', color: 'blue' };
                  }

                  return null;
                }),
                images: {
                  pc: product.prodImg,
                  mobile: product.prodImg,
                },
                promoString: product.promoString,
              }));
            });

            // 更新slidesOption2
            this.slidesOption2 = transformedData;
          } else {
          }
        })
      )
      .subscribe();
  }

  /** slide next */
  slideNext() {
    this.swiper?.swiperRef.slideNext(100);
  }

  /** slide previous */
  slidePrev() {
    this.swiper?.swiperRef.slidePrev(100);
  }

  onSlideChange({ activeIndex }: Swiper): void {
    this.currentIndex = activeIndex;
  }

  /** slide next */
  slide2Next() {
    this.swiper2?.swiperRef.slideNext(100);
  }

  /** slide previous */
  slide2Prev() {
    this.swiper2?.swiperRef.slidePrev(100);
  }

  getSlideUrl(slide: any): string {
    const url = slide.relatedUrl;
    const source = slide.bannerAdId ? "homepage-banner" : "homepage-banner-default";
    const sourceId = (slide.bannerAdId ?? slide.defaultAdId);

    return TRACK_PARAMS.combine(url, source, sourceId);
  }
}
