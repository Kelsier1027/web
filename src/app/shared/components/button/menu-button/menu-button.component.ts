/** --------------------------------------------------------------------------------
 *-- Description： menu button
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
  selector: 'app-menu-button',
  templateUrl: './menu-button.component.html',
  styleUrls: ['./menu-button.component.scss'],
})
export class MenuButtonComponent implements OnInit {
  @Input()
  icon: string = '';
  @Input()
  config: any;
  @Input()
  updateTable: any;

  constructor() {}

  ngOnInit(): void {}

  /** click event */
  onClick(itemKey: any): void {
    this.updateTable.filter((item: any) =>
      item.key === itemKey ? (item.display = !item.display) : null
    );
  }
}
