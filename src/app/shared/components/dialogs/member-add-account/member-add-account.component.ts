/** --------------------------------------------------------------------------------
 *-- Description：新增帳號
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { MemberService } from 'src/app/services';
import { Component, Inject, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorMessage } from 'src/app/models';
import { AddAccountFormConfig } from './member-add-account.component.config';
import { ResponseCode } from 'src/app/enums';
import { NotifierService } from 'src/app/shared/services';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-member-add-account',
  templateUrl: './member-add-account.component.html',
  styleUrls: ['./member-add-account.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class MemberAddAccountComponent implements OnInit {
  accountForm!: FormGroup;
  formConfigs = AddAccountFormConfig;
  error: ErrorMessage = {
    submitInvalid: false,
    errorMessage: { type: '', message: '' },
  };

  regExps: { [key: string]: RegExp } = {
    word: /^[\u4E00-\u9FA5\uF900-\uFA2D]+$/,
    tel: /^[\d!@#\$%\^\&*\)\(+=._-]{1,40}$/,
    mobile: /^[\d]{1}[\d-]{1,39}$/,
  };

  isLoading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MemberAddAccountComponent>,
    private fb: FormBuilder,
    private memberService: MemberService,
    private notifierService: NotifierService
  ) {}

  /** confirm click */
  onSubmit(): void {
    this.accountForm.markAllAsTouched();

    if (!this.accountForm.valid) return;

    this.isLoading = true;

    this.memberService
      .addAcount(this.accountForm.value)
      .pipe(catchError(_ => {
        this.isLoading = false;
        return of();
      }))
      .subscribe((resp: any) => {
        this.isLoading = false;
        if (resp.responseCode === ResponseCode.Success) {
          this.notifierService.showInfoNotification('會員新增已提出申請');
          this.dialogRef.close(true);
        } else {
          this.error.submitInvalid = true;
          this.error.errorMessage = resp.errorMessage;
        }
      });
  }

  ngOnInit(): void {
    this.accountForm = this.fb.group({
      role: ['', Validators.required],
      userName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.regExps['word']),
        ]),
      ],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      tel: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.regExps['tel']),
        ]),
      ],
      mobile: ['', Validators.pattern(this.regExps['mobile'])],
    });

    this.accountForm.get('role')?.valueChanges.subscribe((value) => {
      if (value === 'Receiver') {
        this.accountForm.get('email')?.disable();
        this.formConfigs = AddAccountFormConfig.filter(
          (config: any) => config.name !== 'email'
        );
      } else {
        this.accountForm.get('email')?.enable();
        this.formConfigs = AddAccountFormConfig;
      }
    });
  }
}
