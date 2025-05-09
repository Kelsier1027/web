/** --------------------------------------------------------------------------------
 *-- Description：訂單狀態
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-order-status-description',
  templateUrl: './order-status-description.component.html',
  styleUrls: ['./order-status-description.component.scss'],
})
export class OrderStatusDescriptionComponent implements OnInit {
  dataSource = [
    {
      status: '受理中',
      description: '經銷商已送出訂單',
    },
    {
      status: '已輸入',
      description: '精技訂單建立',
    },
    {
      status: '已預訂',
      description: '精技訂單已建立，正在下傳倉庫中（資料尚未到達倉庫）',
    },
    {
      status: '已出貨',
      description:
        '倉庫已將訂單之商品交給配送單位 <span class="span-warning">（不等於到貨）</span>',
    },
    {
      status: '結案',
      description: '訂單已配送完成',
    },
    {
      status: '已取消',
      description: '訂單已取消',
    },
  ];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<OrderStatusDescriptionComponent>
  ) {}

  ngOnInit(): void {}
}
