import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogAction } from 'src/app/enums';

@Component({
  selector: 'app-product-commodity-change-cancel-cart',
  templateUrl: './product-commodity-change-cancel-cart.component.html',
  styleUrls: ['./product-commodity-change-cancel-cart.component.scss'],
})
export class ProductCommodityChangeCancelCartComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProductCommodityChangeCancelCartComponent>
  ) {}

  ngOnInit(): void {}

  /** cancel click */
  cancel(): void {
    this.dialogRef.close({ action: DialogAction.Cancel });
  }

  /** confirm click */
  save(): void {
    this.dialogRef.close({
      action: DialogAction.Save,
      item: this.data.replaceItem,
    });
  }
}
