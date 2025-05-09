/** --------------------------------------------------------------------------------
 *-- Description： status type
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
  selector: 'app-status-type',
  templateUrl: './status-type.component.html',
  styleUrls: ['./status-type.component.scss'],
})
export class StatusTypeComponent implements OnInit {
  @Input()
  color!: string;
  constructor() {}

  ngOnInit(): void {}
}
