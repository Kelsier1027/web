import { Component, Inject, OnInit } from '@angular/core';
import { ProductFilterModifierComponent } from '../product-filter-modifier/product-filter-modifier.component';
import { LayoutService } from 'src/app/shared/services';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from 'src/app/services';
import { FilterForm } from 'src/app/models';

@Component({
  selector: 'app-product-save-filter',
  templateUrl:
    '../product-filter-modifier/product-filter-modifier.component.html',
  styleUrls: [
    '../product-filter-modifier/product-filter-modifier.component.scss',
  ],
})
export class ProductSaveFilterComponent
  extends ProductFilterModifierComponent
  implements OnInit
{
  public override form = this.fb.group({
    name: ['', Validators.required],
  });
  constructor(
    public override layoutService: LayoutService,
    @Inject(MAT_DIALOG_DATA)
    public override data: {
      title: string;
      description: string;
      filterData: FilterForm;
    },
    public override fb: FormBuilder,

    public dialogRef: MatDialogRef<ProductSaveFilterComponent>,
    private productService: ProductService
  ) {
    super(layoutService, data, fb);
  }

  override submit() {
    super.submit();
    this.productService
      .createFilter({
        ...this.data.filterData,
        filterName: this.form.value.name,
      })
      .subscribe(() => {
        this.dialogRef.close();
      });
  }

  ngOnInit(): void {
    document.body.classList.add('product-save');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('product-save');
  }
}
