import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { Options } from '../../models';
import { SharedService } from 'src/app/core/services/shared.service';
import { DialogService, NotifierService } from 'src/app/shared/services';
import { ProductListFilterService } from 'src/app/services/product-list-filter.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-product-list-filter',
  templateUrl: './product-list-filter.component.html',
  styleUrls: ['./product-list-filter.component.scss'],
  viewProviders: [FormGroupDirective],
})
export class ProductListFilterComponent {
  @Input()
  type!: number;
  @Output()
  dataChange = new EventEmitter();
  @Output()
  layoutChange = new EventEmitter();

  isTraceOrder = false;

  isUnitPrice = true;

// 商品列表每頁顯示數量選項單 Modify by Tako on 2025/03/14
// 因每頁改為顯示12個，故選項改為12之倍數

  selectedPageSize = 12;
  sortField = '';
  sortOrder = '';

  pageSizeOption: Options[] = [
    {
      label: '12個',
      value: 12,
    },
    {
      label: '24個',
      value: 24,
    },
    {
      label: '36個',
      value: 36,
    },
    {
      label: '48個',
      value: 48,
    },
    {
      label: '60個',
      value: 60,
    },
    {
      label: '72個',
      value: 72,
    },
  ];


  constructor(private sharedService: SharedService,
    private notifierService: NotifierService,
    public dialogservice: DialogService,
    private productListFilterService: ProductListFilterService) { }


  ngOnInit(): void {
    this.sharedService.isUnitPrice$
      .pipe(takeUntil(this.destroy$)) // Ensure to unsubscribe when the component is destroyed
      .subscribe((isUnitPrice) => {
        if (this.isUnitPrice !== isUnitPrice) {
          this.isUnitPrice = isUnitPrice;
        }
      });

    this.productListFilterService.state$
      .pipe(takeUntil(this.destroy$)) // Ensure to unsubscribe when the component is destroyed
      .subscribe((newState) => {
        switch (newState) {
          case '':
            this.sortOrderChange('', true);
            break;
          case 'traceOrder':
            this.traceOrderChange();
            break;
          case 'ASC':
            this.sortOrderChange('ASC', true);
            break;
          case 'DESC':
            this.sortOrderChange('DESC', true);
            break;
        }
      });
  }
  // Add a destroy subject to properly unsubscribe when the component is destroyed
  private destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  traceOrderChange() {
    this.isTraceOrder = true;
    this.sortOrder = '';
    this.dataChange.emit({ isTraceOrder: true, sortOrder: '' });
    //this.productListFilterService.ChangeFilter('traceOrder');
  }

  pageSizeChange($event: number) {
    this.selectedPageSize = $event;
    this.dataChange.emit({ pageSize: $event });
  }

  sortOrderChange(sortOrder: 'ASC' | 'DESC' | '', changeByFilter = false) {
    this.isTraceOrder = false;
    this.sortOrder = sortOrder;
    if (!changeByFilter) this.productListFilterService.ChangeFilter(sortOrder);
    this.dataChange.emit({ sortOrder, isTraceOrder: false });
  }

  unitPriceChange(isUnitPrice: boolean) {
    this.sharedService.setUnitPrice(isUnitPrice);
    if (isUnitPrice) {
      this.notifierService.showInfoNotification('價格已設定未稅價');
    } else {
      this.notifierService.showInfoNotification('價格已設定含稅價');
    }

    this.dataChange.emit({
      isUnitPrice
    });
  }

  sortFieldChange(sortField: string): void {
    this.dataChange.emit({sortField: sortField});
  }
}
