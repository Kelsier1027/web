/** --------------------------------------------------------------------------------
 *-- Description： 貨到通知
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTooltip } from '@angular/material/tooltip';
import { catchError, of, Subscription, switchMap, tap } from 'rxjs';
import { Pagination } from 'src/app/core/model';
import { ResponseCode } from 'src/app/enums';
import { MemberService } from 'src/app/services';
import { DialogService, LayoutService } from 'src/app/shared/services';
import { FilterService } from 'src/app/shared/services/filter.service';

@Component({
  selector: 'app-stock-notice',
  templateUrl: './stock-notice.component.html',
  styleUrls: ['./stock-notice.component.scss'],
  providers: [FilterService],
})
export class StockNoticeComponent implements OnInit, OnDestroy {
  dataSource!: any;
  filterForm!: FormGroup;
  pagination?: Pagination;
  filterSub = new Subscription();

  tooltip!: MatTooltip;
  constructor(
    public dialogservice: DialogService,
    public layoutService: LayoutService,
    private fb: FormBuilder,
    private filterService: FilterService,
    private memberService: MemberService
  ) {}

  reset() {
    this.filterForm.reset({
      processStatus: '',
      notificationStatus: '',
      itemNumber: '',
    });
  }
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (this.tooltip) {
      this.tooltip.hide();
    }
  }
  toggleToolTip(tooltip : MatTooltip){
    this.tooltip = tooltip;
    if(this.tooltip){
      this.tooltip.show();
    }
  }
  ngOnInit(): void {
    this.filterForm = this.fb.group({
      processStatus: [''],
      notificationStatus: [''],
      itemNumber: [''],
    });

    this.filterSub = this.filterService.filterParams$
      .pipe(
        switchMap((param) =>
          this.memberService.getItemArriveNotification(param).pipe(
            catchError(() => {
              // handle api error and continue operation
              return of();
            })
          )
        ),
        tap((res) => {
          if (res.responseCode === ResponseCode.Success) {
            this.pagination = res.result.pagination;
            this.dataSource = res.result.itemArrivedNotificationVM;
          }
        })
      )
      .subscribe();

    this.filterForm.valueChanges.subscribe((value) => {
      const filter = Object.fromEntries(
        Object.entries(value).filter((item) => item[1] !== '')
      );
      this.filterService.filterChange(filter);
    });
  }
  
  ngOnDestroy(): void {
    this.filterSub.unsubscribe();
  }

  /** search change */
  onSearchChange(keyword: string): void {
    this.filterForm.patchValue({
      itemNumber: keyword,
    });
  }

  /** 分頁切換 */
  onPageChange(page: number): void {
    this.filterService.pageChange({
      page: page,
      pageSize: this.pagination?.pageSize!,
    });
  }
}
