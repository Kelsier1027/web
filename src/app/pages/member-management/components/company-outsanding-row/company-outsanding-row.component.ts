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
  selector: 'app-company-outsanding-row',
  templateUrl: './company-outsanding-row.component.html',
  styleUrls: ['./company-outsanding-row.component.scss'],
})
export class CompanyOutsandingRowComponent implements OnInit {
  @Input() account!: CustomerAccount;

  constructor() {}

  ngOnInit(): void {}
}
