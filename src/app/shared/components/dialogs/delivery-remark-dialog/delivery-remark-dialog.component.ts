/** --------------------------------------------------------------------------------
 *-- Description：寄送密碼 / Message box
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, Inject, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormBuilder,
  FormGroupDirective
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, catchError, from, of, switchMap, tap } from 'rxjs';
import { Pagination } from 'src/app/core/model';
import { DialogAction, ResponseCode } from 'src/app/enums';
import { DeliveryRemark } from 'src/app/models';
import { MemberService } from 'src/app/services';
import {
  DialogService,
  LayoutService,
  NotifierService
} from 'src/app/shared/services';
import { FilterService } from 'src/app/shared/services/filter.service';

@Component({
  selector: 'app-delivery-remark-dialog',
  templateUrl: './delivery-remark-dialog.component.html',
  styleUrls: ['./delivery-remark-dialog.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ]
})
export class DeliveryRemarkDialogComponent implements OnInit {
  isCreatedByCurrentUser!: boolean;
  dataSource!: any;
  pagination?: Pagination;
  filterSub = new Subscription();
  deliveryRemarkList!: DeliveryRemark[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DeliveryRemarkDialogComponent>,
    private fb: FormBuilder,
    public layoutService: LayoutService,
    public dialogservice: DialogService,
    private filterService: FilterService,
    private memberService: MemberService,
    private notifierService: NotifierService
  ) {}

  ngOnInit(): void {
    this.isCreatedByCurrentUser = true;
    this.filterService.filterChange({
      isCreatedByCurrentUser: this.isCreatedByCurrentUser
    });

    this.filterSub = this.filterService.filterParams$
      .pipe(
        switchMap((param) =>
          this.memberService.getDeliveryRemark(param).pipe(
            catchError(() => {
              // handle api error and continue operation
              return of();
            })
          )
        ),
        tap((res) => {
          if (res.responseCode === ResponseCode.Success) {
            this.deliveryRemarkList = res.result.deliveryRemarkList;
            this.pagination = res.result.pagination;
            this.dataSource = res.result ? this.deliveryRemarkList : [];
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.filterSub.unsubscribe();
  }

  /** open 刪除常用出貨備註 modal */
  handleDelModal(id: number): void {
    const modelOption = {
      modelName: 'delete-address',
      config: {
        data: {
          title: '刪除常用出貨備註',
          text: '請確認是否要刪除常用出貨備註，刪除後紀錄將不會留存。',
          displayFooter: true,
          cancelButton: '取消',
          confirmButton: ' 刪除'
        },
        width: '500px',
        height: '224px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: ''
      }
    };
    this.dialogservice
      .openLazyDialog(modelOption.modelName, modelOption.config)
      .then((ref) => {
        ref.afterClosed().subscribe((result) => {
          if (result) {
            this.memberService
              .deleteDeliveryRemark(id)
              .subscribe((res) => {
                if (res.responseCode === ResponseCode.Success) {
                  this.notifierService.showInfoNotification(
                    '常用出貨備註已刪除'
                  );
                  this.filterService.pageChange({
                    page: 1,
                    pageSize: this.pagination?.pageSize!
                  });
                }
              });
          }
        });
      });
  }

  /** open 修改常用出貨備註 modal */
  handleModifyModal(index: number): void {

    const modelOption = {
      modelName: 'create-delivery-remark',
      config: {
        data: {
          title: '修改常用出貨備註',
          oldData: this.deliveryRemarkList.filter(res =>{return res.id === index;})[0]
        },
        width: '500px',
        height: '379px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: ''
      }
    };
    from(
      this.dialogservice.openLazyDialog(
        modelOption.modelName,
        modelOption.config
      )
    )
      .pipe(switchMap((ref) => ref.afterClosed()))
      .subscribe((result) => {
        if (result) {
          this.filterService.pageChange({
            page: 1,
            pageSize: this.pagination?.pageSize!
          });
        }
      });
  }

  /** open 新增常用出貨備註 modal */
  handleCreateModal(): void {
    const modelOption = {
      modelName: 'create-delivery-remark',
      config: {
        data: {
          title: '新增常用出貨備註',
          oldData: {
            title: '出貨備註' + (this.dataSource.length + 1),
            comment: ''
          }
        },
        width: '500px',
        height: '379px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: ''
      }
    };
    from(
      this.dialogservice.openLazyDialog(
        modelOption.modelName,
        modelOption.config
      )
    )
      .pipe(switchMap((ref) => ref.afterClosed()))
      .subscribe((result) => {
        if (result) {
          this.filterService.pageChange({
            page: 1,
            pageSize: this.pagination?.pageSize!
          });
        }
      });
  }

  /** 只顯示本人建立的常用出貨備註 click */
  onChange(change: MatCheckboxChange): void {
    this.isCreatedByCurrentUser = change.checked;
    this.filterService.filterChange({
      isCreatedByCurrentUser: this.isCreatedByCurrentUser
    });
  }

  /** 分頁切換 */
  onPageChange(page: number): void {
    this.filterService.pageChange({
      page: page,
      pageSize: this.pagination?.pageSize!
    });
  }

  selectDeliverRemark(row: any) {
    this.dialogRef.close({
      action: DialogAction.Save,
      data: {
        ...row
      }
    });
  }
}
