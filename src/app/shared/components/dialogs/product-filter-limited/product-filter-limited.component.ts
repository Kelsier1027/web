import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LayoutService } from 'src/app/shared/services';

@Component({
  selector: 'app-product-filter-limited',
  templateUrl: './product-filter-limited.component.html',
  styleUrls: ['./product-filter-limited.component.scss'],
})
export class ProductFilterLimitedComponent {
  constructor(
    public layoutService: LayoutService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
    }
  ) {}

  ngOnInit(): void {
    document.body.classList.add('product-filter-limited');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('product-filter-limited');
  }
}
