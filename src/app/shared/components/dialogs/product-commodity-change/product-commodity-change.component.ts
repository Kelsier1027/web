import { Component, Inject, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogAction } from 'src/app/enums';

@Component({
  selector: 'app-product-commodity-change',
  templateUrl: './product-commodity-change.component.html',
  styleUrls: ['./product-commodity-change.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class ProductCommodityChangeComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProductCommodityChangeComponent>
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
