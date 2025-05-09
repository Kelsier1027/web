/** --------------------------------------------------------------------------------
 *-- Description：查看序號
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
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ResponseCode } from 'src/app/enums';
import { ErrorMessage } from 'src/app/models';
import { MemberService } from 'src/app/services';
import { DialogService } from 'src/app/shared/services';

@Component({
  selector: 'app-serial-list',
  templateUrl: './serial-list.component.html',
  styleUrls: ['./serial-list.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class SerialListComponent implements OnInit {
  serialForm!: FormGroup;
  error: ErrorMessage = {
    submitInvalid: false,
    errorMessage: { type: '', message: '' },
  };
  apiResponse!: Observable<{ value: string; label: string }[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      inventoryItem: string;
      title: string;
      text: string;
      purchaseNumber: string;
      purchaseId: number;
      serialIds: number[];
      dealerView?: string | null;
    },
    public dialogRef: MatDialogRef<SerialListComponent>,
    private fb: FormBuilder,
    private memberService: MemberService,
    public dialogservice: DialogService
  ) {}

  /** confirm click */
  onSubmit(): void {
    this.serialForm.markAllAsTouched();
    if (this.serialForm.valid) {
      const param = {
        purchaseNumber: this.data.purchaseNumber,
        purchaseId: this.data.purchaseId,
        serialIds: this.data.serialIds,
        password: this.serialForm.value.password,
        dealerView: this.data.dealerView
      };
      this.memberService.getSerialNumber(param).subscribe((resp: any) => {
        if (resp.responseCode === ResponseCode.Success) {
          this.dialogRef.close(true);
          const modelOption = {
            modelName: 'serial-detail',
            config: {
              data: {
                title: '查看序號',
                text: this.data.inventoryItem,
                serial: resp.result,
              },
              width: '500px',
              height: '422px',
              hasBackdrop: true,
              autoFocus: false,
              enterAnimationDuration: '300ms',
              exitAnimationDuration: '300ms',
              panelClass: 'apply-to-change-panel',
            },
          };
          this.dialogservice.openLazyDialog(
            modelOption.modelName,
            modelOption.config
          );
        } else {
          this.error.submitInvalid = true;
          this.error.errorMessage = resp.errorMessage;
        }
      });
    }
  }

  ngOnInit(): void {
    this.serialForm = this.fb.group({
      password: ['', Validators.compose([Validators.required])],
    });
  }
}
