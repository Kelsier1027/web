/** --------------------------------------------------------------------------------
 *-- Description： count input
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';

@Component({
  selector: 'app-count-input',
  templateUrl: './count-input.component.html',
  styleUrls: ['./count-input.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class CountInputComponent implements OnInit {
  @Input() group!: FormGroup;
  @Input() field!: {
    type: string;
    label: string;
    labelPosition: string;
    inputType: string;
    name: string;
    placeholder: string;
    hint: string;
    count: number;
    class?: string;
    stylePadding?: string;
    styleMargin?: string;
    validations: {
      hasErrorMessage: boolean;
      errorMessage: any;
    };
  };

  constructor(private rootformGroup: FormGroupDirective) {}

  ngOnInit(): void {
    this.group = this.rootformGroup.control;
  }
}
