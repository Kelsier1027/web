/** --------------------------------------------------------------------------------
 *-- Description：預付清單
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
import { LayoutService } from 'src/app/shared/services';

@Component({
  selector: 'app-prepay',
  templateUrl: './prepay.component.html',
  styleUrls: ['./prepay.component.scss'],
})
export class PrepayComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PrepayComponent>,
    public layoutService: LayoutService
  ) {}

  ngOnInit(): void {}
}
