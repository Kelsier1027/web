/** --------------------------------------------------------------------------------
 *-- Description： button
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  @Input() group!: FormGroup;
  @Input() field!: {
    type: string;
    label: string;
    inputType: string;
    name: string;
    color?: string;
    class?: string;
    stylePadding?: string;
    styleMargin?: string;
    styleFontWeight?: string;
    icon?: string;
    matType?: string;
  };

  constructor() {}
  ngOnInit(): void {}
}
