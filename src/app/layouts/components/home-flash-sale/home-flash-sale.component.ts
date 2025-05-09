import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { catchError, of, Subscription, switchMap, tap } from 'rxjs';
import { Pagination } from 'src/app/core/model';
import { DialogService, LayoutService } from 'src/app/shared/services';
import { FilterService } from 'src/app/shared/services/filter.service';
import { ProductService } from 'src/app/services';
import { ResponseCode } from 'src/app/enums';
import { MemberService } from 'src/app/services';
import { PromoHomeItem } from 'src/app/models';


@Component({
  selector: 'app-home-flash-sale',
  templateUrl: './home-flash-sale.component.html',
  styleUrls: ['./home-flash-sale.component.scss']
})
export class HomeFlashSaleComponent implements OnInit {
  filterForm!: FormGroup;
  isCreatedByCurrentUser!: boolean;
  dataSource!: any;
  pagination?: Pagination;
  filterSub = new Subscription();
  

  flashSaleData = [
    {
      promoId: 1,
      imgSrc: 'https://fakeimg.pl/140x140/',
      mainTitle: 'ASUS家用筆記型電腦限時促銷優惠6折起',
      subTitle: '2022/12/01~2022/12/31 ASUS歲末年終感恩，指定機種享有超低優惠價！',
      countDownTime: 86400,
      promoString: '10000000.00000000'
    },
    {
      promoId: 2,
      imgSrc: 'https://fakeimg.pl/140x140/',
      mainTitle: '限時一天！ADATA 特選商品8折起，要買要快！',
      subTitle: '2022/12/01~2022/12/31 ASUS歲末年終感恩，指定機種享有超低優惠價！',
      countDownTime: 30,
      promoString: '10000000.00000000'
    },
    {
      promoId: 3,
      imgSrc: 'https://fakeimg.pl/140x140/',
      mainTitle: '聖誕狂歡限時特賣，GARMIN商品成為你交換禮物首選',
      subTitle: 'GARMIN潛水錶週年慶活動，低於市售5000元的價格買給你',
      countDownTime: 3600,
      promoString: '10000000.00000000'
    },
    {
      promoId: 4,
      imgSrc: 'https://fakeimg.pl/140x140/',
      mainTitle: '兔年如意，NB筆電為你撞鴻運！指定商品限時5折起',
      subTitle: '2023/1/13~2023/1/15 NB筆電包你發發發！',
      countDownTime: 86400,
      promoString: '10000000.00000000'
    }
  ]

  constructor(
    private productService: ProductService,
    public dialogservice: DialogService,
    public layoutService: LayoutService,
    private fb: FormBuilder,
    private filterService: FilterService,
    private memberService: MemberService) { }

  ngOnInit(): void {
    this.flashSaleData=[];
    this.loadContentManagement();
     
  }
  loadContentManagement() {
    this.filterSub = this.filterService.filterParams$
      .pipe(
        switchMap((param) => {
          return this.productService.getFlashSaleomeList(param).pipe(
            catchError(() => {
              // handle api error and continue operation
              return of();
            })
          );
        }),

        tap((res) => {
          if (res.responseCode === '0000' && Array.isArray(res.result)) {
            this.pagination = res.result.pagination;

            const promoHomeItemList = res.result as PromoHomeItem[];

        
            if (Array.isArray(promoHomeItemList)) {
              this.flashSaleData = promoHomeItemList.map((item) => ({
                promoId: item.promoId,
                imgSrc: item.prodImg,               
                mainTitle: item.promoName,
                subTitle: item.remark,
                countDownTime: Math.floor((new Date(item.endDate).getTime() - new Date().getTime()) / 1000),
                promoString: item.promoString
              }));
            }
          } else {
          }
        })
      )
      .subscribe();
  }

}
