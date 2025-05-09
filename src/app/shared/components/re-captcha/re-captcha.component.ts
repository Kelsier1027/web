/** --------------------------------------------------------------------------------
 *-- Description： reCaptcha
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { EnvConfig } from 'src/app/app.module';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  FormGroupDirective,
  ControlContainer,
  FormGroup,
  AbstractControl,
} from '@angular/forms';
import { debounce, interval, pairwise, tap } from 'rxjs';
import { has } from 'ramda';
import { RecaptchaComponent } from 'ng-recaptcha';

@Component({
  selector: 'app-re-captcha',
  templateUrl: './re-captcha.component.html',
  styleUrls: ['./re-captcha.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class ReCaptchaComponent implements OnInit {
  @ViewChild(RecaptchaComponent) recaptcha!: RecaptchaComponent;
  @Input() group!: FormGroup;
  @Input() field!: {
    type: string;
    name: string;
    class?: string;
    stylePadding?: string;
    styleMargin?: string;
    validations: {
      hasErrorMessage: boolean;
      errorMessage: any;
    };
  };
  siteKey!: string;
  recaptchaFormControl: AbstractControl;
  latestValue: string | null = null;

  constructor(
    private rootformGroup: FormGroupDirective,
    private envConfig: EnvConfig
  ) {

    this.recaptchaFormControl = rootformGroup.control.controls['recaptcha'];
  }

  ngOnInit(): void {
    this.siteKey = this.envConfig.siteKey;
    this.group = this.rootformGroup.control;

    this.recaptchaFormControl ??= this.group.controls['recaptcha'];
  }

  /** resolve reCaptcha response */
  resolved(captchaResponse: string) {
    if (this.latestValue == captchaResponse)
      return;

    this.latestValue = captchaResponse;

    this.group.controls['recaptcha'].patchValue(captchaResponse);
  }
}
