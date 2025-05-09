/** --------------------------------------------------------------------------------
 *-- Description： product list
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { clone } from 'ramda';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  filter,
  finalize,
  firstValueFrom,
  iif,
  of,
  switchMap,
  take,
  tap
} from 'rxjs';
import { promoTagLabel } from 'src/app/constants/product.constants';
import { SharedService } from 'src/app/core/services/shared.service';
import { ResponseCode } from 'src/app/enums';
import { Trace } from 'src/app/models/member.model';
import { CompareProduct2, FilterForm } from 'src/app/models/product.model';
import { MemberService } from 'src/app/services';
import { ProductService } from 'src/app/services/product.service';
import { FixNavBarService } from 'src/app/services/fix-navbar.service';
import { ProductComparisonComponent } from 'src/app/shared/components/product-comparison/product-comparison.component';
import {
  DialogService,
  LayoutService,
  NotifierService,
} from 'src/app/shared/services';
import { Title } from '@angular/platform-browser';
import { ProductFilterModifierComponent } from 'src/app/shared/components/dialogs/product-filter-modifier/product-filter-modifier.component';
import { FilterFormComponent } from 'src/app/shared/components/filter-form/filter-form.component';
import { ProductListFilterComponent } from 'src/app/shared/components/product-list-filter/product-list-filter.component';
import { query } from 'express';
import { URL_UTIL } from 'src/app/shared/utils/urlUtilities';
import { POP_UP } from 'src/app/shared/utils/popUpUtilities';
interface Detail {
  itemId?: number;
  itemName: string;
  itemNumber: string;
}

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent {
  // @Output() countChanged: EventEmitter<number> = new EventEmitter();
  specialEventId: string | null = null;
  keyword = '';
  isSearchPage = false;
  isWelfare = false;
  isSpecialEvent = false;
  promoTagLabel = promoTagLabel;
  type = 1;
  noworderState = 'new';
  compareItems: CompareProduct2[] = [];
  brandIdList: number[] = [];
  type1IdList: number[] = [];
  type2IdList: number[] = [];
  needToUpdateType1IdList: boolean = false;
  needToUpdateType2IdList: boolean = false;
  // 特定期間促銷活動
  showPeriodPromotion: boolean = false;

  @ViewChild(ProductComparisonComponent)
  comparisonComp?: ProductComparisonComponent;

  @ViewChild(ProductListFilterComponent)
  productListFilterComponent?: ProductListFilterComponent;

  constructor(
    public layoutService: LayoutService,
    private productService: ProductService,
    public dialogservice: DialogService,
    private activatedRoute: ActivatedRoute,
    private memberService: MemberService,
    private notifierService: NotifierService,
    private sharedService: SharedService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private title: Title,
    private fixNavBarService: FixNavBarService,
  ) {
    this.activatedRoute.queryParams
      .pipe(
        tap((queryParams) => {
          if (queryParams['itemId']) {
            // 清掉 queryparam 中的 itemId, 不然會造成 breadcrumbs 消失
            this.router.navigate([], {queryParams: {...queryParams, itemId: null}});
          }

          this.specialEventId = queryParams['specialEventId'] || null;
          this.showPeriodPromotion =
            queryParams['showPeriodPromotion'] || false;

          this.handleParam(queryParams)
        })
      )
      .subscribe();

      this.productData$
    .subscribe({
      complete: () => {this.isLoading = false;},
      error: () => {this.isLoading = false;},
      next: () => {this.isLoading = false;}
    });

    this.handleWelfare();
    this.handleSpecialEvent();
  }
  isFilterOpen = false;
  data: any[] = [];
  newArrivalsData: any[] = [];
  filterForm = new BehaviorSubject<Partial<FilterForm> | null>(null);
  filterForm$ = this.filterForm.asObservable();
  traceList!: Trace[];
  tracedMap: { [itemId: number]: true } = {};
  tracingItems = 0;
  totalItems!: number;
  private filterFormData!: Partial<FilterForm>;
  private initialPageData = {
    page: 1,
    pageSize: 12,   // 商品列表一頁顯示幾個  Modify by Tako on 2025/03/14
    sortField: '',
    isUnitPrice: true,
  };
  pageData: Partial<FilterForm> = clone(this.initialPageData);
  isLoading: boolean = false;
  dealerView?: string | null;

  source?: string | null;
  sourceId?: number | null;

  productData$ = this.filterForm$.pipe(
    finalize(() => {
      this.isLoading = false;
    }),
    tap(() => {
      this.isLoading = true;
    }),
    filter((filterFormParams) => filterFormParams !== null),
    switchMap((params: any) => {
      if (params.showPeriodPromotion || this.showPeriodPromotion) {
        if ((params?.activity || '').toString().indexOf('促銷活動') < 0 || params.activity == null) {
          params['showPeriodPromotion'] = true;
        }
      }
      this.activatedRoute.queryParams.pipe(
        tap(({specialEventId}) => {
          if(!specialEventId){
            delete params['specialEventId'];
          }
        }),
      ).subscribe();
      return this.productService.getProductList(params as FilterForm);
    }),
    tap((response: any) => {
      this.data = response?.result?.data;
      this.totalItems = response?.result?.pagination?.total;

      this.brandIdList = response?.result?.brandIdList ?? [];
      this.type1IdList = response?.result?.type1IdList ?? [];
      this.type2IdList = response?.result?.type2IdList ?? [];

      this.newArrivalsData = this.data; // 最新上架資料，因為json格式中沒有找到時間相關可以做排序的值
      switch(this.noworderState){
        case 'new':
          this.SortData('');
          break;
        case 'ASC':
          this.SortData('ASC');
          break;
        case 'DESC':
          this.SortData('DESC');
          break;
        case 'Trace':
          this.isTraceOrderData();
          break;
      }
    })
  );

  ngOnInit(): void {
    firstValueFrom(this.productData$)
    .then((data) => {
      this.brandIdList = data?.result?.brandIdList ?? [];
      this.type1IdList = data?.result?.type1IdList ?? [];
      this.type2IdList = data?.result?.type2IdList ?? [];

    })
    .catch((err) => {
      console.error('Error fetching product data:', err);
    });
  }


  ngAfterViewInit() {
    this.compareItems = this.comparisonComp?.items || [];
    this.cdRef.detectChanges();
    this.onWishList();
  }

  private handleParam(params: Params) {
    // handles:
    // keyword, type1Id, type2Id, brand,
    // dealearView

    const keyword = params['keyword'];
    const type1Id = params['type1Id'];
    const type2Id = params['type2Id'];
    const brand = params['brand'];
    this.dealerView = params['dealerView'];

    this.source = params['source'] ? params['source'] : params['brand']
      ? 'brand' : params['type2Id']
      ? 'type2' : null;

    this.sourceId = params['sourceId'] ?? params['sourceId'] ?? params['brand'] ?? null;

    const needToDeal = keyword || type1Id || type2Id || brand || this.dealerView;

    if (!needToDeal)
      return;

    this.isSearchPage = keyword ? true : false;
    this.pageData = clone(this.initialPageData);
    this.isWelfare = false;
    this.keyword = keyword ? keyword : '';

    this.pageData = {
      ...this.pageData,
      keyword: keyword,
      type1: type1Id,
      type2: type2Id,
      brandId: brand,
      dealerView: this.dealerView
    };
    this.pageDataChange(this.pageData);
  }

  private handleWelfare() {
    this.activatedRoute.queryParams
      .pipe(
        tap(({ isWelfare }) => {
          this.isWelfare = isWelfare === 'true' ? true : false;
        }),
        filter(({ isWelfare }) => isWelfare === 'true'),

        tap(() => {
          this.isSearchPage = false;
          this.pageData = clone(this.initialPageData);
        }),
        tap(() => {
          this.pageData = {
            ...this.pageData,
            isWelfare: true,
          };
          this.pageDataChange({ isWelfare: true });
        })
      )
      .subscribe();
  }

  private handleSpecialEvent() {
    this.activatedRoute.queryParams
      .pipe(
        filter(() => !!this.specialEventId?.trim().length),
        tap(() => {
          this.isSpecialEvent = this.specialEventId != null && Number(this.specialEventId) >= 0 ? true : false;
          this.isSearchPage = false;
          this.pageData = clone(this.initialPageData);
        }),
        tap(() => {
          this.pageData = {
            ...this.pageData,
            specialEventId: parseInt(this.specialEventId!, 10), // 使用非空斷言運算符 !
          };
          this.pageDataChange({
            specialEventId: parseInt(this.specialEventId!, 10),
          }); // 使用非空斷言運算符 !
        })
      )
      .subscribe();
  }
  clearData() {
    const hasData = this.data?.length > 0;
    if (hasData) {
      this.data = [];
      this.totalItems = 0;
    }
  }

  toggleFilter(isOpen: boolean) {
    if(isOpen){
      this.fixNavBarService.sethideNavbar(false)
    }
    else{
      this.fixNavBarService.sethideNavbar(true)
    }
    const page = document.querySelector('app-pages');
    this.isFilterOpen = isOpen;
    isOpen ? page?.classList.add('fixed') : page?.classList.remove('fixed');
  }

  filterDataChange($event: Partial<FilterForm>) {
    this.filterFormData = $event;
    this.pageDataChange($event);
  }
  isTraceOrderData(){
      this.data = this.newArrivalsData;
      this.noworderState = 'Trace'
  }
  SortData(type: string){
    switch (type) {
      case '':
        this.data = this.newArrivalsData;
        this.noworderState = 'new';
        break;
      case 'ASC':
        this.data = this.data.slice().sort((a, b) => a.unitPrice - b.unitPrice);
        this.noworderState = 'ASC';
        break;
      case 'DESC':
        this.data = this.data.slice().sort((a, b) => b.unitPrice - a.unitPrice);
        this.noworderState = 'DESC';
        break;
    }
  }
  pageDataChange($event: any) {
    this.pageData = {
      ...this.pageData,
      ...$event,
      page: 1,
    };

    this.filterForm.next({
      ...this.filterFormData,
      ...this.pageData,
    });
    if ($event.isTraceOrder) {
      this.isTraceOrderData();
    }
    else{
      this.SortData($event.sortOrder);
    }

    if (this.productListFilterComponent && this.pageData.pageSize && this.productListFilterComponent.selectedPageSize != this.pageData.pageSize)
      this.productListFilterComponent.pageSizeChange(this.pageData.pageSize ?? 10);
  }

  changePageStyle($event: number) {
    this.type = $event;
  }

  /** 分頁切換 */
  onPageChange(page: number): void {
    this.pageData = {
      ...this.pageData,
      page,
    };
    this.filterForm.next({
      ...this.filterFormData,
      ...this.pageData,
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onWishList(): void {
    this.tracingItems = Number(localStorage.getItem('tracingItems'));
    const param = { page: 1, pageSize: this.tracingItems };
    this.memberService
      .getWishList(param)
      .pipe(
        catchError(() => of()),
        tap((res) => {
          if (res.responseCode === ResponseCode.Success) {
            if (Array.isArray(res.result.traceList)) {
              this.traceList = res.result.traceList;
              res.result.traceList.map((item) => {
                this.tracedMap[item.itemId] = true;
              });
            }
          }
        })
      )
      .subscribe();
  }

  getDealerView(): string | null {
    return URL_UTIL.getDealerView(this.route.snapshot);
  }
  isUsingDealerView(): boolean {
    return !!this.getDealerView()?.length;
  }

  showDealerViewError(): void {
    POP_UP.showMessage(this.dialogservice, "您正在檢視經銷商中", "檢視經銷商不支援此功能，請先退出檢視經銷商模式後再操作。");
  }

  toggleFavorite(item: any) {
    if (this.isUsingDealerView()) {
      this.showDealerViewError();
      return;
    }

    const isSales = JSON.parse(localStorage.getItem('isSales') ?? 'true');

    if (isSales)
    {
      const hint = ['很抱歉，您的身分組（查價員）無法使用此功能。', '如有疑問，請聯絡您的帳戶管理員，或聯絡線上客服。'];
      POP_UP.showMessage(this.dialogservice, '您的身分組不支援此功能', hint);
      return;
    }

    of('')
      .pipe(
        switchMap(() =>
          iif(
            () => item.favorite,
            this.memberService.deleteWishList(item.itemId).pipe(
              tap(()=>{
                this.notifierService.showInfoNotification('已移除追蹤清單');
                const currentCount = localStorage.getItem('tracingItems');
                const newCount = currentCount ? parseInt(currentCount, 10) - 1 : 0;
                localStorage.setItem('tracingItems', newCount.toString());
                this.sharedService.updateTracingItems(newCount);
              })
            ),
            this.memberService.addWishList(item.itemId).pipe(tap(()=>{
              this.notifierService.showInfoNotification('已加入追蹤清單');
              const currentCount = localStorage.getItem('tracingItems');
              const newCount = currentCount ? parseInt(currentCount, 10) + 1 : 1; // Increment if currentCount exists, else set to 1
              localStorage.setItem('tracingItems', newCount.toString());
              this.sharedService.updateTracingItems(newCount);
            }))
          )
        )
      )
      .subscribe(() => {
        item.favorite = !item.favorite;
      });
  }

  isCompareAddOrRemove(data: any): boolean {
    return !(this.comparisonComp?.items ?? [])?.find(
      (item: { itemId: any; }) => item.itemId === data?.itemId
    );
  }

  onCompare(element: any): void {
    if (!this.comparisonComp) return;
    if (this.isUsingDealerView()) {
      this.showDealerViewError();
      return;
    }

    if (this.isCompareAddOrRemove(element)) {
      this.comparisonComp.add(
        element.itemName,
        element.unitPrice || element.priceWithTax,
        element.prodImg,
        element.itemId
      );
      if (
        this.comparisonComp?.items.find(
          (item: { itemId: any; }) => item.itemId === element.itemId
        )
      ) {
        this.notifierService.showInfoNotification(
          `已加入比價（${this.comparisonComp.items.length}/${this.comparisonComp.maxCompareCount}）`
        );
      }
    } else {
      this.comparisonComp.remove(element, true);
    }
    this.compareItems = this.comparisonComp?.items || [];
  }
  routeToProduct(itemId: any) {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/Product'], { queryParams: { itemId: itemId, dealerView: this.dealerView } }));
    window.open(url, '_blank');
  }
  promoTagLabelIndexModify(element: any): number{
    if(element == null || element == undefined){
      return 1;
    }
    return element;
  }

  getBadgeByProductDetail(product: any): string {
    return product.productTag || "";
  }

  getProductIsEmpty(product: any): boolean {
    if (!product.subinventory || product.subinventory.length === 0 || !product.subinventory.some((e: any) => e.qty && e.qty > 0)) return true;
    return false;
  }
}
