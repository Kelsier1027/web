/** --------------------------------------------------------------------------------
 *-- Description： 帳單查詢
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { filter, map, Observable, switchMap, tap } from 'rxjs';
import { ResponseCode } from 'src/app/enums';
import { Bill, BillDetail } from 'src/app/models';
import { MemberService } from 'src/app/services';
import { DialogService } from 'src/app/shared/services';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { Location } from '@angular/common';
import { URL_UTIL } from 'src/app/shared/utils/urlUtilities';

@Component({
  selector: 'app-bill-no',
  templateUrl: './bill-no.component.html',
  styleUrls: ['./bill-no.component.scss'],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class BillNoComponent implements OnInit {
  currentScreenSize: string = '';
  apiResponse!: Observable<BillDetail[]>;
  bill!: Bill;
  dealerView: string | null = null;

  constructor(
    public layoutService: LayoutService,
    public dialogservice: DialogService,
    private route: ActivatedRoute,
    private memberService: MemberService,
    private location: Location,
    private router: Router
  ) {
  }

  /** open 新增常用只送地址 modal */
  handleCreateModal(): void {
    const modelOption = {
      modelName: 'create-address',
      config: {
        data: {
          title: '新增常用指送地址',
        },
        width: '500px',
        height: '600px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: '',
      },
    };
    this.dialogservice
      .openLazyDialog(modelOption.modelName, modelOption.config)
      .then((ref) => {
        ref.afterClosed().subscribe();
      });
  }
  ngOnInit(): void {
    this.route.queryParams
    .pipe(
      tap((p) => {
        this.dealerView = URL_UTIL.getDealerView(p);
      })
    )
    .subscribe();

    this.apiResponse = this.route.paramMap.pipe(
      map((url) => url.get('id')),
      switchMap((purchaseNumber) => 
        this.memberService.getBill(
          this.dealerView
          ? { keyword: purchaseNumber!, dealerView: this.dealerView }
          : { keyword: purchaseNumber! }
        )
      ),
      filter((res) => res.responseCode === ResponseCode.Success),
      map((res) => res.result),
      tap((bill) => {
        this.bill = bill.order.billList[0];
      }),
      switchMap((bill) =>
        this.memberService.getBillDetail(this.bill.shipNumber)
      ),
      filter((res) => res.responseCode === ResponseCode.Success),
      map((res) => res.result)
    );
  }

  /** 回上頁 */
  goBack(): void {
    this.location.back();
  }
}
