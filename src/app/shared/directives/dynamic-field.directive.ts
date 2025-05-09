/** --------------------------------------------------------------------------------
 *-- Description： dynamic field directive
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Directive, Input, ViewContainerRef, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  ButtonComponent,
  LabelInputComponent,
  ModelCheckboxComponent,
  PasswordInputComponent,
  ReCaptchaComponent,
  IconSelectComponent,
  ChecboxTermsOfUseComponent,
  TextareaInputComponent,
  DateRangeFilterComponent,
  DateInputComponent,
} from '../components';

@Directive({
  selector: '[appDynamicField]',
})
export class DynamicFieldDirective implements OnInit {
  componentMapper: any = {
    input: LabelInputComponent,
    password: PasswordInputComponent,
    button: ButtonComponent,
    select: LabelInputComponent,
    date: LabelInputComponent,
    radiobutton: LabelInputComponent,
    checkbox: ModelCheckboxComponent,
    modelcheckbox: ModelCheckboxComponent,
    checkboxTerms: ChecboxTermsOfUseComponent,
    reCaptcha: ReCaptchaComponent,
    iconSelect: IconSelectComponent,
    textareaInput: TextareaInputComponent,
    daterangefilter: DateRangeFilterComponent,
    dateInput: DateInputComponent,
  };

  @Input() field!: any;
  @Input() group!: FormGroup;
  componentRef: any;
  constructor(private container: ViewContainerRef) {}

  ngOnInit(): void {
    this.componentRef = this.container.createComponent(
      this.componentMapper[this.field.type]
    );
    this.componentRef.instance.field = this.field;
    this.componentRef.instance.group = this.group;
  }
}
