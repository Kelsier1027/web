/** --------------------------------------------------------------------------------
 *-- Description：查看序號
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-serial-detail',
  templateUrl: './serial-detail.component.html',
  styleUrls: ['./serial-detail.component.scss'],
})
export class SerialDetailComponent implements OnInit {
  copyText: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { text: string; serial: string[] },
    public dialogRef: MatDialogRef<SerialDetailComponent>
  ) {}

  /** confirm click */
  onSubmit(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {}

  /** copy to clipboard */
  clipboard(text: string) {
    this.copyText = text;
  }
}
