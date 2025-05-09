import { Component, EventEmitter, Input, OnInit, Output, Inject,ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'src/app/shared/services';
import {
  MatBottomSheetRef,MAT_BOTTOM_SHEET_DATA
} from '@angular/material/bottom-sheet';
import { set } from 'ramda';
import { Subject, Subscription, catchError, map, of, switchMap, tap, throttleTime } from 'rxjs';
import { FilterService } from 'src/app/shared/services/filter.service';
import { ProductService } from 'src/app/services';
import { ResponseCode } from 'src/app/enums';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-bottom-sheet',
  templateUrl: './search-bottom-sheet.component.html',
  styleUrls: ['./search-bottom-sheet.component.scss']
})
export class SearchBottomSheetComponent implements OnInit {

  @ViewChild(MatAutocompleteTrigger) autocomplete!: MatAutocompleteTrigger;
  @Output() searchChange = new EventEmitter<string>();
  inputValue: string | undefined;
  placeholder = '請輸入關鍵字或品號';
  type1Id?: number;
  type2Id?: number;
  filterSub = new Subscription();

  // 最近搜尋
  options: string[] = ['筆電', 'asus筆電', 'dell螢幕','筆電', 'asus筆電', 'dell螢幕','筆電', 'asus筆電', 'dell螢幕','筆電', 'asus筆電', 'dell螢幕'];
  // Matching keyword
  // optionsMatching: string[] = ['筆電包', '筆電架', 'ASUS 筆電', '筆電架', 'ASUS 筆電', '筆電架', 'ASUS 筆電', '筆電架', 'ASUS 筆電', '筆電架', 'ASUS 筆電'];
  optionsMatching: {
    keyword: string;
    prefix: string;
    suffix: string;
  }[] = []

  private inputSub: Subscription | null = null;
  private routeSub: Subscription | null = null;

  inputSource = new Subject<string>();
  input$ = this.inputSource.asObservable()
    .pipe(
      throttleTime(500, undefined, {
        leading: false,
        trailing: true
      }))
    .pipe(
      switchMap(value => {
        const param: {
          keyword?: string;
          type1?: number;
          type2?: number;
          // 品牌 ID 的集合，送出param時以逗號區隔轉成string格式
          brandList?: string[];
        } = {
          keyword: value
        };
        return this.productService.getSearchSuggestion(param).pipe(
          catchError(_ => {
            return of({});
          }),
          map((res: any) => {
            if (res.responseCode === ResponseCode.Success) {
              return res.result
            } else {
              return null;
            }
          }),
        );
      })
    )

  @ViewChild("inputField") inputField:any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialogservice: DialogService,
    private filterService: FilterService,
    private productService: ProductService,
    private _bottomSheetRef: MatBottomSheetRef<SearchBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) { }

  ngOnInit(): void {
    this.loadContentManagement();
    setTimeout(()=>{
      this.inputField.nativeElement.focus();
    },300);
  }

  onInputValue(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.inputSource.next(value);
  }

  getItem(): string[] {
    let data = localStorage.getItem('searchRadiusInputHistory');
    let options: string[] = [];
    if (data) {
      try {
        options = JSON.parse(data);
      } catch (_) { }
    }
    return options;
  }

  setItem(options: string[]) {
    localStorage.setItem('searchRadiusInputHistory', JSON.stringify(options));
  }

  removeItem(index: number, e?: MouseEvent) {
    e?.stopPropagation();
    let options = [...this.options]
    options.splice(index, 1);
    this.setItem(options);
    this.options = options;
    return options;
  }

  onDelete(index: number, _: string) {
    this.removeItem(index);
  }

  /** search name */
  searchName($event?: string): void {
    this.router.navigate(['/ProductList'], { queryParams: { keyword: $event } })
  }

  /** open 進階搜尋 modal */
  advancedSearchViewModal(): void {
    const modelOption = {
      modelName: 'advanced-search-view',
      config: {
        data: {
          title: '進階搜尋',
        },
        width: '500px',
        height: '410px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: '',
      },

    };
    this.dialogservice
      .openLazyDialog(modelOption.modelName, modelOption.config)
      .then((ref) => {
        ref.afterClosed().subscribe((result) => {
          if(result){
            this.close();
          }
        });
      });
  }

  loadContentManagement() {
    this.filterSub = this.filterService.filterParams$
      .pipe(
        switchMap((param) => {
          // const option1AsString = this.option1.toString();
          /*
          if (this.option1.toString() !== '所有主分類') {
            const matchingType1 = this.type1Options.find(
              (type1) => type1.name === this.option1.toString()
            );
            if (matchingType1) {
              param.type1Id = matchingType1.id;
            }
          }
          if (this.option2.toString() !== '所有次分類') {
            const matchingType2 = this.type2Options.find(
              (type2) => type2.name === this.option2.toString()
            );
            if (matchingType2) {
              param.type2Id = matchingType2.id;
            }
          }
          if (this.option3.toString() !== '所有品牌') {
            const matchingType3 = this.type3Options.find(
              (type3) => type3.name === this.option3.toString()
            );
            if (matchingType3) {
              param.brandId = matchingType3.id;
            }
          }
          */




          return this.productService.getSearchSuggestion(param).pipe(
            catchError(() => {
              // handle api error and continue operation
              return of();
            })
          );
        }),
        tap((res) => {
          if (Array.isArray(res)) {
            // handle the case when res is an array
          } else {
            // handle the case when res is ResultRes<any>
            if (res.responseCode === '0000') {
              // your code here res.result.awardActivityName
              this.optionsMatching = res.result.suggestions;
            }
          }
        })
      )
      .subscribe();

    this.inputSub = this.input$.subscribe((result) => {
      if (!result) {
        return;
      } else {
        this.optionsMatching = result.suggestions;
      }
    });

    this.routeSub = this.route.queryParams
      .pipe(
        map(params => ({
          keyword: params['keyword'],
          type1Id: params['type1Id'] && Number(params['type1Id']),
          type2Id: params['type2Id'] && Number(params['type2Id']),
        }))
      ).subscribe((params) => {
        this.inputValue = params.keyword;
        this.type1Id = params.type1Id;
        this.type2Id = params.type2Id;
        this.options = this.getItem();
      });
  }

  submit(){
    if (this.inputValue) {
      let index = this.options.indexOf(this.inputValue);
      if (-1 != index) {
        this.options.splice(index, 1);
      }
      this.options.unshift(this.inputValue);
      this.setItem(this.options);
    }
    this.searchChange.emit(this.inputValue);
    const queryParams: {
      keyword?: string;
    } = {
      keyword: this.inputValue,
    };
    this.router.navigate(['/ProductList'], { queryParams });

    this.close();
  }

  close(){
    this.autocomplete.closePanel();
    this._bottomSheetRef.dismiss(this.inputValue);
  }

  clearAllOptions() {
    localStorage.removeItem('searchRadiusInputHistory')
    this.options = [];
  }
}
