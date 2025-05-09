/** --------------------------------------------------------------------------------
 *-- Description： 帳號權限
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, Inject, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

const ELEMENT_DATA = [
  {
    function: '登入系統',
    Admin: 'yes',
    Sales: 'yes',
    Account: 'yes',
    Buyer: 'yes',
    AccountBuyer: 'yes',
    Receiver: 'no',
  },
  {
    function: '下單作業',
    Admin: 'yes',
    Sales: 'no',
    Account: 'no',
    Buyer: 'yes',
    AccountBuyer: 'yes',
    Receiver: 'no',
  },
  {
    function: '收貨人',
    Admin: 'yes',
    Sales: 'no',
    Account: 'yes',
    Buyer: 'yes',
    AccountBuyer: 'yes',
    Receiver: 'yes',
  },
  {
    function: '紅利好康',
    Admin: 'yes',
    Sales: 'no',
    Account: 'yes',
    Buyer: 'yes',
    AccountBuyer: 'yes',
    Receiver: 'no',
  },
  {
    function: '訂單查詢',
    Admin: 'all order',
    Sales: 'no',
    Account: 'all order',
    Buyer: '該會員訂單',
    AccountBuyer: 'all order',
    Receiver: 'no',
  },
  {
    function: '帳單查詢',
    Admin: 'all order',
    Sales: 'no',
    Account: 'all order',
    Buyer: '該會員訂單',
    AccountBuyer: 'all order',
    Receiver: 'no',
  },
  {
    function: '會員中心',
    Admin: 'yes',
    Sales: 'no',
    Account: 'yes',
    Buyer: 'yes',
    AccountBuyer: 'yes',
    Receiver: 'no',
  },
];
@Component({
  selector: 'app-account-permissions',
  templateUrl: './account-permissions.component.html',
  styleUrls: ['./account-permissions.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class AccountPermissionsComponent implements OnInit {
  displayedColumns = [
    'function',
    'Admin',
    'Sales',
    'Account',
    'Buyer',
    'AccountBuyer',
    'Receiver',
  ];
  dataSource = ELEMENT_DATA;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AccountPermissionsComponent>
  ) {}

  ngOnInit(): void {}
}
