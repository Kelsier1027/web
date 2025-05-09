import {
  animate,
  AnimationBuilder,
  AnimationPlayer,
  style,
} from '@angular/animations';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { catchError, of, Subscription, switchMap, tap } from 'rxjs';
import { Pagination } from 'src/app/core/model';
import {
  BrandList,
  FlashSalesAdvertise,
  FlashSalesAdvertise2,
  Menu,
  ResultRes,
  Type1List,
  Type2List,
} from 'src/app/models';
import { MemberService, ProductService } from 'src/app/services';
import { DialogService, LayoutService } from 'src/app/shared/services';
import { FilterService } from 'src/app/shared/services/filter.service';
import { Swiper } from 'swiper';
import { Title } from '@angular/platform-browser';
import { POP_UP } from 'src/app/shared/utils/popUpUtilities';
import { Router } from '@angular/router';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss'],
})
export class PromotionComponent implements OnInit, AfterViewChecked {
  filterForm!: FormGroup;
  isCreatedByCurrentUser!: boolean;
  dataSource!: any;
  pagination?: Pagination;
  filterSub = new Subscription();
  activePromoId = '';
  isLoading: boolean = false;

  cards = [
    {
      countdown: 0,
      itemId: 0,
      name: 'BENQ GW2280',
      introduce: 'BENQ 21.5吋 VA GW2280 光智慧不閃屏 黑色/653657',
      grayPrice: '$ 8,890',
      redPrice: '6,750',
      imageUrl: '../../../assets/images/productList1.jpg',
      promoId: 1,
      promoMethods: [1,2]
    },
    {
      countdown: 0,
      itemId: 0,
      name: 'BENQ GW2280',
      introduce: 'BENQ 21.5吋 VA GW2280 光智慧不閃屏 黑色/653657',
      grayPrice: '$ 8,890',
      redPrice: '6,750 ',
      imageUrl: '../../../assets/images/productList2.jpg',
      promoId: 2,
      promoMethods: [1,2]
    },
    {
      countdown: 0,
      itemId: 0,
      name: 'BENQ GW2280',
      introduce: 'BENQ 21.5吋 VA GW2280 光智慧不閃屏 黑色/653657',
      grayPrice: '$ 8,890',
      redPrice: '6,750 ',
      imageUrl: '../../../assets/images/productList3.jpg',
      promoId: 3,
      promoMethods: [1,2]
    },
  ];
  productList = [
    {
      itemId: 0,
      picUrl: '../../../assets/images/productList1.jpg',
      name: 'ASUS PRO-UX425EA-0802 P113 5G7',
      introduce:
        'UX425EA/14FHD IPS/TPM/i5-1135G7/16G/512G/WIFI6/Win11Pro/3Y/841239',
      tag1: '【單品下殺 8折】不併行其他促銷',
      tag2: '【送贈品】Gaming 加送1TB超薄外接硬碟+網卡/集線器',
      tag3: '【假日下單紅利現抵 500 點】贈原廠 65W 口紅型變壓器不併行其他促銷',
      sales: '$36,667',
      price: '$35,990',
      promoId: 4,
    },
    {
      itemId: 0,
      picUrl: '../../../assets/images/productList2.jpg',
      name: 'Lenovo ZAAE0004TW',
      introduce:
        'UX425EA/14FHD IPS/TPM/i5-1135G7/16G/512G/WIFI6/Win11Pro/3Y/841239',
      tag1Type: 1,
      tag1: '【單品下殺 8折】不併行其他促銷',
      tag2Type: 2,
      tag2: '【送贈品】Gaming 加送1TB超薄外接硬碟+網卡/集線器',
      tag3Type: 3,
      tag3: '【假日下單紅利現抵 500 點】贈原廠 65W 口紅型變壓器不併行其他促銷',
      sales: '$36,667',
      price: '$35,990',
      promoId: 5,
    },
    {
      itemId: 0,
      picUrl: '../../../assets/images/productList3.jpg',
      name: 'DELL P2319H-4Y',
      introduce:
        'UX425EA/14FHD IPS/TPM/i5-1135G7/16G/512G/WIFI6/Win11Pro/3Y/841239',
      tag1Type: 1,
      tag1: '【單品下殺 8折】不併行其他促銷',
      tag2Type: 2,
      tag2: '【送贈品】Gaming 加送1TB超薄外接硬碟+網卡/集線器',
      tag3Type: 3,
      tag3: '【假日下單紅利現抵 500 點】贈原廠 65W 口紅型變壓器不併行其他促銷',
      sales: '$36,667',
      price: '$35,990',
      promoId: 6,
    },
    {
      itemId: 0,
      picUrl: '../../../assets/images/productList4.jpg',
      name: 'HP OJ200',
      introduce:
        'UX425EA/14FHD IPS/TPM/i5-1135G7/16G/512G/WIFI6/Win11Pro/3Y/841239',
      tag1Type: 1,
      tag1: '【單品下殺 8折】不併行其他促銷',
      tag2Type: 2,
      tag2: '【送贈品】Gaming 加送1TB超薄外接硬碟+網卡/集線器',
      tag3Type: 3,
      tag3: '【假日下單紅利現抵 500 點】贈原廠 65W 口紅型變壓器不併行其他促銷',
      sales: '$36,667',
      price: '$35,990',
      promoId: 7,
    },
    {
      itemId: 0,
      picUrl: '../../../assets/images/productList5.jpg',
      name: 'BENQ GW2280',
      introduce: 'BENQ 21.5吋 VA GW2280 光智慧不閃屏 黑色/653657',
      tag1Type: 1,
      tag1: '【單品下殺 8折】不併行其他促銷',
      tag2Type: 2,
      tag2: '【送贈品】Gaming 加送1TB超薄外接硬碟+網卡/集線器',
      tag3Type: 3,
      tag3: '【假日下單紅利現抵 500 點】贈原廠 65W 口紅型變壓器不併行其他促銷',
      sales: '$36,667',
      price: '$35,990',
      promoId: 8,
    },
    {
      itemId: 0,
      picUrl: '../../../assets/images/productList6.jpg',
      name: 'ASUS PRO-UX425EA-0802 P113 5G7',
      introduce:
        'UX425EA/14FHD IPS/TPM/i5-1135G7/16G/512G/WIFI6/Win11Pro/3Y/841239',
      tag1Type: 1,
      tag1: '【單品下殺 8折】不併行其他促銷',
      tag2Type: 2,
      tag2: '【送贈品】Gaming 加送1TB超薄外接硬碟+網卡/集線器',
      tag3Type: 3,
      tag3: '【假日下單紅利現抵 500 點】贈原廠 65W 口紅型變壓器不併行其他促銷',
      sales: '$36,667',
      price: '$35,990',
      promoId: 9,
    },
  ];
  textItems = [
    {
      countdown: 0,
      tag: '今日',
      time: '10:00',
      promoEndDate: '2024-09-29T23:55:00',
      productList: this.productList,
      promoId: '',
    },
    {
      countdown: 0,
      tag: '今日',
      time: '16:00',
      promoEndDate: '2024-09-29T23:55:00',
      productList: this.productList,
      promoId: '',
    },
    {
      countdown: 0,
      tag: '12/08',
      time: '08:00',
      promoEndDate: '2024-09-29T23:55:00',
      productList: this.productList,
      promoId: '',
    },
    {
      countdown: 0,
      tag: '12/08',
      time: '12:00',
      promoEndDate: '2024-09-29T23:55:00',
      productList: this.productList,
      promoId: '',
    },
    {
      countdown: 0,
      tag: '12/08',
      time: '16:00',
      promoEndDate: '2024-09-29T23:55:00',
      productList: this.productList,
      promoId: '',
    },
  ];

  selectedIndex = 0;
  topPosToStartShowing = 100;
  countdown: number = 86400;
  radius: number = 150;
  minScale: number = 0.5;
  interval: any;
  isShow: boolean | undefined;
  cellWidth: number | undefined;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  //minPrice: number | null = null;
  //maxPrice: number | null = null;
  filteroption1: string = '';
  filteroption2: string = '';
  filteroption3: string = '';

  option1: string[] = [];
  option2: string[] = [];
  option3: string[] = [];
  type1Options: Type1List[] = [];
  type2Options: Type2List[] = [];
  type3Options: BrandList[] = [];
  isDialogVisible = false;
  isChecked1: boolean = false;
  isChecked2: boolean = false;

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
    { pos: 7, right: [8, 0], left: [6, 5, 4, 3, 2] },
  ];

  cards2: FlashSalesAdvertise2[] = [];
  //cards2: FlashSalesAdvertiseList2[] = []; // 修改為 FlashSalesAdvertise 類型的數組
  isAnimationRunOnce = false;

  constructor(
    private builder: AnimationBuilder,
    private productService: ProductService,
    public dialogservice: DialogService,
    public layoutService: LayoutService,
    private fb: FormBuilder,
    private filterService: FilterService,
    private memberService: MemberService,
    private titleService: Title,
    private router: Router
  ) {
    titleService.setTitle("限時促銷");
  }

  ngOnInit(): void {
    this.cards = [];
    this.textItems = [];
    this.productList = [];
    this.filterForm = this.fb.group({
      page: [0],
      promoId: [''],
      pageSize: [''],
      type1Id: [''],
      type2Id: [''],
      brandId: [''],
      subInventoryNames: [''],
      priceMin: [''],
      priceMax: [''],
    });
    this.startCountdown();
    this.loadContentManagement();
    //取得篩選DDL資訊
    this.productService.getMenu().subscribe((response: ResultRes<Menu>) => {
      this.type1Options = response.result.type1List;
    });
  }
  loadContentManagement() {
    this.filterSub = this.filterService.filterParams$
      .pipe(
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

          this.isLoading = true;
          return this.productService.getPromoList(param).pipe(
            tap(() => {
              this.isLoading = false;
            }),
            catchError(() => {
              // handle api error and continue operation
              this.isLoading = false;
              return of();
            })
          );
        }),
        tap((res) => {
          if (res.responseCode === '0000' && res.result) {
            this.pagination = res.result.pagination;

            // 使用類型斷言將 res.result 斷言為你期望的類型
            const result = res.result as {
              flashSalesAdvertiseList?: FlashSalesAdvertise[];
              flashSalesList?: FlashSalesAdvertise[];
              flashSalesMenu?: FlashSalesAdvertise[];
            };

            // 根據需要選擇要映射的數組
            const flashSalesAdvertiseList = result.flashSalesAdvertiseList;
            const flashSalesMenu = result.flashSalesMenu;
            const flashSalesList = result.flashSalesList;

            if (Array.isArray(flashSalesAdvertiseList)) {
              // 將 flashSalesAdvertiseList 映射到 this.cards
              this.cards = flashSalesAdvertiseList.map((item: any) => {
                return {
                  promoId: (item.promoInfos ?? [])[0]?.id ?? 0,
                  itemId: item.itemId,
                  name: item.itemName,
                  introduce: item.description,
                  grayPrice: item.unitPrice.toString(),
                  redPrice: item.firstPromoPrice.toString(),
                  imageUrl: item.prodImg.toString(),
                  countdown: item.countdown.toString(),
                  promoMethods: item.promoMethods
                };
              });
              //this.countdown=this.cards[0].countdown;
            }
            if (Array.isArray(flashSalesMenu) && flashSalesMenu[0]) {
              this.textItems = flashSalesMenu.map((item: any) => {
                return {
                  promoId: item.promoId,
                  tag: item.date,
                  time: item.endDate,
                  countdown: item.countdown.toString(),
                  promoEndDate: item.promoEndDate,
                  productList: item.flashSalesList,
                };
              });
              this.activePromoId = this.textItems[0].promoId;

              const secondsUntilPromoEnd = this.getSecondsUntilPromoEnd(
                this.textItems[0].promoEndDate.toString()
              );

              if (secondsUntilPromoEnd !== null) {
                this.countdown = secondsUntilPromoEnd;
              }
              this.productList = this.textItems[0].productList.map(
                (item: any) => this.transformItem(item)
              );
            }

            if (!flashSalesMenu?.length || !flashSalesAdvertiseList?.length)
            {
              POP_UP.showMessage(this.dialogservice, '限時促銷已結束', ['對不起，現在所有限時促銷都已搶售一空。', '', '已為您跳轉回首頁，', '歡迎您繼續參觀選購，或聯絡線上客服瞭解更多資訊。']);
              this.router.navigateByUrl('/');
            }
          } else {
          }
        })
      )
      .subscribe();
  }

  transformItem(item: any) {
    const promoInfo = item.promoInfos || [];
    return {
      promoId: promoInfo[0]?.id ?? 0,
      itemId: item.itemId,
      picUrl: item.prodImg,
      name: item.itemName,
      introduce: item.description,
      tag1Type: promoInfo[0]?.promoMethod,
      tag1: this.getTag(promoInfo[0]),
      tag2Type: promoInfo[1]?.promoMethod,
      tag2: this.getTag(promoInfo[1]),
      tag3Type: promoInfo[2]?.promoMethod,
      tag3: this.getTag(promoInfo[2]),
      sales: item.unitPrice,
      price: item.firstPromoPrice,
    };
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

  // Modify by Tako on 2025/03/12 for No.20250057
  formatTime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedDays = days < 10 ? `0${days}` : days;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${formattedDays}天  ${formattedHours} : ${formattedMinutes} : ${formattedSeconds} `;
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

  ngAfterViewInit(): void {
    new Swiper('.text-swiper .swiper', {
      spaceBetween: 0,
      navigation: {
        nextEl: '.text-swiper .swiper-button-next',
        prevEl: '.text-swiper .swiper-button-prev',
      },
      loop: true,
      breakpoints: {
        0: {
          slidesPerView: 2.5,
        },

        1200: {
          slidesPerView: 5,
        },
      },
    });
  }

  ngAfterViewChecked() {
    if (!this.isAnimationRunOnce && this.items?.length > 0) {
      this.isAnimationRunOnce = true;
      this.animateCarousel();
    }
  }

  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
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

  getStyle(index: number): {
    left: string;
    transform: string;
    'z-index': number;
  } {
    if (!this.cellCount) {
      return {
        left: '0px',
        transform: 'scale(1)',
        'z-index': 0,
      };
    }

    const angle = ((index - this.selectedIndex) * 2 * Math.PI) / this.cellCount;
    const scale = (90 + 10 * Math.cos(angle)) / 100;

    return {
      left: 60 + 120 * Math.sin(angle) + 'px',
      transform: 'scale(' + scale + ')',
      'z-index': Math.floor(100 * scale),
    };
  }

  prev() {
    this.selectedIndex =
      this.selectedIndex === 0 ? this.cards.length - 1 : this.selectedIndex - 1;
    this.animateCarousel();
    // this.animateViews('right');
  }

  next() {
    this.selectedIndex = this.selectedIndex === this.cards.length - 1 ? 0 : this.selectedIndex + 1;
    this.animateCarousel();
    // this.animateViews('left');
  }

  selectCard(index: number) {
    this.selectedIndex = index;
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
  submitFilterForm({ submit = true }) {
    this.loadContentManagement();
    this.toggleDialog();
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
  setCountdown(value: any): void {
    this.activePromoId = value.promoId;

    const secondsUntilPromoEnd = this.getSecondsUntilPromoEnd(
      value.promoEndDate.toString()
    );

    if (secondsUntilPromoEnd !== null) {
      this.countdown = secondsUntilPromoEnd;
    }
    
    this.productList = value.productList.map((item: any) => this.transformItem(item));
  }
  getSecondsUntilPromoEnd(promoEndDate: string): number | null {
    const now = new Date();
    const end = new Date(promoEndDate);

    if (isNaN(now.getTime()) || isNaN(end.getTime())) {
      return null;
    }

    const seconds = Math.floor((end.getTime() - now.getTime()) / 1000);
    return seconds;
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

  getTag(promoInfo: any): string {
    if (promoInfo?.remark?.length)
      return promoInfo.remark;

    if (promoInfo?.name?.length)
      return promoInfo.name;

    return '';
  }
}
