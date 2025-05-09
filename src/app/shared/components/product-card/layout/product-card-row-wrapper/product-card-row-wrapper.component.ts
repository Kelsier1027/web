/** --------------------------------------------------------------------------------
 *-- Description： product card row wrapper
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-product-card-row-wrapper',
  templateUrl: './product-card-row-wrapper.component.html',
  styleUrls: ['./product-card-row-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardRowWrapperComponent implements OnInit {
  @Input() wrapperStyles = {};
  constructor() {}

  ngOnInit(): void {}
}
