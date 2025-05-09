import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { LayoutService } from 'src/app/shared/services';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-swiper-card',
  templateUrl: './swiper-card.component.html',
  styleUrls: ['./swiper-card.component.scss'],
})
export class SwiperCardComponent implements OnInit {
  _imgs!: string[];
  
  @Input()
  get imgs(): string[]{
    return this._imgs;
  }
  set imgs(value: string[]) {
    // 單純從父層元件改變 imgs，不會使這個元件重新 render，導致在 angular 重複利用 component 的情況下，即使換了商品，圖片可能也不會換
    // 所以在這裡手動觸發 re-render
    this._imgs = [];
    this.changeDetector.detectChanges();
    this._imgs = value;
    this.changeDetector.detectChanges();
  }

  constructor(public layoutService: LayoutService,
    private changeDetector: ChangeDetectorRef
  ) {}

  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 50,
    navigation: false,
    pagination: {
      el: '.swiper-pagination',
      type: 'custom',
      renderCustom: function (swiper, current, total) {
        return `<span>${current}</span>  / <span style='color:rgba(255, 255, 255, .7)'>${total}</span>`;
      },
    },
    scrollbar: { draggable: true },
    virtual: true,
  };
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  ngOnInit(): void {}

  /** slide next */
  slideNext() {
    this.swiper?.swiperRef.slideNext(100);
  }

  /** slide previous */
  slidePrev() {
    this.swiper?.swiperRef.slidePrev(100);
  }

  /** swiper */
  onSwiper(swiper: any) {
  }

  /** slide change */
  onSlideChange() {
  }

  thumbnailClick(index: number) {
    this.swiper?.swiperRef.slideTo(index, 100);
  }
}
