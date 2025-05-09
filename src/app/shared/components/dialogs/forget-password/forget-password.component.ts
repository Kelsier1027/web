/** --------------------------------------------------------------------------------
 *-- Description：忘記密碼
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { ResponseCode } from 'src/app/enums';
import { EnvConfig } from 'src/app/app.module';
import { DialogService } from 'src/app/shared/services';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormGroupDirective,
  ControlContainer,
} from '@angular/forms';
import { LoginFormConfig } from './forget-password.component.config';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ErrorMessage } from 'src/app/models';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class ForgetPasswordComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading: boolean = false;
  formConfigs = LoginFormConfig;
  error: ErrorMessage = {
    submitInvalid: false,
    errorMessage: { type: '', message: '' },
  };

  regExps: { [key: string]: RegExp } = {
    tax_id: /^[\d]{8}$/,
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ForgetPasswordComponent>,
    private fb: FormBuilder,
    private dialogservice: DialogService,
    private authService: AuthService,
    private envConfig: EnvConfig
  ) {}

  /** confirm click */
  onSubmit(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService
        .forgotPassword({
          ...this.loginForm.value,
          orgId: this.envConfig.orgId,
        })
        .pipe(catchError(_ => {
          this.isLoading = false;
          return of();
        }))
        .subscribe((resp: any) => {
          this.isLoading = false;
          // API Success UI pop send-password
          if (resp.responseCode === ResponseCode.Success) {
            this.dialogRef.close();
            const modelOption = {
              modelName: 'send-password',
              config: {
                data: {
                  title: '密碼已發送',
                  text: '已將密碼寄送到您的Email信箱，請使用該密碼重新登入。',
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
          } else {
            switch (resp.responseCode) {
              case ResponseCode.NotAdminAccount:
                this.dialogRef.close();
                const modelOption = {
                  modelName: 'send-password',
                  config: {
                    data: {
                      title: '已通知貴公司帳號管理員',
                      text: '請連繫貴公司帳號管理員取得密碼。',
                      displayFooter: true,
                      confirmButton: '重新登入',
                    },
                    width: '550px',
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
                break;
              default:
                this.error.submitInvalid = true;
                this.error.errorMessage = resp.errorMessage;
                this.error.errorMessage.message = this.error.errorMessage.message.split(']')[1];
            }
          }
        });
    }
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      companyNo: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.regExps['tax_id']),
        ]),
      ],
      account: [
        '',
        Validators.compose([Validators.required, Validators.email]),
      ],
    });
  }
}
