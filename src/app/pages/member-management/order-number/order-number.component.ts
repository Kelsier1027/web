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
import { MemberService } from 'src/app/services';
import { Component, OnInit, Sanitizer } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { DialogService } from 'src/app/shared/services';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, firstValueFrom, lastValueFrom, map, Observable, switchMap, take, tap } from 'rxjs';
import { Order, OrderDetail, CheckOrderCancel } from 'src/app/models';
import { ResponseCode } from 'src/app/enums';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { URL_UTIL } from 'src/app/shared/utils/urlUtilities';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { EnvConfig } from 'src/app/app.module';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-order-number',
  templateUrl: './order-number.component.html',
  styleUrls: ['./order-number.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class OrderNumberComponent implements OnInit {
  thisisAlreadyCancelled!: boolean;
  purchaseId!: number;
  thispurchaseId!: number;
  apiResponse!: Observable<any>;
  groupApiResponse!: Observable<any>;
  apiResponse2!: Observable<CheckOrderCancel>;
  order!: Order;
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  dealerView: string | null = null;
  proofImages: string[] = [];
  disableCancelButton: boolean = false;

  sendLaterText: string = "此商品下單時缺貨，到貨後 iOrder 將自動通知您";

  constructor(
    public layoutService: LayoutService,
    public dialogservice: DialogService,
    private location: Location,
    private route: ActivatedRoute,
    private memberService: MemberService,
    private envConfig: EnvConfig,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.thisisAlreadyCancelled = false;
    this.apiResponse = this.getOrderDetail();

    // dealerView(經銷商檢視) 為 queryParam
    // 避免 param 改變但元件未重新初始化導致漏掉處理
    // 所以採訂閱方式
    this.route.queryParams
      .pipe(
        take(1),
        tap((p) => {
          this.dealerView = URL_UTIL.getDealerView(p);
        })
      )
      .subscribe();
  }

  populateProofImages(proofPath: string): void {
    const apiBase = this.envConfig.baseApiUrl;
    const route = '/api/web/customer/member/order/deliveryProof';
    const params = new HttpParams()
                       .set('deliveryProofFile', proofPath);

    const url = new URL(route, apiBase);

    this.proofImages.push(url.toString() + '?' + params.toString());
  }

  getOrderDetail(): Observable<any> {
    this.proofImages = [];
    if (this.orderType === 'GroupOrder') {
      this.route.params.subscribe(params => {
        this.purchaseId = params['id'];
      })
      return this.route.paramMap.pipe(
        map((url) => url.get('id')),
        switchMap((purchaseNumber) =>
          this.memberService.getOrderGroupBuyDetail(purchaseNumber!, this.dealerView)
        ),
        map((res) => res.result),
        tap((result) => result.proofList?.map((path: string) => this.populateProofImages(path))),
        map((result) => ({
          ...result,
          tracking: {
            transferedDatetime: result.tracking.TRANSFERED_DATETIME,
            pickDate: result.tracking.PICK_DATE,
            estimateDeliverTime: result.tracking.ESTIMATE_DELIVER_TIME,
            lastUpdatedDate: result.tracking.LAST_UPDATED_DATE,
          }
        }))
      );
    } else if (this.orderType === 'PreOrder') {
      this.route.params.subscribe(params => {
        this.purchaseId = params['id'];
      })
      return this.route.paramMap.pipe(
        map((url) => url.get('id')),
        switchMap((purchaseNo) =>
          this.memberService.getPreOrderInfo(purchaseNo!, this.dealerView)
        ),
        map((res) => res.result),
        tap((result) => result.proofList?.map((path: string) => this.populateProofImages(path))),
        map((result) => ({
          ...result,
          tracking: {
            transferedDatetime: result?.tracking?.TRANSFERED_DATETIME,
            pickDate: result?.tracking?.PICK_DATE,
            estimateDeliverTime: result?.tracking?.ESTIMATE_DELIVER_TIME,
            lastUpdatedDate: result?.tracking?.LAST_UPDATED_DATE,
          }
        }))
      );

    }
    return this.route.paramMap.pipe(
      map((url) => url.get('id')),
      switchMap((purchaseNumber) =>
        this.memberService.getOrder({ keyword: purchaseNumber!, dealerView: this.dealerView })
      ),
      filter((res) => res.responseCode === ResponseCode.Success),
      map((res) => res.result),
      tap((order) => {
        this.order = order.order.orderList[0] ?? { purchaseId: '' };
      }),
      switchMap((order) =>
        this.memberService.getOrderDetail(this.order.purchaseId, this.dealerView)
      ),
      filter((res) => res.responseCode === ResponseCode.Success),
      map((res) => res.result),
      tap((result) => result.proofList?.map((path: string) => this.populateProofImages(path))),
      map((result: any) => ({
        ...result,
        tracking: {
          transferedDatetime: result?.tracking?.TRANSFERED_DATETIME,
          pickDate: result?.tracking?.PICK_DATE,
          estimateDeliverTime: result?.tracking?.ESTIMATE_DELIVER_TIME,
          lastUpdatedDate: result?.tracking?.LAST_UPDATED_DATE,
        },
      }))
    );
  }

  get orderType(): 'GroupOrder' | 'PreOrder' | 'Order' {
    const type = this.route.snapshot.url[0]?.path?.toLowerCase();
    if (type === 'grouporder') return 'GroupOrder';
    if (type === 'preorder') return 'PreOrder';
    return 'Order';
  }
  /** 回上頁 */
  goBack(): void {
    // 有歷史時回上一頁，否則回訂單查詢作為 fallback

    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(["/Member/Order"],
        {queryParams: {
          groupBuy: this.orderType == 'GroupOrder' ? true : null,
          preOrder: this.orderType == 'PreOrder' ? true : null
        }});
    }
  }

  /** 確認是否超過活動期間 超過回傳true */
  checkDeadline(endDate:Date){
    return endDate < new Date();
  }
  /** 匯出序號清單 excel */
  exportSerialListExcel(): void {
    this.memberService
      .exportSerialListExcel(this.order.purchaseId, this.dealerView)
      .subscribe((response: Blob) => {
        const blob: Blob = response;
        const a = document.createElement('a');
        a.download = `序號清單-${this.order.purchaseNumber}.xlsx`;
        a.href = window.URL.createObjectURL(blob);
        a.click();
      });
  }

  /** 下載 click */
  download(url: string): void {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.click();
  }

  /** open 查看序號 modal */
  handleSerialModal(
    inventoryItem: string,
    purchaseNumber: string,
    purchaseId: number,
    serialIds: number[]
  ): void {
    const modelOption = {
      modelName: 'serial-list',
      config: {
        data: {
          title: '查看序號',
          text: '欲查看序號請先輸入iOrder會員密碼。',
          inventoryItem: inventoryItem,
          purchaseNumber: purchaseNumber,
          purchaseId: purchaseId,
          serialIds: serialIds,
          dealerView: this.dealerView,
          StyleMargin: '0px',
        },
        width: '500px',
        minHeight: '274px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: 'apply-to-change-panel',
      },
    };
    this.dialogservice.openLazyDialog(
      modelOption.modelName,
      modelOption.config
    );
  }
  /** 取消訂單驗證 1251*/

  cancelOrderValid(): void {
    if (this.disableCancelButton)
      return;

    this.disableCancelButton = true;
    if(this.orderType != 'GroupOrder' && this.orderType != 'PreOrder') {
    this.memberService
      .getCheckCancel(this.order.purchaseId)
      .subscribe((res) => {
        if (res.responseCode === ResponseCode.Success) {
          this.thisisAlreadyCancelled = res.result.isAlreadyCancelled;
          this.disableCancelButton = true;
        }
        //訂單尚未被取消
        //可繼續往下走 ToDO：取消原因必填
        if (!this.thisisAlreadyCancelled) {
          this.promptCancelReason();
        } //訂單已被其他人取消
        else {
          const modelOption = {
            modelName: 'simple-dialog',
            config: {
              data: {
                title: '取消訂單',
                StyleMargin: '0px',
                message: '此訂單已被其他人取消',
                warning: true,
                displayFooter: true,
                confirmButton: '確認',
                confirm: () => this.getOrderDetail(),
              },
              width: '500px',
              height: '204px',
              hasBackdrop: true,
              autoFocus: false,
              enterAnimationDuration: '300ms',
              exitAnimationDuration: '300ms',
              panelClass: 'changeDialog',
            },
          };

          this.disableCancelButton = true;
          this.dialogservice.openLazyDialog(
            modelOption.modelName,
            modelOption.config
          );
        }
      });
  } else {
    this.promptCancelReason();
  }
  }

  private promptCancelReason() {
    const config = {
      width: '500px',
      height: '300px',
      hasBackdrop: true,
      autoFocus: false,
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '300ms',
      panelClass: 'changeDialog',
      data: {
        purchaseId: this.order.purchaseId,
        type: this.orderType,
      }
    }
    this.dialogservice.openLazyDialog('order-cancel-reason', config)
    .then(d => d.afterClosed()
      .pipe(take(1),
            tap(result => {
              this.disableCancelButton = !!result;
            }))
      .subscribe()
    );
  }

  isUsingDealerView(): boolean {
    return !!this.dealerView?.length;// ?? false;
  }
}
