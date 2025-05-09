/** --------------------------------------------------------------------------------
 *-- Description： product card badge
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, Input, OnInit } from '@angular/core';
import { Mapper, colorMapper } from './badge.config';
import { LayoutService } from 'src/app/shared/services';

@Component({
  selector: 'app-product-card-badge',
  templateUrl: './product-card-badge.component.html',
  styleUrls: ['./product-card-badge.component.scss'],
})
export class ProductCardBadgeComponent implements OnInit {
  @Input()
  productTag!: string;

  @Input()
  keepIcon: boolean = false;

  @Input() position?: string = "right";

  color = colorMapper;
  badgeConfig: { [index: string]: string } = Mapper

  get colorName() {
    return this.color.get(this.productTag) as string
  }

  constructor(public layoutService: LayoutService) {}

  ngOnInit(): void {}
}
