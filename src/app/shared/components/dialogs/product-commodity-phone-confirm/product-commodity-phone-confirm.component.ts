import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogAction } from 'src/app/enums';

@Component({
  selector: 'app-product-commodity-phone-confirm',
  templateUrl: './product-commodity-phone-confirm.component.html',
  styleUrls: ['./product-commodity-phone-confirm.component.scss'],
})
export class ProductCommodityPhoneConfirmComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProductCommodityPhoneConfirmComponent>
  ) {}

  ngOnInit(): void {}

  /** cancel click */
  cancel(): void {
    this.dialogRef.close({ action: DialogAction.Cancel });
  }

  /** confirm click */
  save(): void {
    this.dialogRef.close({ action: DialogAction.Save });
  }
}
