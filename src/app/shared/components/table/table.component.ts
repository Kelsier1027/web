/** --------------------------------------------------------------------------------
 *-- Description： table
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import {
  Component,
  Input,
  Directive,
  TemplateRef,
  ContentChildren,
  QueryList,
  AfterContentInit,
} from '@angular/core';
import { DialogService } from '../../services';

@Directive({
  selector: '[column]',
})
export class TableDirective {
  @Input()
  column!: {
    key: string;
    title: string;
    cellAlign?: string;
    headerAlign?: string;
    width?: number;
    icon?: string;
    modalOption?: any;
    sticky?: boolean;
  };
  constructor(public templateRef: TemplateRef<unknown>) {}
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export default class TableComponent implements AfterContentInit {
  displayedColumns!: string[];
  @Input()
  dataSource!: any[];
  @Input() noDataCaption = '無查詢結果';
  @ContentChildren(TableDirective) children!: QueryList<TableDirective>;

  constructor(public dialogService: DialogService) {}

  ngAfterContentInit(): void {
    // 避免datasource為空陣列，tabe header不顯示
    this.displayedColumns = this.children.map((c) => c.column.key);
  }

  /** open modal */
  handleDialog(modalOption: any): void {
    this.dialogService.openLazyDialog(
      modalOption?.modalName,
      modalOption?.modalConfig
    );
  }
}
