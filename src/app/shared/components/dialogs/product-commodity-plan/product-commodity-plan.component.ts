import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogAction } from 'src/app/enums';

@Component({
  selector: 'app-product-commodity-plan',
  templateUrl: './product-commodity-plan.component.html',
  styleUrls: ['./product-commodity-plan.component.scss'],
})
export class ProductCommodityPlanComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProductCommodityPlanComponent>
  ) {}

  ngOnInit(): void {}

  /** cancel click */
  cancel(): void {
    this.dialogRef.close({
      action: DialogAction.Cancel,
      item: this.data.replaceItem,
    });
  }

  /** confirm click */
  save(): void {
    this.dialogRef.close({
      action: DialogAction.Save,
      item: this.data.replaceItem,
    });
  }
}
