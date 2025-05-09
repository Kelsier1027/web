/** --------------------------------------------------------------------------------
 *-- Description： mobile table item
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
  selector: 'app-mobile-table-item',
  templateUrl: './mobile-table-item.component.html',
  styleUrls: ['./mobile-table-item.component.scss'],
})
export class MobileTableItemComponent implements OnInit {
  @Input()
  isLast!: boolean;
  constructor() {}

  ngOnInit(): void {}
}
