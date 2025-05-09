/** --------------------------------------------------------------------------------
 *-- Description： 變更密碼
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { StorageService } from './../../../core/services/storage.service';
import { Component, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { CustomValidator } from 'src/app/auth/custom-validator/custom-validator';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ResponseCode } from 'src/app/enums';
import { ErrorMessage } from 'src/app/models';
import { MemberService } from 'src/app/services';
import {
  DialogService,
  LayoutService,
  NotifierService,
} from 'src/app/shared/services';
import {
  adminFormConfig,
  adminMobileFormConfig,
  memberFormConfig,
  memberMobileFormConfig,
} from './password.component.config';
import { Router } from '@angular/router';
import { NotificationComponent } from 'src/app/shared/components';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class PasswordComponent implements OnInit {
  passwordForm!: FormGroup;
  error: ErrorMessage = {
    submitInvalid: false,
    errorMessage: { type: '', message: '' },
  };

  // Dynamic Form Config
  formConfigs = adminFormConfig;

  isAdmin!: boolean;
  noticationData = {
    title: '注意事項',
    list: [
      '請輸入變更密碼的原因，帳號管理員在收到您的申請後即可重新設定您的密碼。',
    ],
  };

  constructor(
    public layoutService: LayoutService,
    private fb: FormBuilder,
    private authService: AuthService,
    private memberService: MemberService,
    private dialogservice: DialogService,
    private storage: StorageService,
    private router: Router,
    private notifierService: NotifierService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin;
    this.passwordForm = this.isAdmin
      ? this.fb.group(
          {
            oldPassword: ['', [Validators.required]],
            newPassword: [
              '',
              [Validators.required, CustomValidator.validPassword],
            ],
            confirmPassword: ['', [Validators.required]],
            reason: ['', [Validators.required]],
            recaptcha: ['', Validators.required],
          },
          { validator: CustomValidator.match('newPassword', 'confirmPassword') }
        )
      : this.fb.group({
          recaptcha: ['', Validators.required],
          reason: ['', [Validators.required]],
        });
    this.layoutService.layoutChanges$.subscribe((size) => {
      if (size === 'small') {
        this.formConfigs = this.isAdmin
          ? adminMobileFormConfig
          : memberMobileFormConfig;
      } else {
        this.formConfigs = this.isAdmin ? adminFormConfig : memberFormConfig;
      }
    });
  }

  /** confirm click */
  onSubmit(): void {
    this.passwordForm.markAllAsTouched();
    if (this.passwordForm.valid) {
        if (this.isAdmin) {
          if(this.passwordForm.value.newPassword != this.passwordForm.value.oldPassword){
            this.error.submitInvalid =  false;
            this.changeAdminPassword();
          }
          else{
            this.error.submitInvalid =  true;
            this.error.errorMessage ={type:'error',message: "新密碼不能與舊密碼一樣!"};
          }
        } else {
          this.changeMemberPassword();
        }
    }
  }

  /** 變更帳號管理員密碼 */
  changeAdminPassword(): void {
    this.memberService
      .changeAdminPassword(this.passwordForm.value)
      .subscribe((res: any) => {
        if (res.responseCode === ResponseCode.Success) {
          const modelOption = {
            modelName: 'send-password',
            config: {
              data: {
                title: '密碼變更成功',
                text: '您已成功變更密碼，請使用新密碼重新登入iOrder。',
                displayFooter: true,
                confirmButton: '確認',
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
          this.dialogservice
            .openLazyDialog(modelOption.modelName, modelOption.config)
            .then((ref) => {
              ref.afterClosed().subscribe(() => {
                this.storage.clear();
                this.router.navigate(['/Account/Login']);
              });
            });
        } else {
          this.passwordForm.controls["recaptcha"].patchValue('');
          this.error.submitInvalid = true;
          this.error.errorMessage = res.errorMessage!;
        }
      });
  }

  /** 變更帳號密碼 */
  changeMemberPassword(): void {
    this.memberService
      .changeMemberPassword(this.passwordForm.value)
      .subscribe((res: any) => {
        if (res.responseCode === ResponseCode.Success) {
          this.notifierService.showInfoNotification('已通知帳號管理員變更申請');
        } else {
          this.passwordForm.controls["recaptcha"].patchValue('');
          this.error.submitInvalid = true;
          this.error.errorMessage = res.errorMessage!;
        }
      });
  }
}
