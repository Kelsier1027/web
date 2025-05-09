/** --------------------------------------------------------------------------------
 *-- Description：取消訂單 / Message box
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { DialogService, LayoutService } from 'src/app/shared/services';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-cancel-order-dialog',
  templateUrl: './cancel-order-dialog.component.html',
  styleUrls: ['./cancel-order-dialog.component.scss'],
})
export class CancelOrderDialogComponent implements OnInit {
[x: string]: any;

@Output()
cancelComment = new EventEmitter();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CancelOrderDialogComponent>,
    private dialogservice:DialogService
  ) {}

  form = {
    commentInfo: {
      comment: '',
    },
  };
  error: {
    commentInfo: {
      comment: string;
    };
  } = {
    commentInfo: {
      comment: '',
    },
  };
  ngOnInit(): void {}

  cancel(){
    this.dialogservice.closeAll();
  }
  cancelPreOrder(){
    if(this.validateDeliveryInfo()){
      this.dialogRef.close({ text: this.form.commentInfo.comment, isCanceled: true});
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
  }
  validateDeliveryInfo() {
    const comment = this.form.commentInfo.comment;
    this.error.commentInfo['comment'] =
      !comment || comment.length == 0 ? '必填欄位' : '';

    return this.form.commentInfo['comment'].length != 0;
  }
}
