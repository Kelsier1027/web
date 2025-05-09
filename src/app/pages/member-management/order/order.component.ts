/** --------------------------------------------------------------------------------
 *-- Description： 訂單查詢
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { DialogService, LayoutService } from 'src/app/shared/services';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MemberService } from 'src/app/services';
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
  take,
  tap,
} from 'rxjs';
import * as moment from 'moment';
import { DynamicFormValue, GroupOrder, Order, PreOrderList, User } from 'src/app/models';
import { ResponseCode } from 'src/app/enums';
import { Pagination } from 'src/app/core/model';
import { FilterService } from 'src/app/shared/services/filter.service';
import { HttpEvent, HttpResponse } from '@angular/common/http';
import { response } from 'express';
import { start } from 'repl';
import { ActivatedRoute } from '@angular/router';
import { URL_UTIL } from 'src/app/shared/utils/urlUtilities';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  providers: [FilterService],
})
export class OrderComponent implements OnInit, OnDestroy {
  filterForm!: FormGroup;
  dataSource!: any;
  groupDataSource!: any;
  preOrderDataSource!: any;
  pagination?: Pagination;
  groupPagination?: Pagination;
  preOrderPagination?: Pagination;
  groupPaginateArgs: any = {
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0,
  };
  preOrderPaginateArgs: any = {
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0,
  };
  noticationData = {
    title: '注意事項',
    list: [
      '採購清單編號 <span class="span-purchase text-bold">『P』</span>開頭為iOrder下單，其它為業務人員接單，若訂單內容有任何疑問請洽業務人員。',
      '出貨單號後<span class="text-bold">顯示 <span class="span-sign">[簽]</span></span>：該筆訂單簽收單已回傳 / <span class="text-bold">未顯示 <span class="span-sign">[簽]</span></span>：該筆訂單簽收單未回傳。',
    ],
  };
  thispage=1;
  filterSub = new Subscription();
  orderList!: Order[];
  groupOrderList!: GroupOrder[];
  preOrderList!: PreOrderList[];
  userList!: User[];
  tabIndexSubject = new BehaviorSubject<number>(1);
  tabIndex$ = this.tabIndexSubject.asObservable();
  tabIndex!: number;
  perPageCount: string = "10";
  dealerView: string | null = null;
  initialTabIndex: number = 0;


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
      groupBuyStatus: '',
      preorderStatus:'',
      status: '',
      startDate: '',
      endDate: '',
      sortField: '',
      sortOrder: '',
      keyword: '',
      dealerView: this.dealerView
    });
  }

  ngOnInit(): void {
    // TODO 團購紀錄 預購紀錄
    this.filterForm = this.fb.group({
      groupBuyStatus: [''],
      preorderStatus:[''],
      status: [''],
      startDate: [''],
      endDate: [''],
      sortField: [''],
      sortOrder: [''],
      keyword: [''],
      dealerView: [this.dealerView]
    },
      {validators: [
        // 驗證結束日期 >= 開始日期
        (group: AbstractControl): ValidationErrors | null => {
          const startDate = group.get('startDate')?.value;
          const endDate = group.get('endDate')?.value;

          if (!startDate || !endDate)
            return null;

          if (new Date(startDate) <= new Date(endDate))
            return null;

          return { dateRange : true };
      }
    ]}
    );

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

    // 跳轉過來時可以在網址上設定 params 指定要到團購或預購
    this.route.queryParams
    .pipe(
      take(1),
      tap((p) => {
        if (!!p['groupBuy']) {
          this.onTabChange(2);
          this.initialTabIndex = 1;
        }

        if (!!p['preOrder']) {
          this.onTabChange(3);
          this.initialTabIndex = 2;
        }
      })
    )
    .subscribe();

    this.filterService.filterChange(this.filterForm.value);
    this.filterSub = this.filterService.filterParams$
      .pipe(
        switchMap((param) =>
          this.memberService.getOrder(param).pipe(
            catchError(() => {
              // handle api error and continue operation
              return of();
            })
          )
        ),
        tap((res) => {
          if (res.responseCode === ResponseCode.Success) {
            this.userList = res.result.order.userList;
            this.orderList = res.result.order.orderList;

            this.pagination = res.result.pagination;
            if(this.pagination.totalPage>this.thispage)
            {
              this.pagination.currentPage=this.thispage;
            }
            this.dataSource = this.orderList
              ? this.orderList.map((item) => {
                  return {
                    creationDate: item.creationDate,
                    orderStatus: item.orderStatus,
                    orderNumber: item.orderNumber,
                    shipNumber: item.shipNumber,
                    subInventory: item.subInventory,
                    poNo: item.poNo,
                    purchaseNumber: item.purchaseNumber,
                    amountWithoutTax: item.amountWithoutTax,
                    buyerName: item.buyerName,
                    deliveryCompany: item.deliveryCompany,
                  };
                })
              : [];
          }
        })
      )
      .subscribe();

      this.filterSub = this.filterService.filterParams$
        .pipe(
          switchMap((param) =>
            this.memberService.getOrdergroupBuy(param).pipe(
              catchError(() => {
                return of();
              })
            )
          ),
          tap((res) => {
            if(res.responseCode === ResponseCode.Success) {
              this.groupOrderList = res.result.data;
              this.pagination = res.result.pagination;
              if(this.pagination) {
                this.pagination.pageSize = 10;
              }
              if(this.pagination.totalPage > this.thispage) {
                this.pagination.currentPage = this.thispage;
              }
              this.groupPaginateArgs.totalItems = this.pagination.total;
              this.groupPaginateArgs.currentPage = this.thispage;
              this.groupDataSource = this.groupOrderList ?
              this.groupOrderList.map((item) => {
                return {
                  orderDate: item.orderDate,
                  groupBuyStatusName: item.groupBuyStatusName,
                  orderStatus: item.orderStatus,
                  shipNumber: item.shipNumber,
                  purchaseNo: item.purchaseNo,
                  itemName: item.itemName,
                  amountWithoutTax: item.amountWithoutTax,
                  shippingStartDate: item.shippingStartDate,
                  shippingEndDate: item.shippingEndDate,
                  invoiceNo: item.invoiceNo,
                  invoiceFile: item.invoiceFile,
                  canCancel: item.canCancel,
                }
              }) : [];
            }
          })
        )
        .subscribe();

        this.filterSub = this.filterService.filterParams$
        .pipe(
          switchMap((param) => {
            if (param.status)  param.preorderStatus = param.status;

            return this.memberService.getPreOrderList(param).pipe(
              catchError(() => {
                return of();
              })
            )
          }
          ),
          tap((res) => {
            if(res.responseCode === ResponseCode.Success) {
              this.preOrderList = res.result.data;
              this.preOrderPagination = res.result.pagination;
              this.preOrderPaginateArgs.totalItems = this.preOrderPagination.total;
              this.preOrderPaginateArgs.currentPage = this.thispage;
              this.preOrderDataSource = this.preOrderList.map((item) => {
                return {
                  orderDate: item.orderDate,
                  preorderStatus: item.preorderStatus,
                  preorderStatusName: item.preorderStatusName,
                  orderStatus: item.orderStatus,
                  shipNumber: item.shipNumber,
                  purchaseNo: item.purchaseNo,
                  itemName: item.itemName,
                  amountWithoutTax: item.amountWithoutTax,
                  shippingDate: item.shippingDate,
                  invoiceNo: item.invoiceNo,
                  invoiceFile: item.invoiceFile,
                  canCancel: item.canCancel,
                }
              })
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
                (item[0] === 'startDate' || item[0] === 'endDate') &&
                  (item[1] = moment(item[1]).format('YYYY/MM/DD'));
                return { ...item, [item[0]]: item[1] };
              })
          );
          this.filterService.filterChange(filter);
          this.filterService.pageChange({
            page: this.thispage,
            pageSize: Number(this.perPageCount),
          })
        }
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
          // 检查 filter 中的 page 和 pageSize 是否等于 1 和 10，如果是则移除它们
          if (filter.page === 1 && filter.pageSize === 10) {
            const { page, pageSize, ...newFilter } = filter;
            filter = newFilter;
          }
          const { page, pageSize, ...newFilter } = filter;
            filter = newFilter;

          // 调用 API 并传递筛选条件
          return this.memberService.getOrder(filter).pipe(
            catchError(() => {
              // 处理 API 错误并继续操作
              return of();
            })
          );
        }),
        tap((response: any) => {
          const pagination = response.result.pagination ?? {}; // 獲取 pagination 對象，如果不存在則默認為一個空對象
          this.pagination = pagination;

            //this.pagination = res.result.pagination;
            this.userList = response.result.order.userList;
            this.orderList = response.result.order.orderList;

            this.dataSource = this.orderList
              ? this.orderList.map((item) => {
                  return {
                    creationDate: item.creationDate,
                    orderStatus: item.orderStatus,
                    orderNumber: item.orderNumber,
                    shipNumber: item.shipNumber,
                    subInventory: item.subInventory,
                    poNo: item.poNo,
                    purchaseNumber: item.purchaseNumber,
                    amountWithoutTax: item.amountWithoutTax,
                    buyerName: item.buyerName,
                  };
                })
              : [];
          const MainMapper = (mainData: any) => ({
            creationDate: moment(mainData.creationDate).format('YYYY/MM/DD'),
            orderStatus: mainData.orderStatus,
            orderNumber: mainData.orderNumber,
            shipNumber: mainData.shipNumber,
            poNo: mainData.poNo,
            purchaseNumber: mainData.purchaseNumber,
            amountWithoutTax: mainData.amountWithoutTax,
            buyerName: mainData.buyerName,


          });
          if (Array.isArray(response.result.order.orderList)) {
            this.dataSource = response.result.order.orderList.map(MainMapper);
          }

        })

      )
      .subscribe();
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
    this.thispage=page;
    this.filterService.pageChange({
      page: page,
      pageSize: this.pagination?.pageSize!,
    });
  }

  onPageCountChange(pageCount: any) {
    this.perPageCount = pageCount.value;
    if(this.pagination) {
      this.pagination.pageSize = pageCount.value;
    }
    if(this.tabIndex === 2) {
      this.groupPaginateArgs.itemsPerPage = pageCount.value;
      this.filterService.pageChange({
        page: this.groupPaginateArgs.currentPage,
        pageSize: pageCount.value,
      });
    }
    if(this.tabIndex === 3) {
      this.preOrderPaginateArgs.itemsPerPage = pageCount.value;
      this.filterService.pageChange({
        page: this.preOrderPaginateArgs.currentPage,
        pageSize: pageCount.value,
      });
    }
  }

  /** 匯出 excel */
  exportExcel(tabIndex : number): void {
    if(tabIndex == 1) {
      if (this.filterForm.valid) {
        const param = Object.fromEntries(
          Object.entries(this.filterForm.value)
            .filter((item) => item[1] !== '')
            .map((item) => {
              (item[0] === 'startDate' || item[0] === 'endDate') &&
                (item[1] = moment(item[1] as moment.Moment).format('YYYY/MM/DD'));
              return { ...item, [item[0]]: item[1] };
            })
        );

        this.memberService
          .exportOrderExcel(param as typeof this.filterForm.value)
          .subscribe((response: Blob) => {
            const blob: Blob = response;
            const a = document.createElement('a');
            a.download = 'OrderList.xlsx';
            a.href = window.URL.createObjectURL(blob);
            a.click();
          });
      }
    } else if(tabIndex === 2) {
      if (this.filterForm.valid) {
        const param = Object.fromEntries(
          Object.entries(this.filterForm.value)
            .filter((item) => item[1] !== '')
            .map((item) => {
              (item[0] === 'startDate' || item[0] === 'endDate') &&
                (item[1] = moment(item[1] as moment.Moment).format('YYYY/MM/DD'));
              return { ...item, [item[0]]: item[1] };
            })
        );

        this.memberService
          .exportGroupOrderExcel(param as typeof this.filterForm.value)
          .subscribe((response: Blob) => {
            const blob: Blob = response;
            const a = document.createElement('a');
            a.download = 'GroupOrderList.xlsx';
            a.href = window.URL.createObjectURL(blob);
            a.click();
          });
      }
    }
    else if(tabIndex == 3){
      if (this.filterForm.valid) {
        this.filterForm.value.preorderStatus = this.filterForm.value.status
        const param = Object.fromEntries(
          Object.entries(this.filterForm.value)
            .filter((item) => item[1] !== '')
            .map((item) => {
              (item[0] === 'startDate' || item[0] === 'endDate') &&
                (item[1] = moment(item[1] as moment.Moment).format('YYYY/MM/DD'));
              return { ...item, [item[0]]: item[1] };
            })
        );

        this.memberService
          .getExportPreOrderList(param as typeof this.filterForm.value)
          .subscribe((response: Blob) => {
            const blob: Blob = response;
            const a = document.createElement('a');
            a.download = 'OrderList.xlsx';
            a.href = window.URL.createObjectURL(blob);
            a.click();
          });
      }

    }
  }

  /** open 發票寄送 modal */
  handleSendModal(index: number): void {
    const data = this.orderList[index];
    const modelOption = {
      modelName: 'invoice-delivery',
      config: {
        data: {
          title: '發票寄送',
          invoiceNo: data.invoiceNo,
          creationDate: data.creationDate,
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

  /** open 訂單明細 modal */
  handleShippingNoModal(index: number): void {
    const data = this.orderList?.[(this.pagination?.from ?? 0) + index-1];
    const modelOption = {
      modelName: 'shipping-no',
      config: {
        data: {
          ...data,
          title: '訂單編號' + ' ' + data.orderNumber,
        },
        width: '784px',
        height: '298px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: 'shipping-no-panel',
      },
    };
    this.dialogservice.openLazyDialog(
      modelOption.modelName,
      modelOption.config
    );
  }

  async opencancelPreOrder(purchaseNo:string){
    const modelOption = {
      modelName: 'cancel-order-dialog',
      config: {
        data: {
          title: '申請取消訂單',
        },
        width: '500px',
        height: '300px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
      },
    };
    this.dialogservice.openCancelOrderDialog(
      modelOption.modelName,
      modelOption.config
    ).then(value => {
      this.cancelPreOrder(purchaseNo,value);
    });
  }
  cancelPreOrder(purchaseNo:string,result: any){
    if(result != undefined && result != '' && result != null){
    const param = {'purchaseNo':purchaseNo,'cancelReason':result.text};
    this.memberService.cancelPreOrder(param).subscribe((response: any) => {
      if(response.responseCode === ResponseCode.Success) {
      this.filterSub = this.filterService.filterParams$
        .pipe(
          switchMap((param) =>
            this.memberService.getPreOrderList(param).pipe(
              catchError(() => {
                return of();
              })
            )
          ),
          tap((res) => {
            if(res.responseCode === ResponseCode.Success) {
              this.preOrderList = res.result.data;
              this.preOrderPagination = res.result.pagination;
              this.preOrderDataSource = this.preOrderList.map((item) => {
                return {
                  orderDate: item.orderDate,
                  preorderStatus: item.preorderStatus,
                  preorderStatusName: item.preorderStatusName,
                  orderStatus: item.orderStatus,
                  shipNumber: item.shipNumber,
                  purchaseNo: item.purchaseNo,
                  itemName: item.itemName,
                  amountWithoutTax: item.amountWithoutTax,
                  shippingDate: item.shippingDate,
                  invoiceNo: item.invoiceNo,
                  invoiceFile: item.invoiceFile,
                  canCancel: item.canCancel,
                }
              })
            }
          })
        )
        .subscribe();
      }
    });
    }
  }
  cancelGroupOrder(purchaseNo: string) {
    const config = {
      width: '500px',
      height: '300px',
      hasBackdrop: true,
      autoFoucs: false,
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '300ms',
      panelClass: 'changeDialog',
      data: {
        purchaseId: purchaseNo,
        getOrderDetail: this.onTabChange(2),
        type: "GroupOrder",
      }
    };
    this.dialogservice.openLazyDialog('order-cancel-reason', config);
  }
  /** 頁籤切換 */
  onTabChange(tabIndex: number): void {
    this.tabIndexSubject.next(tabIndex);
    this.perPageCount = '10';
    this.thispage = 1;
    this.filterService.pageChange({
      page: 1,
      pageSize: 10,
    })
    this.tabIndex = tabIndex;
  }

  checkInvoiceFileNotIsnull(index: number): string {
    const invoiceFile = this.preOrderList[index]?.invoiceFile;
    return invoiceFile !== null ? invoiceFile : 'ss';
  }

  downloadInvoiceFile(invoiceFile: string, index: number): void {
  if(invoiceFile !== ''){
    this.memberService
      .getInvoiceFile({ invoiceFile: invoiceFile })
      .subscribe((response: any) => {
        if (response && response.responseCode !== '9999' && response instanceof Blob) {
          const blob: Blob = response;
          const a = document.createElement('a');
          a.download = 'InvoiceFile.pdf';
          a.href = window.URL.createObjectURL(blob);

          // 點擊事件
          a.click();
        }
      });
  }
}

// 檢查檔案是否有效的方法
isValidInvoice(response: any): boolean {
  return response && response.responseCode !== '9999' && response instanceof Blob;
}

  isDealerViewMode(): boolean {
    return !!this.dealerView?.length ?? false;
  }
}
