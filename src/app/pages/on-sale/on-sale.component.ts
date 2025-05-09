// import { Component, OnInit } from '@angular/core';
import {
  animate,
  AnimationBuilder,
  AnimationPlayer,
  style,
} from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { is } from 'ramda';
import { catchError, of, Subscription, switchMap, take, tap } from 'rxjs';
import { Pagination } from 'src/app/core/model';
import { PromoCategory, ResponseCode } from 'src/app/enums';
import {
  BrandList,
  ClearanceSaleItem,
  ClearanceSaleList,
  Menu,
  ResultRes,
  Type1List,
  Type2List,
} from 'src/app/models';
import { MemberService, ProductService } from 'src/app/services';
import { DialogService, LayoutService } from 'src/app/shared/services';
import { FilterService } from 'src/app/shared/services/filter.service';
import { Swiper } from 'swiper';

@Component({
  selector: 'app-on-sale',
  templateUrl: './on-sale.component.html',
  styleUrls: ['./on-sale.component.scss'],
})
export class OnSaleComponent implements OnInit, AfterViewInit {

  subTitle: string = "每日破盤殺，現在就搶購！";

  filterForm!: FormGroup;
  isCreatedByCurrentUser!: boolean;
  dataSource!: any;
  pagination?: Pagination;
  filterSub = new Subscription();

  // slide
  productImg = [
    {
      promoId: 1,
      itemId: '1',
      name: 'LOGITECH 910-005609',
      introduce:
        'UX425EA/14FHD IPS/TPM/i5-1135G7/16G/512G/WIFI6/Win11Pro/3Y/841239',
      grayPrice: '890',
      redPrice: '650',
      imageUrl: '../../../assets/images/onSale1.jpg',
      promoMethods: []
    },
  ];

  productList = [
    {
      promoId: 1,
      promoCategory: PromoCategory.General,
      itemId: '1',
      picUrl: '../../../assets/images/onSaleProductList1.jpg',
      name: 'HP Deskjet 2722',
      introduce:
        'UX425EA/14FHD IPS/TPM/i5-1135G7/16G/512G/WIFI6/Win11Pro/3Y/841239',
      tag1: '【單品下殺 8折】不併行其他促銷',
      tag2: '',
      tag3: '',
      sales: '$1,620',
      price: '$1,500',
      number: '36',
      subinventory: [
        {
          subinventoryName: '林口倉',
          subinventoryCode: 'I01',
          qty: 0,
          iorderQty: 0,
          minCount: 1,
        },
      ],
      subInventoryCount: 0,
      promoMethods: []
    },
  ];

  selectedIndex = 0;
  countdown: number = 86400;
  radius: number = 150;
  minScale: number = 0.5;
  cellWidth: number | undefined;
  interval: any;
  isShow: boolean | undefined;
  topPosToStartShowing = 100;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  option1: string[] = [];
  option2: string[] = [];
  option3: string[] = [];
  type1Options: Type1List[] = [];
  type2Options: Type2List[] = [];
  type3Options: BrandList[] = [];
  isDialogVisible = false;
  isChecked1: boolean = false;
  isChecked2: boolean = false;
  slideShowAmt = 1;
  paginationShow = true;
  isLoading = 0;

  @ViewChildren('cell')
  items!: QueryList<ElementRef>;
  @ViewChildren('element') itemsView: QueryList<ElementRef> | undefined;
  @ViewChild('dialogElement') dialogElement: ElementRef | undefined;
  private player: AnimationPlayer | undefined;
  timer = 450;
  timing = '450ms';
  animates = [0, 2, 7];

  get cellCount() {
    return this.items.length;
  }

  movements = [
    { pos: 0, right: [1, 2], left: [8, 7] },
    { pos: 2, right: [3, 4, 5, 6, 7], left: [1, 0] },
    { pos: 5, right: [8, 0], left: [6, 5, 4, 3, 2] },
  ];

  constructor(
    private builder: AnimationBuilder,
    private http: HttpClient,
    private productService: ProductService,
    public dialogservice: DialogService,
    public layoutService: LayoutService,
    private fb: FormBuilder,
    private filterService: FilterService,
    private memberService: MemberService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productImg = [];
    this.productList = [];
    this.startCountdown();
    this.loadContentManagement();
    //取得篩選DDL資訊
    this.productService.getMenu().subscribe((response: ResultRes<Menu>) => {
      this.type1Options = response.result.type1List;
    });

    this.layoutService.layoutChanges$.subscribe((currentScreenSize) => {
      if (currentScreenSize === 'small') {
        this.slideShowAmt = 1;
        this.paginationShow = true;
      } else {
        this.slideShowAmt = 3;
        this.paginationShow = false;
      }
    })

    // 副標題需要顯示目前全系統的破盤特賣最便宜折數
    // 所以，預設顯示 fallback 字串，並嘗試跟後端查一次，如果有結果就取代顯示
    // 這個查詢壓力比較大，因此只在 ngOnInit 查一次
    this.productService.getClearanceSaleSubTitle()
    .pipe(
      tap(_ => this.isLoading++),
      take(1),
      catchError(() => {
        this.isLoading--;
        return of();
      }),
      tap((response) => {
        this.isLoading--;
        if (response.responseCode == ResponseCode.Success && response.result?.length)
          this.subTitle = response.result;
        }
      )
    )
    .subscribe();
  }
  loadContentManagement() {
    this.filterSub = this.filterService.filterParams$
      .pipe(
        tap(_ => this.isLoading++),
        switchMap((param) => {
          // const option1AsString = this.option1.toString();
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

          if (this.isChecked1 && this.isChecked2) {
            param.subInventoryNames = '林口倉,高雄倉';
          } else if (this.isChecked1) {
            param.subInventoryNames = '林口倉';
          } else if (this.isChecked2) {
            param.subInventoryNames = '高雄倉';
          }

          if (this.minPrice != undefined) {
            param.priceMin = this.minPrice;
          }
          if (this.maxPrice != undefined) {
            param.priceMax = this.maxPrice;
          }
          param.page = 1;
          param.pageSize = 60;
          return this.productService.getClearanceSaleList(param)
          .pipe(
            catchError(() => {
              // handle api error and continue operation
              this.isLoading--;
              return of();
            })
          );
        }),
        tap((res) => {
          this.isLoading--;
          if (res.responseCode === '0000' && res.result) {
            this.pagination = res.result.pagination;

            // 使用類型斷言將 res.result 斷言為你期望的類型
            const result = res.result as {
              clearanceSaleAdvertiseList?: ClearanceSaleList[];
              clearanceSaleList?: ClearanceSaleList[];
            };

            // 根據需要選擇要映射的數組
            const clearanceSaleAdvertiseList =
              result.clearanceSaleAdvertiseList;
            const clearanceSaleList = result.clearanceSaleList;

            if (Array.isArray(clearanceSaleAdvertiseList)) {
              // 將 flashSalesAdvertiseList 映射到 this.cards

              this.productImg = clearanceSaleAdvertiseList.map((item) => {
                const p = item as any;
                return {
                  promoId: p.promoInfos[0]?.id ?? 0,
                  itemId: p.itemId,
                  name: p.itemName,
                  introduce: p.description,
                  grayPrice: p.unitPrice.toString(),
                  redPrice: p.firstPromoPrice.toString(),
                  imageUrl: p.prodImg.toString(),
                  promoMethods: p.promoMethods,
                  subInventoryCount: this.subinventoryTotal(p.subinventory)
                };
              });
            }

            if (Array.isArray(clearanceSaleList)) {
              this.productList = clearanceSaleList.map((item) => {
                const p = item as any;
                const promoInfo = p.promoInfos || []; // 防呆處理
                return {
                  promoId: promoInfo[0]?.id ?? 0,
                  promoCategory: promoInfo[0]?.promoCategory ?? PromoCategory.General,
                  itemId: p.itemId,
                  picUrl: p.prodImg,
                  name: p.itemName,
                  introduce: p.description,
                  tag1:
                    promoInfo[0]?.remark
                      ? promoInfo[0].remark.toString()
                      : '',
                  tag2:
                    promoInfo[1]?.remark
                      ? promoInfo[1].remark.toString()
                      : '',
                  tag3:
                    promoInfo[2]?.remark
                      ? promoInfo[2].remark.toString()
                      : '',
                  sales: p.firstPromoPrice,
                  price: p.unitPrice,
                  number: p.itemId,
                  subinventory: p.subinventory,
                  subInventoryCount: this.subinventoryTotal(p.subinventory),
                  promoMethods: p.promoMethods
                };
              });
            } else {
            }
          } else {
          }
        })
      )
      .subscribe();
  }

  startCountdown() {
    this.interval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${formattedHours} : ${formattedMinutes} : ${formattedSeconds} `;
  }

  @HostListener('window:scroll')
  checkScroll() {
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }

  animateViews(direction: 'right' | 'left') {
    this.animates.forEach((x: number, index: number) => {
      const mov = this.movements.find((m) => m.pos === x) as
        | { pos: number; right: number[]; left: number[] }
        | undefined;
      const item = this.itemsView?.find((_x, i) => i === index);
      if (mov && item) {
        const animations = mov[direction].map((m) => {
          const angle = (m * 2 * Math.PI) / 9;
          const scale =
            (1 + this.minScale) / 2 +
            ((1 - this.minScale) / 2) * Math.cos(angle);
          const applystyle = {
            left: -this.cellWidth! / 2 + this.radius * Math.sin(angle) + 'px',
            transform: 'scale(' + scale + ')',
            position: 'absolute',
            'z-index': Math.floor(100 * scale),
          };
          return animate(
            this.timer / mov[direction].length + 'ms',
            style(applystyle)
          );
        });

        const myAnimation = this.builder.build(animations);
        this.player = myAnimation.create(item.nativeElement);
        this.player.onDone(
          () =>
            (this.animates[index] = mov[direction][mov[direction].length - 1])
        );
        this.player.play();
      }
    });
  }

  animateCarousel() {
    this.items.forEach((item: ElementRef, i: number) => {
      const myAnimation = this.builder.build([
        animate(this.timing, style(this.getStyle(i))),
      ]);
      this.player = myAnimation.create(item.nativeElement);
      this.player.play();
    });
  }

  getStyle(index: number): { left: string; transform: string } {
    if (!this.cellCount) {
      return {
        left: '0px',
        transform: 'scale(1)',
      };
    }

    const angle = ((index - this.selectedIndex) * Math.PI) / this.cellCount;
    const scale = 1;
    let left = 900 * Math.sin(angle) + 'px';
    return {
      left: left,
      transform: 'scale(' + scale + ')',
    };
  }

  prev() {
    this.selectedIndex =
      this.selectedIndex === 0
        ? this.productImg.length - 1
        : this.selectedIndex - 1;
    this.animateCarousel();
    this.animateViews('right');
  }

  next() {
    this.selectedIndex =
      this.selectedIndex === this.productImg.length - 1
        ? 0
        : this.selectedIndex + 1;
    this.animateCarousel();
    this.animateViews('left');
  }

  selectCard(index: number) {
    this.selectedIndex = index;
  }

  ngAfterViewInit(): void {
    new Swiper('.text-swiper .swiper', {
      slidesPerView: 5,
      spaceBetween: 0,
      navigation: {
        nextEl: '.text-swiper .swiper-button-next',
        prevEl: '.text-swiper .swiper-button-prev',
      },
      loop: true,
    });
  }

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  toggleDialog() {
    this.isDialogVisible = !this.isDialogVisible;
    if (this.isDialogVisible) {
      window.scrollTo(0, 0);
      document.body.classList.add('promotion-dialog-open');
    } else {
      document.body.classList.remove('promotion-dialog-open');
    }
  }
  resetForm({ submit = true }) {
    this.option1 = ['所有主分類'];
    this.option2 = ['所有次分類'];
    this.option3 = ['所有品牌'];

    this.isChecked1 = false;
    this.isChecked2 = false;

    this.minPrice = undefined;
    this.maxPrice = undefined;

    if (submit) {
    }
  }
  sumitFilterForm({ submit = true }) {
    this.loadContentManagement();

    if (submit) {
    }
  }
  onType1Change() {
    const selectedType1Names: string[] = this.option1;

    const selectedType1 = this.type1Options.find((type1) =>
      selectedType1Names.includes(type1.name)
    );

    if (selectedType1) {
      this.type2Options = selectedType1.type2List;

      this.type3Options = [];
    } else {
      this.type2Options = [];
      this.type3Options = [];
    }
  }
  onType2Change() {
    const selectedType2Names: string[] = this.option2;

    const selectedType1Name: string[] = this.option1;
    const selectedType1 = this.type1Options.find((type1) =>
      selectedType1Name.includes(type1.name)
    );

    if (selectedType1) {
      const selectedType2List = selectedType1.type2List.filter((type2) =>
        selectedType2Names.includes(type2.name)
      );

      if (selectedType2List.length > 0) {
        const brandList: BrandList[] = [];
        selectedType2List.forEach((type2) => {
          brandList.push(...type2.brandList);
        });
        this.type3Options = brandList;
      } else {
        this.type3Options = [];
      }
    }
  }
  navigateToProduct(itemId: string, promoId: number) {
    this.router.navigate(['/Product'], { queryParams: { itemId: itemId, source: 'breaking-good', sourceId: promoId } });
  }

  toLocaleString(num: string) {
    return Number(num).toLocaleString();
  }

  subinventoryTotal(item: any) {
    return item?.reduce(
      (accumulator: any, item: { qty: any }) => accumulator + item.qty,
      0
    );
  }

  getItemCountText(item: any): string {
    if (item.promoCategory == PromoCategory.GroupBuy)
      return "團購開放中";

    if (item.promoCategory == PromoCategory.PreOrder)
      return "預購登記中";

    const subinventoryTotal = Math.max(0, this.subinventoryTotal(item.subinventory) ?? 0);

    if (subinventoryTotal >= 10)
      return `還剩${subinventoryTotal}件`;

    if (0 < subinventoryTotal && subinventoryTotal < 10)
      return `只剩${subinventoryTotal}件`;

    return `搶售一空`;
  }

  showPromoMethods(itemId: number) {
    let name = '';
    switch (itemId) {
      case 1:
        name = '折價';
        break;
      case 2:
        name = '贈品';
        break;
      case 3:
        name = '加價購';
        break;
      case 4:
        name = '組合價';
        break;
      case 5:
        name = '量購價';
        break;
    }
    return name;
  }

  getPromoIcon(type: number): string {
    const base = '../../../assets/images/';
    let file = '';

    switch (type) {
      case 2:
        file = 'freebee.png';
        break;
      case 3:
        file = 'addBuy.png';
        break;
      case 4:
        file = 'combo.png';
        break;
      case 5:
        file = 'bulk.png';
        break;
      case 1:
      default:
        file = 'discount.png';
        break;
    }

    return base + file;
  }

  getPromoTextIcon(type: number): string {
    const base = '../../../assets/images/';
    let file = '';

    switch (type) {
      case 2:
        file = 'freebeeText.png';
        break;
      case 3:
        file = 'addBuyText.png';
        break;
      case 4:
        file = 'comboText.png';
        break;
      case 5:
        file = 'bulkText.png';
        break;
      case 1:
      default:
        file = 'discountText.png';
        break;
    }

    return base + file;
  }
}
