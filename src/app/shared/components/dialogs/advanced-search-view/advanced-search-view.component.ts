import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorMessage, Type1List, Type2List } from 'src/app/models';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services';
import { map, share } from 'rxjs';
import { ResponseCode } from 'src/app/enums';
import { Options } from 'src/app/shared/models';

@Component({
  selector: 'app-advanced-search-view',
  templateUrl: './advanced-search-view.component.html',
  styleUrls: ['./advanced-search-view.component.scss']
})
export class AdvancedSearchViewComponent implements OnInit {

  advancedSearchForm!: FormGroup;
  error: ErrorMessage = {
    submitInvalid: false,
    errorMessage: { type: '', message: '' },
  };
  regExps: { [key: string]: RegExp } = {
    word: /^(?=.*[\u4E00-\u9FA5\uF900-\uFA2D]).+$/,
    tel: /^[\d!@#\$%\^\&*\)\(+=._-]{1,40}$/,
    mobile: /^[\d]{1}[\d-]{1,39}$/,
  };

  menu$ = this.productService.getMenu()
    .pipe(
      share(),
      map(data =>
        data.responseCode === ResponseCode.Success ?
          Array.isArray(data.result?.type1List) ?
            data.result.type1List :
            [] :
          []
      ),
    );

  menu: Type1List[] = [];
  type1List: (Type1List & Options)[] = [];
  type2List: (Type2List & Options)[] = [];
  selectedType1: string | number | null = null;
  selectedType2: string | number | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AdvancedSearchViewComponent>,
    private fb: FormBuilder,
    private router: Router,
    private productService: ProductService,
    private route: ActivatedRoute,
  ) {}

  /** confirm click */
  onSubmit(): void {
    if (this.advancedSearchForm.valid) {
      const keyword = this.advancedSearchForm.value.keyword;
      if (keyword) {
        const options = this.getItem();
        let index = options.indexOf(keyword);
        if (-1 != index) {
          options.splice(index, 1);
        }
        options.unshift(keyword);
        this.setItem(options);
      }

      this.router.navigate(['/ProductList'], { queryParams: { 
        keyword: this.advancedSearchForm.value.keyword,
        type1Id: this.selectedType1,
        type2Id: this.selectedType2,
      } })
      this.dialogRef.close(this.advancedSearchForm.value);
    }
  }
  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;
    const queryParams = {
      keyword: params['keyword'],
      type1Id: params['type1Id'] && Number(params['type1Id']),
      type2Id: params['type2Id'] && Number(params['type2Id']),
    }
    this.advancedSearchForm = this.fb.group({
      mainCategory: null,
      subCategory:null,
      keyword: queryParams.keyword ?? null
    });
    const subscription = this.menu$.subscribe((menu) => {
      this.menu = menu;
      this.type1List = menu.map(item => ({
        ...item,
        label: item.name,
        value: item.id,
      }));
      this.type2List = [];
      queryParams.type1Id && this.onSelectType1(queryParams.type1Id);
      queryParams.type2Id && this.onSelectType2(queryParams.type2Id);
      subscription.unsubscribe();
    });
  }

  onSelectType1(value: any) {
    this.advancedSearchForm.value.mainCategory = value;
    this.selectedType1 = value;
    this.getType2List();
  }

  onSelectType2(value: any) {
    this.advancedSearchForm.value.subCategory = value;
    this.selectedType2 = value;
  }

  private getType2List() {
    if (!this.advancedSearchForm.value.mainCategory) {
      this.type2List = [];
      return;
    }
    const type1 = this.type1List.find(item => item.id === this.advancedSearchForm.value.mainCategory);
    this.type2List = !type1 ? [] : type1.type2List.map(item => ({
      ...item,
      label: item.name,
      value: item.id,
    }));
  }

  private getItem(): string[] {
    let data = localStorage.getItem('searchRadiusInputHistory');
    let options: string[] = [];
    if (data) {
      try {
        options = JSON.parse(data);
      } catch (_) { }
    }
    return options;
  }

  private setItem(options: string[]) {
    localStorage.setItem('searchRadiusInputHistory', JSON.stringify(options));
  }
}
