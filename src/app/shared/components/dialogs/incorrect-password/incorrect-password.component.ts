/** --------------------------------------------------------------------------------
 *-- Description：密碼錯誤
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
  selector: 'app-incorrect-password',
  templateUrl: './incorrect-password.component.html',
  styleUrls: ['./incorrect-password.component.scss'],
})
export class IncorrectPasswordComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<IncorrectPasswordComponent>
  ) {}

  ngOnInit(): void {}
}
