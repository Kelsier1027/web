/** --------------------------------------------------------------------------------
 *-- Description： 獎勵活動達成禮
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */

import { DatePipe } from '@angular/common';
import { LayoutService } from 'src/app/shared/services';
import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { Pagination } from 'src/app/core/model';
import { MemberService } from 'src/app/services';
import {
  catchError,
  of,
  Subscription,
  switchMap,
  tap,
  BehaviorSubject,
  combineLatest,
} from 'rxjs';
import { ResponseCode } from 'src/app/enums';
import { Gift } from 'src/app/models';
import { FilterService } from 'src/app/shared/services/filter.service';
import { Options } from 'src/app/shared/models';
@Component({
  selector: 'app-prize',
  templateUrl: './prize.component.html',
  styleUrls: ['./prize.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
  providers: [FilterService, DatePipe,FormGroupDirective],
})
export class PrizeComponent implements OnInit, OnDestroy {
  @Output()
  dataChange = new EventEmitter();
  maxSize: number = 10;
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
  paginateArgs: any = {
    itemsPerPage: 10,
    currentPage: this.pagination?.currentPage ?? 1,
    totalItems: 0,
  };
  filterForm!: FormGroup;
  dataSource!: any;
  pagination?: Pagination;
  filterSub = new Subscription();
  giftList!: Gift[];
  tabIndexSubject = new BehaviorSubject<number>(1);
  tabIndex$ = this.tabIndexSubject.asObservable();
  tabIndex!: number;
  unclaimed!: number;

  constructor(
    public layoutService: LayoutService,
    private filterService: FilterService,
    private memberService: MemberService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.filterSub = combineLatest([
      this.filterService.filterParams$,
      this.tabIndex$,
    ])
      .pipe(
        tap(([, tabIndex]) => (this.tabIndex = tabIndex)),
        switchMap(([param, tabIndex]) => {
          if (tabIndex === 1) {
            return this.memberService.getGiftUnclaimed(param).pipe(
              catchError(() => {
                // handle api error and continue operation
                return of();
              })
            );
          } else {
            return this.memberService.getGiftRecord(param).pipe(
              catchError(() => {
                // handle api error and continue operation
                return of();
              })
            );
          }
        }),
        tap((res) => {
          if (res.responseCode === ResponseCode.Success) {
            this.pagination = res.result.pagination;
            this.paginateArgs.itemsPerPage = this.pagination.pageSize;
            this.paginateArgs.currentPage = this.pagination.currentPage ?? 1;
            this.paginateArgs.totalItems = this.pagination.total;
            this.tabIndex === 1 && (this.unclaimed = this.pagination.total);
            this.giftList = res.result.giftList;
            this.dataSource = this.giftList
              ? this.tabIndex === 1
                ? this.giftList
                : this.giftList.map((gift) => {
                    const startDate = this.datePipe.transform(
                      gift.startDate,
                      'yyyy/MM/dd'
                    );
                    const endDate = this.datePipe.transform(
                      gift.endDate,
                      'yyyy/MM/dd'
                    );
                    return {
                      ...gift,
                      activityDate:
                        startDate && endDate ? startDate + '~' + endDate : '',
                    };
                  })
              : [];
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.filterSub.unsubscribe();
  }

  /** 分頁切換 */
  onPageChange(page: number): void {
    this.filterService.pageChange({
      page: page,
      pageSize: this.pagination?.pageSize!,
    });
  }

  /** 頁籤切換 */
  onTabChange(tabIndex: number): void {
    this.tabIndexSubject.next(tabIndex);
  }
  pageSizeChange($event: number) {
    this.maxSize=$event;
    this.selectedPageSize = $event;
    this.dataChange.emit({ pageSize: $event });
    this.filterService.pageChange({
      page: 1,
      pageSize: this.selectedPageSize,
    });
  }
}
