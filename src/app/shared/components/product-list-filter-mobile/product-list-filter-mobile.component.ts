import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { take } from 'rxjs';
import { SharedService } from 'src/app/core/services/shared.service';
import { ProductListFilterService } from 'src/app/services/product-list-filter.service';
import {
  DialogService, NotifierService,
} from 'src/app/shared/services';

@Component({
  selector: 'app-product-list-filter-mobile',
  templateUrl: './product-list-filter-mobile.component.html',
  styleUrls: ['./product-list-filter-mobile.component.scss'],
})

export class ProductListFilterMobileComponent {
  @Input()
  type!: number;

  @Output()
  change = new EventEmitter();

  @Output()
  toggle = new EventEmitter();

  isUnitPrice$ = this.sharedService.isUnitPrice$;
  isActiveType :String = '最新上架';
  constructor(
    private sharedService: SharedService,
    private notifierService: NotifierService,
    public dialogservice: DialogService,
    private productListFilterService: ProductListFilterService,
  ) {}
  ngOnInit(): void {
    this.productListFilterService.state$.subscribe((newState) => {
      switch(newState){
        case '':
          this.isActiveType= '最新上架';
          break;
        case 'traceOrder':
          this.isActiveType= '熱門追蹤';
          break;
        case 'ASC':
          this.isActiveType= '價格由低到高';
          break;
        case 'DESC':
          this.isActiveType= '價格由高到低';
          break;
      }
    });
  }

  // onSort(): void {
  //   const config = {
  //     width: '300px',
  //     height: '300px',
  //     hasBackdrop: true,
  //     autoFocus: false,
  //     enterAnimationDuration: '300ms',
  //     exitAnimationDuration: '300ms',
  //   };
  //   this.dialogService.openLazyDialog('sort-mobile-dialog', config);
  // }

  /** open 最新上架 modal */
  contactProductListFilterMobileDialog() {
    const modelOption = {
      modelName: 'product-list-filter-mobile-dialogs',
      config: {
        data: {
          title: '排序',
        },
        width: '260px',
        height: 'auto',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: 'product-list-sort',
      },
    };

    this.dialogservice.openLazyDialog(modelOption.modelName, modelOption.config);
  }

  unitPriceChange() {
    this.isUnitPrice$.pipe(take(1)).subscribe((isUnitPrice) => {
      const newIsUnitPrice = !isUnitPrice;
      this.sharedService.setUnitPrice(newIsUnitPrice);
      if (newIsUnitPrice) {
        this.notifierService.showInfoNotification('價格已設定未稅價');
      } else {
        this.notifierService.showInfoNotification('價格已設定含稅價');
      }
    });
  }
}
