/** --------------------------------------------------------------------------------
 *-- Description： detail item
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
  selector: 'app-detail-item',
  templateUrl: './detail-item.component.html',
  styleUrls: ['./detail-item.component.scss'],
})
export class DetailItemComponent implements OnInit {
  @Input()
  title!: string;

  @Input()
  border = true;

  constructor() {}

  ngOnInit(): void {}
}
