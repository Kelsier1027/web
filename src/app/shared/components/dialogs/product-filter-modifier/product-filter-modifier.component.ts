import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LayoutService } from 'src/app/shared/services';

@Component({
  selector: 'app-product-filter-modifier',
  template: '',
  styleUrls: ['./product-filter-modifier.component.scss'],
})
export class ProductFilterModifierComponent {
  filterName = '';
  constructor(
    public layoutService: LayoutService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
    },
    protected fb: FormBuilder
  ) {}

  form!: FormGroup<{
    name: FormControl<string | null>;
  }>;

  submit() {
    this.form.markAllAsTouched();
  }
  getFormValue(){
    return this.form.value.name;
  }
}
