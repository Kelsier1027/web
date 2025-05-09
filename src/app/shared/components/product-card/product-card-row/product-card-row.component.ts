/** --------------------------------------------------------------------------------
 *-- Description： product card row
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-card-row',
  templateUrl: './product-card-row.component.html',
  styleUrls: ['./product-card-row.component.scss'],
})
export class ProductCardRowComponent implements OnInit {
  @Input()
  gap = 12;
  @Input()
  imgWidth = 100;
  constructor() {}

  ngOnInit(): void {}
}
