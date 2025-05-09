/** --------------------------------------------------------------------------------
 *-- Description： 商品頁 layout
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, Input, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/shared/services';

@Component({
  selector: 'app-product-layout',
  templateUrl: './product-layout.component.html',
  styleUrls: ['./product-layout.component.scss'],
})
export class ProductLayoutComponent implements OnInit {
  currentScreenSize: string = '';
  @Input() gap: string = '32px';
  constructor(public layoutService: LayoutService) {}

  ngOnInit(): void {}
}
