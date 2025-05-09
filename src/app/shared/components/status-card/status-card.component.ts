/** --------------------------------------------------------------------------------
 *-- Description： status card
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
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  TemplateRef,
} from '@angular/core';

@Directive({
  selector: '[statusItem]',
})
export class StatusItemDirective {
  @Input()
  statusItem!: {
    isColumn?: boolean;
    title?: string;
  };
  constructor(public templateRef: TemplateRef<unknown>) {}
}
@Component({
  selector: 'app-status-card',
  templateUrl: './status-card.component.html',
  styleUrls: ['./status-card.component.scss'],
})
export class StatusCardComponent implements OnInit {
  @Input()
  isActive?: boolean;
  @Input()
  shortenedHeight!: number;
  constructor() {}

  isExtend = false;
  @ContentChild('headerTitle') headerTitle!: TemplateRef<ElementRef>;
  @ContentChild('headerEnd') headerEnd!: TemplateRef<ElementRef>;

  @ContentChildren(StatusItemDirective) items!: QueryList<StatusItemDirective>;
  ngOnInit(): void {}
}
