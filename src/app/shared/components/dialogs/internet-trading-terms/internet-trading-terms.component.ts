/** --------------------------------------------------------------------------------
 *-- Description：寄送密碼 / Message box
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, Inject, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MemberService } from 'src/app/services';
import { DialogService, LayoutService } from 'src/app/shared/services';

@Component({
  selector: 'app-internet-trading-terms',
  templateUrl: './internet-trading-terms.component.html',
  styleUrls: ['./internet-trading-terms.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class InternetTradingTermsComponent implements OnInit {
  orderLaw = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<InternetTradingTermsComponent>,
    public layoutService: LayoutService,
    public dialogservice: DialogService,
    private memberService: MemberService
  ) {}

  ngOnInit(): void {
    this.memberService.getTermsAndConditions(2).subscribe((resp) => {
      this.orderLaw = resp.result.htmlText;
    });
  }
}
