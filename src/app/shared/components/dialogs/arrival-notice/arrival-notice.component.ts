import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { DialogAction, ResponseCode } from 'src/app/enums';
import { ArrivalNotice } from 'src/app/models';
import { ProductService } from 'src/app/services';
import { Options } from 'src/app/shared/models';
import { DialogService, NotifierService } from 'src/app/shared/services';

@Component({
  selector: 'app-arrival-notice',
  templateUrl: './arrival-notice.component.html',
  styleUrls: ['./arrival-notice.component.scss'],
})
export class ArrivalNoticeComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ArrivalNoticeComponent>,
    private fb: FormBuilder,
    private productService: ProductService,
    private notifierService: NotifierService,
    public dialogservice: DialogService,
  ) {}

  group!: FormGroup;
  countOption = {
    type: 'incrementInput',
    _label: '',
    label: '',
    inputType: 'number',
    name: 'itemQTY',
    class: '',
    _value: 0,
    _step: 1,
    _min: 0,
    _max: Infinity,
    _wrap: false,
    color: 'primary',
  };
  detail!: ArrivalNotice;
  subInventories!: Options[];
  mailList!: Options[];
  notificationMail!: string[];
  minDate!: string;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.notificationMail = [];
    this.minDate = moment().format('YYYY-MM-DDTHH:mm:ss.sss');
    this.group = this.fb.group({
      itemQTY: [],
      // promotion: [''],
      subinventoryCode: ['', Validators.required],
      status: [1],
      account: [''],
      email: ['', Validators.compose([Validators.email])],
      deadline: [
        new Date(new Date().setDate(new Date().getDate() + 14)),
        Validators.required,
      ],
    });
    this.isLoading = true;
    this.productService.getArrivalNotice(this.data.itemId)
    .subscribe((res) => {
      this.isLoading = false;
      if (res.responseCode === ResponseCode.Success) {
        this.detail = res.result;
        this.subInventories = this.detail.subinventoryList.map((inventory) => {
          return {
            value: inventory.subinventoryCode,
            label: inventory.subinventoryName,
          };
        });
        this.mailList = this.detail.mailList.map((mail) => {
          return {
            value: mail.mail,
            label: mail.mailString,
          };
        });
        this.notificationMail.push(this.detail.userMail);
      }
    });
    this.group.get('subinventoryCode')?.valueChanges.subscribe((value) => {
      const inventory = this.detail.subinventoryList.find(
        (data) => data.subinventoryCode === value
      );
      inventory && (this.countOption._value = inventory.minCount);
    });
    this.group.get('status')?.valueChanges.subscribe((value) => {
      if (value === 1) {
        this.group.get('account')?.enable();
        this.group.get('email')?.disable();
      } else {
        this.group.get('account')?.disable();
        this.group.get('email')?.enable();
      }
    });
  }

  /** cancel click */
  cancel(): void {
    this.dialogRef.close({ action: DialogAction.Cancel });
  }

  /** confirm click */
  save(): void {
    this.group.markAllAsTouched();
    if (this.group.valid && this.countOption._value > 0) {
      const param = {
        itemId: this.data.itemId,
        itemSeg: this.data.itemSeg,
        itemQTY: this.countOption._value,
        deadline: this.group.get('deadline')?.value,
        notificationMail: this.notificationMail.join(','),
        type: 'Arrival Notice',
        subinventoryCode: this.group.get('subinventoryCode')?.value,
      };
      this.isLoading = true;
      this.productService
      .arrivalNotice(param)
      .subscribe((res) => {
        this.isLoading = false;
        if (res.responseCode === ResponseCode.Success) {
          this.notifierService.showInfoNotification('商品已加入貨到通知');
          this.dialogRef.close({ action: DialogAction.Save });
        } else {
          //this.notifierService.showErrorNotification(res.responseMessage);
          const modelOption = {
            modelName: 'simple-dialog',
            config: {
              data: {
                title: '貨到通知申請結果',
                StyleMargin: '0px',
                message: res.responseMessage,
                warning: true,
                displayFooter: true,
                confirmButton: '確認',
                confirm: () => this.dialogRef.close({ action: DialogAction.Save }),
                cancel: () => this.dialogRef.close({ action: DialogAction.Save }),
              },
              width: '500px',
              height: '234px',
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
        }
      });
    }
  }

  add(): void {
    switch (this.group.get('status')?.value) {
      case 1:
        const account = this.group.get('account')?.value;
        if (account) {
          !this.notificationMail.some((item) => item === account) &&
            this.notificationMail.push(account);
        }
        break;
      case 2:
        const mail = this.group.get('email')?.value;
        if (mail && this.group.get('email')?.valid) {
          !this.notificationMail.some((item) => item === mail) &&
            this.notificationMail.push(mail);
        }
        break;
    }
  }
  delete(index: number): void {
    this.notificationMail.splice(index, 1);
  }
}
