/** --------------------------------------------------------------------------------
 *-- Description： product card tag
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
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-product-card-tag',
  templateUrl: './product-card-tag.component.html',
  styleUrls: ['./product-card-tag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardTagComponent implements OnChanges {
  className: { [key: string]: string } = {
    purple: 'purple',
    yellow: 'yellow',
    green: 'green',
    blue: 'blue',
    lightblue: 'lightblue',
    red: 'red',
    gray: 'gray',
    origin: 'origin',
    lightgreen:'lightgreen',
    orange: 'orange',
    none: '',
  };

  @Input()
  gap = true;

  @Input()
  wide = false;

  @Input()
  color!: string;

  currentClass!: string;

  @Input()
  padding: string = '1px 5px';

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    const color = changes['color'].currentValue;
    const isClassChange = changes['color'].previousValue !== color;
    isClassChange && (this.currentClass = this.className[color]);
  }
}
