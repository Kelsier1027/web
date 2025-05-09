/** --------------------------------------------------------------------------------
 *-- Description： 儲存變更
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
import { DialogAction } from 'src/app/enums';

@Component({
  selector: 'app-discard-changes',
  templateUrl: './discard-changes.component.html',
  styleUrls: ['./discard-changes.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class DiscardChangesComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DiscardChangesComponent>
  ) {}

  ngOnInit(): void {}

  /** cancel click */
  cancel(): void {
    this.dialogRef.close({ action: DialogAction.Cancel });
  }

  /** discard click */
  discard(): void {
    this.dialogRef.close({ action: DialogAction.Discard });
  }

  /** confirm click */
  save(): void {
    this.dialogRef.close({ action: DialogAction.Save });
  }
}
