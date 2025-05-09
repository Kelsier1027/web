/** --------------------------------------------------------------------------------
 *-- Description： dialog service
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/overlay';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
interface Detail {
  itemId?: number;
  itemName: string;
  itemNumber: string;
  description: string;
}
@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  /** open modal */
  openDialog(template?: any, config?: MatDialogConfig<any>) {
    const dialogRef = this.dialog.open(template, config);
    dialogRef.afterClosed().subscribe();
  }

  closeAll() {
    this.dialog.closeAll();
  }

  /** open modal */
  async openLazyDialog(
    dialogName: string,
    config?: MatDialogConfig<any>
  ): Promise<MatDialogRef<any>> {
    const chunk = await import(
      `../components/dialogs/${dialogName}/${dialogName}.component`
    );
    const dialogComponent = Object.values(chunk)[0] as ComponentType<unknown>;
    return this.dialog.open(dialogComponent, config);
  }

  async openCancelOrderDialog(
    dialogName: string,
    config?: MatDialogConfig<any>
  ): Promise<any> {
    const chunk = await import(
      `../components/dialogs/${dialogName}/${dialogName}.component`
    );
    const dialogComponent = Object.values(chunk)[0] as ComponentType<unknown>;

    const dialogRef = this.dialog.open(dialogComponent, config);

    return new Promise((resolve, reject) => {
      dialogRef.afterClosed().subscribe(result => {
        resolve(result);
      }, error => {
        reject(error);
      });
    });
  }
  /** open 貨到通知 modal */
  arrivalNoticeDialog(detail: Detail) {
    const modelOption = {
      modelName: 'arrival-notice',
      config: {
        data: {
          title: '貨到通知',
          StyleMargin: '0px',
          text: '目前庫存已完售 (暫無確切交期)，若有需求請洽業務排單，待貨到後再行通知。謝謝！',
          isIcon: false,
          itemId: detail.itemId,
          itemName: detail.itemName,
          itemSeg: detail.itemNumber,
        },
        width: '500px',
        height: '654px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: '',
      },
    };

    this.openLazyDialog(modelOption.modelName, modelOption.config);
  }

  /** open 請洽業務 modal */
  contactBusinessDialog(detail: Detail) {
    const modelOption = {
      modelName: 'contact-business',
      config: {
        data: {
          title: '請洽業務',
          StyleMargin: '0px',
          text: '',
          isIcon: false,
          itemNumber: detail.itemNumber,
          itemName: detail.description,
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

    this.openLazyDialog(modelOption.modelName, modelOption.config);
  }
}
