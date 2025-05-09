import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ProductComparisonComponent } from '../product-comparison/product-comparison.component';
import { CompareProduct2 } from 'src/app/models';

@Component({
  selector: 'app-product-control',
  templateUrl: './product-control.component.html',
  styleUrls: ['./product-control.component.scss'],
})
export class ProductControlComponent {
  @ViewChild(ProductComparisonComponent)
  comparisonComp?: ProductComparisonComponent;

  @Input()
  displayStatus!: number;
  @Input()
  isCompareAddOrRemove!: boolean;
  @Input()
  isComparedata!: any;
  @Input()
  isAddToWishList!: boolean;

  @Output()
  addToCart = new EventEmitter<void>();

  @Output()
  arrivalNotice = new EventEmitter<void>();

  @Output()
  contactSales = new EventEmitter<void>();

  @Output()
  addToComparison = new EventEmitter<void>();

  @Output()
  addToWishList = new EventEmitter<void>();

  @HostBinding('class')
  class = 'product-control';

  get compareItems(): CompareProduct2[] {
    return this.comparisonComp?.items || [];
  }
}
