import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogAction, ResponseCode } from 'src/app/enums';
import { DialogService, NotifierService } from 'src/app/shared/services';
import { ProductService } from 'src/app/services';
import { Options } from 'src/app/shared/models';
import { ArrivalNotice } from 'src/app/models';
import { EnvConfig } from 'src/app/app.module';

@Component({
  selector: 'app-product-remind-me',
  templateUrl: './product-remind-me.component.html',
  styleUrls: ['./product-remind-me.component.scss'],
})
export class ProductRemindMeComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProductRemindMeComponent>,
    private fb: FormBuilder,
    private productService: ProductService,
    private notifierService: NotifierService,
    private envConfig: EnvConfig,
    public dialogservice: DialogService
  ) {}

  detail!: ArrivalNotice;
  group!: FormGroup;
  mailList!: Options[];
  notificationMail!: string[];

  ngOnInit(): void {
    this.notificationMail = [];
    this.group = this.fb.group({
      status: [1],
      account: [''],
      email: ['', Validators.compose([Validators.email])],
    });
    this.productService.getArrivalNotice(this.data.itemId).subscribe((res) => {
      if (res.responseCode === ResponseCode.Success) {
        this.detail = res.result;
        this.mailList = this.detail.mailList.map((mail) => {
          return {
            value: mail.mail,
            label: mail.mailString,
          };
        });
        this.notificationMail.push(this.detail.userMail);
      }
    })
  }

  openModal(): void {
    const modelOption = {
      modelName: 'black-text-dialog',
      config: {
        data: {
          text: '已成功新增提醒，請耐心等候活動開始',
        },
        width: '368px',
        height: '142px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: 'blackDialog',
      },
    };

    this.dialogservice.openLazyDialog(
      modelOption.modelName,
      modelOption.config
    );
  }

  /** cancel click */
  cancel(): void {
    this.dialogRef.close({ action: DialogAction.Cancel });
  }

  /** confirm click */
  save(): void {
    this.group.markAllAsTouched();
    if (this.group.valid) {
      const param = {
        orgId: this.envConfig.orgId,
        itemId: this.data.itemId,
        promoId: this.data.promoId.id,
        email: this.notificationMail,
      };
      this.productService.remindSale(param).subscribe((res) => {
        if (res.responseCode === ResponseCode.Success) {
          this.openModal();
          this.dialogRef.close({ action: DialogAction.Save });
        } else {
          this.notifierService.showErrorNotification(res.responseMessage);
        }
      })
    }
  }

  add(): void {
    switch (this.group.get('status')?.value) {
      case 1:
        const account = this.group.get('account')?.value;
        if(account) {
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
