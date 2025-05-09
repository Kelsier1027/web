/** --------------------------------------------------------------------------------
 *-- Description： 帳號管理
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, OnInit } from '@angular/core';
import { catchError, filter, map, Observable, of, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MemberRole, ResponseCode } from 'src/app/enums';
import { Account } from 'src/app/models';
import { MemberService } from 'src/app/services';
import {
  DialogService,
  LayoutService,
  NotifierService,
} from 'src/app/shared/services';

@Component({
  selector: 'app-account-manage-addaccount-row',
  templateUrl: './account-manage-addaccount-row.component.html',
  styleUrls: ['./account-manage-addaccount-row.component.scss'],
})
export class AccountManageAddaccountRowComponent implements OnInit {
  apiResponse!: Observable<Account[]>;
  adminAccount?: Account;
  dataSource!: {
    role: string;
    jobTitle: string;
    email: string;
    lastName: string;
    isAvailable: boolean;
    operate: string;
    isApplyingForPasswordChange: boolean;
  }[];
  isAdminChangeApply!: boolean;
  isLoading: boolean = false;

  constructor(
    public dialogservice: DialogService,
    private memberService: MemberService,
    private notifierService: NotifierService,
    public layoutService: LayoutService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.apiResponse = this.memberService.getAccountList().pipe(
      filter((res) => res.responseCode === ResponseCode.Success),
      map((res) => res.result),
      tap((res) => {
        this.isAdminChangeApply = res.isAdminChangeApply;
        this.adminAccount = res.members.find(
          (m) => m.role === MemberRole.Admin
        );
      }),
      tap((res) => {
        const list = res.members
          .filter((member) => member.role !== MemberRole.Admin)
          .map((member) => {
            return {
              role: member.role,
              jobTitle: member.jobTitle,
              email: member.email,
              lastName: member.lastName,
              isAvailable: member.isAvailable,
              operate: '',
              isApplyingForPasswordChange: member.isApplyingForPasswordChange
            };
          })
          .concat(
            res.memberApplying.map((member) => {
              return {
                role: member.role,
                jobTitle: member.jobTitle,
                email: member.email,
                lastName: member.userName!,
                isAvailable: member.isAvailable,
                operate: '',
                isApplyingForPasswordChange: member.isApplyingForPasswordChange
              };
            })
          );
        this.dataSource = list;
      }),
      map((res) =>
        res.members
          .filter((member) => member.role != MemberRole.Admin)
          .concat(res.memberApplying)
      )
    );
  }

  /** open 新增帳號 modal */
  async popModel(): Promise<void> {
    const modelOption = {
      modelName: 'member-add-account',
      config: {
        data: {
          title: '新增帳號',
          StyleMargin: '0px',
        },
        width: '500px',
        height: '600px',
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
        ref.afterClosed().subscribe((ref) => {
          ref && this.apiResponse.subscribe();
        });
      });
  }

  /** open 申請變更 modal */
  async popApplyChangeModel(): Promise<void> {
    const modelOption = {
      modelName: 'apply-to-change',
      config: {
        data: {
          title: '申請變更',
          StyleMargin: '0px',
        },
        width: '500px',
        height: '100%',
        maxHeight: '50vh',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: 'apply-to-change-panel',
      },
    };
    this.dialogservice
      .openLazyDialog(modelOption.modelName, modelOption.config)
      .then((ref) => {
        ref.afterClosed().subscribe((ref) => {
          ref && this.apiResponse.subscribe();
        });
      });
  }

  /** open 刪除帳號 modal */
  handleDeleteAccountModal(row: Account) {
    const modelOption = {
      modelName: 'delete-address',
      config: {
        data: {
          title: '刪除帳號',
          text: '請確認是否要刪除此帳號，刪除後帳號將不會留存。',
          displayFooter: true,
          cancelButton: '取消',
          confirmButton: ' 刪除',
        },
        width: '500px',
        // height: '204px',
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
            this.memberService.deleteAccount(row.id).subscribe((res) => {
              if (res.responseCode === ResponseCode.Success) {
                this.notifierService.showInfoNotification('該帳號已刪除');
                this.apiResponse.subscribe();
              }
            });
          }
        });
      });
  }

  /** open 重設密碼 modal */
  handleResetPasswordModal(row: Account): void {
    const modelOption = {
      modelName: 'member-reset-password',
      config: {
        data: {
          title: '重設密碼',
          StyleMargin: '0px',
          jobTitle: row.jobTitle,
          email: row.email,
          lastName: row.lastName,
          reason: row.passwordChangeReason,
          displayFooter: true,
          cancelButton: '取消',
          confirmButton: ' 產生新密碼',
        },
        width: '500px',
        height: '320px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: '',
      },
    };
    this.dialogservice
      .openLazyDialog(modelOption.modelName, modelOption.config)
      .then((ref) =>
        ref.afterClosed().subscribe((ref) => {
          if (!ref)
            return;

          this.isLoading = true;

          this.memberService
            .changePassword(row.id, { email: row.email })
            .pipe(catchError(_ => {
              this.isLoading = false;
              return of();
              }
            ))
            .subscribe((res) => {
              this.isLoading = false;
              if (res.responseCode === ResponseCode.Success) {
                this.notifierService.showInfoNotification(
                  '新密碼已發送至該帳號'
                );
              }
            });
        })
      );
  }

  /** 啟用/停用 click */
  toggleClick(row: Account): void {
    row.isAvailable = !row.isAvailable;
    const param = { ...row } as Record<string, unknown>;
    this.memberService.editMemberStatus(row.id, param).subscribe((res) => {
      this.apiResponse.subscribe();
      if (res.responseCode !== ResponseCode.Success) {
        this.notifierService.showErrorNotification(res.responseMessage);
      }
    });
  }
}
