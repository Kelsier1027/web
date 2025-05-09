/** --------------------------------------------------------------------------------
 *-- Description： 即將到期紅利
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
import { BonusExpireSoonItem } from 'src/app/models';
import { ProductService } from 'src/app/services';
import { TableService } from 'src/app/shared/services/table.service';

@Component({
  selector: 'app-bonus-due',
  templateUrl: './bonus-due.component.html',
  styleUrls: ['./bonus-due.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class BonusDueComponent implements OnInit {
  dataSource: BonusExpireSoonItem[] = [];
  displayedColumns: string[] = ['dateline', 'bonusdue'];
  noDataCaption: string = "無查詢結果";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string,
      StyleMargin: string,
      contentHeight: string,
      expireSoonList: BonusExpireSoonItem[]
    },
    public dialogRef: MatDialogRef<BonusDueComponent>,
    public tableService: TableService,
    private productService: ProductService
  ) {}

  /** confirm click */
  onSubmit(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.dataSource = this.data.expireSoonList;
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
