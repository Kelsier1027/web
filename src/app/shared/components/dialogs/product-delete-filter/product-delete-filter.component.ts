import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from 'src/app/services';
import { LayoutService } from 'src/app/shared/services';

@Component({
  selector: 'app-product-delete-filter',
  templateUrl: './product-delete-filter.component.html',
  styleUrls: ['./product-delete-filter.component.scss'],
})
export class ProductDeleteFilterComponent {
  filterName = '';
  constructor(
    public layoutService: LayoutService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      filterId: number;
      filterName: string;
    },
    private productService: ProductService,
    public dialogRef: MatDialogRef<ProductDeleteFilterComponent>
  ) {}

  delete() {
    this.productService.deleteFilter(this.data.filterId).subscribe(() => {
      this.dialogRef.close();
    });
  }
}
