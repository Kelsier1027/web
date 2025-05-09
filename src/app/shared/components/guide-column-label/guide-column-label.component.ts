/** --------------------------------------------------------------------------------
 *-- Description：guide column label
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, Input, OnInit } from '@angular/core';
import { Ioption } from '../../models';
import { DialogService } from '../../services';

@Component({
  selector: 'app-guide-column-label',
  templateUrl: './guide-column-label.component.html',
  styleUrls: ['./guide-column-label.component.scss'],
})
export class GuideColumnLabelComponent implements OnInit {
  @Input()
  option: Ioption = {
    type: 'link',
    title: '',
    hint: '',
    theme: undefined,
  };

  constructor(private dialogservice: DialogService) {}

  ngOnInit(): void {}

  /** open message modal */
  openModal(): void {
    const modelOption = {
      modelName: 'send-password',
      config: {
        data: {
          title: this.option.modal?.title,
          text: this.option.modal?.text,
          displayFooter: this.option.modal?.displayFooter,
          confirmButton: this.option.modal?.confirmButton,
        },
        width: '500px',
        height: '204px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: '',
      },
    };
    this.dialogservice.openLazyDialog(
      modelOption.modelName,
      modelOption.config
    );
  }
}
