/** --------------------------------------------------------------------------------
 *-- Description： 登入 footer
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
import { DialogService } from 'src/app/shared/services';

@Component({
  selector: 'app-login-footer',
  templateUrl: './login-footer.component.html',
  styleUrls: ['./login-footer.component.scss'],
})
export class LoginFooterComponent implements OnInit {
  year!: number;
  thisOrgId: any;

  constructor(private dialogservice: DialogService,
    private envConfig: EnvConfig
  ) {}

  ngOnInit(): void {
    this.year = new Date().getFullYear();
  }

  /** open Modal */
  openModal(): void {
    const modelOption = {
      modelName: 'terms-of-service',
      config: {
        data: {
          title: '會員約定同意書',
          StyleWidthFooter: '430px',
        },
        width: '820px',
        height: '600px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: 'terms-of-service-dialog',
      },
    };
    this.dialogservice.openLazyDialog(
      modelOption.modelName,
      modelOption.config
    );
  }

  isJingHo(): boolean {
    return this.envConfig.orgId == 151;
  }
}
