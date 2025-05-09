/** --------------------------------------------------------------------------------
 *-- Description： 登入 header
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, OnInit } from '@angular/core';
import { EnvConfig } from 'src/app/app.module';
import { Ioption } from 'src/app/shared/models';

@Component({
  selector: 'app-login-header',
  templateUrl: './login-header.component.html',
  styleUrls: ['./login-header.component.scss'],
})
export class LoginHeaderComponent implements OnInit {
  options!: Ioption[];

  constructor(private envConfig: EnvConfig) {}

  ngOnInit(): void {
    this.options = this.envConfig.loginGuide as Ioption[];
  }

  isJingHo(): boolean {
    return this.envConfig.orgId == 151;
  }
}
