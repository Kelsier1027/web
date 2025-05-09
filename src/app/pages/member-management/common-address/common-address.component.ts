/** --------------------------------------------------------------------------------
 *-- Description： 常用指送地址
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ControlContainer,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { catchError, from, of, Subscription, switchMap, tap } from 'rxjs';
import { Pagination } from 'src/app/core/model';
import { ResponseCode } from 'src/app/enums';
import { CommonAddress, DynamicFormValue } from 'src/app/models';
import { MemberService } from 'src/app/services';
import { DialogService, NotifierService } from 'src/app/shared/services';
import { FilterService } from 'src/app/shared/services/filter.service';
import { LayoutService } from 'src/app/shared/services/layout.service';

@Component({
  selector: 'app-common-address',
  templateUrl: './common-address.component.html',
  styleUrls: ['./common-address.component.scss'],
  providers: [FilterService],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class CommonAddressComponent implements OnInit, OnDestroy {
  filterForm!: FormGroup;
  dataSource!: any;
  onlyMe!: boolean;
  keywords:any;
  pagination?: Pagination;
  filterSub = new Subscription();
  commonAddressList!: CommonAddress[];

  constructor(
    private fb: FormBuilder,
    public layoutService: LayoutService,
    public dialogservice: DialogService,
    private filterService: FilterService,
    private memberService: MemberService,
    private notifierService: NotifierService
  ) {}

  ngOnInit(): void {
    this.onlyMe = true;
    this.filterForm = this.fb.group({
      keyword: [''],
      onlyMe: [this.onlyMe],
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
      onlyMe: this.onlyMe,
    });
  }

  /** search change */
  onSearchChange(keyword: string): void {
    this.keywords=keyword;
    // this.filterForm.patchValue({
    //   keyword: keyword,
    // });
    this.filterService.filterChange({
      onlyMe: this.onlyMe,
      keyword: keyword,
    })
  }

  /** 只顯示本人建立的常用指送地址 click */
  onChange(change: MatCheckboxChange): void {
    this.onlyMe = change.checked;
    this.filterService.filterChange({
      onlyMe: this.onlyMe,
      keyword: this.keywords ? this.keywords : '',
    });
  }

  /** 分頁切換 */
  onPageChange(page: number): void {
    this.filterService.pageChange({
      page: page,
      pageSize: this.pagination?.pageSize!,
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
          confirmButton: ' 刪除',
        },
        width: '500px',
        height: '224px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: '',
      },
    };
    this.dialogservice
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
                    pageSize: this.pagination?.pageSize!,
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
          oldData: this.commonAddressList[index],
        },
        width: '500px',
        height: '638px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: '',
      },
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
            pageSize: this.pagination?.pageSize!,
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
          title: '新增常用指送地址',
        },
        width: '500px',
        height: '638px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: '',
      },
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
            pageSize: this.pagination?.pageSize!,
          });
        }
      });
  }
}
