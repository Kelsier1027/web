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
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { F } from 'ramda';
import {
  catchError,
  filter,
  map,
  of,
  Subscription,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { Pagination } from 'src/app/core/model';
import { ResponseCode } from 'src/app/enums';
import { Bill, DynamicFormValue, User } from 'src/app/models';
import { MemberService } from 'src/app/services';
import { DialogService } from 'src/app/shared/services';
import { FilterService } from 'src/app/shared/services/filter.service';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { POP_UP } from 'src/app/shared/utils/popUpUtilities';
import { URL_UTIL } from 'src/app/shared/utils/urlUtilities';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss'],
  providers: [FilterService],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class BillComponent implements OnInit, OnDestroy {
  filterForm!: FormGroup;
  expand!: boolean[];
  dataSource!: any;
  pagination?: Pagination;
  filterSub = new Subscription();
  billList!: Bill[];
  userList!: User[];
  dealerView: string | null = null;

  constructor(
    public layoutService: LayoutService,
    public dialogservice: DialogService,
    private fb: FormBuilder,
    private filterService: FilterService,
    private memberService: MemberService,
    private route: ActivatedRoute
  ) {
  }

  /** reset form */
  reset() {
    this.filterForm.reset({
      payableDate: '',
      dueDate: '',
      keyword: '',
      dealerView: this.dealerView
    });
  }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      payableDate: [''],
      dueDate: [''],
      keyword: [''],
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
    
    this.filterSub = this.filterService.filterParams$
      .pipe(
        switchMap((param) =>
          this.memberService.getBill(param).pipe(
            catchError(() => {
              // handle api error and continue operation
              return of();
            })
          )
        ),
        tap((res) => {
          if (res.responseCode === ResponseCode.Success) {
            this.pagination = res.result.pagination;
            this.userList = res.result.order.userList;
            this.billList = res.result.order.billList;
            this.expand = this.billList.map(() => false);
            this.dataSource = this.billList
              ? this.billList.map((item) => {
                  return {
                    payableDate: item.payableDate,
                    orderNumber: item.orderNumber,
                    shipNumber: item.shipNumber,
                    taxAmount: item.taxAmount,
                    trxAmount: item.trxAmount,
                    trxRemaining: item.trxRemaining,
                    invoiceNo: item.invoiceNo,
                    poNo: item.poNo,
                    buyerName: item.buyerName,
                    dueDate: item.dueDate,
                  };
                })
              : [];
          }
        })
      )
      .subscribe();

    this.filterForm.valueChanges.subscribe((value: DynamicFormValue) => {
      if (this.filterForm.valid) {
          const filter = Object.fromEntries(
            Object.entries(value)
              .filter((item) => item[1] !== '')
              .map((item) => {
                if(item[0] === 'payableDate' || item[0] === 'dueDate') {
                  const date = moment(item[1]);
                  if(date.isValid()){
                    item[1] = date.format('YYYY/MM/DD');
                  }else{
                    item[1] = "";
                  }
                }
                return { ...item, [item[0]]: item[1] };
              })
          );
          this.filterService.filterChange(filter);
      }
    });
  }

  ngOnDestroy(): void {
    this.filterSub.unsubscribe();
  }

  /** search change */
  onSearchChange(keyword: string): void {
    this.filterForm.patchValue({
      keyword: keyword,
    });
  }

  /** 分頁切換 */
  onPageChange(page: number): void {
    this.filterService.pageChange({
      page: page,
      pageSize: this.pagination?.pageSize!,
    });
  }

  /** handle expand */
  handleExpand(index: number): void {
    this.expand[index] = !this.expand[index];
  }

  /** open 發票寄送 modal */
  handleSendModal(index: number): void {
    const data = this.billList[index];
    const modelOption = {
      modelName: 'invoice-delivery',
      config: {
        data: {
          title: '發票寄送',
          invoiceNo: data.invoiceNo,
          creationDate: data.trxDate,
          userList: this.userList.map((user) => {
            return {
              label: user.role + ' ' + user.lastName + ' ' + user.email,
              value: user.email,
            };
          }),
        },
        width: '500px',
        height: '258px',
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
  }

  /** 匯出 excel */
  exportExcel(): void {
    if (this.filterForm.valid) {
      const param = Object.fromEntries(
        Object.entries(this.filterForm.value)
          .filter((item) => item[1] !== '')
          .map((item) => {
            (item[0] === 'payableDate' || item[0] === 'dueDate') &&
              (item[1] = moment(item[1] as moment.Moment).format('YYYY/MM/DD'));
            return { ...item, [item[0]]: item[1] };
          })
      );

      this.memberService
        .exportBillExcel(param as typeof this.filterForm.value)
        .subscribe((response: Blob) => {
          const blob: Blob = response;
          const a = document.createElement('a');
          a.download = 'BillList.xlsx';
          a.href = window.URL.createObjectURL(blob);
          a.click();
        });
    }
  }

  /** open 預付清單 modal */
  handlePrepayModal(): void {
    this.memberService
      .getPrepay()
      .pipe(
        filter((res) => res.responseCode === ResponseCode.Success),
        map((res) => {
          return {
            modelName: 'prepay',
            config: {
              data: {
                dataSource: res.result,
                serverTime: res.serverTime,
                title: '預付清單',
              },
              width: '784px',
              height: '500px',
              hasBackdrop: true,
              autoFocus: false,
              enterAnimationDuration: '300ms',
              exitAnimationDuration: '300ms',
              panelClass: res.result.length
                ? 'prepay-panel'
                : 'no-data-prepay-panel',
            },
          };
        }),
        switchMap((modelOption) =>
          this.dialogservice.openLazyDialog(
            modelOption.modelName,
            modelOption.config
          )
        )
      )
      .subscribe();
  }

  getInvoiceFile(invoiceFile: string): void {
    this.memberService.getInvoiceFile({invoiceFile: invoiceFile}, false)
      .pipe(take(1),
            tap((response) => {
              const blob: Blob = response;
              const a = document.createElement('a');
              a.download = invoiceFile.split('/').pop() ?? '';
              a.href = window.URL.createObjectURL(blob);
              a.click();
            }),
            catchError(() => {
              POP_UP.showMessage(this.dialogservice, 
                '發票已超過查詢期限', 
                '發票證明聯PDF時效已超過（7日），如需電子發票證明聯，請改按「寄送」按鍵。');
              return of()}
            ))
      .subscribe();
  }
}
