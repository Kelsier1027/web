/** --------------------------------------------------------------------------------
 *-- Description： icon label
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon-label',
  templateUrl: './icon-label.component.html',
  styleUrls: ['./icon-label.component.scss'],
})
export class IconLabelComponent implements OnInit {
  @Input()
  option = {
    icon: '',
    lable: '',
    class: '',
    custom: true,
  };

  constructor() {}

  ngOnInit(): void {}
}
