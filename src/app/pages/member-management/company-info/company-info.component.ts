/** --------------------------------------------------------------------------------
 *-- Description： 公司帳戶
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { ResponseCode } from 'src/app/enums';
import { MemberService } from 'src/app/services';
import { Component, OnInit } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { CustomerAccount } from 'src/app/models';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss'],
})
export class CompanyInfoComponent implements OnInit {
  apiResponse!: Observable<CustomerAccount>;

  constructor(private memberService: MemberService,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.apiResponse = this.memberService.getCustomerAccount().pipe(
      filter((res) => res.responseCode === ResponseCode.Success),
      map((res) => res.result)
    );
  }

  anchorToBankRow(): void {
    this.viewportScroller.scrollToAnchor("bank-row");
  }
}
