import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DialogAction } from 'src/app/enums';

@Component({
  selector: 'app-common-cancel-confirm',
  templateUrl: './common-cancel-confirm.component.html',
  styleUrls: ['./common-cancel-confirm.component.scss']
})
export class CommonCancelConfirmComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      text: string;
      cancelButton: string;
      confirmButton: string;
    },
    public dialogRef: MatDialogRef<CommonCancelConfirmComponent>
  ) {}

  ngOnInit(): void {}

  /** cancel click */
  cancel(): void {
    this.dialogRef.close({ action: DialogAction.Cancel });
  }

  /** confirm click */
  save(): void {
    this.dialogRef.close({ action: DialogAction.Save });
  }
}
