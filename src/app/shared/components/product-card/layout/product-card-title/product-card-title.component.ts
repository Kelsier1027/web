/** --------------------------------------------------------------------------------
 *-- Description： product card title
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-product-card-title',
  templateUrl: './product-card-title.component.html',
  styleUrls: ['./product-card-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardTitleComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
