import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { catchError, of, Subscription, switchMap, tap } from 'rxjs';
import { SwiperComponent } from 'swiper/angular';
import { Swiper, SwiperOptions } from 'swiper/types';
import { ProductListPageBannersList, ResultRes } from 'src/app/models';
import { ProductService } from 'src/app/services';
import { LayoutService } from 'src/app/shared/services';
import { FilterService } from 'src/app/shared/services/filter.service';
import { EnvConfig } from 'src/app/app.module';
import { ActivatedRoute, Params } from '@angular/router';
import { TRACK_PARAMS } from 'src/app/shared/utils/trackParamUtilities';

@Component({
  selector: 'app-product-header-slideshow',
  templateUrl: './product-header-slideshow.component.html',
  styleUrls: ['./product-header-slideshow.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProductHeaderSlideshowComponent {
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 50,
    navigation: false,
    autoplay: { delay: 5000 },
    pagination: {
      el: '.swiper-pagination-slide',
      type: 'custom',
      clickable: true,
      renderCustom: function (swiper, current, total) {
        return `<span style="color: #FFF;">${current}  <span style="opacity:0.7;">/ ${total}</span></span>`;
      },
    },
    scrollbar: { draggable: true },
    virtual: true,
  };
  slidesOption: any[] = [];

  constructor(
    public layoutService: LayoutService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private envConfig: EnvConfig,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadContentManagement();
  }

  loadContentManagement() {
    this.route.queryParams    
      .pipe(tap((params) => this.handleNewParams(params)))
      .subscribe();
  }

  source?: string | null;

  handleNewParams(params: Params){
    let type2Id = params['type2Id'];
    let brandId = params['brand'];

    // 這邊旨在依據目前是品牌館還是次分類館，決定這張廣告的 source
    // 廣告的 sourceId 是廣告 id, 因此在這裡不會定義
    this.source = brandId ? "brand-banner" : "type2-banner";

    this.productService.adproduct(type2Id, brandId)
          .pipe(
              catchError(() => {
                // handle api error and continue operation
                return of();
              }),
              tap((res) => this.updateImages(res))
            )
          .subscribe();
  }

  updateImages(response: ResultRes<ProductListPageBannersList>) {
    const bannersList = response.result as ProductListPageBannersList;

    // 把圖片陣列清空
    this.slidesOption = [];

    // 偵測一次
    this.changeDetector.detectChanges();

    // populate 圖片陣列
    this.slidesOption = bannersList.banners.map((banner) => ({
      mobile: `${this.envConfig.baseApiUrl}${banner.imageUrlForMobile}`,
      pc: `${this.envConfig.baseApiUrl}${banner.imageUrlForPc}`,
      relatedUrl: banner.relatedUrl,
      adId: banner.adId
    }));

    // 偵測一次
    this.changeDetector.detectChanges();

    // 這裡的行為在讓 swiper 能正常重新讀取圖片
    // 如果單純只取代 slidesOption，即使 detectChanges 也不會發生任何事
  }

  /** swiper */
  onSwiper(swiper: any) {
  }

  /** slide change */
  onSlideChange() {
  }

  /** slide previous */
  slidePrev() {
    this.swiper?.swiperRef.slidePrev(100);
  }

  /** slide next */
  slideNext() {
    this.swiper?.swiperRef.slideNext(100);
  }

  getSlideUrl(slide: any): string {
    const url = slide.relatedUrl;
    const source = this.source;
    const sourceId = slide.adId;

    return TRACK_PARAMS.combine(url, source, sourceId);
  }
}
