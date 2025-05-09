/** --------------------------------------------------------------------------------
 *-- Description： home
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Observable,
  Subscription,
  catchError,
  filter,
  map,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { Pagination } from 'src/app/core/model';
import { ResponseCode } from 'src/app/enums';
import {
  ClearanceSaleItem,
  CompareProduct2,
  CustomHomePageBannersList,
  FilterForm,
  MemberInfo,
  ResultRes,
} from 'src/app/models';
import { MemberService, ProductService } from 'src/app/services';
import { ProductComparisonComponent } from 'src/app/shared/components/product-comparison/product-comparison.component';
import {
  DialogService,
  LayoutService,
  NotifierService,
} from 'src/app/shared/services';
import { FilterService } from 'src/app/shared/services/filter.service';
import { AuthService } from './../../auth/services/auth.service';
import { EnvConfig } from 'src/app/app.module';
import { Title } from '@angular/platform-browser';
import { and } from 'ramda';
import { POP_UP } from 'src/app/shared/utils/popUpUtilities';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('salesBoxRef') salesBoxRef?: ElementRef;
  @ViewChild('purchaseRef') purchaseRef?: ElementRef;
  @ViewChild('flashRef') flashRef?: ElementRef;
  @ViewChild('groupRef') groupRef?: ElementRef;
  @ViewChild('specialRef') specialRef?: ElementRef;

  @ViewChild(ProductComparisonComponent) comparisonComp?: ProductComparisonComponent;
  customerName = '';
  companyName = '';
  email = '';
  customerClass = 0;
  usableBonusPoints = 0;
  availableAwards = 0;
  tracingItems = 0;
  cartCount = 0;
  restockNotifyCount = 0;
  displayBonus = false;
  strongDiscountisCompare = true;
  apiResponse!: Observable<MemberInfo>;
  maxImageWidth: string = '100%';
  maxImageHeight: string = '100%';
  showGroupBuy = true;
  downOption = [
    {
      imageUrlForMobile: '',
      imageUrlForPc: '',
      name: '',
      relatedUrl: '',
      type: '',
    },
  ];

  middle1Image = '';
  middle2Image = '';

  filterForm!: FormGroup;
  isCreatedByCurrentUser!: boolean;
  dataSource!: any;
  pagination?: Pagination;
  filterSub = new Subscription();
  permission$ = this.auth.permission$;
  periodSaleList1 = false;
  periodSaleList2 = false;
  periodSaleList3 = false;

  salesDataChrisbtn = true; // 特殊活動1的詳細按鈕是否顯示，本來是照筆數確認，改固定顯示，純為相容用
  salesDataChris2btn = true; // 特殊活動2的詳細按鈕是否顯示，本來是照筆數確認，改固定顯示，純為相容用
  salesDataChris3btn = true; // 特殊活動3的詳細按鈕是否顯示，本來是照筆數確認，改固定顯示，純為相容用

  periodSaleListName1 = '';
  periodSaleListName2 = '';
  periodSaleListName3 = '';

  periodSaleListId1 = 0;
  periodSaleListId2 = 0;
  periodSaleListId3 = 0;

  showIncentiveActivities: boolean = false;

  middleOptionalPurchaseBanners = [
    {
      imageUrlForMobile: '',
      imageUrlForPc: '',
      name: '',
      relatedUrl: '',
      type: 1,
    },
  ];
  middlePeriodBanners = [
    {
      imageUrlForMobile: '',
      imageUrlForPc: '',
      name: '',
      relatedUrl: '',
      type: 1,
    },
  ];

  downBanners = [
    {
      imageUrlForMobile: '',
      imageUrlForPc: '',
      name: '',
      relatedUrl: '',
      type: 1,
    },
  ];

  salesData = [
    {
      promoId: 1,
      itemId: 12,
      imgSrc: 'https://fakeimg.pl/140x140/',
      tags: [1],
      mainTitle: 'ASUS PRIME-AP201-BLACK-EDITION',
      subTitle: 'AP201 ASUS PRIME CASE MESH/878224',
      price: '$24,0487',
      oldPrice: '$33,048',
      hot: true,
      favorite: true,
    },
  ];
  salesDataChris = [
    {
      id: 2,
      itemId: 12,
      imgSrc: 'https://fakeimg.pl/140x140/',
      tags: [1],
      mainTitle: 'ASUS PRIME-AP201-BLACK-EDITION',
      subTitle: 'AP201 ASUS PRIME CASE MESH/878224',
      price: '$24,0488',
      oldPrice: '$33,048',
      hot: true,
      favorite: true,
    },
  ];
  salesDataChris2 = [
    {
      id: 3,
      itemId: 12,
      imgSrc: 'https://fakeimg.pl/140x140/',
      tags: [1],
      mainTitle: 'ASUS PRIME-AP201-BLACK-EDITION',
      subTitle: 'AP201 ASUS PRIME CASE MESH/878224',
      price: '$24,0489',
      oldPrice: '$33,048',
      hot: true,
      favorite: true,
    },
  ];
  salesDataChris3 = [
    {
      id: 4,
      itemId: 12,
      imgSrc: 'https://fakeimg.pl/140x140/',
      tags: [1],
      mainTitle: 'ASUS PRIME-AP201-BLACK-EDITION',
      subTitle: 'AP201 ASUS PRIME CASE MESH/878224',
      price: '$24,0480',
      oldPrice: '$33,048',
      hot: true,
      favorite: true,
    },
  ];
  // 判斷是否有特定期間促銷活動
  periodPromotion: boolean = true;

  thisOrgId: any;
  compareItems: CompareProduct2[] = [];

  constructor(
    private auth: AuthService,
    public dialogservice: DialogService,
    private productService: ProductService,
    public layoutService: LayoutService,
    private filterService: FilterService,
    private memberService: MemberService,
    private router: Router,
    private notifierService: NotifierService,
    private cdRef: ChangeDetectorRef,
    private envConfig: EnvConfig,
    private title:Title,
  ) {
  }

  ngOnInit(): void {
    this.routerPath();
    this.GetDefaultInformations();
    this.middleOptionalPurchaseBanners = [];
    this.middlePeriodBanners = [];

    this.salesData = [];
    this.loadContentManagement();
    this.salesDataChris = [];
    this.salesDataChris2 = [];
    this.salesDataChris3 = [];
    this.loadContentManagement2();
    this.loadContentManagement3();

    this.thisOrgId = localStorage.getItem('orgId');
    if(this.thisOrgId == '151'){
      this.title.setTitle('精豪電腦');
    }
    else{
    this.title.setTitle('精技電腦');
    }


  }

  ngAfterViewInit() {
    this.compareItems = this.comparisonComp?.items || [];
    this.cdRef.detectChanges();
  }

  routerPath() {
    if (this.auth.relatedUrl) {
      const currentDomain = window.location.origin;
      const relatedUrlDomain = new URL(this.auth.relatedUrl).origin;
      if (currentDomain !== relatedUrlDomain) {
        this.router.navigateByUrl(this.auth.relatedUrl);
      } else {
        window.location.href = this.auth.relatedUrl;
      }
      return;
    }
  }
  HomepopupValidation(){
    // 每次彈窗會記錄一個 userPopupDate, 包含這次彈窗的日期還有帳號
    // 將之用來比對目前登入中的帳號資訊
    // 如果是相同帳號，就引用同樣的日期去彈窗
    // 用於對應共用電腦的狀況
    const lastQueried = localStorage.getItem('userPopupDate');

    // 避免 lastQueried 不是預期的 json 格式
    // 出錯時 fallback 為空字串

    let Data: any = '';

    try {
      Data = lastQueried ? JSON.parse(lastQueried) : '';
    } catch {
      Data = '';
    }

    const companyNo = localStorage.getItem('companyNo');
    const email = localStorage.getItem('email');
    const orgId = localStorage.getItem('orgId');

    const hasLastDate = companyNo == Data.companyNo 
      && email == Data.account 
      && orgId == Data.orgId
      && Data.PopupDate

    console.log('hasLastDate: ', hasLastDate);

    const param = hasLastDate
    ? { lastQueried: Data.PopupDate }
    : {}
    
    this.memberService.gethomepagePopup(param)
    .pipe(
      filter((res) => res.responseCode === ResponseCode.Success),
      map(
        (res)=> {
          return res.result
        }
        ),
      tap((res) => {
        if (res.hasPopup) {
          // 彈出視窗
          const modelOption = {
            modelName: 'home-popup',
            config: {
              data: {
                title: '',
                src: res.popup?.imageUrlForPc,
                srcForMobile: res.popup?.imageUrlForMobile,
                url: res.popup?.url,
                adId: res.popup?.adId,
                isExternal: res.popup?.isExternal,
              },
              hasBackdrop: true,
              autoFocus: false,
              enterAnimationDuration: '300ms',
              exitAnimationDuration: '300ms',
              panelClass: '',
            },
          };

          // Open the dialog
          this.dialogservice
            .openLazyDialog(modelOption.modelName, modelOption.config)
            .then((ref) => {
              ref.afterClosed().subscribe();

              // Set the flag in localStorage to indicate that the user has performed the action today
              const userPopupDate = {
                "companyNo": companyNo,
                "account": email,
                "orgId": orgId,
                "PopupDate":new Date().toISOString().split('T')[0]
              }
              localStorage.setItem(
                'userPopupDate',
                JSON.stringify(userPopupDate)
              );
            });
        }
      })
    ).subscribe();
  }
  GetDefaultInformations() {
    this.apiResponse = this.memberService.getMemberInfo().pipe(
      filter((res) => res.responseCode === ResponseCode.Success),
      map((res) => {
        this.customerName = res.result.customerName || '';
        this.companyName = res.result.companyName || '';
        this.email = res.result.email || '';
        this.customerClass = res.result.customerClass || 0;
        this.usableBonusPoints = res.result.usableBonusPoints || 0;
        this.availableAwards = res.result.availableAwards || 0;
        this.tracingItems = res.result.tracingItems || 0;
        this.cartCount = res.result.cartCount || 0;
        this.restockNotifyCount = res.result.restockNotifyCount || 0;
        this.displayBonus = res.result.displayBonus || false;

        localStorage.setItem('customerName', this.customerName);
        localStorage.setItem('companyName', this.companyName);
        localStorage.setItem('email', this.email);
        localStorage.setItem('customerClass', this.customerClass.toString());
        localStorage.setItem(
          'usableBonusPoints',
          this.usableBonusPoints.toString()
        );
        localStorage.setItem(
          'availableAwards',
          this.availableAwards.toString()
        );
        localStorage.setItem('tracingItems', this.tracingItems.toString());
        localStorage.setItem('cartCount', this.cartCount.toString());
        localStorage.setItem(
          'restockNotifyCount',
          this.restockNotifyCount.toString()
        );
        localStorage.setItem('displayBonus', JSON.stringify(this.displayBonus));
        return res.result;
      })
    );

    // 設定完 localStorage 之後才觸發首頁彈窗，避免異步競合
    this.apiResponse.subscribe(_ => this.HomepopupValidation());
  }
  loadContentManagement() {
    this.filterSub = this.filterService.filterParams$
      .pipe(
        switchMap((param) => {
          return this.productService.getClearanceSaleHome(param)
          .pipe(
            catchError(() => {
              // handle api error and continue operation
              return of();
            })
          );
        }),

        tap((res) => {
          if (res.responseCode === '0000' && Array.isArray(res.result)) {
            this.pagination = res.result.pagination;
            const clearanceSaleList = res.result as ClearanceSaleItem[];
            this.salesData = (clearanceSaleList || []).map((item) => {
                const promoInfo = item.promoInfos[0];

                const subTitle =
                  promoInfo
                    ? promoInfo.name
                    : '';
                const promoString =
                  promoInfo
                    ? promoInfo.promoString
                    : '';

                return {
                  promoId: promoInfo.id ?? 0,
                  itemId: item.itemId,
                  imgSrc: item.prodImg,
                  tags: item.promoMethods,
                  mainTitle: item.itemName,
                  subTitle: subTitle,
                  price: item.firstPromoPrice.toString(),
                  oldPrice: item.unitPrice.toString(),
                  hot: item.isHot,
                  promoString: promoString,
                  favorite: item.favorite,
                };
              }) || [];
          } 
        })
      )
      .subscribe();
  }

  loadContentManagement2() {
    this.filterSub = this.filterService.filterParams$
      .pipe(
        switchMap((param) => {
          return this.productService.getPeriodSaleHome()
          .pipe(
            catchError(() => {
              return of();
            })
          );
        }),

        tap((res) => {
          let result: any;
          result = res.result;
          if (
            res.responseCode === '0000' &&
            Array.isArray(result?.periodSales)
          ) {
            this.pagination = res.result.pagination;

            const periodSaleList = result.periodSales;
            for (let x = 0; x < periodSaleList.length; x++) {
              if (Array.isArray(periodSaleList[x].periodSaleProducts)) {
                if (x == 0) {
                  this.periodSaleList1 = true;
                  this.periodSaleListName1 = periodSaleList[x].name;
                  this.periodSaleListId1 = periodSaleList[x].specialEventId;

                  this.salesDataChris = periodSaleList[x].periodSaleProducts
                    .map((item: any) => {
                      return {
                        id: this.periodSaleListId1,
                        itemId: item.itemId,
                        imgSrc: item.prodImg,
                        tags: item.promoMethods,
                        mainTitle: item.itemName,
                        subTitle: item.description,
                        price: item.firstPromoPrice.toString(),
                        oldPrice: item.unitPrice.toString(),
                        hot: item.isHot,
                        favorite: item.favorite,
                      };
                    })
                    .slice(0, 6);
                } else if (x == 1) {
                  this.periodSaleList2 = true;
                  this.periodSaleListName2 = periodSaleList[x].name;
                  this.periodSaleListId2 = periodSaleList[x].specialEventId;

                  this.salesDataChris2 = periodSaleList[x].periodSaleProducts
                    .map((item: any) => {
                      return {
                        id: this.periodSaleListId2,
                        itemId: item.itemId,
                        imgSrc: item.prodImg,
                        tags: item.promoMethods,
                        mainTitle: item.itemName,
                        subTitle: item.description,
                        price: item.firstPromoPrice.toString(),
                        oldPrice: item.unitPrice.toString(),
                        hot: item.isHot,
                        favorite: item.favorite,
                      };
                    })
                    .slice(0, 6);
                } else if (x == 2) {
                  this.periodSaleList3 = true;
                  this.periodSaleListName3 = periodSaleList[x].name;
                  this.periodSaleListId3 = periodSaleList[x].specialEventId;

                  this.salesDataChris3 = periodSaleList[x].periodSaleProducts
                    .map((item: any) => {
                      return {
                        id: this.periodSaleListId3,
                        itemId: item.itemId,
                        imgSrc: item.prodImg,
                        tags: item.promoMethods,
                        mainTitle: item.itemName,
                        subTitle: item.description,
                        price: item.firstPromoPrice.toString(),
                        oldPrice: item.unitPrice.toString(),
                        hot: item.isHot,
                        favorite: item.favorite,
                      };
                    })
                    .slice(0, 6);
                }
              }
            }
          } else {
            // Handle the case where res.responseCode is not '0000' or res.result.periodSales is not an array.
          }
        })
      )
      .subscribe();
  }
  loadContentManagement3() {
    this.filterSub = this.filterService.filterParams$
      .pipe(
        switchMap((param) => {
          return this.productService.gethomePageBanners()
          .pipe(
            catchError(() => {
              // handle api error and continue operation
              return of();
            })
          );
        }),
        tap((res) => {
          if (res.responseCode === '0000' && res.result) {
            let x: any;
            x = res.result;

            this.middle1Image =
              this.envConfig.baseApiUrl +
              x.middleOptionalPurchaseBanners[0].imageUrlForPc;
            this.middle2Image =
              this.envConfig.baseApiUrl + x.middlePeriodBanners[0].imageUrlForPc;

            const bannersList = x as CustomHomePageBannersList;
            this.downOption = bannersList.bottomBanners.map((banner) => ({
              imageUrlForMobile: `${this.envConfig.baseApiUrl}${banner.imageUrlForMobile}`,
              imageUrlForPc: `${this.envConfig.baseApiUrl}${banner.imageUrlForPc}`,
              name: `${banner.name}`,
              relatedUrl: `${banner.relatedUrl}`,
              type: `${banner.type}`,
            }));
          } else {
          }
        })
      )
      .subscribe();
  }

  /** open 特定期間促銷 modal */
  toPeriodPromotion() {
    // const param = {
    //   activity: null,
    //   isUnitPrice: true,
    //   keyword: ' ',
    //   page: 1,
    //   pageSize: 10,
    //   showPeriodPromotion: true,
    //   sortField: "unitPrice",
    //   subInventory: null,
    // }

    // this.productService.getProductList(param as FilterForm).subscribe((res: any) => {
    //   if(res.result.data) {
    //     const url = `/ProductList?showPeriodPromotion=true&keyword=%20`;
    //     window.open(url, '_blank');
    //   }else {
    //     this.dialogservice
    //       .openLazyDialog(modelOption.modelName, modelOption.config)
    //       .then((ref) => {
    //         ref.afterClosed().subscribe((result) => {});
    //       });
    //   }
    // })

    const modelOption = {
      modelName: 'simple-dialog',
      config: {
        data: {
          title: '尚未有特定促銷活動',
          StyleMargin: '0px',
          text: '目前尚未有任何特定期間促銷活動，請您參考iOrder其他商品，謝謝。',
          displayFooter: true,
          confirmButton: '確認',
        },
        width: '500px',
        height: '204px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: '',
      },
    };

    const filterForm: FilterForm = {
      pageSize: 0,
      showPeriodPromotion: true
    }

    this.productService.getProductList(filterForm).pipe(
      tap((response: any) => {
        // 判斷是否有特定期間促銷活動
        this.periodPromotion = response?.result?.pagination?.total > 0 || false;

        if (this.periodPromotion) {
          const url = `/ProductList?showPeriodPromotion=${this.periodPromotion}&keyword=%20`;
          this.openNewTab(url);

          // this.router.navigate(['/ProductList'], { queryParams: { showPeriodPromotion: this.periodPromotion, keyword: ' ' } }); // 令 keyword 為 truthy, 避免在進入商品列表時被 filter 掉, 跳回首頁
        } else {
          this.dialogservice
            .openLazyDialog(modelOption.modelName, modelOption.config)
            .then((ref) => {
              ref.afterClosed().subscribe((result) => {});
            });
        }
      })
    )
    .subscribe();
  }

  fetchOptionalPurchase($event: MouseEvent) {
    $event.preventDefault();
    const modelOption = {
      modelName: 'simple-dialog',
      config: {
        data: {
          title: '尚未有任購活動',
          StyleMargin: '0px',
          text: '目前尚未有任何任購超值配活動，請您參考iOrder其他商品，謝謝。',
          displayFooter: true,
          confirmButton: '確認',
        },
        width: '500px',
        height: '204px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: '',
      },
    };

    this.productService.getCustomPromoList().pipe(
      tap((response: any) => {
        const isPromo = response.result.tabs.length > 0 || false;

        if (isPromo) {
          this.openNewTab("/OptionalPurchase");
          return
        }

        this.dialogservice
          .openLazyDialog(modelOption.modelName, modelOption.config)
          .then((ref) => {
            ref.afterClosed().subscribe((result) => {});
          });

      })
    )
    .subscribe();
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

  isCompareAddOrRemove(data: any): boolean {
    return !(this.comparisonComp?.items ?? [])?.find(
      (item: { itemId: any; }) => item.itemId === data?.itemId
    );
  }
  isAddToWishList(data: any): boolean {
    if(data.favorite) return true
    else return false
  }

  checkstrongDiscountisCompare(element: any): void {
    this.strongDiscountisCompare = this.isCompareAddOrRemove(element);
  }

  addToWishList(detail: any): void {
    const isSales = JSON.parse(localStorage.getItem('isSales') ?? 'true');

    if (isSales)
    {
      const hint = ['很抱歉，您的身分組（查價員）無法使用此功能。', '如有疑問，請聯絡您的帳戶管理員，或聯絡線上客服。'];
      POP_UP.showMessage(this.dialogservice, '您的身分組不支援此功能', hint);
      return;
    }

    if(detail) {
      this.memberService
        .addWishList(Number(detail.itemId))
        .subscribe((res): any => {
          if (res.responseCode === ResponseCode.Success) {
            this.notifierService.showInfoNotification('已加入追蹤清單');
            this.loadContentManagement();
            this.loadContentManagement2();
            this.loadContentManagement3();
          } else {
            this.notifierService.showInfoNotification(res.responseMessage);
          }
        })
    }
  }

  onCompare(element: any): void {

    /*
    {
    "itemId": 950864,
    "imgSrc": "https://service.unitech.com.tw/upload/product/pic/Product_Pic202306061432449KEJPv.jpg",
    "tags": [
        1,
        3,
        4
    ],
    "mainTitle": "ASUS VA24EHF",
    "subTitle": "23.8吋寬螢幕 IPS 100Hz 低藍光不閃屏",
    "price": "3049",
    "oldPrice": "3050",
    "hot": false
}
    */
    if (!this.comparisonComp) return;
    if (this.isCompareAddOrRemove(element)) {
      this.comparisonComp.add(
        element.mainTitle,
        element.price || element.oldPrice,
        element.imgSrc,
        element.itemId
      );
      if (
        this.comparisonComp?.items.find(
          (item: { itemId: any; }) => item.itemId === element.itemId
        )
      ) {
        this.notifierService.showInfoNotification(
          `已加入比價（${this.comparisonComp.items.length}/${this.comparisonComp.maxCompareCount}）`
        );
      }
    } else {
      this.comparisonComp.remove(element, true);
    }
    this.compareItems = this.comparisonComp?.items || [];
  }

  onNavigateProduct(itemId: number, source?: string | null, sourceId?: number | null) {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/Product'], { queryParams: { itemId, source, sourceId } }));
    this.openNewTab(url);
  }


  processDownAdUrl(url: string): string {
    const domainRegex = /[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;
    if (domainRegex.test(url) && !url.startsWith("http")) return "https://" + url
    return url;
  }

  toggleIncentiveActivities(isVisible: boolean): void {
    this.showIncentiveActivities = isVisible;
  }

  openNewTab(url: string): void {
    const isSuccess = window.open(url, '_blank');
    if (!isSuccess) {
      window.location.href = url;
    }
  }

  handleGroupBuyNoData(event: boolean) {
    if (event) {
      this.showGroupBuy = false;
    }
  }

  handleClickSales() {
    this.salesBoxRef?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  handleClickPurchase() {
    const y = this.purchaseRef?.nativeElement.getBoundingClientRect().top + window.screenY;
    window.scrollTo({ top: y - 250, behavior: 'smooth' });
  }

  handleClickFlash() {
    this.flashRef?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  handleClickSpecial() {
    this.specialRef?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  handleClickGroup() {
    const y = this.groupRef?.nativeElement.getBoundingClientRect().top + window.screenY;
    window.scrollTo({ top: y - 200, behavior: 'smooth' });
  }
}
