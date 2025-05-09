/** --------------------------------------------------------------------------------
 *-- Description： 公司資訊
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
  selector: 'app-company-notic-row',
  templateUrl: './company-notic-row.component.html',
  styleUrls: ['./company-notic-row.component.scss'],
})
export class CompanyNoticRowComponent implements OnInit {
  @Input() field!: {
    title: string;
    list: any[];
  };
  constructor() {}

  ngOnInit(): void {}
}
