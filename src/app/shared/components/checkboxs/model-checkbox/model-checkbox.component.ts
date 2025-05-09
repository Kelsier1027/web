/** --------------------------------------------------------------------------------
 *-- Description： checkbox with modal
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
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DialogService } from 'src/app/shared/services';

@Component({
  selector: 'app-model-checkbox',
  templateUrl: './model-checkbox.component.html',
  styleUrls: ['./model-checkbox.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class ModelCheckboxComponent implements OnInit {
  @Input() group!: FormGroup;
  @Input() field!: {
    type: string;
    label: string;
    name: string;
    modelName: string;
    class?: string;
    prefix?: string;
    suffix?: string;
    stylePadding?: string;
    styleMargin?: string;
    styleAlign?: string;
    validations: {
      hasErrorMessage: boolean;
      errorMessage: any;
    };
    modelOption: {
      modelName: string;
      config: any;
    };
  };
  constructor(public dialogservice: DialogService) {}

  /** open modal */
  async popModel(): Promise<void> {
    this.dialogservice.openLazyDialog(
      this.field.modelOption.modelName,
      this.field.modelOption.config
    );
  }

  ngOnInit(): void {}
}
