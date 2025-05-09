/** --------------------------------------------------------------------------------
 *-- Description： 申請變更
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
import { filter, map, Observable, take, tap } from 'rxjs';
import { ResponseCode } from 'src/app/enums';
import { DialogService } from 'src/app/shared/services';
import { POP_UP } from 'src/app/shared/utils/popUpUtilities';

@Component({
  selector: 'app-apply-to-change',
  templateUrl: './apply-to-change.component.html',
  styleUrls: ['./apply-to-change.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class ApplyToChangeComponent implements OnInit {
  applyChangeForm!: FormGroup;
  error: ErrorMessage = {
    submitInvalid: false,
    errorMessage: { type: '', message: '' },
  };
  accounts: {value: string; label: string; role: string }[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ApplyToChangeComponent>,
    private fb: FormBuilder,
    private memberService: MemberService,
    public dialogservice: DialogService
  ) {}

  /** confirm click */
  onSubmit(): void {
    this.applyChangeForm.markAllAsTouched();
    if (this.applyChangeForm.valid) {
      const isUsingCompanyAccount =  this.applyChangeForm.value.status === 1
      const isAccountExisting = this.getAccount(this.applyChangeForm.value.email);

      if (!isUsingCompanyAccount && isAccountExisting){
        this.popUp('帳號已有其他角色', '變更之帳號已有其他身分之角色。');
        this.applyChangeForm.patchValue({status: 1, account: this.applyChangeForm.value.email});
        return;
      }

      const param =
        isUsingCompanyAccount
          ? {
              changeAccount: this.applyChangeForm.value.account,
              password: this.applyChangeForm.value.password,
              existingAccountChoice: this.applyChangeForm.value.existingAccountChoice,
              oldRole: this.getCurrentChoiceRole()
            }
          : {
              changeAccount: this.applyChangeForm.value.email,
              password: this.applyChangeForm.value.password,
              contactNo: this.applyChangeForm.value.contactNo,
              userName: this.applyChangeForm.value.userName
            };
      this.memberService.changeAdmin(param).subscribe((resp: any) => {
        if (resp.responseCode === ResponseCode.Success) {
          this.dialogRef.close(true);
          this.popUp('帳號已變更', '已將您的帳號管理員角色變更申請送出。待審核通過，將以 E-mail 通知您重新登入。');
        } else {
          this.error.submitInvalid = true;
          this.error.errorMessage = resp.errorMessage;
        }
      });
    }
  }

  private popUp(title: string, content: string) {
    POP_UP.showMessage(this.dialogservice, title, content);
  }

  ngOnInit(): void {
    this.memberService.getActiveUsers().pipe(
      take(1),
      filter((res) => res.responseCode === ResponseCode.Success),
      map((res) =>
        res.result.activeUsers.map((user) => {
          return {
            label: user.role + ' ' + user.lastName + ' ' + user.email,
            value: user.email,
            role: user.role
          };
        })
      ),
      tap((result) => this.accounts = result)
    ).subscribe();

    this.applyChangeForm = this.fb.group({
      status: [],
      account: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required])],
      contactNo: ['', Validators.compose([Validators.required])],
      userName: ['', Validators.compose([Validators.required])],
      existingAccountChoice: [1, Validators.compose([Validators.required])]
    });

    this.applyChangeForm.get('status')?.valueChanges.subscribe((value) => {
      if (value === 1) {
        this.applyChangeForm.get('email')?.disable();
        this.applyChangeForm.get('contactNo')?.disable();
        this.applyChangeForm.get('userName')?.disable();

        this.applyChangeForm.get('account')?.enable();
        this.applyChangeForm.get('existingAccountChoice')?.enable();
      } else {
        this.applyChangeForm.get('account')?.disable();
        this.applyChangeForm.get('existingAccountChoice')?.disable();

        this.applyChangeForm.get('email')?.enable();
        this.applyChangeForm.get('contactNo')?.enable();
        this.applyChangeForm.get('userName')?.enable();
      }
    });

    this.applyChangeForm.patchValue({status: 1});
  }

  getCurrentChoiceRole(): string {
    const currentEmail = this.applyChangeForm.get('account')?.value as string | null;
    if (!currentEmail)
      return '';

    return this.getAccount(currentEmail)?.role;
  }

  getAccount(email: string): any | null {
    return this.accounts
    .filter(acc => acc.value == email)
    [0];
  }
}
