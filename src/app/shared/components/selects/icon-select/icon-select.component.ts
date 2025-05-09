/** --------------------------------------------------------------------------------
 *-- Description： icon select
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { Options } from 'src/app/shared/models';
import { DialogService } from 'src/app/shared/services';

@Component({
  selector: 'app-icon-select',
  templateUrl: './icon-select.component.html',
  styleUrls: ['./icon-select.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class IconSelectComponent implements OnInit {
  @Output() valueChange = new EventEmitter();
  @Input() isBindForm = true;
  @Input() group!: FormGroup;
  @Input()
  disabled!: boolean;
  @Input()
  hasNone: boolean = false;
  @Input()
  noneText: string = "取消選擇";
  @Input() field!: {
    type: string;
    label: string;
    labelStyles?: { [key: string]: string };
    inputType: string;
    name: string;
    options: Options[];
    value?: any;
    class?: string;
    stylePadding?: string;
    styleMargin?: string;
    placeholder: string;
    iconOption?: {
      iconName: string;
      modelOption: any;
      iconStyle?: { [key: string]: string };
    };
    validations?: {
      hasErrorMessage: boolean;
      errorMessage: any;
    };
  };
  constructor(
    private rootformGroup: FormGroupDirective,
    public dialogservice: DialogService
  ) {}

  ngOnInit(): void {
    if (this.isBindForm) {
      this.group = this.rootformGroup.control;
    }
  }

  /** open modal */
  async accountPermissionsModal(): Promise<void> {
    const modelName = this.field?.iconOption?.modelOption.modelName;
    const modelConfig = this.field?.iconOption?.modelOption.config;

    this.dialogservice.openLazyDialog(modelName, modelConfig);
  }

  change($event: any) {
    this.valueChange.emit($event);
  }
}
