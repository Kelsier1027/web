/** --------------------------------------------------------------------------------
 *-- Description：發票寄送
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, Inject, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResponseCode } from 'src/app/enums';
import { ErrorMessage } from 'src/app/models';
import { MemberService } from 'src/app/services';
import { NotifierService } from 'src/app/shared/services';

@Component({
  selector: 'app-invoice-delivery',
  templateUrl: './invoice-delivery.component.html',
  styleUrls: ['./invoice-delivery.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class InvoiceDeliveryComponent implements OnInit {
  applyChangeForm!: FormGroup;
  error: ErrorMessage = {
    submitInvalid: false,
    errorMessage: { type: '', message: '' },
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<InvoiceDeliveryComponent>,
    private fb: FormBuilder,
    private memberService: MemberService,
    private notifierService: NotifierService
  ) {}

  /** confirm click */
  onSubmit(): void {
    this.applyChangeForm.markAllAsTouched();
    if (this.applyChangeForm.valid) {
      const param =
        this.applyChangeForm.value.status === 1
          ? {
              invoiceNo: this.data.invoiceNo,
              creationDate: this.data.creationDate,
              email: this.applyChangeForm.value.account,
            }
          : {
              invoiceNo: this.data.invoiceNo,
              creationDate: this.data.creationDate,
              email: this.applyChangeForm.value.email,
            };
      this.memberService.sendInvoice(param).subscribe((resp: any) => {
        if (resp.responseCode === ResponseCode.Success) {
          this.dialogRef.close(true);
          this.notifierService.showInfoNotification('發票已寄送成功');
        } else {
          this.error.submitInvalid = true;
          this.error.errorMessage = resp.errorMessage;
        }
      });
    }
  }

  ngOnInit(): void {
    this.applyChangeForm = this.fb.group({
      status: [1],
      account: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
    });

    this.applyChangeForm.get('email')?.disable();

    this.applyChangeForm.get('status')?.valueChanges.subscribe((value) => {
      if (value === 1) {
        this.applyChangeForm.get('email')?.disable();
        this.applyChangeForm.get('account')?.enable();
      } else {
        this.applyChangeForm.get('account')?.disable();
        this.applyChangeForm.get('email')?.enable();
      }
    });
  }
}
