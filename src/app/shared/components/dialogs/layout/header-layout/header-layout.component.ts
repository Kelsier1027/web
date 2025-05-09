/** --------------------------------------------------------------------------------
 *-- Description：layout
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header-layout',
  templateUrl: './header-layout.component.html',
  styleUrls: ['./header-layout.component.scss']
})
export class HeaderLayoutComponent implements OnInit {
  @Input()
  confirm = () => {};
  @Input()
  cancel = () => {};
  @Input() data: any;
  @Input() otherData: any;
  constructor() {}

  ngOnInit(): void {}

  onConfirm() {
    this.confirm && this.confirm();
  }

  onCancel() {
    this.cancel && this.cancel();
  }
}
