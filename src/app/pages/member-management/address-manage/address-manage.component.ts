/** --------------------------------------------------------------------------------
 *-- Description： 配送地址管理
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { filter, map, Observable, of, tap, switchMap, from } from 'rxjs';
import { AddrAction, DialogAction, ResponseCode } from 'src/app/enums';
import { CanComponentDeactivate } from 'src/app/guards';
import { Address, AddrManage, ErrorMessage } from 'src/app/models';
import { MemberService } from 'src/app/services';
import { Options } from 'src/app/shared/models';
import { DialogService, NotifierService } from 'src/app/shared/services';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { AuthService } from 'src/app/auth/services/auth.service';
@Component({
  selector: 'app-address-manage',
  templateUrl: './address-manage.component.html',
  styleUrls: ['./address-manage.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class AddressManageComponent implements OnInit, CanComponentDeactivate {
  dataSource: any;
  expand: boolean = false;
  noticationData = {
    title: '注意事項',
    list: [
      '您的選擇將會自動於確認採購清單時成為預設值。',
      '您可以選擇常用的送貨地址、收貨人、聯絡電話，但不可編輯，需由帳號管理員編輯。',
    ],
  };
  applyChangeForm!: FormGroup;
  error: ErrorMessage = {
    submitInvalid: false,
    errorMessage: { type: '', message: '' },
  };
  apiResponse!: Observable<AddrManage>;
  addrMange!: {
    defaultAddr: {
      defaultShipAddrId: number;
      defaultBillAddrId: number;
      defaultShipContact: number;
      defaultBillContact: number;
    };
    shipAddrList: Options[];
    billAddrList: Options[];
    shipAddrApplyList: Address[];
    billAddrApplyList: Address[];
    shipContactList: Options[];
    billContactList: Options[];
  };
  currentScreenSize: string = '';
  tabIndex!: number;
  IsAdmin : boolean = false;
  constructor(
    private fb: FormBuilder,
    public layoutService: LayoutService,
    public dialogservice: DialogService,
    private memberService: MemberService,
    private notifierService: NotifierService,
    private authService:AuthService,
  ) {}

  /** open confirm dialog */
  confirmDialog(): Observable<boolean> {
    const text = '請確認是否要儲存結帳配送設定。';

    const modelOption = {
      modelName: 'discard-changes',
      config: {
        data: {
          title: '儲存變更',
          StyleMargin: '0px',
          text: text,
        },
        width: '500px',
        height: '204px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: '',
      },
    };

    return from(
      this.dialogservice.openLazyDialog(
        modelOption.modelName,
        modelOption.config
      )
    ).pipe(
      switchMap((ref) => ref.afterClosed()),
      switchMap((dialog: { action: DialogAction }) => {
        if (dialog.action === DialogAction.Cancel) {
          return of(false);
        }
        if (dialog.action === DialogAction.Discard) {
          return of(true);
        }
        this.applyChangeForm.markAllAsTouched();
        return this.memberService
          .changeDefaultAddr(this.applyChangeForm.value)
          .pipe(
            map((res) => {
              if (res.responseCode === ResponseCode.Success) {
                return true;
              } else {
                return false;
              }
            })
          );
      })
    );
  }

  /** confirm */
  confirm(): boolean {
    return this.isDefaultAddrChange;
  }

  /** getter is default address change */
  get isDefaultAddrChange(): boolean {
    return (
      JSON.stringify(this.applyChangeForm.value) ===
      JSON.stringify(this.addrMange.defaultAddr)
    );
  }

  /** open 新增地址 modal */
  handleShippingAddressModal(): void {
    const modelOption = {
      modelName: 'add-bill-shipping-address',
      config: {
        data: {
          title: this.tabIndex === 1 ? '新增公司地址' : '新增帳單寄送地址',
          StyleMargin: '0px',
          action:
            this.tabIndex === 1
              ? AddrAction.AddShipAddr
              : AddrAction.AddBillAddr,
        },
        width: '500px',
        height: '448px',
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
          this.apiResponse.subscribe();
        }
      });
  }

  /** open 地址失效申請 modal */
  handleInvalidationApplicationModal(addr: Address): void {
    const modelOption = {
      modelName: 'delete-address',
      config: {
        data: {
          title:
            this.tabIndex === 1 ? '公司地址失效申請' : '帳單寄送地址失效申請',
          text:
            this.tabIndex === 1
              ? '請確認是否要將此公司地址失效，失效後將無法撤回申請。'
              : '請確認是否要將此帳單地址失效，失效後將無法撤回申請。',
          displayFooter: true,
          cancelButton: '取消',
          confirmButton: ' 失效申請',
        },
        width: '500px',
        height: '224px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: 'apply-to-change-panel',
      },
    };

    from(
      this.dialogservice.openLazyDialog(
        modelOption.modelName,
        modelOption.config
      )
    )
      .pipe(
        switchMap((ref) => ref.afterClosed()),
        filter((result) => result),
        switchMap(() =>
          this.memberService.addrManage({
            password: '',
            fullAddr: addr.fullAddr,
            action:
              this.tabIndex === 1
                ? AddrAction.DisableShipAddr
                : AddrAction.DisableBillAddr,
          })
        )
      )
      .subscribe((res) => {
        if (res.responseCode === ResponseCode.Success) {
          this.notifierService.showInfoNotification(
            this.tabIndex === 1
              ? '公司地址失效申請成功'
              : '帳單寄送地址失效申請成功'
          );
          this.apiResponse.subscribe();
        }
      });
  }

  /** handle expand */
  handleExpand(): void {
    this.expand = !this.expand;
  }

  /** confirm click */
  onSubmit(): void {
    this.applyChangeForm.markAllAsTouched();
    this.memberService
      .changeDefaultAddr(this.applyChangeForm.value)
      .subscribe((res) => {
        if (res.responseCode === ResponseCode.Success) {
          this.notifierService.showInfoNotification('預設送貨資訊已更改');
          this.apiResponse.subscribe();
        }
      });
  }

  /** 切換頁籤 */
  onTabChange(tabIndex: number): void {
    this.tabIndex = tabIndex;
    this.dataSource =
      this.tabIndex === 1
        ? this.addrMange.shipAddrApplyList
        : this.addrMange.billAddrApplyList;
  }

  checkDataStatus(): boolean{
    if(this.dataSource.filter((status: { status: number; }) => status.status == 0).length >= 2){
      return true;
    }
    else{
      return false;
    }
  }
  ngOnInit(): void {
    this.IsAdmin = this.authService.isAdmin;
    this.tabIndex = 1;
    this.applyChangeForm = this.fb.group({
      defaultShipAddrId: ['', Validators.compose([Validators.required])],
      defaultBillAddrId: ['', Validators.compose([Validators.required])],
      defaultShipContact: ['', Validators.compose([Validators.required])],
      defaultBillContact: ['', Validators.compose([Validators.required])],
    });

    this.apiResponse = this.memberService.getAddrManage().pipe(
      filter((res) => res.responseCode === ResponseCode.Success),
      map((res) => res.result),
      tap((data) => {
        this.addrMange = {
          ...data,
          shipAddrList: data.shipAddrList.map((i) => {
            return { value: i.id, label: i.fullAddr };
          }),
          billAddrList: data.billAddrList.map((i) => {
            return { value: i.id, label: i.fullAddr };
          }),
          shipAddrApplyList: data.shipAddrList
            .concat(data.shipAddrApplyList)
            .map((addr) => {
              return { ...addr, operate: '' };
            }),
          billAddrApplyList: data.billAddrList
            .concat(data.billAddrApplyList)
            .map((addr) => {
              return { ...addr, operate: '' };
            }),
          shipContactList: data.shipContactList.map((i) => {
            return { value: i.id, label: i.name };
          }),
          billContactList: data.billContactList.map((i) => {
            return { value: i.id, label: i.name };
          }),
        };
        this.applyChangeForm.patchValue({
          defaultShipAddrId: this.addrMange.defaultAddr.defaultShipAddrId,
          defaultBillAddrId: this.addrMange.defaultAddr.defaultBillAddrId,
          defaultShipContact: this.addrMange.defaultAddr.defaultShipContact,
          defaultBillContact: this.addrMange.defaultAddr.defaultBillContact,
        });
        this.onTabChange(this.tabIndex);
      })
    );
  }
}
