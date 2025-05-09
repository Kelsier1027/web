/** --------------------------------------------------------------------------------
 *-- Description： 首頁 action
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { EnvConfig } from 'src/app/app.module';
import { StorageEnum } from 'src/app/enums/storage.enum';
import { environment } from 'src/environments/environment';
import { filter, map, tap } from 'rxjs';
import { ResponseCode } from 'src/app/enums';
import { MemberService } from 'src/app/services';
import { RecentProduct, ReviewedList } from 'src/app/models/fixed-nav.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { URL_UTIL } from 'src/app/shared/utils/urlUtilities';

@Component({
  selector: 'app-home-header-action',
  templateUrl: './home-header-action.component.html',
  styleUrls: ['./home-header-action.component.scss'],
})
export class HomeHeaderActionComponent implements OnInit {
  recentProducts: RecentProduct[] = [{ time: '', list: [] }];
  urljingho: any;
  urldchain: any;
  companyNo: string = "";
  customerName: string = "";
  companyName = "";
  email = "";
  isAdmin = false;
  customerClass = "0";
  usableBonusPoints = "0";
  availableAwards = "0";
  tracingItems = "0";
  cartCount = "0";
  restockNotifyCount = "0";
  displayBonus = false;

  thisOrgId: any;
  showProfile = false;
  isUnitPrice = true;
  @Input()
  scrollToHide!: boolean;

  constructor(
    private storageService: StorageService,
    private router: Router,
    private storage: StorageService,
    private envConfig: EnvConfig,
    private sharedService: SharedService, // 注入服務
    private memberService: MemberService,
    protected authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    /*
    this.sharedService.tracingItems$.subscribe((count) => {
      this.tracingItems = count.toString();
    });
    */
    const loginGuide = this.envConfig.loginGuide;
    const jingjiComputer = loginGuide.find(item => item.title === '精技電腦');
    if (jingjiComputer) {
      this.urldchain = jingjiComputer.url;
    }
    const jinghoComputer = loginGuide.find(item => item.title === '精豪電腦');
    // Extract the URL if the object is found
    if (jinghoComputer) {
      this.urljingho = jinghoComputer.url;
    }
    this.companyNo = localStorage.getItem('companyNo') || '';
    this.thisOrgId = localStorage.getItem('orgId');
    this.sharedService.isUnitPrice$.subscribe((isUnitPrice) => {
      this.isUnitPrice = isUnitPrice;
    });

    this.route.queryParams
      .pipe(tap(params => this.getMemberInfo(URL_UTIL.getDealerView(params))))
      .subscribe()

  }

  getMemberInfo(dealerView: string | null = null) {
    this.memberService.getMemberInfo(dealerView).pipe(
      filter((res) => res.responseCode === ResponseCode.Success),
      map((res) => {
        this.customerName = res.result.customerName || "";
        this.email = res.result.email || "";
        this.isAdmin = res.result.isAdmin ?? false;
        localStorage.setItem('customerName', this.customerName);
        localStorage.setItem('email', this.email);
        localStorage.setItem('isAdmin', this.isAdmin.toString());
        localStorage.setItem('isSales', res.result.isSales.toString());
        localStorage.setItem('canOrder', res.result.canOrder.toString());
        localStorage.setItem('displayBOnus', res.result.displayBonus.toString());
        return res.result;
      })
    ).subscribe();

    this.customerName = localStorage.getItem('customerName')?.toString() || '';
    this.companyName = localStorage.getItem('companyName')?.toString() || '';
    this.email = localStorage.getItem('email')?.toString() || '';
    this.customerClass = localStorage.getItem('customerClass')?.toString() || '';
    this.usableBonusPoints = localStorage.getItem('usableBonusPoints')?.toString() || '';
    this.availableAwards = localStorage.getItem('availableAwards')?.toString() || '';
    this.tracingItems = localStorage.getItem('tracingItems')?.toString() || '';
    this.cartCount = localStorage.getItem('cartCount')?.toString() || '';
    this.restockNotifyCount = localStorage.getItem('restockNotifyCount')?.toString() || '';
    this.displayBonus = JSON.parse(localStorage.getItem('displayBonus') || "false");
    this.isAdmin = JSON.parse(localStorage.getItem('isAdmin') ?? 'false');

  }

  show(isShow: boolean) {
    this.showProfile = isShow;
  }

  logout() {
    this.authService.logout({}).subscribe();
    this.recentProducts = [{ time: '', list: [] }];
    const reviewedList: ReviewedList[] = (this.storageService.get(
      StorageEnum.RecentlyViewed
    ) || []) as any;
    const itemIds = reviewedList.map((item) => Number(item.itemId));
    this.storageService.clear();
    //再將最近瀏覽的資訊放回
    this.storageService.set(StorageEnum.RecentlyViewed, reviewedList);
    this.router.navigate(['/Account/Login']);
  }

  unitPriceChange(isUnitPrice: boolean) {
    this.sharedService.setUnitPrice(isUnitPrice);
  }

  getDealerView(): string | null {
    return URL_UTIL.getDealerView(this.route.snapshot);
  }

  isSales(): boolean {
    return JSON.parse(localStorage.getItem('isSales') ?? 'true');
  }
}
