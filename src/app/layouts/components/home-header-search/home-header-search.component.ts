/** --------------------------------------------------------------------------------
 *-- Description： 首頁Search
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { filter, map, tap, Observable, Subscription } from 'rxjs';
import { Router, NavigationEnd, ActivatedRoute, Params } from '@angular/router';
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
  selector: 'app-home-header-search',
  templateUrl: './home-header-search.component.html',
  styleUrls: ['./home-header-search.component.scss'],
})
export class HomeHeaderSearchComponent implements OnInit {
  customerName="";
  companyName="";
  email="";
  customerClass=0;
  usableBonusPoints=0;
  availableAwards=0;
  tracingItems=0;
  cartCount=0;
  restockNotifyCount=0;
  canUseDealerView=false;
  thisCompanyNo: any;

  apiResponse!: Observable<MemberInfo>;
  @Input()
  currentScreenSize!: string
  @Input()
  isHomePage!: boolean;
  @Input()
  scrollToHide!: boolean;
  @Output() fixedProductChange = new EventEmitter();

  fixedProduct :boolean = false;
  taxIdNumber:any;
  keyword:any;

  private addWishListSubscription!: Subscription;
  private wishlistDeletedSubscription!: Subscription;
  private addCartSubscription!: Subscription;
  constructor(
    private router: Router,
    public dialogservice: DialogService,
    private memberService: MemberService,
    private storageService: StorageService,
    public toggleTypeListService: ToggleTypeListService,
    private productService:ProductService,
    private route: ActivatedRoute
  ) {
  }

  handleParam(params: Params): void {
    const dealerView = params['dealerView'];
    this.taxIdNumber = dealerView;
  }

  ngOnInit(): void {
    this.wishlistDeletedSubscription = this.memberService.onWishlistDeleted().subscribe(() => {
      this.GetDefaultInformations();
    });
    this.addWishListSubscription = this.memberService.onWishlistAdd().subscribe(() => {
      this.GetDefaultInformations();
    });
    this.addCartSubscription = this.productService.onCartAdd().subscribe(()=>{
      this.GetDefaultInformations();
    })
    this.thisCompanyNo = localStorage.getItem('companyNo');
    this.canUseDealerView = localStorage.getItem('canUseDealerView') === "true" ? true : false;

    this.route.queryParams
      .pipe(tap(params => this.GetDefaultInformations(URL_UTIL.getDealerView(params))))
      .subscribe()
  }
  ngOnDestroy(): void {
    if (this.wishlistDeletedSubscription) {
      this.wishlistDeletedSubscription.unsubscribe();
    }
    if (this.addWishListSubscription) {
      this.addWishListSubscription.unsubscribe();
    }
    if (this.addCartSubscription){
      this.addCartSubscription.unsubscribe();
    }
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
        this.cartCount = res.result.cartCount || 0;
        this.restockNotifyCount = res.result.restockNotifyCount || 0;
        if (!this.canUseDealerView) {
          this.canUseDealerView = res.result.canUseDealerView;
        }
        
        if (this.canUseDealerView)
        {
          this.route.queryParams
            .pipe(tap(p => this.handleParam(p)))
            .subscribe();
        }

        localStorage.setItem('customerName', this.customerName);
        localStorage.setItem('companyName', this.companyName);
        localStorage.setItem('email', this.email);
        localStorage.setItem('customerClass', this.customerClass.toString());
        localStorage.setItem('usableBonusPoints', this.usableBonusPoints.toString());
        localStorage.setItem('availableAwards', this.availableAwards.toString());
        localStorage.setItem('tracingItems', this.tracingItems.toString());
        localStorage.setItem('cartCount', this.cartCount.toString());
        localStorage.setItem('restockNotifyCount', this.restockNotifyCount.toString());
        localStorage.setItem('displayBonus', res.result.displayBonus.toString());
        localStorage.setItem('canUseDealerView', this.canUseDealerView.toString());

        localStorage.setItem('isSales', res.result.isSales.toString());
        localStorage.setItem('canOrder', res.result.canOrder.toString());

        // analyticsService 用
        localStorage.setItem('userId', res.result.userId.toString());
        localStorage.setItem('city', res.result.city);
        localStorage.setItem('subinventory', res.result.subinventory);
        
        return res.result;
      })
    );
    // Adding .subscribe() to the observable
    this.apiResponse.subscribe();
  }
  /** search name */
  searchName($event?: string): void {
    this.keyword = $event ;
    // this.router.navigate(['/ProductList'], { queryParams: { keyword: $event } })
  }

  /** open 檢視經銷商 modal */
  dealerViewModal(): void {
    const modelOption = {
      modelName: 'dealer-view',
      config: {
        data: {
          title: '檢視經銷商',
        },
        width: '500px',
        height: 'auto',
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
        ref.afterClosed().subscribe((result) => {
          if(result){
            this.taxIdNumber = result.taxIdNumber;
          }
        });
      });
  }
  /** 取消經銷商 */
  async dealerDelete(){
    const modelOption = {
      modelName: 'simple-dialog',
      config: {
        data: {
          title: '取消檢視經銷商',
          StyleMargin: '0px',
          text: '是否確定取消檢視經銷商？',
          displayFooter: true,
          cancelButton: '否，繼續檢視',
          confirmButton: '是，結束檢視經銷商',
          color:'warn'
        },
        width: '500px',
        height: '204px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: ''
      },
    };
    this.dialogservice
      .openLazyDialog(modelOption.modelName, modelOption.config)
      .then((ref) => {
        ref.afterClosed().subscribe(async (result) => {
          if(result){
            this.taxIdNumber = null;

          // 刪掉 param 中的 dealerView 之後原地重讀一次
          const param = { ...this.route.snapshot.queryParams, dealerView: this.taxIdNumber };
          await this.router.navigate([],  { queryParams: param });
        }
      });
    });
  }

  fixedProductCol(){
    this.fixedProduct = !this.fixedProduct;
    this.fixedProductChange.emit(this.fixedProduct);
  }

  getDealerView(): string | null {
    return URL_UTIL.getDealerView(this.route.snapshot);
  }

  isSales(): boolean {
    return JSON.parse(localStorage.getItem('isSales') ?? 'true');
  }

  canUseCart(): boolean {
    const canOrder = JSON.parse(localStorage.getItem('canOrder') ?? 'true');
    return canOrder;
  }

  displayBonus(): boolean {
    return JSON.parse(localStorage.getItem('displayBonus') ?? 'false');
  }

  isJingHo(): boolean {
    return localStorage.getItem('orgId') == '151';
  }
}
