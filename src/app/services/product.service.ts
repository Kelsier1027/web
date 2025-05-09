/** --------------------------------------------------------------------------------
 *-- Description： 商品api
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { HttpDefaultOptions, Response } from '../core/model';
import { ErrorServiceService } from '../core/services/error-service.service';
import { StorageService } from '../core/services/storage.service';
import { EnvConfig } from 'src/app/app.module';
import { NotifierService } from '../shared/services';
import {
  ArrivalNotice,
  AwardActivityUrl,
  CompareItem,
  CustomPromo,
  ProductListPageBannersList,
  ResultRes,
  Sales,
} from '../models';
import {
  FilterData,
  FilterForm,
  Menu,
  Type2List,
  ProductDetail,
  ListRes,
  PromoReq,
  FlashSalesAdvertise,
  ClearanceSaleListReq,
  ClearanceSaleList,
  BonusPoint,
  BonusListReq,
  BonusItem,
  AwardActivityList,
  AwardActivityDetailList,
  HomePageBannersList,
  ClearanceSaleReq,
  PromoHomeItem,
  PeriodSalesList
} from '../models';
import { CustomerInfoCache, LOCAL_STORAGE_CACHE, ProductDetailCache } from '../shared/utils/localStorageCacheUtilities';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends ErrorServiceService {
  constructor(
    http: HttpClient,
    options: HttpDefaultOptions,
    router: Router,
    storage: StorageService,
    notifier: NotifierService,
    private envConfig: EnvConfig
  ) {
    super(http, options, router, storage, notifier);
  }

  private addCartSubject = new Subject<void>();
  private addCartCustomPromoSubject = new Subject<void>();
  typeList = new BehaviorSubject<Type2List[]>([]);
  typeList$ = this.typeList.asObservable();

  /** 新增貨到通知 */
  arrivalNotice(param: {
    itemId: number;
    itemSeg: string;
    itemQTY: number;
    deadline: string;
    notificationMail: string;
    type: string;
    subinventoryCode: string;
  }): Observable<Response> {
    const url = '/api/web/product/product/backInStock';
    return this.post(url, { body: param });
  }

  remindSale(param: {
    orgId: number;
    itemId: number;
    promoId: number;
    email: string[];
  }): Observable<Response> {
    const url = '/api/web/product/product/remindSale';
    return this.post(url, { body: param });
  }

  /** 取得貨到通知頁面資訊 */
  getArrivalNotice(itemId: number): Observable<ResultRes<ArrivalNotice>> {
    const url = `/api/web/product/product/getBackInStockData?itemId=${itemId}`;
    return this.get(url);
  }

  /** 取得請洽業務頁面資訊 */
  getSalesInfo(): Observable<ResultRes<Sales>> {
    const url = '/api/web/product/product/getSalesInfo';
    return this.get(url);
  }

  /** 請業務聯繫我 */
  contactMe(param: {
    itemNumber: string;
    itemName: string;
  }): Observable<ResultRes<string>> {
    const url = '/api/web/product/product/contactMe';
    return this.post(url, { queryObject: param });
  }

  /** 加入購物車前檢查 */
  checkCart(param: {
    subinventoryCode: string;

    attachedItems?: {
      itemId: number;
      listLineId?: string;
      qty: number;
    };

    mainItem?: {
      itemId: number;
      listLineId?: string;
      qty: number;
    };
    comboItems?: {
      itemId: number;
      listLineId?: string;
      qty: number;
    }[];
    giftItems?: {
      itemId: number;
      listLineId?: string;
      qty: number;
    }[];
    accessoryItems?: {
      itemId: number;
      listLineId?: string;
      qty: number;
    }[];
  }): Observable<Response> {
    const url = '/api/web/product/product/addToCartCheck';
    return this.post(url, { body: param });
  }

  addToCart(param: {
    subinventoryCode: string;
    attachedItems?: {
      promoId: number | null;
      uniqueId: string;
      itemId: number;
      listLineId: string;
      qty: number;
    };

    mainItem?: {
      promoId: number | null;
      uniqueId: string;
      itemId: number;
      listLineId: string;
      qty: number;
    };
    comboItems?: {
      promoId: number;
      itemId: number;
      listLineId?: string;
      qty: number;
    }[];
    giftItems?: {
      promoId: number;
      itemId: number;
      listLineId?: string;
      qty: number;
    }[];
    accessoryItems?: {
      itemId: number;
      listLineId?: string;
      qty: number;
    }[];
  }): Observable<Response> {
    LOCAL_STORAGE_CACHE.Invalidate(LOCAL_STORAGE_CACHE.customerInfo);
    LOCAL_STORAGE_CACHE.InvalidateAllProductDetails();

    const url = '/api/web/product/product/addToCart';
    return this.post(url, { body: param }).pipe(
      tap(() => {
        this.addCartSubject.next();
      })
    );
  }

  /** 團購加入購物車 */
  addToCartGroupBuy(param: {
    // 主商品 ID（= 商品頁 ID）
    itemId: number;
    // 促銷 ID
    promoId: number;
    // 數量
    orderQuantity: number;
    // 倉庫
    // 林口倉：I01
    // 高雄倉：I07
    subInventoryCode: string;
  }): Observable<Response> {
    LOCAL_STORAGE_CACHE.Invalidate(LOCAL_STORAGE_CACHE.customerInfo);
    LOCAL_STORAGE_CACHE.InvalidateAllProductDetails();

    const url = '/api/web/product/groupBuy/addToCart';
    return this.post(url, { body: param }).pipe(
      tap(() => {
        this.addCartSubject.next();
      })
    );
  }

  onCartAdd(): Observable<void> {
    return this.addCartSubject.asObservable();
  }
  /** 商品頁 */
  getProductDetail(itemId: number, dealerView?: string | null): Observable<ResultRes<ProductDetail>> {
    const url = `/api/web/product/product/list/${itemId}`;
    return this.post(url, dealerView ? { queryObject: { dealerView: dealerView }} : {}, false);
  }
  /** 商品頁獎勵活動頁 */
  getProductAwards(itemId: number, dealerView?: string | null): Observable<ResultRes<any>> {
    const url = `/api/web/product/product/awards/${itemId}`;

    return this.post(url, dealerView ? { queryObject: { dealerView: dealerView } } : {});
  }

  /**
   * 首頁Menu大分類,小分類,品牌清單
   */
  getMenu(): Observable<ResultRes<Menu>> {
    const url = '/api/web/Product/Product/menu';
    return this.getCacheOrQuery(LOCAL_STORAGE_CACHE.menu, url);
  }

  /**
   * 取得側邊篩選
   */
  getFilter(param: {
    type1Id: number | null;
    type2Id: number | null;
    isWelfare?: boolean;
  }): Observable<ResultRes<FilterData> | []> {
    param.isWelfare ??= false;
    
    const url = '/api/web/Product/Product/filter';
    return this.get(url, { queryObject: param });
  }

  getSavedFilter(): Observable<ResultRes<Partial<FilterForm>> | []> {
    const url = '/api/web/customer/filter';
    return this.get(url);
  }

  createFilter(param: any) {
    const url = '/api/web/customer/filter';
    return this.post(url, { body: param });
  }

  editFilter(param: any) {
    const url = '/api/web/customer/filter';
    return this.put(url, { body: param });
  }
  deleteFilter(id: number) {
    const url = `/api/web/customer/filter/${id}`;
    return this.delete(url);
  }

  getSavedFilterCount(): Observable<ResultRes<number>> {
    const url = '/api/web/customer/filter/count';
    return this.get(url);
  }

  /**
   * 取得商品列表
   */
  getProductList(param: FilterForm, noLoading: boolean = false): Observable<ResultRes<any> | []> {
    let rememberMeData = this.storage.get(this.envConfig.rememberMeKey) || {};
    if (!('isunitprice' in rememberMeData)) {
      rememberMeData['isunitprice'] = true;
      this.storage.set(this.envConfig.rememberMeKey, rememberMeData);
      param.isUnitPrice = rememberMeData['isunitprice'] as boolean | undefined;
    } else {
      param.isUnitPrice = rememberMeData['isunitprice'] as boolean | undefined;
    }
    const url = '/api/web/Product/Product/list';
    return this.post(url, { body: { ...param }, noLoading: noLoading });
  }
  /**
   * 取得搜尋建議
   */
  getSearchSuggestion(param: FilterForm): Observable<ResultRes<any> | []> {
    const url = '/api/web/Product/Product/SearchSuggestions';
    return this.get(url, {
      queryObject: { ...param },
    });
  }

  /** get common cust list */
  getPromoList(param: PromoReq): Observable<ListRes<FlashSalesAdvertise>> {
    const url = '/api/web/product/product/flashSaleList';
    return this.get(url, {
      queryObject: { ...param },
    });
  }

  /** get common cust list */
  getFlashSaleomeList(param: PromoReq): Observable<ListRes<PromoHomeItem>> {
    const url = '/api/web/product/product/flashSale';
    return this.getCacheOrQuery(LOCAL_STORAGE_CACHE.flashSale, 
      url, 
      {
        queryObject: { ...param },
      }
    );
  }

  /** get common cust list */
  getClearanceSaleList(
    param: ClearanceSaleListReq
  ): Observable<ListRes<ClearanceSaleList>> {
    const url = '/api/web/product/product/ClearanceSaleList';
    return this.getCacheOrQuery(
      LOCAL_STORAGE_CACHE.clearanceSale,
      url, 
      {
        queryObject: { ...param },
      });
  }

  /** 破盤特賣副標題 */
  getClearanceSaleSubTitle(): Observable<ResultRes<string>> {
    const url = '/api/web/product/product/ClearanceSaleSubTitle';
    return this.get(url);
  }

  /** get common cust list */
  getClearanceSaleHome(
    param: ClearanceSaleReq
  ): Observable<ListRes<ClearanceSaleList>> {
    const url = '/api/web/product/product/ClearanceSale';
    return this.get(url, {
      queryObject: { ...param },
    });
  }

  /**  get BonusList list */
  getBonus(dealerView?: string | null): Observable<ListRes<BonusPoint>> {
    const url = '/api/web/customer/member/bonus';
    return this.get(url, {
      queryObject: { dealerView: dealerView },
    });
  }

  getBonusList(param: BonusListReq): Observable<ListRes<BonusItem[]>> {
    const url = '/api/web/customer/member/bonus/list';
    return this.get(url, {
      queryObject: { ...param },
    });
  }

  getAwardActivityList(param: any): Observable<ListRes<AwardActivityList>> {
    const url = '/api/web/product/product/awardActivity';
    return this.postCacheOrRequest(LOCAL_STORAGE_CACHE.awardActivity, url, { body: param, noLoading: true });
  }

  /** 猜你喜歡 */
  getGuessYouLikeList(
    param: any
  ): Observable<ResultRes<{ guessYouLike: ProductDetail[] }>> {
    const url = `/api/web/product/product/guessYouLike`;
    return this.getCacheOrQuery(LOCAL_STORAGE_CACHE.guessYouLike, url, {
      queryObject: { ...param },
    });
  }

  /** 推薦商品 */
  getRecommendedList(
    param: any
  ): Observable<ResultRes<{ recommended: ProductDetail[] }>> {
    const url = `/api/web/product/product/recommended`;
    return this.getCacheOrQuery(LOCAL_STORAGE_CACHE.recommended, url, {
      queryObject: { ...param },
    });
  }

  getAwardActivityDetail(
    param: any
  ): Observable<ListRes<AwardActivityDetailList>> {
    const url = '/api/web/product/product/awardActivityDetail';
    return this.post(url, { body: param });
  }

  gethomePageBanners(): Observable<ListRes<HomePageBannersList>> {
    const url = '/api/web/product/product/homePageBanners';
    return this.getCacheOrQuery(LOCAL_STORAGE_CACHE.homePageBanners, url);
  }

  /** get common cust list */
  getPeriodSaleHome(): Observable<ListRes<PeriodSalesList>> {
    const url = `/api/web/product/product/periodSale`;
    return this.getCacheOrQuery(LOCAL_STORAGE_CACHE.periodSale, url);
  }

  /**
   * 取得熱門促銷商品列表
   */
  getHotSalesList(): Observable<Response> {
    const url = '/api/web/Product/Product/hotSales';
    const param = { pageSize: 2 };
    return this.postCacheOrRequest(LOCAL_STORAGE_CACHE.hotSales, url, { body: param, noLoading: true });
  }

  /** 子分類頁面廣告 */
  adproduct(
    type2Id: string,
    brandId: string
  ): Observable<ResultRes<ProductListPageBannersList>> {
    const url = '/api/web/product/product/adproduct';
    return this.get(url, {
      queryObject: {
        type2Id,
        brandId,
      },
    });
  }

  /** 取得商品比較清單 */
  getCompareProductList(
    itemIds: number[]
  ): Observable<ResultRes<{ comparison: CompareItem[] }>> {
    const url = '/api/web/product/product/comparison';
    return this.post(url, { body: { itemIds } });
  }

  getCompareProductExcel(itemIds: number[]): Observable<Blob> {
    const url = '/api/web/product/product/comparisonExcel';
    return this.post(url, { body: { itemIds }, responseType: 'blob' });
  }

  /** get common cust list */
  getCustomPromoList(): Observable<ListRes<any>> {
    const url = `/api/web/product/customPromo/list`;
    return this.get(url);
  }

  /** get common cust list */
  getCustomPromoDetail(
    promoId: number
  ): Observable<ResultRes<{ customPromo: CustomPromo }>> {
    const url = `/api/web/product/customPromo/${promoId}`;
    return this.get(url);
  }

  /** 取得福利品規則頁面資訊 */
  getWelfareDesc(): Observable<ResultRes<any>> {
    const url = '/api/web/product/product/welfareDesc';
    return this.get(url);
  }

  /** 任購用的加入購物車 **/
  customPromoAddToCart(param: {
    promoId: number;
    subInventoryCode: string;
    soldOutPlan: number;
    products: {
      itemId: number;
      buyCount: number;
      customPromoArea: string;
      uniqueId: string;
    }[];
  }): Observable<Response> {
    LOCAL_STORAGE_CACHE.Invalidate(LOCAL_STORAGE_CACHE.customerInfo);
    LOCAL_STORAGE_CACHE.InvalidateAllProductDetails();

    const url = '/api/web/product/customPromo/addToCart';
    return this.post(url, { body: param }).pipe(
      tap(() => {
        this.addCartCustomPromoSubject.next();
      })
    );
  }

  /** 取得任購相關資訊 */
  getCheckoutDetail(param: {
    purchaseId: number;
    purchaseItemIds: number[];
    awardGiftListIds: number[];
  }): Observable<Response> {
    const url = '/api/web/customer/checkout/detail';
    return this.post(url, { body: param });
  }

  /** 取得強檔優惠資訊 */
  getGoupBuyPrimePromos(): Observable<ResultRes<any>> {
    const url = '/api/web/product/groupBuy/primePromos';
    return this.getCacheOrQuery(LOCAL_STORAGE_CACHE.primePromos, url);
  }


  /** 送出訂單 */
  getPreOrderCheckOut(param: any): Observable<ResultRes<any>> {
    LOCAL_STORAGE_CACHE.Invalidate(LOCAL_STORAGE_CACHE.customerInfo);

    const url = '/api/web/product/preorder/checkOut';
    LOCAL_STORAGE_CACHE.Invalidate(LOCAL_STORAGE_CACHE.customerInfo);
    return this.post(url, { body: param });
  }

  /** 預購商品加入購物車 */
  preOrderAddToCart(param: any): Observable<ResultRes<any>> {
    LOCAL_STORAGE_CACHE.Invalidate(LOCAL_STORAGE_CACHE.customerInfo);
    LOCAL_STORAGE_CACHE.InvalidateAllProductDetails();

    const url = '/api/web/product/preorder/addToCart';
    
    return this.post(url, { body: param });
  }

  /** 取得活動詳情的URL */
  awardActivityUrl(promoId: any): Observable<ResultRes<AwardActivityUrl>> {
    const url = `/api/web/product/product/awardActivityUrl?promoteId=${promoId}`;
    return this.post(url);
  }
}
