/** --------------------------------------------------------------------------------
 *-- Description：會員約定同意書
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { ResponseCode } from 'src/app/enums';
import { EnvConfig } from 'src/app/app.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-terms-of-service',
  templateUrl: './terms-of-service.component.html',
  styleUrls: ['./terms-of-service.component.scss'],
})
export class TermsOfServiceComponent implements OnInit {
  memberRight!: string;
  confirmDisabled!: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ForgetPasswordComponent>,
    private authService: AuthService,
    private envConfig: EnvConfig
  ) {}

  ngOnInit(): void {
    this.confirmDisabled = this.data?.confirmDisabled && true;

    this.authService
      .memberRight(this.envConfig.orgId)
      .subscribe((resp: any) => {
        resp.responseCode === ResponseCode.Success &&
          (this.memberRight = resp.result.memberRight);
      });
  }
}
