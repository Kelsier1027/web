/** --------------------------------------------------------------------------------
 *-- Description： 會員中心 mobile navigator
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { filter, map, tap, Observable } from 'rxjs';
import { Router, NavigationEnd, Route, ActivatedRoute } from '@angular/router';
import { DialogService } from 'src/app/shared/services';
import { ToggleTypeListService } from 'src/app/services/ToggleTypeList.service';
import {
  ClearanceSaleItem,
  PeriodSale,
  ResultRes,
  FilterForm,
  MemberInfo
} from 'src/app/models';
import { MemberService } from 'src/app/services';
import { ProductService } from 'src/app/services';
import { ResponseCode } from 'src/app/enums';
import { StorageService } from 'src/app/core/services/storage.service';
import { URL_UTIL } from 'src/app/shared/utils/urlUtilities';
@Component({
  selector: 'app-member-header-mobile-nav',
  templateUrl: './member-header-mobile-nav.component.html',
  styleUrls: ['./member-header-mobile-nav.component.scss'],
})
export class MemberHeaderMobileNavComponent implements OnInit {
  @Output()
  action = new EventEmitter()
  @Input() title: string = '';
  customerName="";
  companyName="";
  email="";
  customerClass=0;
  usableBonusPoints=0;
  availableAwards=0;
  tracingItems=0;
  cartCount="0";
  restockNotifyCount=0;
  displayBonus=false;
  apiResponse!: Observable<MemberInfo>;

  constructor(  private router: Router,
    public dialogservice: DialogService,
    private memberService: MemberService,
    private storageService: StorageService,
    public toggleTypeListService: ToggleTypeListService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    const currentUrl = window.location.href;
    if (currentUrl.includes("ProductComparison")) {
      this.title ='商品比較'
    }
    this.GetDefaultInformations();
    this.cartCount = localStorage.getItem('cartCount')?.toString() || '';

    this.route.queryParams
    .pipe(tap(params => this.GetDefaultInformations(URL_UTIL.getDealerView(params))))
    .subscribe()
    
  }
  GetDefaultInformations(dealerView: string | null = null) {
    this.apiResponse = this.memberService.getMemberInfo(dealerView).pipe(
      filter((res) => res.responseCode === ResponseCode.Success),
      map((res) => {
        this.customerName = res.result.customerName || "";
        this.companyName = res.result.companyName || "";
        this.email = res.result.email || "";
        this.customerClass = res.result.customerClass || 0;
        this.usableBonusPoints = res.result.usableBonusPoints || 0;
        this.availableAwards = res.result.availableAwards || 0;
        this.tracingItems = res.result.tracingItems || 0;
        //this.cartCount = res.result.cartCount || 0;
        this.restockNotifyCount = res.result.restockNotifyCount || 0;
        this.displayBonus = res.result.displayBonus || false;

        localStorage.setItem('customerName', this.customerName);
        localStorage.setItem('companyName', this.companyName);
        localStorage.setItem('email', this.email);
        localStorage.setItem('customerClass', this.customerClass.toString());
        localStorage.setItem('usableBonusPoints', this.usableBonusPoints.toString());
        localStorage.setItem('availableAwards', this.availableAwards.toString());
        localStorage.setItem('tracingItems', this.tracingItems.toString());
        localStorage.setItem('cartCount', this.cartCount.toString());
        localStorage.setItem('restockNotifyCount', this.restockNotifyCount.toString());
        localStorage.setItem('displayBonus', JSON.stringify(this.displayBonus));
        return res.result;
      })
    );
    }

  clickAction() {

    if (this.title == '會員中心') {
      this.router.navigate(['/']);
    } else {
      this.action.emit();
    }

  }

  canUseCart(): boolean {
    const canOrder = JSON.parse(localStorage.getItem('canOrder') ?? 'true');
    return canOrder;
  }
}
