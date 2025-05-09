/** --------------------------------------------------------------------------------
 *-- Description： 修改常用出貨備註
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
import { DeliveryRemark, ErrorMessage } from 'src/app/models';
import { MemberService } from 'src/app/services';
import { NotifierService } from 'src/app/shared/services';
import { LayoutService } from 'src/app/shared/services/layout.service';

@Component({
  selector: 'app-create-delivery-remark',
  templateUrl: './create-delivery-remark.component.html',
  styleUrls: ['./create-delivery-remark.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class CreateDeliveryRemarkComponent implements OnInit {
  createDeliveryAddressForm!: FormGroup;
  error: ErrorMessage = {
    submitInvalid: false,
    errorMessage: { type: '', message: '' },
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateDeliveryRemarkComponent>,
    private fb: FormBuilder,
    public layoutService: LayoutService,
    private memberService: MemberService,
    private notifierService: NotifierService
  ) {}

  /** confirm click */
  onSubmit(): void {
    const isEdit = !!this.data.oldData.id;
    this.createDeliveryAddressForm.markAllAsTouched();
    if (this.createDeliveryAddressForm.valid) {
      const api = isEdit
        ? this.memberService.editDeliveryRemark(
            this.data.oldData.id,
            this.createDeliveryAddressForm.value
          )
        : this.memberService.addDeliveryRemark(
            this.createDeliveryAddressForm.value
          );
      api.subscribe((resp: any) => {
        if (resp.responseCode === ResponseCode.Success) {
          this.dialogRef.close(true);
          this.notifierService.showInfoNotification(
            isEdit ? '常用出貨備註已修改成功' : '常用出貨備註已新增成功'
          );
        } else {
          this.error.submitInvalid = true;
          this.error.errorMessage = resp.errorMessage;
        }
      });
    }
  }
  ngOnInit(): void {
    const oldData = this.data.oldData as DeliveryRemark;
    this.createDeliveryAddressForm = this.fb.group({
      title: [
        oldData ? oldData.title : '',
        Validators.compose([Validators.required]),
      ],
      comment: [
        oldData ? oldData.comment : '',
        Validators.compose([Validators.required]),
      ],
    });
  }
}
