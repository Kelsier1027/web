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
  FormGroup,
  FormGroupDirective
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, catchError, from, of, switchMap, tap } from 'rxjs';
import { Pagination } from 'src/app/core/model';
import { DialogAction, ResponseCode } from 'src/app/enums';
import { CommonAddress, DynamicFormValue } from 'src/app/models';
import { MemberService } from 'src/app/services';
import {
  DialogService,
  LayoutService,
  NotifierService
} from 'src/app/shared/services';
import { FilterService } from 'src/app/shared/services/filter.service';

@Component({
  selector: 'app-common-address-dialog',
  templateUrl: './common-address-dialog.component.html',
  styleUrls: ['./common-address-dialog.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ]
})
export class CommonAddressDialogComponent implements OnInit {
  filterForm!: FormGroup;
  dataSource!: any;
  onlyMe!: boolean;
  pagination?: Pagination;
  filterSub = new Subscription();
  commonAddressList!: CommonAddress[];
  currentScreenSize!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CommonAddressDialogComponent>,
    private fb: FormBuilder,
    public layoutService: LayoutService,
    public dialogService: DialogService,
    private filterService: FilterService,
    private memberService: MemberService,
    private notifierService: NotifierService,
    public dialogservice: DialogService,
  ) { }

  ngOnInit(): void {
    this.onlyMe = true;
    this.filterForm = this.fb.group({
      keyword: [''],
      onlyMe: [this.onlyMe]
    });
    this.filterService.filterChange(this.filterForm.value);

    this.filterSub = this.filterService.filterParams$
      .pipe(
        switchMap((param) =>
          this.memberService.getCommonAddress(param).pipe(
            catchError(() => {
              // handle api error and continue operation
              return of();
            })
          )
        ),
        tap((res) => {
          if (res.responseCode === ResponseCode.Success) {
            this.commonAddressList = res.result.commonUsedAddrList;
            this.pagination = res.result.pagination;
            this.dataSource = res.result ? this.commonAddressList : [];
            if (this.commonAddressList.length == 0 && this.onlyMe) {
             
              const modelOption = {
                modelName: 'simple-dialog',
                config: {
                  data: {
                    title: '尚未常用指送地址',
                    StyleMargin: '0px',
                    text: `您尚未儲存任何常用指送地址，請選擇其他配送類別。`,
                    displayFooter: true,
                    confirmButton: '確認'
                  },
                  width: '500px',
                  height: '204px',
                  hasBackdrop: true,
                  autoFocus: false,
                  enterAnimationDuration: '300ms',
                  exitAnimationDuration: '300ms',
                  panelClass: ''
                }
              };
              this.dialogservice.openLazyDialog(
                modelOption.modelName,
                modelOption.config
              );
            }
          }
        })
      )
      .subscribe();

    this.filterForm.valueChanges.subscribe((value: DynamicFormValue) => {
      if (this.filterForm.valid) {
        this.filterService.filterChange(value);
      }
    });
  }

  ngOnDestroy(): void {
    this.filterSub.unsubscribe();
  }

  /** reset form */
  reset() {
    this.filterForm.reset({
      keyword: '',
      onlyMe: this.onlyMe
    });
  }

  /** search change */
  onSearchChange(keyword: string): void {
    this.filterForm.patchValue({
      keyword: keyword
    });
  }

  /** 只顯示本人建立的常用指送地址 click */
  onChange(change: MatCheckboxChange): void {
    this.onlyMe = change.checked;
    this.filterService.filterChange({
      onlyMe: this.onlyMe
    });
  }

  /** 分頁切換 */
  onPageChange(page: number): void {
    this.filterService.pageChange({
      page: page,
      pageSize: this.pagination?.pageSize!
    });
  }

  /** open 刪除常用指送地址 modal */
  handleDelModal(index: number): void {
    const modelOption = {
      modelName: 'delete-address',
      config: {
        data: {
          title: '刪除常用指送地址',
          text: '請確認是否要刪除常用指送地址，刪除後紀錄將不會留存。',
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
    this.dialogService
      .openLazyDialog(modelOption.modelName, modelOption.config)
      .then((ref) => {
        ref.afterClosed().subscribe((result) => {
          if (result) {
            this.memberService
              .deleteCommonAddress(this.commonAddressList[index].id)
              .subscribe((res) => {
                if (res.responseCode === ResponseCode.Success) {
                  this.notifierService.showInfoNotification(
                    '常用指送地址已刪除'
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

  /** open 修改常用指送地址 modal */
  handleModifyModal(index: number): void {
    const modelOption = {
      modelName: 'create-address',
      config: {
        data: {
          title: '修改常用指送地址',
          oldData: this.commonAddressList[index]
        },
        width: '500px',
        height: '638px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: ''
      }
    };
    from(
      this.dialogService.openLazyDialog(
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

  /** open 新增常用指送送地址 modal */
  handleCreateModal(): void {
    const modelOption = {
      modelName: 'create-address',
      config: {
        data: {
          title: '新增常用指送地址'
        },
        width: '500px',
        height: '638px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: ''
      }
    };
    from(
      this.dialogService.openLazyDialog(
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

  selectDeliverCompany(row: any) {
    this.dialogRef.close({
      action: DialogAction.Save,
      data: {
        ...row
      }
    });
  }
}
