import {
  BehaviorSubject,
  Observable,
  Subject,
  combineLatest,
  filter,
  share,
  shareReplay,
  take,
} from 'rxjs';
/** --------------------------------------------------------------------------------
 *-- Description：filter form
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { map, switchMap, tap } from 'rxjs';
import {
  lensPath,
  assoc,
  over,
  pipe as Rpipe,
  map as Rmap,
  filter as Rfilter,
  __,
  ifElse,
  hasPath,
  values,
  uniqBy,
  prop,
  without,
  append,
  clone,
  view,
  complement,
  flatten,
  join,
  when,
  forEach,
  propSatisfies,
  gt,
  allPass,
  propEq,
  find,
  mergeLeft,
  concat,
  cond,
  isNil,
  always,
  T,
  lt,
} from 'ramda';
import { ProductService } from 'src/app/services/product.service';
import { Brand, FilterForm, MainType, SpData, SubType, ViewFilter } from 'src/app/models/product.model';
import { DialogService, LayoutService } from '../../services';
import { MobileMenuService } from 'src/app/services/mobile-menu.service';
import { FormGroupDirective } from '@angular/forms';
import { StorageService } from 'src/app/core/services/storage.service';
import { CurrencyPipe } from '@angular/common';
import { ResultRes } from 'src/app/models';
import { URL_UTIL } from 'src/app/shared/utils/urlUtilities';
import { POP_UP } from 'src/app/shared/utils/popUpUtilities';

interface ModifyList {
  isChecked: boolean;
  data: any;
  list: string[];
}

@Component({
  selector: 'app-filter-form',
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.scss'],
  viewProviders: [FormGroupDirective],
})
export class FilterFormComponent implements OnInit {
  @Output()
  paramsChange = new EventEmitter<Partial<FilterForm>>();
  @Output()
  mobileTitleChange = new EventEmitter<string>();
  @Output()
  clear = new EventEmitter();
  @Output()
  close = new EventEmitter();
  @Input()
  isSearchPage!: boolean;
  @Input()
  isWelfare!: boolean;
  @Input()
  isSpecialEvent: boolean = false;
  @Input()
  brandIdList: number[] = [];
  @Input()
  type1IdList: number[] = [];
  type1IdListBackup?: number[];
  @Input()
  type2IdList: number[] = [];
  type2IdListBackup?: number[];
  selectedType1Id?: number;
  selectedType2Id?: number;
  keywordBackup: string | null = null;

  brandNameList: string[] = [];
  brandNameList2: string[] = [];
  panelOpenState = false;
  keyword: string | null = null;

  currentBrands: Brand[] = [];
  brandId!: number | null;
  selectedFilter: FilterForm | null = null;
  selectedMainFilter: MainType | null = null;
  selectedSubFilter: SubType | null = null;

  defaultFilterForm: Partial<FilterForm> = {
    brandList: [],
    filters: [],
    activity: null,
    subInventory: null,
    lowestPrice: null,
    highestPrice: null
  };

  filterForm: Partial<FilterForm> = clone(this.defaultFilterForm);
  filterFormPreviousRecord: Partial<FilterForm> = clone(this.defaultFilterForm);
  defaultFilterData!: any;

  mobileMenu$: Observable<any[]> = combineLatest([
    this.activatedRoute.queryParams,
    this.mobileMenuService.menuData,
  ]).pipe(
    filter(([routeParams]) => !routeParams['keyword']),
    map(
      ([routeParams, menuData]) => menuData[routeParams['type1Id']]?.type2List
    ),
    tap((menuList) => {
      menuList && this.mobileMenuService.title.next(menuList);
    })
  );

  defaultFilters: any = [];
  activityStatus: string[] = [];
  activityData = ['促銷活動', '獎勵活動'];
  subInventoryStatus: string[] = [];
  subInventoryData!: string[];
  specialEventId!: string;
  brandsData: Brand[] = [];
  mainCategory!: MainType[];
  SubCategory!: SubType[];
  filterData!: ViewFilter[];
  currentScreenSize!: string;
  filterOptions: any[] = [];
  savedFilter = new Subject();

  savedFilter$ = this.savedFilter.asObservable().pipe(
    switchMap(() => this.productService.getSavedFilter()),
    map(view(lensPath(['result', 'filters']))),
    tap((data) => {
      const currentId = localStorage.getItem('filterId');
      const target = ifElse<any, any, any>(
        () => !!currentId,
        find((item: any) => String(item.filterId) === currentId),
        () => null
      )(data);
      target && this.filterChange(target);
      localStorage.removeItem('filterId');
    }),
    shareReplay(1)
  );
  savedFilterCount = new Subject();

  savedFilterCount$ = this.savedFilterCount.asObservable().pipe(
    switchMap(() => this.productService.getSavedFilterCount()),
    map(view(lensPath(['result'])))
  );

  // 暫存常用篩選按鈕常駐
  currentSavedFilterCount$ = this.savedFilterCount$.pipe(map(x => Math.max(x, 1)))

  constructor(
    private dialogservice: DialogService,
    public layoutService: LayoutService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    public mobileMenuService: MobileMenuService,
    private storageService: StorageService,
    private currencyPipe: CurrencyPipe
  ) { }

  ngOnInit(): void {
    this.getFilter();

    this.layoutService.layoutChanges$.subscribe((size) => {
      this.currentScreenSize = size;
    });
  }
  ngAfterViewInit(): void {
    this.savedFilter.next(true);
    this.savedFilterCount.next(true);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['type1IdList'] || changes['type2IdList'] || changes['brandIdList']) {
      if (this.isMainCategoryNeedFilter ) {
        // 篩選出存在於 brandIdList 的 mainCategory
        this.mainCategory = this.mainCategory.filter((type1) => this.type1IdList!.includes(type1.type1Id ?? -1));
        this.type1IdListBackup = this.type1IdList;
        this.keywordBackup = this.keyword;
      }else{
        if(this.type1IdListBackup){
          this.mainCategory = this.mainCategory.filter((type1) => this.type1IdListBackup!.includes(type1.type1Id ?? -1));
        }
      }

      if (this.isSubCategoryNeedFilter) {
        // 篩選出存在於 type2IdList 的 SubCategory
        this.SubCategory = this.SubCategory.filter((type2) => this.type2IdList!.includes(type2.type2Id ?? -1));
        this.type2IdListBackup = this.type2IdList;
      }else{
        if(this.type2IdListBackup && this.SubCategory){
          this.SubCategory = this.SubCategory.filter((type2) => this.type2IdListBackup!.includes(type2.type2Id ?? -1));
        }
      }

      if (this.isBrandListNeedFilter) {
        // 篩選出存在於 brandIdList 的 brandsData
        this.brandsData = this.brandsData.filter((brand) => this.brandIdList!.includes(brand.brandId));
      }

      if (this.filterFormPreviousRecord != this.filterForm) {
        this.filterFormPreviousRecord = this.filterForm;
      }
    }
  }

  get isMainCategoryNeedFilter(){
    return (
      !this.selectedType1Id &&
      this.type1IdList &&
      this.type1IdList.length > 0 &&
      this.hasFilter == false &&
      (
        this.isWelfare || this.isSpecialEvent || this.isSearchPage
      )
      || this.keywordBackup != this.keyword
    )
  }

  get filterFormWithoutMainCategory(){
    let values = this.filterForm;
    values.type1 = undefined;
    return values;
  }

  get isSubCategoryNeedFilter(){
    return (
      !this.selectedType2Id &&
      this.SubCategory &&
      this.type2IdList.length > 0 &&
      Object.values(this.filterFormWithoutMainCategory).some(value => this.isValuePresent(value)) == false
    )
  }

  get isBrandListNeedFilter(){
    return (
      this.brandIdList &&
      this.brandIdList.length > 0 &&
      (
        this.filterForm.brandList?.length == 0 ||
        (
          this.filterFormPreviousRecord != this.filterForm &&
          this.filterFormPreviousRecord.brandList == this.filterForm.brandList
        )
      )
    )
  }

  get hasFilter(): boolean {
    // 獲取物件所有屬性值
    const values = Object.values(this.filterForm);

    // 判斷是否有任何屬性是有值的
    return values.some(value => this.isValuePresent(value));
  }

  // 判斷單一值是否有值
  private isValuePresent(value: any): boolean {
    if (value === null || value === undefined || value === '') {
      return false; // 空值
    }

    if (Array.isArray(value)) {
      return value.length > 0; // 非空陣列
    }

    if (typeof value === 'object') {
      return Object.keys(value).length > 0; // 非空物件
    }

    return true; // 字串、數字、布林值等
  }


  get isDesktop() {
    return this.currentScreenSize !== 'small';
  }

  private getFilter() {
    this.activatedRoute.queryParams
      .pipe(
        tap(({ keyword, isWelfare, specialEventId }) => {
          this.isSearchPage = keyword ? true : false;
          this.keyword = keyword || null;
          if (keyword || isWelfare === 'true') {
            this.subInventoryData = ['林口倉', '高雄倉', '福利倉', '數位軟體'];
            if (!specialEventId) {
              this.isSpecialEvent = false;
              this.specialEventId = '';
              this.filterForm.specialEventId = undefined;
            }
            this.filterForm = {
              activity: null,
              subInventory: null,
            };
            this.submitForm();
          }
        }),
        tap(({ type1Id, type2Id, brand, specialEventId }) => {
          if (type1Id || type2Id || brand) {
            this.selectedType1Id = type1Id;
            this.selectedType2Id = type2Id;
            if (!specialEventId) {
              this.isSpecialEvent = false;
              this.specialEventId = '';
              this.filterForm.specialEventId = undefined;
            }
            this.filterForm = {
              ...this.filterForm,
              type1: type1Id,
              type2: type2Id,
              brandId: brand
            };

            this.submitForm();
          }
        }),
        tap(({ specialEventId }) => {
          if (specialEventId) {
            this.specialEventId = specialEventId;
          }
        }),

        tap(({ isWelfare }) => {
          if (isWelfare) {
            this.filterForm.type1 = null;
            this.filterForm.type2 = null;
          }
        }),
        tap(({ type1Id, type2Id, keyword }) => {
          if (this.specialEventId) {
          } else {
            const isInvalid = !type1Id && !type2Id && !keyword;
            if(!this.activatedRoute.snapshot.queryParamMap.get('isWelfare')){
              isInvalid && this.router.navigate(['/']);
            }
          }
        }),
        tap(({ type1Id, type2Id, brand }) => {
          this.defaultFilterForm.type1 = type1Id;
          this.defaultFilterForm.type2 = type2Id;
          brand ? (this.brandId = Number(brand)) : (this.brandId = null);
          this.filterForm = clone(this.defaultFilterForm);
          this.clear.emit();
        }),
        switchMap(({ type1Id, type2Id }) => {
          return this.productService.getFilter(
            { type1Id: type1Id || '',
              type2Id: type2Id != undefined && type2Id != null && type2Id != 'null' ? type2Id: '',
              isWelfare: this.isWelfare
            });
        }),
        map(

          ifElse(
            hasPath(['result', 'brands']),
            over(
              lensPath(['result', 'brands']),
              Rmap(assoc('selected', false))
            ),
            () => null
          )
        ),
        filter((response) => Boolean(response?.result)),
        tap(({ result }) => {
          this.filterForm.isWelfare = Boolean(this.activatedRoute.snapshot.queryParamMap.get('isWelfare'));
          this.defaultFilterData = clone(result);
          this.setFormData(result);
          this.submitForm();
          this.resetForm({ submit: false });
        })
        ,tap(_ => {
            const type1Id: number = URL_UTIL.getParam(this.activatedRoute.snapshot.queryParams, 'type1Id');
            const type2Id: number = URL_UTIL.getParam(this.activatedRoute.snapshot.queryParams, 'type2Id');

            if (type1Id) {
              this.selectedMainFilter = this.mainCategory.filter(mc => mc.type1Id == type1Id)[0] ?? this.selectedMainFilter;
              this.SubCategory = this.selectedMainFilter.type2Filters;
            }

            if (type2Id)
              this.selectedSubFilter = this.selectedMainFilter?.type2Filters.filter((val) => val.type2Id == type2Id)[0] ?? null;
        })
      )
      .subscribe();
  }

  get filters() {
    return this.filterForm['filters'] as any[];
  }

  private setFormData(result: any) {
    result.brands && this.setBrand(result.brands);
    result.type1s && this.setType(result.type1s);
    if (this.brandId) {
      const name = this.brandsData.find(
        (data) => data.brandId === this.brandId
      )?.brandName;
      this.brandsChange({ checked: true }, this.brandId, name);
      this.currentBrands[this.brandId].selected = true;
    }

    this.setDefaultFilters(result.defaultFilters);
    this.setFilter();
    result.subInventory && this.setSubInventory(result.subInventory);
  }

  onMainCategoryChange(selectedMainCategory: any): void {
    // 重置次分類，因為次分類是跟著主分類
    this.SubCategory = [];
    this.selectedSubFilter = null;

    const filteredMainCategory = this.mainCategory.filter(item => item.type1Id === selectedMainCategory?.type1Id).map(item => item.type2Filters);
    this.SubCategory = filteredMainCategory[0];
    this.selectedMainFilter = selectedMainCategory;
    this.MainAndSubCategoryChage();
  }
  onSubCategoryChange(selectedSubCategory: any): void {
    const filteredSubCategory = this.selectedMainFilter?.type2Filters.filter(item => item.type2Id === selectedSubCategory?.type2Id) ?? [];
    this.selectedSubFilter = filteredSubCategory[0];
    this.MainAndSubCategoryChage();
  }
  MainAndSubCategoryChage(){
     let params: any = {};

    if (this.selectedMainFilter?.type1Id)
      params = {...params, type1: this.selectedMainFilter.type1Id};

    if( this.selectedSubFilter?.type2Id)
      params = {...params, type2: this.selectedSubFilter.type2Id};

    if (this.keyword)
      params = {...params, keyword: this.keyword};

    this.redirectPage(0, params, this.isWelfare, this.isSpecialEvent);
  }

  filterChange($event: any) {
    this.resetForm({ submit: false });

    ifElse(
      allPass<any>([
        propEq('type1Id', String($event.type1)),
        propEq('type2Id', String($event.type2)),
      ]),
      () => this.selectFilter($event),
      () =>
        this.redirectPage($event.filterId, {
          type1: $event.type1,
          type2: $event.type2,
        })
    )(this.activatedRoute.snapshot.queryParams);
  }

  private selectFilter($event: any) {
    const hasData = propSatisfies(gt(__, 0), 'length');
    when<number[], number[]>(
      hasData,
      forEach((item: number) => {
        this.brandsChange({ checked: true }, item);
        this.currentBrands[item].selected = true;
      })
    )($event.brandList);

    when<string[], string[]>(
      hasData,
      (list) => (this.brandNameList = list)
    )($event.brandNameList);
    when<string[], string[]>(
      hasData,
      forEach((item: string) => {
        this.activityChange({ checked: true }, item);
      })
    )($event.activity);

    when<string[], string[]>(
      hasData,
      forEach((item: string) => {
        this.subInventoryChange({ checked: true }, item);
      })
    )($event.subInventory);

    this.filterForm.filters = $event.filters;
    this.filterForm.highestPrice = $event.highestPrice;
    this.filterForm.lowestPrice = $event.lowestPrice;
    this.filterData = $event.filters.map(over(lensPath(['spDatas']), values));
    this.selectedFilter = $event;
    this.submitForm();
  }

  private redirectPage(id: number, params: { type1: number | null; type2: number | null, keyword?: string},isWelfare?: Boolean,isSpecialEvent?: Boolean) {
    const { type1, type2 } = params;
    const productListUrl = this.router.url.substring(
      0,
      this.router.url.indexOf('?')
    );

    if (type1 === -1) {
      this.router.navigateByUrl(productListUrl + '?isWelfare=true');
      return;
    }

    let url = productListUrl + '?';

    if (params.type1)
      url += `&type1Id=${params.type1}`;

    if (params.type2)
      url += `&type2Id=${params.type2}`;

    if (params.keyword)
      url += `&keyword=${params.keyword}`;

    if (isWelfare)
      url += '&isWelfare=true';
    if (isSpecialEvent)
      url += ( '&specialEventId=' + this.specialEventId );
    this.router.navigateByUrl(url);
    this.storageService.set('filterId', id);
    this.savedFilter.next(true);
  }

  private getCurrency(value: any) {
    return cond([
      [isNil, () => null],
      [gt(99), (value) => `$${value}`],
      [T, (value) => this.currencyPipe.transform(value, '', 'symbol', '1.0-0')],
    ])(value ? Number(value) : value);
  }

  private getFilterDescription() {
    const { lowestPrice, highestPrice } = this.filterForm as FilterForm;

    const getCheckedSpDatas = Rpipe(
      Rmap((item: any) => item.spDatas),
      flatten,
      Rfilter((item: any) => item.selected),
      Rmap((item: any) => item.typeName)
    );

    // 價格顯示有四種
    // $xxx-$xxx
    // 大於$xxx
    // 小於$xxx
    // 完全沒有

    const priceLow = lowestPrice != null && lowestPrice != undefined ? this.getCurrency(lowestPrice) : null;
    const priceHigh = highestPrice != null && highestPrice != undefined ? this.getCurrency(highestPrice) : null;

    let priceString = '';
    if (priceLow && priceHigh)
    {
      priceString = `${priceLow}-${priceHigh}`;
    }
    else if (priceLow) {
      priceString = `大於${priceLow}`;
    }
    else if (priceHigh) {
      priceString = `小於${priceHigh}`;
    }

    return this.brandNameList
      .concat(this.activityStatus)
      .concat(this.subInventoryStatus)
      .concat(getCheckedSpDatas(this.filterData ? this.filterData : []))
      .concat([priceString])
      .filter(s => s)
      .join('/')
  }

  saveFilter() {
    if (this.isUsingDealerView()) {
      this.showDealerViewError();
      return;
    }

    const description = this.getFilterDescription();
    const filterData = mergeLeft(
      {
        activity: this.activityStatus,
        subInventory: this.subInventoryStatus,
      },
      this.filterForm
    );
    if (filterData.activity.length == 0 && filterData.brandList?.length == 0 &&
      filterData.filters?.length == 0 && filterData.subInventory?.length == 0 &&
      filterData.highestPrice == null && filterData.lowestPrice == null
    ) {
      this.filterNoConditions();
    }
    else {
      const modelOption = {
        modelName: 'product-save-filter',
        config: {
          data: {
            title: '暫存常用篩選',
            displayFooter: true,
            cancelButton: '取消',
            confirmButton: '確認',
            filterData,
            description,
            async: true,
          },
          width: '500px',
          hasBackdrop: true,
          autoFocus: false,
          enterAnimationDuration: '300ms',
          exitAnimationDuration: '300ms',
          panelClass: 'product-edit-filter',
        },
      };
      this.dialogservice
        .openLazyDialog(modelOption.modelName, modelOption.config)
        .then((ref) => {
          ref.afterClosed().subscribe(() => {
            this.savedFilter.next(true);
            this.savedFilterCount.next(true);
          });
        });
    }
  }

  filterLimited() {
    if (this.isUsingDealerView()) {
      this.showDealerViewError();
      return;
    }

    const modelOption = {
      modelName: 'product-filter-limited',
      config: {
        data: {
          title: '篩選條件已達上限',
          displayFooter: true,
          confirmButton: '確認',
        },
        width: '500px',
        height: '204px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
      },
    };
    this.dialogservice.openLazyDialog(
      modelOption.modelName,
      modelOption.config
    );
  }
  filterNoConditions() {
    const modelOption = {
      modelName: 'simple-dialog',
      config: {
        data: {
          title: '篩選條件無選擇',
          StyleMargin: '0px',
          text: `篩選條件無選擇，請重新確認。`,
          displayFooter: true,
          confirmButton: '確認'
        },
        width: '500px',
        height: '204px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: ''
      }
    };
    this.dialogservice.openLazyDialog(
      modelOption.modelName,
      modelOption.config
    );
  }

  getDealerView(): string | null {
    return URL_UTIL.getDealerView(this.activatedRoute.snapshot);
  }
  isUsingDealerView(): boolean {
    return !!this.getDealerView()?.length;
  }

  showDealerViewError(): void {
    POP_UP.showMessage(this.dialogservice, "您正在檢視經銷商中", "檢視經銷商不支援此功能，請先退出檢視經銷商模式後再操作。");
  }

  editFilter(data: Partial<FilterForm>[]) {
    if (this.isUsingDealerView()) {
      this.showDealerViewError();
      return;
    }

    const modelOption = {
      modelName: 'product-edit-filter',
      config: {
        data: {
          title: '編輯常用篩選',
          savedFilter$: this.savedFilter$,
          savedFilter: this.savedFilter,
          savedFilterCount: this.savedFilterCount,
        },
        width: '784px',
        height: '485px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: 'product-edit-filter',
      },
    };
    this.dialogservice.openLazyDialog(
      modelOption.modelName,
      modelOption.config
    );
  }

  resetForm({ submit = true }) {
    this.filterForm = clone(this.defaultFilterForm);
    this.brandNameList = [];
    this.subInventoryStatus = [];
    this.activityStatus = [];
    !this.isSearchPage &&
      !this.isWelfare &&
      this.setFormData(clone(this.defaultFilterData));
    this.selectedFilter = null;
    this.selectedMainFilter = null;
    this.selectedSubFilter = null;
    this.SubCategory = [];
    if(submit){
      // 福利品時，可以在左側篩選篩選主分類與次分類
      const newType1 = !this.isWelfare ? (this.filterForm.type1 ?? null) : null;
      const newType2 = !this.isWelfare ? (this.filterForm.type2 ?? null) : null;
      this.redirectPage(0, {
        type1: newType1,
        type2: newType2,
      },
      this.isWelfare)
    }
    submit && this.submitForm();
  }

  brandsChange($event: any, id: number, name?: string) {
    this.setFilter();
    this.filterForm.brandList = this.modifyListData({
      isChecked: $event.checked,
      data: id,
      list: this.filterForm.brandList as string[],
    });
    name &&
      (this.brandNameList = this.modifyListData({
        isChecked: $event.checked,
        data: name,
        list: this.brandNameList as string[],
      }));
  }

  brandsChangeDesktop =
    Rpipe(this.brandsChange, this.submitForm);

  submitForm() {
    this.filterForm.type1 = Number(this.filterForm.type1);
    this.filterForm.type2 = Number(this.filterForm.type2);
    this.filterForm.specialEventId = Number(this.specialEventId);

    this.paramsChange.emit(this.filterForm);
  }

  confirm() {
    this.submitForm();
    this.close.emit();
  }

  private setBrand(brands: Brand[]) {
    this.currentBrands = brands;
    this.brandsData = Object.values(brands);
    this.currentBrands = brands;
  }

  private setType(type1s: MainType[]) {
    this.mainCategory = type1s;
  }

  private setDefaultFilters(filterData?: any) {
    this.defaultFilters = filterData;
  }

  private setFilter() {
    const selected = Object.values(this.currentBrands).filter(
      (item: any) => item.selected
    );
    const newFilterData =
      selected.length === 0
        ? this.defaultFilters
        : uniqBy(prop('id'))(selected.flatMap((item: any) => item.filters));

    const filters =
      newFilterData &&
        newFilterData.filter((value: any) => Boolean(value)).length > 0
        ? newFilterData.map(
          over(lensPath(['spDatas']), Rmap(assoc('selected', false)))
        )
        : [];
    this.filterData = filters.map(over(lensPath(['spDatas']), values));
    this.filterForm.filters = filters;
  }

  private setSubInventory(subInventory: string[]) {
    this.subInventoryData = subInventory;
  }

  subInventoryChange($event: any, subInventory: string) {
    this.subInventoryStatus = this.modifyListData({
      isChecked: $event.checked,
      data: subInventory,
      list: this.subInventoryStatus,
    });

    const result = this.subInventoryStatus.join(',');
    this.filterForm.subInventory = result === '' ? null : result;
  }

  subInventoryChangeDesktop = Rpipe(this.subInventoryChange, this.submitForm);

  activityChange($event: any, activity: string) {
    this.activityStatus = this.modifyListData({
      isChecked: $event.checked,
      data: activity,
      list: this.activityStatus,
    });

    const result = this.activityStatus.join(',');
    this.filterForm.activity = result === '' ? null : result;
  }

  activityChangeDesktop = Rpipe(this.activityChange, this.submitForm);

  private modifyListData(params: ModifyList) {
    return ifElse(
      (_list) => params.isChecked,
      append(params.data),
      without([params.data])
    )(params.list);
  }

  getOrderedSpData(filter: ViewFilter): SpData[] {
    return filter.spDatas
      .sort((a, b) => a.index - b.index);
  }
}
