import { AnimationBuilder } from '@angular/animations';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { catchError, of, Subscription, switchMap, tap } from 'rxjs';
import { Pagination } from 'src/app/core/model';
import { AwardActivityList } from 'src/app/models';
import { MemberService, ProductService } from 'src/app/services';
import { DialogService, LayoutService } from 'src/app/shared/services';
import { FilterService } from 'src/app/shared/services/filter.service';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-home-incentive-activities',
  templateUrl: './home-incentive-activities.component.html',
  styleUrls: ['./home-incentive-activities.component.scss'],
})
export class HomeIncentiveActivitiesComponent implements OnInit {
  filterForm!: FormGroup;
  isCreatedByCurrentUser!: boolean;
  dataSource!: any;
  pagination?: Pagination;
  filterSub = new Subscription();

  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  isBeginning: boolean = true;
  isEnd: boolean = false;

  slidesOption = [
    {
      //points: '300點',
      //text: '送紅利點數',
      //content: "ASUS/DELL/Lenovo/HP/指定家用主機•1-3月「假日」下單最高送900點數",
      //date: "2023/1/3 - 2022/3/30",
      //full:"滿30,000送300點",
      //threshold:"已符合門檻 1/3",
      //detailUrl:"",
      points: '300',
      targetReward: '', // 精技新增 Add by Kelsier at 2024/11/07 for No.2024035201
      title: null,
      type: '送紅利點數',
      description:
        'ASUS/DELL/Lenovo/HP/指定家用主機•1-3月「假日」下單最高送900點數',
      date: '2023/1/3',
      conditionText: '滿30,000送300點',
      condition: 70,
      conditionStatus: '已符合門檻 1/3',
      detailUrl: 'http://www.google.com.tw',
    },
    {
      points: '300',
      targetReward: '', // 精技新增 Add by Kelsier at 2024/11/07 for No.2024035201
      title: null,
      type: '送紅利點數',
      description:
        'ASUS/DELL/Lenovo/HP/指定家用主機•1-3月「假日」下單最高送900點數',
      date: '2023/1/3',
      conditionText: '滿100,000送1,000點',
      condition: 70,
      conditionStatus: '已符合門檻 1/3',
      detailUrl: 'http://www.google.com.tw',
    },
    {
      points: '300',
      targetReward: '', // 精技新增 Add by Kelsier at 2024/11/07 for No.2024035201
      title: '送電競滑鼠',
      type: '送贈品',
      description:
        'ASUS/DELL/Lenovo/HP/指定家用主機•1-3月「假日」下單最高送900點數',
      date: '2023/1/3',
      conditionText: '滿30,000送300點',
      condition: 70,
      conditionStatus: '已符合門檻 1/3',
      detailUrl: 'http://www.google.com.tw',
    },
    {
      points: '300',
      targetReward: '', // 精技新增 Add by Kelsier at 2024/11/07 for No.2024035201
      title: '抽腳踏車',
      type: '抽獎活動',
      description:
        'ASUS/DELL/Lenovo/HP/指定家用主機•1-3月「假日」下單最高送900點數',
      date: '2023/1/3',
      conditionText: '滿30,000送300點',
      condition: 70,
      conditionStatus: '已符合門檻 1/3',
      detailUrl: 'http://www.google.com.tw',
    },
    {
      points: '300',
      targetReward: '', // 精技新增 Add by Kelsier at 2024/11/07 for No.2024035201
      title: null,
      type: '送紅利點數',
      description:
        'ASUS/DELL/Lenovo/HP/指定家用主機•1-3月「假日」下單最高送900點數',
      date: '2023/1/3',
      conditionText: '滿30,000送300點',
      condition: 70,
      conditionStatus: '已符合門檻 1/3',
      detailUrl: 'http://www.google.com.tw',
    },
    {
      points: '300',
      targetReward: '', // 精技新增 Add by Kelsier at 2024/11/07 for No.2024035201
      title: null,
      type: '送紅利點數',
      description:
        'ASUS/DELL/Lenovo/HP/指定家用主機•1-3月「假日」下單最高送900點數',
      date: '2023/1/3',
      conditionText: '滿30,000送300點',
      condition: 70,
      conditionStatus: '已符合門檻 1/3',
      detailUrl: 'http://www.google.com.tw',
    },
  ];

  linearGradient: string = 'linear-gradient(to right, white 0%, #0972e3 100%)';

  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 10,
    navigation: false,
    pagination: false,
    scrollbar: { draggable: true },
    virtual: true,
    breakpoints: {
      1024: {
        slidesPerView: 4,
        spaceBetween: 10,
      },
      1280: {
        slidesPerView: 5,
        spaceBetween: 10,
      },
    },
  };
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;

  // 因為有需求是無獎勵活動時從首頁隱藏整個獎勵活動區塊
  // 但當初切版把區塊做在首頁, 查資料做在 component
  // 這邊利用這個 Output 告知首頁有沒有資料
  @Output() hasData = new EventEmitter<boolean>();

  constructor(
    private builder: AnimationBuilder,

    private productService: ProductService,
    public dialogservice: DialogService,
    public layoutService: LayoutService,
    private fb: FormBuilder,
    private filterService: FilterService,
    private memberService: MemberService
  ) {}

  ngOnInit(): void {
    this.slidesOption = [];
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

  onSlideChange(swiper: any) {
    this.checkNextButtonVisibility();
  }

  checkNextButtonVisibility() {
    if (this.swiper?.swiperRef.isBeginning) {
      this.isBeginning = true;
    } else {
      this.isBeginning = false;
    }
    if (this.swiper?.swiperRef.isEnd) {
      this.isEnd = true;
    } else {
      this.isEnd = false;
    }
  }

  updateGradient(condition: any) {
    this.linearGradient =
      'linear-gradient(to right, white ' +
      condition +
      '%, #0972e3 ' +
      condition +
      '%)';
    return this.linearGradient;
  }
  loadContentManagement() {
    this.filterSub = this.filterService.filterParams$
      .pipe(
        switchMap((param) => {
          return this.productService.getAwardActivityList(param).pipe(
            catchError(() => {
              // handle api error and continue operation
              return of();
            })
          );
        }),

        tap((res) => {
          if (res.responseCode === '0000' && Array.isArray(res.result)) {
            this.pagination = res.result.pagination;

            const awardActivityList = res.result as AwardActivityList[];
            const toEmit = !!awardActivityList?.length;

            this.hasData.emit(toEmit);

            if (Array.isArray(awardActivityList)) {
              this.slidesOption = awardActivityList.map((item) => ({
                points: null ? '' : item.reward,
                targetReward: item.rewardThis, // 精技新增 Add by Kelsier at 2024/11/07 for No.2024035201
                title: item.reward,
                type: item.rewardType,
                description: item.rewardActivityName,
                date: item.rewardActivityDate,
                conditionText: item.achievementDescription,
                condition: item.achievementProgress * 100,
                conditionStatus: item.progress,
                detailUrl: item.detailUrl,
              }));
            }
          } else {
          }
        })
      )
      .subscribe();
  }
}
