/** --------------------------------------------------------------------------------
 *-- Description： 登入 guide
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { EnvConfig } from 'src/app/app.module';
import { Component, OnInit } from '@angular/core';
import { Ioption } from 'src/app/shared/models';

@Component({
  selector: 'app-login-guide-row',
  templateUrl: './login-guide-row.component.html',
  styleUrls: ['./login-guide-row.component.scss'],
})
export class LoginGuideRowComponent implements OnInit {
  options!: Ioption[];
  constructor(private envConfig: EnvConfig) {}

  ngOnInit(): void {
    this.options = this.envConfig.loginGuide as Ioption[];
  }
}
