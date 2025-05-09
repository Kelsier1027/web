/** --------------------------------------------------------------------------------
 *-- Description：layout
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
  selector: 'app-header-inline-close-layout',
  templateUrl: './header-inline-close-layout.component.html',
  styleUrls: ['./header-inline-close-layout.component.scss'],
})
export class HeaderInlineCloseLayoutComponent implements OnInit {
  @Input() data: any;
  @Input() otherData: any;
  @Input() detailUrl?: string;
  constructor() {}

  ngOnInit(): void {}
}
