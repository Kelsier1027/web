/** --------------------------------------------------------------------------------
 *-- Description： 訂單結果
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { promoTagLabel } from 'src/app/constants/product.constants';
import { PromoMethod } from 'src/app/enums/promotion.enum';
import { CartService } from 'src/app/services/cart.service';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { BehaviorSubject, filter, switchMap, tap } from 'rxjs';
import { CheckoutUtilService } from 'src/app/services/checkout-util.service';
import { StorageEnum } from 'src/app/enums/storage.enum';
import { StorageService } from 'src/app/core/services/storage.service';
import { FilterForm } from 'src/app/models';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { AnalyticsService } from 'src/app/services';

@Component({
  selector: 'app-order-complete',
  templateUrl: './order-complete.component.html',
  styleUrls: ['./order-complete.component.scss'],
  providers: [
    CheckoutUtilService,
    CartService,
  ]
})
export class OrderCompleteComponent implements OnInit {
  filterForm = new BehaviorSubject<Partial<FilterForm> | null>(null);
  filterForm$ = this.filterForm.asObservable();
  extraProducts$ = this.filterForm$.pipe(
    filter((filterFormParams) => filterFormParams !== null),
    switchMap((params) => {
      return this.shoppingCartService.getExtraProducts(params as FilterForm);
    }),
    tap((response: any) => {
      const {guessYouLike, recommended} = response.result;
      this.recommended = recommended.map(this.checkoutUtilService.sharedMapper);
      this.guessYouLikes = guessYouLike.map(this.checkoutUtilService.sharedMapper);
    })
  );

  isGroupCheck='0';
  Message='';
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  progress: number = 147/200 * 100; // 現有數 / 目標數, 百分比 

  PromoMethod: typeof PromoMethod = PromoMethod;
  promoTagLabel: typeof promoTagLabel = promoTagLabel;
  isLoading = true;
  isHomePage!: boolean;
  isCategoryLayout!: boolean;
  links: any;
  keyword = '';
  data: any[] = [];
  recommended: any[] = [];
  guessYouLikes: any[] = [];
  form = {
    purchaseNo: '',
    email: '',
    shippingEndDate: '',
    shippingStartDate: '',
    groupBuyCurrentCount: 0,
    groupBuyTargetCount: 0,
    shippingDate: ''
  };
  
  toggleMenuType(isCategoryLayout: boolean) {
    this.isCategoryLayout = isCategoryLayout;
  }

  constructor(
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public layoutService: LayoutService,
    public dialogservice: DialogService,
    private shoppingCartService: ShoppingCartService,
    private storageService: StorageService,
    private checkoutUtilService: CheckoutUtilService,
    private analyticsService: AnalyticsService
  ) {
    this.activatedRoute.queryParams
      .pipe(
        tap(({keyword}) => {
          this.pageDataChange({keyword});
        }),
        filter(({keyword}) => keyword),
        tap(({keyword}) => {
          this.pageDataChange({keyword});
        })
      )
      .subscribe();
    this.extraProducts$.subscribe();
    this.links = [
      {
        name: '訂單成立',
        url: `/OrderComplete`
      }
    ];
  }

  ngOnInit(): void {    
    this.route.queryParams.subscribe(params => {
      const type = params['type'];      
      let checkoutResult: any;
      if (type && type === 'groupOrder') {
        this.isGroupCheck='1';
        this.Message = '謝謝您！您的團購登記成功';
        checkoutResult = this.storageService.get(StorageEnum.GroupCheckoutResult);
        this.form.purchaseNo = checkoutResult.purchaseNo;
        this.form.email = checkoutResult.sentToEmail;
        this.form.shippingEndDate = checkoutResult.shippingEndDate;
        this.form.shippingStartDate = checkoutResult.shippingStartDate;
        this.form.groupBuyCurrentCount = checkoutResult.groupBuyCurrentCount;
        this.form.groupBuyTargetCount = checkoutResult.groupBuyTargetCount;
        this.progress = checkoutResult.groupBuyCurrentCount/checkoutResult.groupBuyTargetCount * 100;
      }else if(type === 'preOrder') {
        this.isGroupCheck='2';
        this.Message = '謝謝您！您的預購登記成功';
        checkoutResult = this.storageService.get(StorageEnum.PreOrderCheckoutResult);
        this.form.purchaseNo = checkoutResult.purchaseNo;
        this.form.email = checkoutResult.sentToEmail;
        this.form.shippingDate = checkoutResult.shippingDate;
      }else 
      {
        this.Message = '謝謝您！您的訂單已成立';
        checkoutResult = this.storageService.get(StorageEnum.CheckoutResult);
        this.form.purchaseNo = checkoutResult.purchaseNo;
        this.form.email = checkoutResult.sentToEmail;
      }

      // 發送 GA 事件
      // checkout 中會有 performances[] 這個欄位，其中每一筆資料代表一個 GA 事件用的業績資訊
      // 逐筆發送事件
      checkoutResult.performances.forEach((p: any) => 
        this.analyticsService.event("checkout", {
          amount: p.amount,
          itemId: p.itemId,
          itemName: p.name,
          promo_id: p.promoId,
          qty: p.qty,
          segment3: p.segment3,
          segment5: p.segment5,
          checkout_source: p.source,
          checkout_source_id: p.sourceId
        })
      );
    });
    this.isLoading = false
  }

  goHome() {
    this.router.navigate(['']);
  }

  goShopping() {
    this.router.navigate(['/']);
  }

  goMemberOrder() {
    if (this.isGroupBuy())
      this.router.navigate(['Member', 'Order'], {queryParams: { groupBuy: true }});
    else if (this.isPreOrder())
      this.router.navigate(['Member', 'Order'], {queryParams: { preOrder: true }});
    else
      this.router.navigate(['Member', 'Order']);
  }

  pageDataChange($event: any) {
    this.filterForm.next({});
  }
  promoTagLabelIndexModify(element: any): number{
    if(element == null || element == undefined){
      return 1;
    }
    return element;
  }

  isGroupBuy(): boolean {
    return this.isGroupCheck == '1';
  }

  isPreOrder(): boolean {
    return this.isGroupCheck == '2';
  }

  redirect(): void {
    this.router.navigate(['/']);
  }
}
