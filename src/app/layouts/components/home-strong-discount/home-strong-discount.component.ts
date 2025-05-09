import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import {
  Observable,
  Subscription,
  Timestamp,
  catchError,
  filter,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { FilterService } from 'src/app/shared/services/filter.service';
import { environment } from 'src/environments/environment';
import { MemberService, ProductService } from 'src/app/services';
import * as moment from 'moment';
import { DialogService, LayoutService, NotifierService } from 'src/app/shared/services';
import { ProductComparisonComponent } from 'src/app/shared/components/product-comparison/product-comparison.component';
import { ResponseCode } from 'src/app/enums';
import { POP_UP } from 'src/app/shared/utils/popUpUtilities';

@Component({
  selector: 'app-home-strong-discount',
  templateUrl: './home-strong-discount.component.html',
  styleUrls: ['./home-strong-discount.component.scss'],
})
export class HomeStrongDiscountComponent implements OnInit {
  @Input()
  comparisonComp?: ProductComparisonComponent;
  @Output() 
  onNoData = new EventEmitter<boolean>();
  @Output()
  addToCart = new EventEmitter<any>();
  @Output()
  addToComparison = new EventEmitter<any>();
  @Output()
  strongDiscount = new EventEmitter<any>();
  color: ThemePalette = 'accent';
  mode: ProgressBarMode = 'determinate';
  isBeginning: boolean = true;
  isEnd: boolean = false;
  filterSub = new Subscription();

  slidesData: SlideData[] = [];
  linearGradient: string = 'linear-gradient(to right, white 0%, #0972e3 100%)';

  config: SwiperOptions = {

    slidesPerView: 1,
    slidesPerGroup: 1,
    spaceBetween: 0,
    navigation: false,
    pagination: {
      el: '.page',
      type: 'custom',
      renderCustom: function (swiper, current, total) {
        return `<span>${current}</span>  / <span style='color:#333333'>${total}</span>`;
      },
    },
    scrollbar: { draggable: true },
    virtual: true,
    breakpoints: {
      1024: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        spaceBetween: 0,
      },
    },
  };
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  constructor(
    private memberService: MemberService,
    private filterService: FilterService,
    private productService: ProductService,
    private notifierService: NotifierService,
    public layoutService: LayoutService,
    private dialogService: DialogService) { }

  ngOnInit(): void {
    this.loadContentManagement();
  }

  /** slide next */
  slideNext() {
    this.swiper?.swiperRef.slideNext(100);
  }

  /** slide previous */
  slidePrev() {
    this.swiper?.swiperRef.slidePrev(100);
  }

  updateGradient(condition: any) {
    this.linearGradient =
      'linear-gradient(to right, white ' +
      condition +
      '%, #ED1C24 ' +
      (100 - condition) +
      '%)';
    return this.linearGradient;
  }

  isCompareAddOrRemove(data: any): boolean {
    return !(this.comparisonComp?.items ?? [])?.find(
      (item: { itemId: any; }) => item.itemId === data?.itemId
    );
  }

  isAddToWishList(data: any): boolean {
    return data.favorite  
  }

  addToWishList(data: any): void {
    const isSales = JSON.parse(localStorage.getItem('isSales') ?? 'true');

    if (isSales)
    {
      const hint = ['很抱歉，您的身分組（查價員）無法使用此功能。', '如有疑問，請聯絡您的帳戶管理員，或聯絡線上客服。'];
      POP_UP.showMessage(this.dialogService, '您的身分組不支援此功能', hint);
      return;
    }

    if(data) {
      this.memberService
        .addWishList(Number(data.itemId))
        .subscribe((res: any) => {
          if(res.responseCode === ResponseCode.Success) {
            this.notifierService.showInfoNotification('已加入追蹤清單');
            this.loadContentManagement();
          } 
          else 
          {
            this.notifierService.showInfoNotification(res.responseMessage);
          }
        })
    } 
  }

  loadContentManagement() {
    this.filterSub = this.filterService.filterParams$
      .pipe(
        switchMap(() => {
          return this.productService.getGoupBuyPrimePromos().pipe(
            catchError(_ => {
              return of();
            })
          );
        }),
        tap((res) => {
          if (res.responseCode === '0000' && res.result) {
            let x: any;
            x = res.result;
            this.slidesData = x.data.map((item: any) => ({
              promoId: item.promoId,
              itemId: item.itemId,
              productTag: item.productTag,
              imgSrc: item.prodImg,
              tags: item.promoMethods,
              mainTitle: item.itemName,
              subTitle: item.itemDescription,
              price: item.promoPrice,
              oldPrice: item.unitPrice,
              conditionText: item.buttonDescription,
              condition: 250,
              conditionStatus: moment(item.endTime).format(
                'YYYY/MM/DD HH:mm:ss'
              ),
              favorite: item.favorite,
            }));
          } else {
            // Handle the case where responseCode is not '0000'
            this.onNoData.emit(true);
          }
          this.swiper?.swiperRef.update();
        })
      )
      .subscribe();
  }
}
interface SlideData {
  promoId: number;
  itemId: number;
  productTag: string;
  imgSrc: string;
  tags: number[];
  mainTitle: string;
  subTitle: string;
  price: number;
  oldPrice: number;
  conditionText: string;
  condition: number;
  conditionStatus: Timestamp<string>;
}
