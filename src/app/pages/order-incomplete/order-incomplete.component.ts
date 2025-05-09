/** --------------------------------------------------------------------------------
 *-- Description： product
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
import { CheckoutUtilService } from 'src/app/services/checkout-util.service';
import { BehaviorSubject, catchError, filter, map, of, switchMap, take, tap } from 'rxjs';
import { ResponseCode } from 'src/app/enums';
import { AnalyticsService, MemberService } from 'src/app/services';
import { FilterForm } from 'src/app/models';
import { StorageService } from 'src/app/core/services/storage.service';
import { StorageEnum } from 'src/app/enums/storage.enum';
import { ErrorMessageMap } from 'src/app/core/constant/error-message-map.constant'; //Add by Tako on 2025/02/12 For No.2024037103

@Component({
  selector: 'app-order-incomplete',
  templateUrl: './order-incomplete.component.html',
  styleUrls: ['./order-incomplete.component.scss'],
  providers: [
    CheckoutUtilService,
    CartService,
  ]
})
export class OrderIncompleteComponent implements OnInit {
  personCustNo: string = ''; //Add by Tako on 2025/02/11 For No.2024037103
  errorMessage: { type: string; message: string } = { type: '', message: '' };

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
  PromoMethod: typeof PromoMethod = PromoMethod;
  promoTagLabel: typeof promoTagLabel = promoTagLabel;
  isLoading = true;
  loadedOnce = false;
  hasSent = false;
  isHomePage!: boolean;
  isCategoryLayout!: boolean;
  links: any;
  recommended: any[] = [];
  guessYouLikes: any[] = [];
  taxReference: string = '';
  form = {
    purchaseNo: '',
    dueDate: ''
  };

  toggleMenuType(isCategoryLayout: boolean) {
    this.isCategoryLayout = isCategoryLayout;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public layoutService: LayoutService,
    public dialogservice: DialogService,
    private shoppingCartService: ShoppingCartService,
    private memberService: MemberService,
    private checkoutUtilService: CheckoutUtilService,
    private storageService: StorageService,
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
        name: '訂單未成立',
        url: `/OrderIncomplete`
      }
    ];
  }

  ngOnInit(): void {
    const checkoutResult: any = this.storageService.get(StorageEnum.CheckoutResult);
    this.form.purchaseNo = checkoutResult.purchaseNo;

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

    const serverTime = new Date(checkoutResult.serverTime);
    serverTime.setHours(serverTime.getHours() + 24);

    const dueDate = serverTime.getFullYear() + '/' +
      (serverTime.getMonth() + 1).toString().padStart(2, '0') + '/' +
      serverTime.getDate().toString().padStart(2, '0') + ' ' +
      serverTime.getHours().toString().padStart(2, '0') + ':' +
      serverTime.getMinutes().toString().padStart(2, '0') + ':' +
      serverTime.getSeconds().toString().padStart(2, '0');
    this.form.dueDate = dueDate;

    this.isLoading = false;
    this.loadedOnce = true;
    this.memberService.getCustomerAccount().pipe(
      filter((res) => res.responseCode === ResponseCode.Success),
      map((res) => res.result)
    ).subscribe((res: any) => {
      this.taxReference = res.taxReference;

      // Add by Tako on 2025/02/12 For No.2024037103
      // 當 taxReference 為 "12215548" 時，從 API 取得 personCustNo
      if (this.taxReference === '12215548') {
        this.memberService.getPersonCustNo().subscribe({
          next: (res: any) => {
            this.personCustNo = res.personCustNo;
            console.error('PERSON_CUST_NO', res.personCustNo);
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
    });
  }

  goHome() {
    this.router.navigate(['']);
  }

  notifyDialog() {
    this.isLoading = true;
    this.shoppingCartService.notifyPayment(this.form.purchaseNo)
    .pipe(take(1),
    catchError(_ => {
      this.isLoading = false;
      return of();
    }),
    map(res => {this.isLoading = false; 
      const isSuccess = res.responseCode === ResponseCode.Success;

      if (isSuccess)
        this.hasSent = true;

      const modelOption = {
        modelName: 'simple-dialog',
        config: {
          data: {
            text: isSuccess ? '收到您的匯款完成通知，\n已通知負責貴公司之業務，\n儘速確認貴公司的匯款資料交換進度。' : res.responseMessage ?? '發生錯誤，請稍後重試，或聯絡精技客服。',
            textAlign: 'center'
          },
          minWidth: '368px',
          width: 'auto',
          minHeight: '150px',
          height: 'auto',
          hasBackdrop: true,
          autoFocus: false,
          enterAnimationDuration: '300ms',
          exitAnimationDuration: '300ms',
          panelClass: 'dark'
        }
      };
  
      this.dialogservice.openLazyDialog(
        modelOption.modelName,
        modelOption.config
      );
    }),
    catchError(err => {this.isLoading = false; throw err;}),
    )
    .subscribe();
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

  redirect(): void {
    this.router.navigate(['/']);
  }

  isJingHo(): boolean {
    return localStorage.getItem('orgId') == '151';
  }

  getOrgName(): string {
    return this.isJingHo() ? '精豪' : '精技';
  }
}
