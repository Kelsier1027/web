import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DialogAction } from "../../../../enums";

@Component({
  selector: 'app-product-commodity-delete-notify',
  templateUrl: './product-commodity-delete-notify.component.html',
  styleUrls: ['./product-commodity-delete-notify.component.scss']
})
export class ProductCommodityDeleteNotifyComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProductCommodityDeleteNotifyComponent>
  ) {}

  ngOnInit(): void {}

  /** cancel click */
  cancel(): void {
    this.dialogRef.close({ action: DialogAction.Delete });
  }

  /** confirm click */
  save(): void {
    this.dialogRef.close({
      action: DialogAction.Notify,
      item: this.data.replaceItem,
    });
  }
}
