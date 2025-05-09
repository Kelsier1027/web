/** --------------------------------------------------------------------------------
 *-- Description： status filter
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
  ContentChildren,
  Directive,
  Input,
  OnInit,
  QueryList,
  TemplateRef,
  EventEmitter,
  Output,
} from '@angular/core';
import { FilterService } from '../../services/filter.service';

@Directive({
  selector: '[filterConfig]',
})
export class StatusFilterDirective {
  @Input()
  filterConfig!: {
    value: { status: number };
    isShowTotalCount?: boolean;
  };
  constructor(public templateRef: TemplateRef<unknown>) {}
}

@Component({
  selector: 'app-status-filter',
  templateUrl: './status-filter.component.html',
  styleUrls: ['./status-filter.component.scss'],
})
export class StatusFilterComponent implements OnInit {
  @Input()
  activeIndex = 0;
  @ContentChildren(StatusFilterDirective)
  children!: QueryList<StatusFilterDirective>;
  @Output() tabChange = new EventEmitter<any>();
  constructor(public filterService: FilterService) {}

  ngOnInit(): void {}

  /** tab click */
  onTabChange(value: any, index: number) {
    this.activeIndex = index;
    this.tabChange.emit(value);
  }
}
