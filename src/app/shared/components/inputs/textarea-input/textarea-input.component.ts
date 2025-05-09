/** --------------------------------------------------------------------------------
 *-- Description： textarea input
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
  FormGroupDirective,
  ControlContainer,
  FormGroup,
} from '@angular/forms';
import { DialogService } from 'src/app/shared/services';

@Component({
  selector: 'app-textarea-input',
  templateUrl: './textarea-input.component.html',
  styleUrls: ['./textarea-input.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class TextareaInputComponent implements OnInit {
  @Input() group!: FormGroup;
  @Input() field!: {
    type: string;
    label: string;
    labelPosition?: string;
    inputType: string;
    value: any;
    name: string;
    placeholder: string;
    hint: string;
    class?: string;
    stylePadding?: string;
    styleMargin?: string;
    isModal: boolean;
    validations: {
      hasErrorMessage: boolean;
      errorMessage: any;
    };
    count: number;
  };

  constructor(
    private rootformGroup: FormGroupDirective,
    public dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.group = this.rootformGroup.control;
  }

  /** open 選擇常用原因 modal */
  handleModal(): void {
    const modelOption = {
      modelName: 'reson',
      config: {
        data: {
          title: '選擇常用原因',
          canelButton: '取消',
          confirm: '確認',
          resonForm: [
            {
              type: 'radiobutton',
              label: '使用權限',
              inputType: 'radio',
              name: 'reason',
              options: [
                {
                  value: 'option1',
                  name: '貴公司(單位)非電腦及事務性機器設備經銷商，不符合iOrder會員申請條件，謝謝',
                },
                {
                  value: 'option2',
                  name: '貴公司屬性不符合iOrder會員，有產品需求還請洽業務 姓名+電話 聯繫',
                },
                {
                  value: 'option3',
                  name: '業務尚未收到貴公司資料，請與業務 姓名+電話 聯繫，謝謝',
                },
                {
                  value: 'option4',
                  name: '業務通知已致電聯繫您, 得知貴司目前無需求下單；故先不開通會員，如有疑問請與業務 姓名+電話 聯繫',
                },
              ],
              value: '',
              color: 'primary',
            },
          ],
        },
        width: '480px',
        height: '448px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: '',
      },
    };
    this.dialogService
      .openLazyDialog(modelOption.modelName, modelOption.config)
      .then((ref) => {
        ref.afterClosed().subscribe((res) => {
          res &&
            modelOption.config.data.resonForm[0].options.filter((item: any) => {
              if (item.value === res.value.reason) {
                this.group.patchValue({
                  [this.field.name]: item.name,
                });
                this.field.value = item.name;
              }
            });
        });
      });
  }
}
