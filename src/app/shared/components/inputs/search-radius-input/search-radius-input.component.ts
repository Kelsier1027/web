/** --------------------------------------------------------------------------------
 *-- Description： search radious input
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */

import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, startWith, throttleTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'src/app/shared/services';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SearchBottomSheetComponent } from '../../bottom-sheet/search-bottom-sheet/search-bottom-sheet.component';
import { ProductService } from 'src/app/services';
import { OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { catchError, of, Subscription, switchMap, tap } from 'rxjs';
import { Pagination } from 'src/app/core/model';

import { ResponseCode } from 'src/app/enums';
import { MemberService } from 'src/app/services';
import { FilterService } from 'src/app/shared/services/filter.service';
import { DynamicFormValue, Order, User } from 'src/app/models';
import * as moment from 'moment';
import { FlashSalesAdvertise2, FlashSalesAdvertise } from 'src/app/models';
import {
  Menu,
  Type1List,
  Type2List,
  BrandList,
  ResultRes,
} from 'src/app/models';
import {
  style,
  animate,
  AnimationBuilder,
  AnimationPlayer,
} from '@angular/animations';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
@Component({
  selector: 'app-search-radius-input',
  templateUrl: './search-radius-input.component.html',
  styleUrls: ['./search-radius-input.component.scss'],
})
export class SearchRadiusInputComponent implements OnInit, OnDestroy {
  filterForm!: FormGroup;
  isCreatedByCurrentUser!: boolean;
  dataSource!: any;
  pagination?: Pagination;
  filterSub = new Subscription();
  @Input() placeholder = '';
  @Input() onlyIcon = false;

  @Output() searchChange = new EventEmitter<string>();
  inputValue: string | undefined;
  type1Id?: number;
  type2Id?: number;

  // 最近搜尋
  options: string[] = ['筆電', 'asus筆電', 'dell螢幕'];
  // 最多保存幾筆搜尋關鍵字歷史紀錄
  maxKeywordHistoryCount: number = 5;
  // options: {
  //   keyword: string;
  //   prefix: string;
  //   suffix: string;
  // }[] = [];
  // Matching keyword
  // optionsMatching: string[] = ['筆電包', '筆電架', 'ASUS 筆電'];
  optionsMatching: {
    keyword: string;
    prefix: string;
    suffix: string;
  }[] = []

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
  private inputSub: Subscription | null = null;
  private routeSub: Subscription | null = null;
  @ViewChild(MatAutocompleteTrigger)
  autocomplete?: MatAutocompleteTrigger;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialogservice: DialogService,
    public layoutService: LayoutService,
    private _bottomSheet: MatBottomSheet,
    private builder: AnimationBuilder,
    private productService: ProductService,
    private analyticsService: AnalyticsService,
    private fb: FormBuilder,
    private filterService: FilterService,
    private memberService: MemberService,
    ) { }

  ngOnInit() {

    this.loadContentManagement();

  }

  ngOnDestroy(): void {
    if (this.inputSub && !this.inputSub.closed) {
      this.inputSub.unsubscribe();
    }
    if (this.routeSub && !this.routeSub.closed) {
      this.routeSub.unsubscribe();
    }
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
    options = options.slice(0, this.maxKeywordHistoryCount);
    localStorage.setItem('searchRadiusInputHistory', JSON.stringify(options));
  }

  removeItem(index: number) {
    let options = [...this.options]
    options.splice(index, 1);
    this.setItem(options);
    this.options = options;
    return options;
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

  /** close click */
  close(): void {
    this.inputValue = '';
    this.searchChange.emit(this.inputValue);
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
        ref.afterClosed().subscribe();
      });
  }

  openSearchBottomSheet() {
    const bottomSheetRef = this._bottomSheet.open(SearchBottomSheetComponent,
      {
        data: { inputValue: this.inputValue },
        panelClass: 'custom-width'
      });
    bottomSheetRef.afterDismissed().subscribe((data) => {
      this.inputValue = data;
    });
  }

  onInputValue(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.inputSource.next(value);
  }

  onClearHistory() {
    this.options = [];
    this.setItem(this.options);
  }

  onDelete(index: number, _: string, e: MouseEvent) {
    e.stopPropagation();
    this.removeItem(index);
  }

  async submit() {
    const isPanelOpen = this.autocomplete?.panelOpen;
    if (this.inputValue) {
      let index = this.options.indexOf(this.inputValue);
      if (-1 != index) {
        this.options.splice(index, 1);
      }
      this.options.unshift(this.inputValue);
      this.setItem(this.options);
      const keyWordAnalytics = {
        keyword: this.inputValue.split(" ")
      };
      this.analyticsService.event('keyWord',keyWordAnalytics,true);
    }
    this.searchChange.emit(this.inputValue);
    await this.router.navigate(['/ProductList'], { queryParams: ({
        ...this.route.snapshot.queryParams,
        keyword: this.inputValue,
        // 搜尋時，清空分類跟品牌的篩選
        type1Id: null,
        type2Id: null,
        brand: null,
        isWelfare: null
      })
    });
    this.autocomplete?.closePanel();

    // 重新計算 autocomplete top 位置
    if(isPanelOpen) this.autocomplete?.openPanel();
  }
}
