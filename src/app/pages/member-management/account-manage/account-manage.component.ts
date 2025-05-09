/** --------------------------------------------------------------------------------
 *-- Description： 帳號管理
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, OnInit } from '@angular/core';
import { DialogService } from 'src/app/shared/services';

@Component({
  selector: 'app-account-manage',
  templateUrl: './account-manage.component.html',
  styleUrls: ['./account-manage.component.scss'],
})
export class AccountManageComponent implements OnInit {
  constructor(public dialogservice: DialogService) {}

  ngOnInit(): void {}

  /** handle delete modal */
  handleDelModal(): void {}
}
