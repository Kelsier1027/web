/** --------------------------------------------------------------------------------
 *-- Description： 匯款銀行資訊
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { MemberService } from 'src/app/services/member.service'; //Add by Tako on 2025/02/11 For No.2024037103
import { ErrorMessageMap } from 'src/app/core/constant/error-message-map.constant'; //Add by Tako on 2025/02/12 For No.2024037103

@Component({
  selector: 'app-company-bank-row',
  templateUrl: './company-bank-row.component.html',
  styleUrls: ['./company-bank-row.component.scss'],
})
export class CompanyBankRowComponent implements OnInit {
  @Input() taxReference!: string;
  @ViewChild('infoTooltip') infoTooltip?: MatTooltip;
  currentScreenSize: String = 'large';
  personCustNo: string = ''; //Add by Tako on 2025/02/11 For No.2024037103
  errorMessage: { type: string; message: string } = { type: '', message: '' };

  constructor(
    private layoutService: LayoutService,
    private memberService: MemberService //Add by Tako on 2025/02/11 For No.2024037103
  ) { }

  ngOnInit(): void {
    this.layoutService.layoutChanges$.subscribe((size) => {
      this.currentScreenSize = size;
    });

    // Add by Tako on 2025/02/12 For No.2024037103
    // 當 taxReference 為 "12215548" 時，從 API 取得 personCustNo
    if (this.taxReference === '12215548') {
      this.memberService.getPersonCustNo().subscribe({
        next: (res: any) => {
          this.personCustNo = res.personCustNo;
        },
        error: (err: any) => {
          console.error('取得 PERSON_CUST_NO 失敗', err);

          // 取得錯誤代碼
          const errorCode = err.status ?? 0;
          // 顯示對應的錯誤訊息
          this.errorMessage.message = ErrorMessageMap[errorCode]?.message || '發生未知錯誤，請稍後再試';
        },
      });
    }
  }

  displayTooltip() {
    if (this.currentScreenSize !== 'small') return;

    if (!this.infoTooltip) return;
    this.infoTooltip.disabled = false;
    this.infoTooltip?.show();

    setTimeout(() => {
      if (!this.infoTooltip) return;
      this.infoTooltip.disabled = true;
    }, 3000);
  }

  isJingHo(): boolean {
    return localStorage.getItem('orgId') == '151';
  }
}
