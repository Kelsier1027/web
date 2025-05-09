/** --------------------------------------------------------------------------------
 *-- Description： label radio
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
import { Options } from 'src/app/shared/models';

@Component({
  selector: 'app-label-radio',
  templateUrl: './label-radio.component.html',
  styleUrls: ['./label-radio.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class LabelRadioComponent implements OnInit {
  @Input() group!: FormGroup;
  @Input() disabled!: boolean;
  @Input() field!: {
    type: string;
    label: string;
    inputType: string;
    name: string;
    options: Options[];
    value: any;
    color?: any;
    class?: 'inline' | '';
    stylePadding?: string;
    styleMargin?: string;
  };

  constructor() {}

  ngOnInit(): void {}
}
