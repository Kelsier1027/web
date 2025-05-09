/** --------------------------------------------------------------------------------
 *-- Description： 註冊會員
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
import { Router } from '@angular/router';

import { ErrorMessage } from 'src/app/models/error-message.model';
import { DialogService, LayoutService } from 'src/app/shared/services';
import { AuthService } from '../../services/auth.service';
import { SignupFormConfig } from './signup.component.config';

import { Title } from '@angular/platform-browser';
import { ResponseCode } from 'src/app/enums';
import { EnvConfig } from 'src/app/app.module';
import { MemberService } from 'src/app/services';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  registerSuccessMsg!: string;
  signupForm!: FormGroup;
  error: ErrorMessage = {
    submitInvalid: false,
    errorMessage: { type: '', message: '' },
  };
  // Dynamic Form Config
  signupformConfigs = SignupFormConfig;

  regExps: { [key: string]: RegExp } = {
    word: /^[\u4E00-\u9FA5\uF900-\uFA2D]+$/,
    tel: /^[\d!@#\$%\^\&*\)\(+=._-]{1,40}$/,
    tax_id: /^[\d]{8}$/,
  };

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private title: Title,
    private envConfig: EnvConfig,
    private dialogservice: DialogService,
    public layoutService: LayoutService,
    public memberService: MemberService,
    public authService: AuthService
  ) {
    this.title.setTitle('註冊');
  }

  ngOnInit(): void {

    this.authService
      .registerSuccess(this.envConfig.orgId)
      .subscribe((resp: any) => {
        this.registerSuccessMsg = resp.result.message
      })

    this.signupForm = this.fb.group({
      companyNo: [
        '',
        [Validators.required, Validators.pattern(this.regExps['tax_id'])],
      ],
      companyName: [
        '',
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(this.regExps['word']),
        ],
      ],
      contactName: [
        '',
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern(this.regExps['word']),
        ],
      ],
      tel: ['', [Validators.required, Validators.pattern(this.regExps['tel'])]],
      account: ['', [Validators.required, Validators.email]],
      terms_of_service: [false, Validators.requiredTrue],
      recaptcha: ['', Validators.required],
    });
    this.layoutService.layoutChanges$.subscribe((currentScreenSize) => {
      if (currentScreenSize === "small") {
        this.signupformConfigs[5].modelOption.config.data.StyleWidthFooter = "calc(100% - 60px)"
        return;
      }
      this.signupformConfigs[5].modelOption.config.data.StyleWidthFooter = "430px"
    })
  }

  /** 註冊會員 */
  register(): void {
    this.signupForm.markAllAsTouched();

    if (this.signupForm.valid) {
      this.auth
        .joinUs({ ...this.signupForm.value, orgId: this.envConfig.orgId })
        .subscribe((resp: any) => {
          if (resp.responseCode === ResponseCode.Success) {
            const modelOption = {
              modelName: 'send-password',
              config: {
                data: {
                  title: '註冊成功',
                  text: this.registerSuccessMsg,
                  displayFooter: true,
                  confirmButton: '確認',
                },
                width: '500px',
                height: '242px',
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
            this.signupForm.controls["recaptcha"].patchValue('');
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
