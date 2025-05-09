/** --------------------------------------------------------------------------------
 *-- Description： 登入
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/core/services/storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JWTOptions } from 'src/app/core/model/option';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { LoginFormConfig } from './login.component.config';
import { Title } from '@angular/platform-browser';
import { ResponseCode } from 'src/app/enums';
import { EnvConfig } from 'src/app/app.module';
import { ErrorMessage } from 'src/app/models';
import { AuthService } from '../../services/auth.service';
import { DialogService } from 'src/app/shared/services';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { take, tap } from 'rxjs';
import { URL_UTIL } from 'src/app/shared/utils/urlUtilities';
import { Response } from 'src/app/core/model';
import { POP_UP } from 'src/app/shared/utils/popUpUtilities';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  error: ErrorMessage = {
    submitInvalid: false,
    errorMessage: { type: '', message: '' },
  };

  permission: string = 'denied';

  // Dynamic Form Config
  loginformConfigs = LoginFormConfig;

  regExps: { [key: string]: RegExp } = {
    password: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/,
    tax_id: /^[\d]{8}$/,
  };

  isLoading: boolean = false;

  constructor(
    private auth: AuthService,
    private storage: StorageService,
    private fb: FormBuilder,
    private option: JWTOptions,
    private router: Router,
    private title: Title,
    private envConfig: EnvConfig,
    private dialogservice: DialogService,
    private fireMessaging: AngularFireMessaging,
    private activeRoute: ActivatedRoute
  ) {
    this.title.setTitle('登入');
  }

  ngOnInit(): void {

    // iOS Safari 不支援 Notification API, 所以要特殊處理
    const isSupported = () =>
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window

    if (isSupported()) {
      Notification.requestPermission().then((permission) => {
        this.permission = permission;
      })
    }
    this.auth.isLoggedIn && this.router.navigate(['/']);

    this.activeRoute.queryParams
    .pipe(take(1),
    tap(qp => {
      const accessToken: string = URL_UTIL.getParam(qp, 'accessToken');
      if (accessToken)
      {
        this.auth.notifyPayment(accessToken)
        .pipe(take(1),
        tap((res: Response) => {
          POP_UP.showMessage(this.dialogservice, '通知已匯款結果', res.responseMessage);
          })
        )
        .subscribe();
      }
    }))
    .subscribe();

    const rememberMe = this.storage.get(this.envConfig.rememberMeKey);

    this.loginForm = this.fb.group({
      companyNo: [
        rememberMe ? rememberMe['companyNo'] : '',
        [Validators.required, Validators.pattern(this.regExps['tax_id'])],
      ],
      account: [
        rememberMe ? rememberMe['account'] : '',
        Validators.compose([Validators.required, Validators.email]),
      ],
      password: ['', Validators.required],
      rememberMe: !!rememberMe,
      recaptcha: ['', Validators.required],
    });
  }

  requestToken() {
    this.fireMessaging.requestToken.subscribe(
      (token) => {
        if(token) {
          this.auth.getRegisterFirebase({
            Token: token
          }).subscribe()
        }
      }
    )
  }

  /** 登入 */
  login(): void {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginForm.value.recaptcha = 'Cloud-Interactive';
      this.auth
        .login({
          ...this.loginForm.value,
          orgId: this.envConfig.orgId,
        })
        .pipe(
          tap(() => this.isLoading = false)
        )
        .subscribe((resp: any) => {
          if (resp.responseCode === ResponseCode.Success) {
            localStorage.setItem('companyNo', this.loginForm.value.companyNo.toString());
            localStorage.setItem('orgId', this.envConfig.orgId.toString());
            if(this.permission === 'granted') {
              this.requestToken();
            }
            if (this.loginForm.get('rememberMe')?.value) {
              this.storage.set(this.envConfig.rememberMeKey, {
                companyNo: this.loginForm.value.companyNo,
                account: this.loginForm.value.account,
                isunitprice:true,//判斷全系統含稅價未稅價使用方式
                orgId: this.envConfig.orgId
              });
            } else {
              this.storage.removeItem(this.envConfig.rememberMeKey);
            }
            this.storage.set(this.option.key!, resp);
            this.router.navigate(['/']);
          } else {
            this.loginForm.controls["recaptcha"].patchValue('');
            switch (resp.responseCode) {
              case ResponseCode.ResetPassword:
                this.router.navigate(['/Account/ResetPassword'], {
                  state: { userId: resp.result.resetPasswordUserId },
                });
                break;
              case ResponseCode.InvalidAccount:
                const modalOption = {
                  modelName: 'help-contact',
                  config: {
                    data: {
                      title: '會員失效',
                      text: resp.responseMessage,
                    },
                    width: '680px',
                    height: '387px',
                    hasBackdrop: true,
                    autoFocus: false,
                    enterAnimationDuration: '300ms',
                    exitAnimationDuration: '300ms',
                    panelClass: 'help-contact-panel',
                  },
                };
                this.dialogservice.openLazyDialog(
                  modalOption.modelName,
                  modalOption.config
                );
                break;
              case ResponseCode.AccountLock:
                const modelOption = {
                  modelName: 'send-password',
                  config: {
                    data: {
                      title: '登入嘗試已達上限',
                      text: '請點選忘記密碼，系統將協助你獲取新密碼，若有任何問題，<br>請洽本公司電子商務部：<br>(02)2796-2345分機829',
                      displayFooter: true,
                      cancelButton: '取消',
                      confirmButton: '忘記密碼',
                    },
                    width: '500px',
                    height: '248px',
                    hasBackdrop: true,
                    autoFocus: false,
                    enterAnimationDuration: '300ms',
                    exitAnimationDuration: '300ms',
                    panelClass: '',
                  },
                };
                this.dialogservice
                  .openLazyDialog(modelOption.modelName, modelOption.config)
                  .then((res) =>
                    res.afterClosed().subscribe((ref) => {
                      if (ref) {
                        const modelOption = {
                          modelName: 'forget-password',
                          config: {
                            data: {
                              title: '忘記密碼',
                              subtitle:
                                '請輸入您的註冊帳號，系統將發送密碼至您的Email信箱。',
                            },
                            width: '500px',
                            hasBackdrop: true,
                            autoFocus: false,
                            enterAnimationDuration: '300ms',
                            exitAnimationDuration: '300ms',
                            panelClass: 'password-dialog',
                          },
                        };
                        this.dialogservice.openLazyDialog(
                          modelOption.modelName,
                          modelOption.config
                        );
                      }
                    })
                  );
                break;
              default:
                this.error.submitInvalid = true;
                this.error.errorMessage = resp.errorMessage;
            }
          }
        });
    }
  }

  /** 導頁至註冊會員 */
  goSignup(): void {
    this.router.navigate(['/Account/Signup']);
  }
}
