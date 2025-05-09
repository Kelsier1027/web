/** --------------------------------------------------------------------------------
 *-- Description： 儲存變更
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, Inject, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogAction } from 'src/app/enums';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-added-to-shopping-cart',
  templateUrl: './product-added-to-shopping-cart.component.html',
  styleUrls: ['./product-added-to-shopping-cart.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class ProductAddedToShoppingCartComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ProductAddedToShoppingCartComponent>,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  /** cancel click */
  cancel(): void {
    this.dialogRef.close({ action: DialogAction.Cancel });
  }

  /** confirm click */
  save(): void {
    this.router.navigate(['/ShoppingCart']);
    this.dialogRef.close({ action: DialogAction.Save });
  }
}
