/** --------------------------------------------------------------------------------
 *-- Description： Layout
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { EnvConfig } from 'src/app/app.module';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DialogService } from 'src/app/shared/services';
import Swiper, { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

interface Slide {
  imagePath: string;
  isInternal: boolean;
  relatedUrl: string;
}

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;

  @Input() config!: {
    className?: string;
  };

  @Input() nowPage!: string;

  currentIndex = 0;
  slides?: Slide[];

  swiperOptions: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 50,
    navigation: false,
    autoplay: { delay: 5000 },
    pagination: { clickable: true, type: 'custom' },
    scrollbar: { draggable: true },
    virtual: true,
  };

  constructor(
    private auth: AuthService,
    private envConfig: EnvConfig,
    private dialogservice: DialogService
  ) {}

  ngOnInit(): void {
    this.getAdvertiseImg();
  }

  onSlideChange({ activeIndex }: Swiper): void {
    this.currentIndex = activeIndex;
  }

  onPrevSlide(): void {
    this.swiper?.swiperRef.slidePrev(100);
  }

  onNextSlide(): void {
    this.swiper?.swiperRef.slideNext(100);
  }

  getAdvertiseImg(): void {
    let orgId = this.envConfig.orgId;

    this.auth.advertiseImg(orgId).subscribe((resp: any) => {
      this.slides = resp.result?.images.map((item: any) => {
        return {
          ...item,
          imagePath: this.envConfig.baseApiUrl + item.imagePath,
        };
      });
    });
  }

  pathUrl(item: Slide): void {
    if (!item.imagePath) return;
    if (item.isInternal) {
      const modelOption = {
        modelName: 'simple-dialog',
        config: {
          data: {
            title: '會員失效',
            text: '此廣告需先登入 iOrder。',
            StyleMargin: '0px',
            displayFooter: true,
            confirmButton: '確認',
            color: 'primary',
            confirm: () => {},
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
      this.auth.relatedUrl = item.relatedUrl;
    } else if (item.relatedUrl.startsWith('http')) {
      window.open(item.relatedUrl, '_blank');
    }
  }
}
