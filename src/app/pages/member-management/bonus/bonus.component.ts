/** --------------------------------------------------------------------------------
 *-- Description： 帳單查詢
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Pagination } from 'src/app/core/model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { DialogService, LayoutService } from 'src/app/shared/services';
import { FilterService } from 'src/app/shared/services/filter.service';
import { ProductService } from 'src/app/services';
import { OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { BonusStatusName } from 'src/app/enums';
import { Options } from 'src/app/shared/models';
import { FormGroupDirective } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  BehaviorSubject,
  Subscription,
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  from,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import {
  style,
  animate,
  AnimationBuilder,
  AnimationPlayer,
} from '@angular/animations';
import { URL_UTIL } from 'src/app/shared/utils/urlUtilities';
import { BonusExpireSoonItem } from 'src/app/models';

const ELEMENT_DATA = [
  {
    transactionDate: '2022/09/21',
    no: 'BN2209208388',
    freePoints: '+400',
    usedPoints: '',
    status: '待生效',
    releaseDate: '2022/09/21',
    effectiveDate: '2022/12/21',
    dividendDetails: '說明',
  },
  {
    transactionDate: '2022/09/21',
    no: 'BN2209208388',
    freePoints: '+400',
    usedPoints: '-12000',
    status: '生效',
    releaseDate: '2022/09/21',
    effectiveDate: '2022/12/21',
    dividendDetails: '說明',
  },
  {
    transactionDate: '2022/09/21',
    no: 'BN2209208388',
    freePoints: '+400',
    usedPoints: '-12000',
    status: '生效',
    releaseDate: '2022/09/21',
    effectiveDate: '2022/12/21',
    dividendDetails: '說明',
  },
  {
    transactionDate: '2022/09/21',
    no: 'BN2209208388',
    freePoints: '+400',
    usedPoints: '-12000',
    status: '生效',
    releaseDate: '2022/09/21',
    effectiveDate: '2022/12/21',
    dividendDetails: '說明',
  },
];

@Component({
  selector: 'app-bonus',
  templateUrl: './bonus.component.html',
  styleUrls: ['./bonus.component.scss'],
  viewProviders: [FormGroupDirective],
})
export class BonusComponent implements OnInit {
  @Output()
  dataChange = new EventEmitter();
  maxSize: number = 10;
  filterForm!: FormGroup;
  isCreatedByCurrentUser!: boolean;
  //dataSource!: any;
  pagination?: Pagination;
  filterSub = new Subscription();
  displayBonus = false;

  active!: string;
  expireSoon!: number;
  expireSoonList: BonusExpireSoonItem[] = [];
  inActive!: string;
  used!: string;
  thispage = 1;
  totalpage = 0;
  paginateArgs: any = {
    itemsPerPage: 10,
    currentPage: this.pagination?.currentPage ?? 1,
    totalItems: 0,
  };
  selectedPageSize = 10;
  pageSizeOption: Options[] = [
    {
      label: '10筆',
      value: 10,
    },
    {
      label: '20筆',
      value: 20,
    },
    {
      label: '30筆',
      value: 30,
    },
    {
      label: '40筆',
      value: 40,
    },
  ];

  applyChangeForm = new FormGroup({
    status: new FormControl([1]),
    account: new FormControl(['', Validators.compose([Validators.required])]),
    email: new FormControl([
      '',
      Validators.compose([Validators.required, Validators.email]),
    ]),
    password: new FormControl(['', Validators.compose([Validators.required])]),
  });
  dataSource = ELEMENT_DATA;
  noticationData = {
    title: '注意事項',
    list: [
      '目前僅提供過去180天和未來90天的紅利點數資料供查詢。',
      '每張訂單最多可折抵未稅總金額30%',
    ],
  };
  dealerView: string | null = null;

  constructor(
    private fb: FormBuilder,
    public dialogservice: DialogService,
    public layoutService: LayoutService,
    private filterService: FilterService,
    private builder: AnimationBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /** reset */
  reset() {
    this.filterForm.reset({
      processStatus: '',
      releaseDateStart: '',
      releaseDateEnd: '',
      effectiveDateStart: '',
      effectiveDateEnd: '',
      notificationStatus: '',
      itemNumber: '',
      dealerView: this.dealerView
    });
  }

  ngOnInit(): void {
    this.displayBonus = JSON.parse(localStorage.getItem('displayBonus') || "false");
    
    // 不能顯示紅利的帳號，跳回首頁
    if(!this.displayBonus) {
      this.router.navigateByUrl('/');
      return;
    }
    this.filterForm = this.fb.group({
      processStatus: [''],
      releaseDateStart: [''],
      releaseDateEnd: [''],
      effectiveDateStart: [''],
      effectiveDateEnd: [''],
      itemNumber: [''],
      dealerView: [this.dealerView]
    });

    
    // dealerView(經銷商檢視) 為 queryParam
    // 避免 param 改變但元件未重新初始化導致漏掉處理
    // 所以採訂閱方式
    this.route.queryParams
      .pipe(
        tap((p) => {
          this.dealerView = URL_UTIL.getDealerView(p);
          this.reset();
        })
      )
      .subscribe();
    
    this.filterService.filterChange(this.filterForm.value);

    this.dataSource = [];
    this.loadContentManagement();
    this.loadContentManagement2();

    this.filterForm.valueChanges.subscribe((value) => {
      const filter = Object.fromEntries(
        Object.entries(value).filter((item) => item[1] !== '')
      );
      this.filterService.filterChange(filter);
    });
  }
  /** search change */
  onSearchChange(keyword: string): void {
    this.filterForm.patchValue({
      itemNumber: keyword,
    });
  }

  loadContentManagement() {
    this.filterSub = combineLatest([
      this.filterService.filterParams$,
      // this.status$,
    ])
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          // this.initialTable();
        }),
        switchMap(([filter]) => {
          // 調用 getAwardLists 函數，注意添加組織ID參數以及篩選條件
          const params: {
            page: number;
            pageSize: number;
            status?: 0 | 1 | 2 | 3;
            releaseDateStart?: string;
            releaseDateEnd?: string;
            effectiveDateStart?: string;
            effectiveDateEnd?: string;
            keyword?: string;
            dealerView?: string | null;
          } = {
            page: filter.page,
            pageSize: filter.pageSize,
            dealerView: filter.dealerView
          };
          if (
            undefined !== filter.processStatus &&
            null !== filter.processStatus
          ) {
            params.status = filter.processStatus;
          }
          if (filter.releaseDateStart) {
            params.releaseDateStart = new Date(
              filter.releaseDateStart
            ).toISOString();
          }
          if (filter.releaseDateEnd) {
            params.releaseDateEnd = new Date(
              filter.releaseDateEnd
            ).toISOString();
          }
          if (filter.effectiveDateStart) {
            params.effectiveDateStart = new Date(
              filter.effectiveDateStart
            ).toISOString();
          }
          if (filter.effectiveDateEnd) {
            params.effectiveDateEnd = new Date(
              filter.effectiveDateEnd
            ).toISOString();
          }
          if (filter.itemNumber) {
            params.keyword = filter.itemNumber;
          }
          return this.productService
            .getBonusList({
              ...(params as any), // 這里將篩選條件合並到參數中
            })
            .pipe(
              catchError(() => {
                // 處理 API 錯誤並繼續操作
                return of();
              })
            );
        }),
        tap((response: any) => {
          const pagination = response.pagination ?? {}; // 獲取 pagination 對象，如果不存在則默認為一個空對象
          this.pagination = pagination;

          this.totalpage = this.pagination?.totalPage ?? 0;
          // this.paginateArgs = {
          //   itemsPerPage: this.maxSize,
          //   currentPage: this.pagination?.currentPage ?? 1 ,
          //   from: this.pagination?.from,
          //   pageSize: this.pagination?.pageSize,
          //   total: this.pagination?.total,
          //   totalPage: this.pagination?.totalPage
          //  };

          this.paginateArgs.itemsPerPage = this.pagination?.pageSize;
          this.paginateArgs.currentPage = this.pagination?.currentPage ?? 1;
          this.paginateArgs.totalItems = this.pagination?.total;
          if (
            this.pagination?.totalPage &&
            this.pagination.totalPage > this.thispage
          ) {
            this.pagination.currentPage = this.thispage;
          } else {
            if (this.pagination) {
              this.pagination.currentPage = 1;
            }
          }

          /*
          this.total = pagination.total ?? 0; // 獲取 total 屬性，如果不存在則默認為 0
          if (typeof this.total !== 'undefined') {
            this.unreadService.promotionUnreadSubject.next(this.total);
          } else {
            // 處理 total 為 undefined 的情況
          }
          */
          /*
          transactionDate: '2022/09/21',
          no: 'BN2209208388',
          freePoints: '+400',
          usedPoints: '',
          status: '待生效',
          releaseDate: '2022/09/21',
          expirationDate: '2022/12/21',
          dividendDetails: '說明',
          active!: string;
          expireSoon!: string;
          inActive!: string;
          used!: string;
          */
          const MainMapper = (mainData: any) => ({
            transactionDate:
              mainData.creationDate == null
                ? ''
                : moment(mainData.creationDate).format('YYYY/MM/DD'),
            no: mainData.origSysDocumentRef,
            freePoints: mainData.transactionQty,
            usedPoints: mainData.usedQty,
            status:
              BonusStatusName[
                mainData.bonusStatus as keyof typeof BonusStatusName
              ], // 進行類型斷言
            releaseDate:
              mainData.releaseDate == null
                ? ''
                : moment(mainData.releaseDate).format('YYYY/MM/DD'),
            effectiveDate:
              mainData.effectiveDate == null
                ? ''
                : moment(mainData.effectiveDate).format('YYYY/MM/DD'),
            dividendDetails: '說明',
            bonusName: mainData.bonusName, //來源說明
            origSysDocumentRef: mainData.origSysDocumentRef, //來源名稱
            orderNumber: mainData.orderNumber, //來源編號
            bonusPointResult: mainData.bonusPointResult, //交易點數
          });
          if (Array.isArray(response.result.details)) {
            this.dataSource = response.result.details.map(MainMapper);
          }
        })
      )
      .subscribe();
  }
  loadContentManagement2() {
    this.filterSub = combineLatest([
      this.filterService.filterParams$,
      // this.status$,
    ])
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          // this.initialTable();
        }),
        switchMap(([filter]) => {
          // 調用 getAwardLists 函數，注意添加組織ID參數以及篩選條件
          return this.productService.getBonus(this.dealerView).pipe(
            catchError(() => {
              // 處理 API 錯誤並繼續操作
              return of();
            })
          );
        }),
        tap((response: any) => {
          this.active = response.result?.active;
          this.expireSoon = response.result?.expireSoon;
          this.inActive = response.result?.inActive;
          this.used = response.result?.used;
          this.expireSoonList = response.result?.expireSoonList;
        })
      )
      .subscribe();
  }

  /** open 即將到期紅利 modal */
  popModal(): void {
    if (this.expireSoon <= 0) return;

    const modelOption = {
      modelName: 'bonus-due',
      config: {
        data: {
          title: '30天內到期紅利',
          StyleMargin: '0px',
          contentHeight: 'calc(100% - 60px)',
          expireSoonList: this.expireSoonList
        },
        width: '500px',
        height: '636px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: '',
      },
    };
    this.dialogservice
      .openLazyDialog(modelOption.modelName, modelOption.config)
      .then((ref) => {
        ref.afterClosed().subscribe();
      });
  }

  /** open 紅利詳情 modal */
  bonusDetailModal(value: any): void {
    const modelOption = {
      modelName: 'bonus-detail',
      config: {
        data: {
          title: '紅利詳情',
          StyleMargin: '0px',
          contentHeight: 'calc(100% - 60px)',
          bonusName: value.row.bonusName, //來源說明
          origSysDocumentRef: value.row.origSysDocumentRef, //來源名稱
          orderNumber: value.row.orderNumber, //來源編號
          bonusPointResult: value.row.bonusPointResult, //交易點數
        },
        width: '500px',
        height: '298px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: '',
      },
    };
    this.dialogservice
      .openLazyDialog(modelOption.modelName, modelOption.config)
      .then((ref) => {
        ref.afterClosed().subscribe();
      });
  }

  /** 分頁切換 */
  onPageChange(page: number): void {
    this.filterService.pageChange({
      page: page,
      pageSize: this.pagination?.pageSize!,
    });
  }

  pageSizeChange($event: number) {
    this.maxSize = $event;
    this.selectedPageSize = $event;
    this.dataChange.emit({ pageSize: $event });
    this.filterService.pageChange({
      page: 1,
      pageSize: this.selectedPageSize,
    });
  }
}
