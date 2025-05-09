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
import { CustomerAccount } from 'src/app/models';

@Component({
  selector: 'app-company-info-row',
  templateUrl: './company-info-row.component.html',
  styleUrls: ['./company-info-row.component.scss'],
})
export class CompanyInfoRowComponent implements OnInit {
  @Input() account!: CustomerAccount;

  // Add by Tako At 2024/11/07 For 2024023106
  // 用於追蹤擴展面板的展開狀態
  panelOpenState: boolean = false;

  constructor() { }

  ngOnInit(): void { }
}
