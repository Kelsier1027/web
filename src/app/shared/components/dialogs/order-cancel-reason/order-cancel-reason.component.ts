import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, of, take } from 'rxjs';
import { ResponseCode } from 'src/app/enums';
import { MemberService } from 'src/app/services';
import { DialogService } from 'src/app/shared/services';

@Component({
  selector: 'app-order-cancel-reason',
  templateUrl: './order-cancel-reason.component.html',
  styleUrls: ['./order-cancel-reason.component.scss'],
})
export class OrderCancelReasonComponent {
  headerConfig = {
    title: '申請取消訂單',
    displayFooter: true,
    confirmButton: '確認',
    cancelButton: '取消',
    async: true
  };
  textareaValue: string = '';
  isNotInput: boolean = false;
  isSuccessful: boolean = false;
  isLoading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<OrderCancelReasonComponent>,
    private memberService: MemberService,
    public dialogservice: DialogService,
  ) {}

  hintDialog() {
    const modelOption = {
      modelName: 'black-text-dialog',
      config: {
        data: {
          text: '已收到貴公司取消訂單申請',
        },
        width: '368px',
        height: '142px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: 'blackDialog',
      },
    };

    this.dialogservice.openLazyDialog(
      modelOption.modelName,
      modelOption.config
    );
  }

  confirm() {
    if (!this.textareaValue) {
      this.isNotInput = true;
      return;
    }

    let api;
    this.isLoading = true;
    if(this.data.type === 'GroupOrder') {
      api = this.memberService.cancelOrdergroupBuy({
        purchaseNo: this.data.purchaseId,
        cancelReason: this.textareaValue,
      })
    } else if(this.data.type === 'PreOrder') {
      api = this.memberService.cancelPreOrder({
        purchaseNo: this.data.purchaseId,
        cancelReason: this.textareaValue,
      })
    } else {
      api = this.memberService.cancelOrder({
        purchaseId: this.data.purchaseId,
        cancelReason: this.textareaValue,
      })
    }
    api
    .pipe(take(1),
          catchError(() => {
            this.isLoading = false;
            return of();
          })
    )
    .subscribe((res) => {
      this.isLoading = false;
      if (res.responseCode === ResponseCode.Success) {
        this.isSuccessful = true;
        this.dialogRef?.close(this.isSuccessful);
        this.hintDialog();
        setTimeout(() => this.data.getOrderDetail(), 5000);
      }
    });
  }
}
