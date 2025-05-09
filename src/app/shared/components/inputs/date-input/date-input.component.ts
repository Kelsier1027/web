/** --------------------------------------------------------------------------------
 *-- Description：date input
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, Input, LOCALE_ID, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DATETIME_FORMATS } from '@mat-datetimepicker/core';
import { DynamicFormConfig } from 'src/app/models';

const DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM/DD',
    monthInput: 'MMMM',
    timeInput: 'LT',
    datetimeInput: 'L LT',
  },
  display: {
    dateInput: 'YYYY/MM/DD',
    monthInput: 'MMMM',
    datetimeInput: 'L LT',
    timeInput: 'LT',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
    popupHeaderDateLabel: 'MM/DD',
  },
};

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
  providers: [
    {
      provide: MAT_DATE_LOCALE,
      useExisting: LOCALE_ID,
    },
    { provide: MAT_DATETIME_FORMATS, useValue: DATE_FORMATS },
  ],
})
export class DateInputComponent implements OnInit {
  @Input() group!: FormGroup;
  @Input() field!: DynamicFormConfig;
  @Input() disabled!: boolean;
  minCreateDate!: string;

  constructor(private rootformGroup: FormGroupDirective) {}

  ngOnInit(): void {
    // this.group = this.rootformGroup.control;
    // this.minCreateDate = this.field.minCreateDate!;
  }

  onDataChange(): void {}
}
