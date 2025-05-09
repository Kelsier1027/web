/** --------------------------------------------------------------------------------
 *-- Description： 首頁商品
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { DialogService } from './../../../shared/services/dialog.service';
import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import {  debounceTime, delay, mergeMap, of } from 'rxjs';
import { Type1List, Type2List } from 'src/app/models/product.model';
import { MobileMenuService } from 'src/app/services/mobile-menu.service';
import { ProductService } from 'src/app/services/product.service';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { ToggleTypeListService } from 'src/app/services/ToggleTypeList.service';
@Component({
  selector: 'app-home-header-product',
  templateUrl: './home-header-product.component.html',
  styleUrls: ['./home-header-product.component.scss'],
})
export class HomeHeaderProductComponent implements AfterViewInit {
  @Input()
  currentScreenSize!: string
  @Input()
  isCategoryLayout!: boolean
  @Input()
  isProductPage!:boolean
  @Input()
  click1!: EventEmitter<boolean>;
  @Input()
  fixedProduct: boolean=false;
  @Output()
  layoutChange = new EventEmitter()
  menu!: Type1List[];
  currentTypeId!: number;
  activeIndex?: number;
  isShowTypeList = false;
  clickPanel: number = 0;
  canShowMenu: boolean = false;
  _mouseEnterStream: EventEmitter<any> = new EventEmitter();

  constructor(
    public productService: ProductService,
    public dialogService: DialogService,
    public layoutService: LayoutService,
    private mobileMenuService: MobileMenuService,
    private router: Router,
    private toggleTypeListService: ToggleTypeListService,
  ) {
  }
  ngOnInit(): void {
    this._mouseEnterStream.pipe(mergeMap((e) => { return of(e) }), debounceTime(400))
      .subscribe((e) => {
        if (this.canShowMenu) {
          this.toggleTypeList(e.type, e.index, e.list);
        }
      });

    this.productService.getMenu().subscribe((response) => {
      this.menu = response.result.type1List;
      // if (localStorage.getItem('orgId') == '83') {
        this.menu.push({
          id: 0,
          name: '福利品',
          type2List: [],
          isWelfare: true,
        })
      // }
      this.mobileMenuService.setMenuData(response.result.type1List);
    });
    this.toggleTypeListService.state$.subscribe((newState) => {
      this.isShowTypeList = newState;
    });
    if(this.currentScreenSize !== 'small'){
      this.isCategoryLayout = false;
    }
  }
  ngAfterViewInit(): void { }

  public click(
    currentScreenSize: string,
    index: number,
    type1List?: Type1List
  ): void {
    if (this.isWelfarem(index)) {
      this.router.navigate(['ProductList'], { queryParams: { isWelfarem: true } });
      return;
    }

    const isMobile = currentScreenSize === 'small';
    // if (!isMobile) return;
    const shouldHide = this.isShowTypeList && this.activeIndex === index;

    shouldHide ? (this.isShowTypeList = false) : (this.isShowTypeList = true);
    this.activeIndex = index;

    this.setInfo(type1List ? type1List.type2List : []);
  }

  /** 是否選擇福利品 */
  isWelfarem = (index: number) => {
    return index === this.menu.length - 1;
  }

  /** handle Panel */
  handlePanel(idx: number): void {
    this.clickPanel = idx;
  }

  handleCloseMenu(event: MouseEvent) {
    event.stopPropagation();
    this.toggleTypeList(false);
  }

  redirect() {
    this.router.navigate(['ProductList']);
  }

  handleDelayToggle(isShow: boolean, index: number, type1List?: Type1List) {
    this.canShowMenu = true;
    this._mouseEnterStream.emit({ type: isShow, index: index, list: type1List });
  }

  handleMouseLeave() {
    this.canShowMenu = false;
  }

  toggleTypeList(isShow: boolean, index?: number, type1List?: Type1List): void {
    // 如果 activeIndex = index, 表示點擊的是上一次看的選單
    // 所以, 這時如果已經打開, 就關起來
    // 否則就打開
    if (this.activeIndex == index)
    {
      this.isShowTypeList = !this.isShowTypeList;
    } else {
      this.isShowTypeList = isShow;
      this.activeIndex = index;
    }
    if (type1List) {
      this.currentTypeId = type1List.id
    } else {
      this.currentTypeId = 0;
    }
    this.setInfo(type1List ? type1List.type2List : []);
  }

  setInfo(type2List: Type2List[]) {
    const container = this.productService.typeList;
    container.next(type2List);
  }

  change() {
    this.layoutChange.emit(true);
  }

  handleMouseOver(name: any): void {
    // 在滑鼠移過去時，將 name 賦值給 adString 並存儲在 localStorage 中
    //this.adString = name;
    if(name.adNavigation==null){
    localStorage.setItem('adString', '');
    localStorage.setItem('adStringUrl', '');
    }else
    {
      localStorage.setItem('adString', name.adNavigation.text);
      localStorage.setItem('adStringUrl', name.adNavigation.adUrl);
    }
  }
}
