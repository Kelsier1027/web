/** --------------------------------------------------------------------------------
 *-- Description： product card type
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-card-type',
  templateUrl: './product-card-type.component.html',
  styleUrls: ['./product-card-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardTypeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
