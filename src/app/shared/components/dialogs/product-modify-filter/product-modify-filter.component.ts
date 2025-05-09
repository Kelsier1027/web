import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { ProductFilterModifierComponent } from '../product-filter-modifier/product-filter-modifier.component';
import { LayoutService } from 'src/app/shared/services';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FilterForm } from 'src/app/models';
import { ProductService } from 'src/app/services';

@Component({
  selector: 'app-product-modify-filter',
  templateUrl: '../product-filter-modifier/product-filter-modifier.component.html',
  styleUrls: ['../product-filter-modifier/product-filter-modifier.component.scss']
})
export class ProductModifyFilterComponent extends ProductFilterModifierComponent {
  public override form = this.fb.group({
    name: [this.data.filterData.filterName as string, Validators.required],
  })
  constructor(
    public override layoutService: LayoutService,
    @Inject(MAT_DIALOG_DATA)
    public override data: {
      title: string;
      description: string;
      filterData: Partial<FilterForm>
    },
    public override fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductModifyFilterComponent>,
    private productService: ProductService
  ) {
    super(layoutService, data, fb);
  }

  override submit() {
    super.submit();
    if(super.getFormValue() != ""){
      this.productService.editFilter({
        filterId: this.data.filterData.filterId,
        filterName: this.form.value.name
      }).subscribe(() => {
        this.dialogRef.close();
      })
    }
  }
}
