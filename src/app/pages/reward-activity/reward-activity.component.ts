import { AnimationBuilder } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { catchError, of, Subscription, switchMap, tap } from 'rxjs';
import { Pagination } from 'src/app/core/model';
import { ResponseCode } from 'src/app/enums/response.enum';
import {
  AwardActivityDetailList,
  AwardActivityList,
  BrandList,
  Menu,
  ResultRes,
  Type1List,
  Type2List,
} from 'src/app/models';
import { MemberService, ProductService } from 'src/app/services';
import { DialogService, LayoutService } from 'src/app/shared/services';
import { FilterService } from 'src/app/shared/services/filter.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-reward-activity',
  templateUrl: './reward-activity.component.html',
  styleUrls: ['./reward-activity.component.scss'],
})
export class RewardActivityComponent implements OnInit {
  filterForm!: FormGroup;
  isCreatedByCurrentUser!: boolean;
  dataSource!: any;
  pagination?: Pagination;
  filterSub = new Subscription();
  showIncentiveActivities: boolean = false;

  bonus = [
    {
      points: '300點',
      text: '送紅利點數',
      content:
        'ASUS/DELL/Lenovo/HP/指定家用主機•1-3月「假日」下單最高送900點數',
      date: '2023/1/3 - 2022/3/30',
      full: '滿30,000送300點',
      threshold: '已符合門檻 1/3',
      detailUrl: '',
    },
    {
      points: '1000點',
      text: '送紅利點數',
      content:
        'ASUS/DELL/Lenovo/HP/指定家用主機•1-3月「假日」下單最高送900點數',
      date: '2023/1/3 - 2022/3/30',
      full: '滿100,000送1,000點',
      threshold: '已符合門檻 1/3',
      detailUrl: '',
    },
    {
      points: '送電競滑鼠',
      text: '送贈品',
      content:
        'ASUS/DELL/Lenovo/HP/指定家用主機•1-3月「假日」下單最高送900點數',
      date: '2023/1/3 - 2022/3/30',
      full: '滿30,000送300點',
      threshold: '已符合門檻 1/3',
      detailUrl: '',
    },
    {
      points: '抽腳踏車',
      text: '抽獎活動',
      content:
        'ASUS/DELL/Lenovo/HP/指定家用主機•1-3月「假日」下單最高送900點數',
      date: '2023/1/3 - 2022/3/30',
      full: '滿30,000送300點',
      threshold: '已符合門檻 1/3',
      detailUrl: '',
    },
    {
      points: '送電競滑鼠',
      text: '送贈品',
      content:
        'ASUS/DELL/Lenovo/HP/指定家用主機•1-3月「假日」下單最高送900點數',
      date: '2023/1/3 - 2022/3/30',
      full: '滿30,000送300點',
      threshold: '已符合門檻 1/3',
      detailUrl: '',
    },
    {
      points: '300點',
      text: '送紅利點數',
      content:
        'ASUS/DELL/Lenovo/HP/指定家用主機•1-3月「假日」下單最高送900點數',
      date: '2023/1/3 - 2022/3/30',
      full: '滿30,000送300點',
      threshold: '已符合門檻 1/3',
      detailUrl: '',
    },
    {
      points: '抽腳踏車',
      text: '抽獎活動',
      content:
        'ASUS/DELL/Lenovo/HP/指定家用主機•1-3月「假日」下單最高送900點數',
      date: '2023/1/3 - 2022/3/30',
      full: '滿30,000送300點',
      threshold: '已符合門檻 1/3',
      detailUrl: '',
    },
    {
      points: '1000點',
      text: '送紅利點數',
      content:
        'ASUS/DELL/Lenovo/HP/指定家用主機•1-3月「假日」下單最高送900點數',
      date: '2023/1/3 - 2022/3/30',
      full: '滿100,000送1,000點',
      threshold: '已符合門檻 1/3',
      detailUrl: '',
    },
  ];

  data = [
    {
      status: '活動中',
      during: '2022/09/21~2022/09/29',
      name: '聯想伺服器12月iOrder下單主機抽iPhone 14和Apple Watch',
      number: 'P202212046',
      productLine: '3條產品線',
      line: ['無線網路卡／一般網卡', '高階雷射複合印表機', '搖桿、手遊控制器'],
      brandLine: '5個品牌',
      brand: ['FUJIFILM', 'VIEWSONIC', 'SAMSUNG', 'Lenovo(TW)', 'KINGSTON'],
      detail: ' ',
    },
    {
      status: '活動中',
      during: '2022/09/21~2022/10/02',
      name: 'Synology 11-12月iOrder下單組合活動滿額送紅利點數/郵政禮金',
      number: 'P202212046',
      productLine: '3條產品線',
      line: ['無線網路卡／一般網卡', '高階雷射複合印表機', '搖桿、手遊控制器'],
      brandLine: '5個品牌',
      brand: ['FUJIFILM', 'VIEWSONIC', 'SAMSUNG', 'Lenovo(TW)', 'KINGSTON'],
      detail: ' ',
    },
    {
      status: '活動中',
      during: '2022/09/21~2022/10/04',
      name: 'HP繪圖機 11+12月iOrder下單滿3台送7-11禮券$1000',
      number: 'P202212046',
      productLine: '3條產品線',
      line: ['無線網路卡／一般網卡', '高階雷射複合印表機', '搖桿、手遊控制器'],
      brandLine: '5個品牌',
      brand: ['FUJIFILM', 'VIEWSONIC', 'SAMSUNG', 'Lenovo(TW)', 'KINGSTON'],
      detail: ' ',
    },
    {
      status: '活動中',
      during: '2022/09/21~2022/10/12',
      name: '【華碩商用主機 ★ iOrder】10~12 月 滿額加送 2000 元！',
      number: 'P202212046',
      productLine: '3條產品線',
      line: ['無線網路卡／一般網卡', '高階雷射複合印表機', '搖桿、手遊控制器'],
      brandLine: '5個品牌',
      brand: ['FUJIFILM', 'VIEWSONIC', 'SAMSUNG', 'Lenovo(TW)', 'KINGSTON'],
      detail: ' ',
    },
    {
      status: '活動中',
      during: '2022/09/21~2022/10/16',
      name: '【華碩商用主機 ★ iOrder】10~12 月 滿額加送 2000 元！',
      number: 'P202212046',
      productLine: '3條產品線',
      line: ['無線網路卡／一般網卡', '高階雷射複合印表機', '搖桿、手遊控制器'],
      brandLine: '5個品牌',
      brand: ['FUJIFILM', 'VIEWSONIC', 'SAMSUNG', 'Lenovo(TW)', 'KINGSTON'],
      detail: ' ',
    },
    {
      status: '已結束',
      during: '2022/09/21~2022/10/18',
      name: 'DIY俱樂部‧單月進貨滿5萬5‧有機會抽中Dyson精品家電！',
      number: 'P202212046',
      productLine: '3條產品線',
      line: ['無線網路卡／一般網卡', '高階雷射複合印表機', '搖桿、手遊控制器'],
      brandLine: '5個品牌',
      brand: ['FUJIFILM', 'VIEWSONIC', 'SAMSUNG', 'Lenovo(TW)', 'KINGSTON'],
      detail: ' ',
    },

    {
      status: '活動中',
      during: '2022/09/21~2022/10/18',
      name: 'DIY俱樂部‧單月進貨滿5萬5‧有機會抽中Dyson精品家電！',
      number: 'P202212046',
      productLine: '3條產品線',
      line: ['無線網路卡／一般網卡', '高階雷射複合印表機', '搖桿、手遊控制器'],
      brandLine: '5個品牌',
      brand: ['FUJIFILM', 'VIEWSONIC', 'SAMSUNG', 'Lenovo(TW)', 'KINGSTON'],
      detail: ' ',
    },
    {
      status: '已結束',
      during: '2022/09/21~2022/10/18',
      name: 'DIY俱樂部‧單月進貨滿5萬5‧有機會抽中Dyson精品家電！',
      number: 'P202212046',
      productLine: '3條產品線',
      line: ['無線網路卡／一般網卡', '高階雷射複合印表機', '搖桿、手遊控制器'],
      brandLine: '5個品牌',
      brand: ['FUJIFILM', 'VIEWSONIC', 'SAMSUNG', 'Lenovo(TW)', 'KINGSTON'],
      detail: ' ',
    },
    {
      status: '活動中',
      during: '2022/09/21~2022/10/18',
      name: 'DIY俱樂部‧單月進貨滿5萬5‧有機會抽中Dyson精品家電！',
      number: 'P202212046',
      productLine: '3條產品線',
      line: ['無線網路卡／一般網卡', '高階雷射複合印表機', '搖桿、手遊控制器'],
      brandLine: '5個品牌',
      brand: ['FUJIFILM', 'VIEWSONIC', 'SAMSUNG', 'Lenovo(TW)', 'KINGSTON'],
      detail: ' ',
    },
    {
      status: '活動中',
      during: '2022/09/21~2022/10/18',
      name: 'DIY俱樂部‧單月進貨滿5萬5‧有機會抽中Dyson精品家電！',
      number: 'P202212046',
      productLine: '3條產品線',
      line: ['無線網路卡／一般網卡', '高階雷射複合印表機', '搖桿、手遊控制器'],
      brandLine: '5個品牌',
      brand: ['FUJIFILM', 'VIEWSONIC', 'SAMSUNG', 'Lenovo(TW)', 'KINGSTON'],
      detail: ' ',
    },
    {
      status: '已結束',
      during: '2022/09/21~2022/10/18',
      name: 'DIY俱樂部‧單月進貨滿5萬5‧有機會抽中Dyson精品家電！',
      number: 'P202212046',
      productLine: '3條產品線',
      line: ['無線網路卡／一般網卡', '高階雷射複合印表機', '搖桿、手遊控制器'],
      brandLine: '5個品牌',
      brand: ['FUJIFILM', 'VIEWSONIC', 'SAMSUNG', 'Lenovo(TW)', 'KINGSTON'],
      detail: ' ',
    },
    {
      status: '活動中',
      during: '2022/09/21~2022/10/18',
      name: 'DIY俱樂部‧單月進貨滿5萬5‧有機會抽中Dyson精品家電！',
      number: 'P202212046',
      productLine: '3條產品線',
      line: ['無線網路卡／一般網卡', '高階雷射複合印表機', '搖桿、手遊控制器'],
      brandLine: '5個品牌',
      brand: ['FUJIFILM', 'VIEWSONIC', 'SAMSUNG', 'Lenovo(TW)', 'KINGSTON'],
      detail: ' ',
    },
    {
      status: '活動中',
      during: '2022/09/21~2022/10/18',
      name: 'DIY俱樂部‧單月進貨滿5萬5‧有機會抽中Dyson精品家電！',
      number: 'P202212046',
      productLine: '3條產品線',
      line: ['無線網路卡／一般網卡', '高階雷射複合印表機', '搖桿、手遊控制器'],
      brandLine: '5個品牌',
      brand: ['FUJIFILM', 'VIEWSONIC', 'SAMSUNG', 'Lenovo(TW)', 'KINGSTON'],
      detail: ' ',
    },
  ];

  config: any;
  p: number = 1;
  isHeadLoading = false;
  isListLoading = false;
  isHomePage!: boolean;
  isCategoryLayout!: boolean;
  currentScreenSize: string = '';
  searchQuery: string = '';
  //option1: string= '所有狀態';
  //option2: string= '所有主分類';
  //option3: string= '所有次分類';
  option4: string = '所有品牌';
  option5: string = '10項';
  isProductLine: boolean[] = [];
  isBrand: boolean[] = [];
  isIcon1: boolean[] = [];
  isIcon2: boolean[] = [];

  option0: string[] = [];
  type0Options: string[] = [];

  option1: string[] = [];
  option2: string[] = [];
  option3: string[] = [];
  type1Options: Type1List[] = [];
  type2Options: Type2List[] = [];
  type3Options: BrandList[] = [];

  constructor(
    private builder: AnimationBuilder,

    private productService: ProductService,
    public dialogservice: DialogService,
    public layoutService: LayoutService,
    private fb: FormBuilder,
    private filterService: FilterService,
    private memberService: MemberService,
    private titleService: Title,
    private router: Router,
  ) {
    titleService.setTitle("獎勵活動");
  }

  ngOnInit(): void {
    this.bonus = [];
    this.data = [];
    this.isProductLine = new Array(this.data.length).fill(false);
    this.isBrand = new Array(this.data.length).fill(false);
    this.isIcon1 = new Array(this.data.length).fill(true);
    this.isIcon2 = new Array(this.data.length).fill(true);

    this.option0 = ['活動中']; // 預設為活動中

    this.loadContentManagement(); //表頭列
    this.loadContentManagement2(); //列表列

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

          this.isHeadLoading = true;
          return this.productService.getAwardActivityList(param)
          .pipe(
            tap(() => this.isHeadLoading = false),
            catchError(() => {
              // handle api error and continue operation
              return of();
            })
          );
        }),

        tap((res) => {
          if (res.responseCode === '0000' && Array.isArray(res.result)) {
            this.pagination = res.result.pagination;

            const awardActivityList = res.result as AwardActivityList[];

            if (Array.isArray(awardActivityList)) {
              this.bonus = awardActivityList.map((item) => ({
                points: item.reward,
                text: item.rewardType,
                content: item.rewardActivityName,
                date: item.rewardActivityDate,
                full:
                  item.achievementDescription == '' &&
                  item.progress.toString() == ''
                    ? '前往購買'
                    : item.achievementDescription,
                threshold: item.progress.toString(),
                detailUrl: item.detailUrl,
              }));
            }
          } else {
            this.data = [];
          }
        })
      )
      .subscribe();
  }
  loadContentManagement2() {
    this.filterSub = this.filterService.filterParams$
      .pipe(
        switchMap((param) => {
          if (this.option0.toString() !== '') {
            param.status = this.option0.toString();
          }

          if (this.option1.toString() !== '所有主分類') {
            const selectedType1Names: string[] = this.option1;

            const selectedType1 = this.type1Options.find((type1) =>
              selectedType1Names.includes(type1.name)
            );
            param.type1Id = selectedType1?.id;
          }

          if (this.option2.toString() !== '所有次分類') {
            const selectedType2Names: string[] = this.option2;

            const selectedType2 = this.type2Options.find((type2) =>
              selectedType2Names.includes(type2.name)
            );
            param.type2Id = selectedType2?.id;
          }

          if (this.option3.toString() !== '所有品牌') {
            param.bramd = this.option3.toString();
          }

          if (this.searchQuery.toString() !== '') {
            param.keyword = this.searchQuery.toString();
          }
        
          this.isListLoading = true;
          return this.productService.getAwardActivityDetail(param).pipe(
            tap(() => this.isListLoading = false),
            catchError(() => {
              // handle api error and continue operation
              this.isListLoading = false;
              return of();
            })
          );
        }),

        tap((res) => {
          if (res.responseCode === '0000' && Array.isArray(res.result.data)) {
            this.pagination = res.result.pagination;
            const awardActivityDetailList = res.result
              .data as AwardActivityDetailList[];
            if (Array.isArray(awardActivityDetailList)) {
              this.data = awardActivityDetailList.map((item) => ({
                status: item.status,
                during: item.rewardActivityDate,
                name: item.rewardActivityName,
                number: item.promoteId,
                productLine: '',
                line: [],
                brandLine: '',
                brand: [],
                detail: item.detailUrl,
              }));
            }
          } else {
            this.data = [];
          }
        })
      )
      .subscribe();
  }

  toggleMenuType(isCategoryLayout: boolean) {
    this.isCategoryLayout = isCategoryLayout;
  }

  productLine(index: number) {
    this.isProductLine[index] = !this.isProductLine[index];
    this.isIcon1[index] = !this.isProductLine[index];
  }
  brand(index: number) {
    this.isBrand[index] = !this.isBrand[index];
    this.isIcon2[index] = !this.isBrand[index];
  }

  resetToFirstPage() {
    this.onPageChange(1);
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
    this.resetToFirstPage();
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
    this.resetToFirstPage();
  }
  /** search change */
  onSearchChange(keyword: string): void {
    this.filterForm.patchValue({
      keyword: keyword,
    });
    this.resetToFirstPage();
  }
  resetFilters() {
    this.searchQuery = ''; // 清除搜尋字串
    this.option0 = ['活動中']; // Set as an array with the default value
    this.option1 = ['所有主分類'];
    this.option2 = ['所有次分類'];
    this.option3 = ['所有品牌'];
    this.option5 = '10項';
  }

  onPageChange(page: number): void {    
    this.p = page;
    this.filterService.pageChange({
      page: page,
      pageSize: this.pagination?.pageSize!,
    });
  }
  redirect(): void {
    this.router.navigate(['/Member']);
  }

  getAwardActivityUrl(promoteId : string): void{

      this.productService.awardActivityUrl(promoteId).subscribe((res) =>{
        if (res.responseCode === ResponseCode.Success) {

            const form = document.createElement('form');

            // 設置表單屬性
            form.method = 'POST';
            form.action = res.result.url;
            form.target = '_blank';

            const iterator = Object.entries(res.result.formData);

            for (const [key, value] of iterator) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = String(value);
                form.appendChild(input);
            }
            document.body.appendChild(form);

            form.submit();

            document.body.removeChild(form);
        }
      })

  }
  toggleIncentiveActivities(isVisible: boolean): void {
    this.showIncentiveActivities = isVisible;
  }
}
