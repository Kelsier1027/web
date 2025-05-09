import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogAction } from 'src/app/enums';

@Component({
  selector: 'app-product-commodity-cancel-confirm',
  templateUrl: './product-commodity-cancel-confirm.component.html',
  styleUrls: ['./product-commodity-cancel-confirm.component.scss'],
})
export class ProductCommodityCancelConfirmComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProductCommodityCancelConfirmComponent>
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
