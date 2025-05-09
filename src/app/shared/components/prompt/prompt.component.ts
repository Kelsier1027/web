/** --------------------------------------------------------------------------------
 *-- Description： Prompt
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
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss'],
})
export class PromptComponent implements OnInit {
  @Input()
  hint: { type: string; message: string } = { type: 'info', message: '' };
  @Input()
  mode?: 'outline';
  constructor() {}

  ngOnInit(): void {}
}
