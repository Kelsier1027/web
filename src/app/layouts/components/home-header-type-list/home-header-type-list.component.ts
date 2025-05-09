import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { GlobalStateService } from 'src/app/core/services/global-state.service';
import { ProductService } from 'src/app/services/product.service';
import { LayoutService } from 'src/app/shared/services';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-home-header-type-list',
  templateUrl: './home-header-type-list.component.html',
  styleUrls: ['./home-header-type-list.component.scss'],
})
export class HomeHeaderTypeListComponent implements OnInit, OnDestroy {
  @Output() clickProductList = new EventEmitter();
  @Input() isCategoryLayout!: boolean;
  @Input() parentId!: number;

  adString!: string;
  adStringUrl!: string;
  interval: any;

  constructor(
    public productService: ProductService,
    public layoutService: LayoutService,
    public globalStateService: GlobalStateService,
    private analyticsService: AnalyticsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize adString and adStringUrl
    this.adString = localStorage.getItem('adString') || 'default_value';
    this.adStringUrl = localStorage.getItem('adStringUrl') ?? 'default_url';

    // Set up interval to check localStorage changes every second
    this.interval = setInterval(() => {
      const newAdString = localStorage.getItem('adString') || '';
      const newAdStringUrl = localStorage.getItem('adStringUrl') ?? '';

      if (this.adString !== newAdString) {
        this.adString = newAdString;
      }

      if (this.adStringUrl !== newAdStringUrl) {
        this.adStringUrl = newAdStringUrl;
      }
    }, 1000);

    // Subscribe to localStorage changes
    window.addEventListener('storage', this.handleStorageChange.bind(this));
  }

  ProductListChecked(type1Id?:number,type2Id?:number) {
    this.analyticsProductType(type1Id ?? 0,type2Id ?? 0);
    this.clickProductList.emit(false);
    this.globalStateService.isOpenFixedNav$.next(null);
  }
  ngOnDestroy(): void {
    // 在組件銷毀時取消訂閱
    //window.removeEventListener('storage', this.handleStorageChange.bind(this));
  }
  handleStorageChange(event: StorageEvent): void {
    if (event.key === 'adString') {
      // 如果 localStorage 中的 adString 變化，更新組件的 adString
      this.adString = event.newValue || 'default_value';
    }
    else if (event.key === 'adStringUrl') {
      this.adStringUrl = event.newValue ?? 'default_url';
    }
  }
  analyticsProductType(type1Id:number,type2Id:number){
    const paranms = {
      productType:[type1Id,type2Id]
    };
    if(type1Id != 0 && type2Id != 0){
      this.analyticsService.event("ProductListType",paranms,true);
    }
  }

  async changeRoute(type1Id: number, type2Id: number, brandId: number | null = null)
  {
    const baseRoute = "/ProductList";

    // 切換分類時清空 keyword 和 isWelfare
    await this.router.navigate([baseRoute], { queryParams: ({
        ...this.route.snapshot.queryParams,
        type1Id: type1Id,
        type2Id: type2Id,
        brand: brandId,
        keyword: null,
        isWelfare: null,
        specialEventId: null
      })
    });
  }
}
