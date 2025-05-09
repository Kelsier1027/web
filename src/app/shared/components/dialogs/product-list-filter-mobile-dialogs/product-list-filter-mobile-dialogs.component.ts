import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LayoutService } from 'src/app/shared/services';
import { FormGroup } from '@angular/forms';
import { ProductListFilterService } from '../../../../../app/services/product-list-filter.service'

@Component({
  selector: 'app-product-list-filter-mobile-dialogs',
  templateUrl: './product-list-filter-mobile-dialogs.component.html',
  styleUrls: ['./product-list-filter-mobile-dialogs.component.scss'],
})
export class ProductListFilterMobileDialogsComponent {
  group!: FormGroup;
  value:string = '1';
  constructor(
    public layoutService: LayoutService,
    public productListFilterService: ProductListFilterService,
    @Inject(MAT_DIALOG_DATA)public data: any,
  ) {}

  ngOnInit(): void {
    this.productListFilterService.state$.subscribe((newState) => {
      switch(newState){
        case '':
          this.value='1';
          break;
        case 'traceOrder':
          this.value='2';
          break;
        case 'ASC':
          this.value='3';
          break;
        case 'DESC':
          this.value='4';
          break;
      }
    });
  }
}
