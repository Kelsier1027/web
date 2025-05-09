/** --------------------------------------------------------------------------------
 *-- Description： product card price
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
  selector: 'app-product-card-price',
  templateUrl: './product-card-price.component.html',
  styleUrls: ['./product-card-price.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardPriceComponent implements OnInit {
  @Input()
  value!: string;

  constructor() {}

  ngOnInit(): void {}
}
