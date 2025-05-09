/** --------------------------------------------------------------------------------
 *-- Description： 重設密碼
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EnvConfig } from 'src/app/app.module';
import { ResponseCode } from 'src/app/enums';
import { ErrorMessage } from 'src/app/models';
import { DialogService } from 'src/app/shared/services';
import { CustomValidator } from '../../custom-validator/custom-validator';
import { AuthService } from '../../services/auth.service';
import { resetFormConfig } from './reset-password.component.config';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  error: ErrorMessage = {
    submitInvalid: false,
    errorMessage: { type: '', message: '' },
  };
  state?: { [key: string]: number };

  // Dynamic Form Config
  resetFormConfigs = resetFormConfig;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private title: Title,
    private envConfig: EnvConfig,
    private dialogservice: DialogService
  ) {
    this.title.setTitle('重設密碼');
    this.state = this.router.getCurrentNavigation()?.extras.state;
  }

  ngOnInit(): void {
    this.resetForm = this.fb.group(
      {
        userId: this.state?.['userId'],
        oldPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, CustomValidator.validPassword]],
        confirmPassword: ['', [Validators.required]],
        recaptcha: ['', Validators.required],
      },
      { validator: CustomValidator.match('newPassword', 'confirmPassword') }
    );
  }

  /** 變更密碼 */
  resetPassword(): void {
    this.resetForm.markAllAsTouched();
    if (this.resetForm.valid) {
      this.auth
        .resetPassword({ ...this.resetForm.value, orgId: this.envConfig.orgId })
        .subscribe((resp: any) => {
          if (resp.responseCode === ResponseCode.Success) {
            const modelOption = {
              modelName: 'send-password',
              config: {
                data: {
                  title: '密碼變更成功',
                  text: '請使用新密碼登入。',
                  displayFooter: true,
                  confirmButton: '重新登入',
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
            this.dialogservice.openLazyDialog(
              modelOption.modelName,
              modelOption.config
            );
            this.router.navigate(['/Account/Login']);
          } else {
            this.resetForm.controls["recaptcha"].patchValue('');
            this.error.submitInvalid = true;
            this.error.errorMessage = resp.errorMessage;
          }
        });
    }
  }

  /** 導頁至登入 */
  goLogin(): void {
    this.router.navigate(['/']);
  }
}
