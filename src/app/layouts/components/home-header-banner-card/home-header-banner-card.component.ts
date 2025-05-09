/** --------------------------------------------------------------------------------
 *-- Description： 首頁Banner
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

// import Swiper core and required modules
@Component({
  selector: 'app-home-header-banner-card',
  templateUrl: './home-header-banner-card.component.html',
  styleUrls: ['./home-header-banner-card.component.scss'],
})
export class HomeHeaderBannerCardComponent implements OnInit {
  constructor() {}

  slidesOption = [
    [
      {
        name: 'ASUS X1403ZA-0171S1',
        type: '銀/i5-12500H/8G/512G_SSD',
        price: '$25,998',
        tag: [
          { value: '折', color: 'green' },
          { value: '贈', color: 'red' },
        ],
        images: {
          pc: 'https://fakeimg.pl/84x84/',
          mobile: '',
        },
      },
      {
        name: 'ASUS X1403ZA-0171S1',
        type: '銀/i5-12500H/8G/512G_SSD',
        price: '$25,998',
        tag: [{ value: '折', color: 'green' }],
        images: {
          pc: 'https://fakeimg.pl/84x84/',
          mobile: '',
        },
      },
    ],
    [
      {
        name: 'ASUS X1403ZA-0171S1',
        type: '銀/i5-12500H/8G/512G_SSD',
        price: '$25,998',
        tag: [
          { value: '折', color: 'green' },
          { value: '贈', color: 'red' },
        ],
        images: {
          pc: 'https://fakeimg.pl/84x84/',
          mobile: '',
        },
      },
    ],
  ];

  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 50,
    navigation: false,
    pagination: {
      el: '.swiper-pagination-card',
      type: 'custom',
      renderCustom: function (swiper, current, total) {
        return `<span>${current}</span>  / <span>${total}</span>`;
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
}
