/** --------------------------------------------------------------------------------
 *-- Description： product card footer
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-card-footer',
  templateUrl: './product-card-footer.component.html',
  styleUrls: ['./product-card-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardFooterComponent implements OnInit {
  @Input()
  border?: boolean
  constructor() {}

  ngOnInit(): void {}
}
