/** --------------------------------------------------------------------------------
 *-- Description： 會員api
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
import { HttpDefaultOptions, Pagination, Response } from '../core/model';
import { ErrorServiceService } from '../core/services/error-service.service';
import { StorageService } from '../core/services/storage.service';
import { AddrAction } from '../enums';
import {
  Account,
  AccountListRes,
  User,
  AddrManage,
  City,
  CityArea,
  CustomerAccount,
  ItemArriveNotification,
  ListRes,
  Order,
  ResultRes,
  OrderDetail,
  Bill,
  BillDetail,
  Prepay,
  DeliveryRemark,
  Gift,
  CommonAddress,
  Trace,
  CheckOrderCancel,
  MemberInfo,
  PreOrderDetail,
  PreOrderList,
  homepagePopup,
  Chat,
  adLink
} from '../models';
import { NotifierService } from '../shared/services';
import { Binary } from '@angular/compiler';
import { CustomerInfoCache, LOCAL_STORAGE_CACHE } from '../shared/utils/localStorageCacheUtilities';

@Injectable({
  providedIn: 'root',
})
export class MemberService extends ErrorServiceService {

  private wishlistDeletedSubject = new Subject<void>();

  private addWishListSubject = new Subject<void>();

  constructor(
    http: HttpClient,
    options: HttpDefaultOptions,
    router: Router,
    storage: StorageService,
    notifier: NotifierService
  ) {
    super(http, options, router, storage, notifier);
  }
  /**
   * 訂單詳細取得序號
   */
  getSerialNumber(param: {
    password: string;
    purchaseNumber: string;
    purchaseId: number;
    serialIds: number[];
    dealerView?: string | null;
  }): Observable<ResultRes<string[]>> {
    const url = '/api/web/customer/member/order/serialNumber';
    return this.get(url, { queryObject: param });
  }

  /**
   * 刪除我的追蹤
   */
  deleteWishList(id: number): Observable<Response> {
    const url = `/api/web/customer/member/Wishlist/${id}`;
    LOCAL_STORAGE_CACHE.Invalidate(LOCAL_STORAGE_CACHE.customerInfo);
    return this.delete(url).pipe(
      tap(() => {
        this.wishlistDeletedSubject.next();
      })
    );
  }
  onWishlistDeleted(): Observable<void> {
    return this.wishlistDeletedSubject.asObservable();
  }
  /**
   * 我的追蹤列表
   */
  getWishList(param: { page?: number; pageSize?: number }): Observable<
    ResultRes<{
      traceList: Trace[];
      pagination: Pagination;
    }>
  > {
    const url = '/api/web/customer/member/Wishlist';
    LOCAL_STORAGE_CACHE.Invalidate(LOCAL_STORAGE_CACHE.customerInfo);
    return this.get(url, { queryObject: param });
  }

  /**
   * Delete common used ship-address
   * 刪除常用指送地址
   */
  deleteCommonAddress(id: number): Observable<Response> {
    const url = `/api/web/customer/member/commonUsedAddr/${id}`;
    return this.delete(url);
  }

  /**
   * Modify common used ship-address
   * 修改常用指送地址
   */
  editCommonAddress(
    id: number,
    param: {
      addrName: string;
      addrCity: string;
      addrCityArea: string;
      addrZipCode: string;
      addr: string;
      receiver: string;
      contactNo: string;
      phoneNo: string;
    }
  ): Observable<Response> {
    const url = `/api/web/customer/member/commonUsedAddr/${id}`;
    return this.patch(url, { body: param });
  }

  /**
   * Add common used ship-address
   * 新增常用指送地址
   */
  addCommonAddress(param: {
    addrName: string;
    addrCity: string;
    addrCityArea: string;
    addrZipCode: string;
    addr: string;
    receiver: string;
    contactNo: string;
    phoneNo: string;
  }): Observable<Response> {
    const url = '/api/web/customer/member/commonUsedAddr';
    return this.post(url, { body: param });
  }

  /**
   * Get common used ship-address list
   * 指送地址列表
   */
  getCommonAddress(param: {
    keyword?: string;
    onlyMe?: boolean;
    page?: number;
    pageSize?: number;
  }): Observable<
    ResultRes<{
      commonUsedAddrList: CommonAddress[];
      pagination: Pagination;
    }>
  > {
    const url = '/api/web/customer/member/commonUsedAddr';
    return this.get(url, { queryObject: param });
  }

  /**
   * 獎勵活動達成禮-領取紀錄
   */
  getGiftRecord(param: { page?: number; pageSize?: number }): Observable<
    ResultRes<{
      giftList: Gift[];
      pagination: Pagination;
    }>
  > {
    const url = '/api/web/customer/member/gift/record';
    return this.get(url, { queryObject: param });
  }

  /**
   * 獎勵活動達成禮-待領達成禮
   */
  getGiftUnclaimed(param: { page?: number; pageSize?: number }): Observable<
    ResultRes<{
      giftList: Gift[];
      pagination: Pagination;
    }>
  > {
    const url = '/api/web/customer/member/gift/unclaimed';
    return this.get(url, { queryObject: param });
  }

  /**
   * Delete delivery remark
   * 刪除常用備註
   */
  deleteDeliveryRemark(id: number): Observable<Response> {
    const url = `/api/web/customer/member/deliveryRemark/${id}`;
    return this.delete(url);
  }

  /**
   * Update delivery remark
   * 更新常用備註
   */
  editDeliveryRemark(
    id: number,
    param: {
      title: string;
      comment: string;
    }
  ): Observable<Response> {
    const url = `/api/web/customer/member/deliveryRemark/${id}`;
    return this.patch(url, { body: param });
  }

  /**
   * Create delivery remark
   * 建立常用備註
   */
  addDeliveryRemark(param: {
    title: string;
    comment: string;
  }): Observable<Response> {
    const url = '/api/web/customer/member/deliveryRemark';
    return this.post(url, { body: param });
  }

  /**
   * Get delivery remark list
   * 常用備註清單
   */
  getDeliveryRemark(param: {
    isCreatedByCurrentUser?: boolean;
    page?: number;
    pageSize?: number;
  }): Observable<
    ResultRes<{
      deliveryRemarkList: DeliveryRemark[];
      pagination: Pagination;
    }>
  > {
    const url = '/api/web/customer/member/deliveryRemark';
    return this.get(url, { queryObject: param });
  }

  /**
   * Get prepay list
   * 預付清單列表
   */
  getPrepay(dealerView?: string | null): Observable<ResultRes<Prepay[]>> {
    const url = '/api/web/customer/member/bill/prepay';
    return this.get(url, {queryObject: { dealerView: dealerView }});
  }

  /**
   * Export excel
   * 帳單查詢依查詢條件匯出清單
   */
  exportBillExcel(param: {
    payableDate: string;
    dueDate: string;
    keyword: string;
    dealerView?: string | null;
  }): Observable<Blob> {
    const url = '/api/web/customer/member/bill/export';
    return this.get(url, { queryObject: { ...param }, responseType: 'blob' });
  }

  /**
   * Get bill info by shipNumber
   * 依出貨單號查詢帳單明細
   */
  getBillDetail(shipNumber: string): Observable<ResultRes<BillDetail[]>> {
    const url = '/api/web/customer/member/bill/detail/';
    return this.get(url, { queryObject: { shipNumber: shipNumber } });
  }

  /**
   * Get bill list
   * 帳單列表
   */
  getBill(param: {
    payableDate?: string;
    dueDate?: string;
    keyword?: string;
    page?: number;
    pageSize?: number;
    dealerView?: string | null;
  }): Observable<
    ResultRes<{
      order: { billList: Bill[]; userList: User[] };
      pagination: Pagination;
    }>
  > {
    const url = '/api/web/customer/member/bill';
    return this.get(url, { queryObject: param });
  }

  /**
   * Export serial list
   * 帳單明細列印帳單
   */
  exportSerialListExcel(purchaseId: number, dealerView?: string | null): Observable<Blob> {
    const url = `/api/web/customer/member/order/${purchaseId}/exportSerialList`;
    return this.get(url, { queryObject: {dealerView: dealerView}, responseType: 'blob' });
  }

  /**
   * Get order info by purchaseId
   * 點採構單號查訂單明細
   */
  getCheckCancel(purchaseId: number): Observable<ResultRes<CheckOrderCancel>> {
    const url = `/api/web/customer/member/order/checkCancel/${purchaseId}`;
    return this.get(url);
  }

  /**
   * Post cancel order by purchaseId
   * 指定採購單號，取消該訂單
   */
  cancelOrder(param: {
    purchaseId: number;
    cancelReason: string;
  }): Observable<Response> {
    const url = `/api/web/customer/member/order/cancel`;
    return this.post(url, { body: param });
  }

  /**
   * Get order info by purchaseId
   * 點採構單號查訂單明細
   */
  getOrderDetail(purchaseId: number, dealerView?: string | null): Observable<ResultRes<OrderDetail>> {
    const url = `/api/web/customer/member/order/${purchaseId}`;
    return this.get(url, {queryObject: {dealerView: dealerView}});
  }

  /**
   * Send order invoice by php api
   * 發票寄送
   */
  sendInvoice(param: {
    invoiceNo: string;
    creationDate: string;
    email: string;
  }): Observable<Response> {
    const url = '/api/web/customer/member/order/sendInvoice';
    return this.post(url, { body: param });
  }

  /**
   * Export list
   * 訂單查詢匯出清單
   */
  exportOrderExcel(param: {
    status: string;
    startDate: string;
    endDate: string;
    keyword: string;
    dealerView?: string | null;
  }): Observable<Blob> {
    const url = '/api/web/customer/member/order/exportList';
    return this.get(url, { queryObject: { ...param }, responseType: 'blob' });
  }

  exportGroupOrderExcel(param: {
    groupBuyStatus: number;
    startDate: string;
    endDate: string;
    sortField: string;
    sortOrder: string;
    page: number;
    pageSize: number;
    keyword: string;
    dealerView?: string | null;
  }): Observable<Blob> {
    const url = '/api/web/customer/member/order/groupBuy/export';
    return this.get(url, { queryObject: {...param}, responseType: 'blob' });
  }

  /**
   * Get order list
   * 訂單查詢列表
   */
  getOrder(param: {
    status?: string;
    startDate?: string;
    endDate?: string;
    keyword?: string;
    page?: number;
    pageSize?: number;
    dealerView?: string | null;
  }): Observable<
    ResultRes<{
      order: { orderList: Order[]; userList: User[] };
      pagination: Pagination;
    }>
  > {
    const url = '/api/web/customer/member/order';
    return this.get(url, { queryObject: param });
  }

  /**
 * Get order list
 * 訂單查詢列表
 */
  getOrdergroupBuy(param: {
    groupBuyStatus?: number;
    startDate?: string;
    endDate?: string;
    sortField?: null | string;
    sortOrder?: string;
    keyword?: string;
    page?: number;
    pageSize?: number;
    dealerView?: string | null;
  }): Observable<
    ResultRes<{
      data: any[];
      pagination: Pagination;
    }>
  > {
    const url = '/api/web/customer/member/order/groupBuy';
    return this.get(url, { queryObject: param });
  }

  /**
 *
 * 取消訂單團購
 */
  cancelOrdergroupBuy(param: {
    // 採購單號，從取得列表的資料裡搬來即可
    purchaseNo: string,
    // 使用者填入的取消原因
    cancelReason: string
  }): Observable<Response> {
    const url = '/api/web/customer/member/order/groupBuy/cancel';
    return this.post(url, { body: param });
  }

  getOrderGroupBuyDetail(purchaseNo: string, dealerView?: string | null): Observable<ResultRes<any>> {
    const url = `/api/web/customer/member/order/groupBuy/${purchaseNo}`;
    return this.get(url, {queryObject: {dealerView: dealerView}});
  }

  /**
   * Get item arrive notification list
   * 貨到通知列表
   */
  getItemArriveNotification(param: {
    processStatus: string;
    notificationStatus: string;
    itemNumber: string;
    page: number;
    pageSize: number;
  }): Observable<
    ResultRes<{
      itemArrivedNotificationVM: ItemArriveNotification[];
      pagination: Pagination;
    }>
  > {
    const url = '/api/web/customer/member/itemArriveNotification';
    return this.get(url, { queryObject: param });
  }

  /**
   * 台灣城市區域列表
   */
  getCityArea(city: string, needDelivery?: boolean): Observable<ListRes<CityArea>> {
    let url = `/api/web/customer/member/commonUsedAddr/cityArea?city=${city}`;

    // 如果 needDelivery 參數存在，則將其添加到 URL 中
    if (needDelivery !== undefined && needDelivery !== null) {
      url += `&needDelivery=${needDelivery}`;
    }

    return this.get(url);
  }

  /**
   * 台灣城市列表
   */
  getCity(needDelivery?: boolean): Observable<ListRes<City>> {
    let url = '/api/web/customer/member/commonUsedAddr/city';

    // 如果 needDelivery 參數存在，則將其添加到 URL 中
    if (needDelivery !== undefined && needDelivery !== null) {
      url += `?needDelivery=${needDelivery}`;
    }

    return this.get(url);
  }

  /**
   * Update the password for the current user whose role is either buyer or account, but buyer just send email notice relative.
   * 變更密碼
   */
  changeMemberPassword(param: {
    recaptcha: string;
    reason: string;
  }): Observable<Response> {
    const url = '/api/web/customer/member/changePassword';
    return this.post(url, { body: param });
  }

  /**
   * Update the password for the current user whose role is admin.
   * 帳號管理員變更密碼
   */
  changeAdminPassword(param: {
    oldPassword: string;
    newPassword: string;
    recaptcha: string;
    reason: string;
  }): Observable<Response> {
    const url = '/api/web/customer/member/changeAdminPassword';
    return this.post(url, { body: param });
  }

  /**
   * Add address or delete address
   * 新增/失效申請 帳單及送貨地址
   */
  addrManage(param: {
    password: string;
    fullAddr: string;
    action: AddrAction;
  }): Observable<Response> {
    const url = '/api/web/customer/member/addrManage';
    return this.post(url, { body: param });
  }

  /**
   * Change current user default address
   * 設定預設結帳配送資訊
   */
  changeDefaultAddr(param: {
    defaultShipAddrId: number;
    defaultBillAddrId: number;
    defaultShipContact: number;
    defaultBillContact: number;
  }): Observable<Response> {
    const url = '/api/web/customer/member/addrManage/changeDefault';
    return this.patch(url, { body: param });
  }

  /**
   * Change member password
   * 變更密碼
   */
  changePassword(
    userId: number,
    param: Record<string, unknown>
  ): Observable<Response> {
    const url = `/api/web/customer/member/list/${userId}/changePassword`;
    return this.patch(url, { queryObject: param });
  }

  /**
   * Delete member
   * 刪除帳號
   */
  deleteAccount(userId: number): Observable<Response> {
    const url = `/api/web/customer/member/list/${userId}`;
    return this.delete(url);
  }

  /**
   * Address info
   * 配送地址
   */
  getAddrManage(): Observable<ResultRes<AddrManage>> {
    const url = '/api/web/customer/member/addrManage';
    return this.get(url);
  }

  /**
   * Edit member status
   * 變更帳號狀態
   */
  editMemberStatus(
    userId: number,
    param: Record<string, unknown>
  ): Observable<Response> {
    const url = `/api/web/customer/member/list/${userId}/edit`;
    return this.patch(url, { body: param });
  }

  /**
   * Change admin account
   * 申請變更
   */
  changeAdmin(param: {
    changeAccount: string;
    password: string;
  }): Observable<Response> {
    const url = '/api/web/customer/member/list/changeAdmin';
    return this.post(url, { body: param });
  }

  /**
   * Get a drop-down list of active user accounts that can replace the admin account
   * 可變更給哪個帳號的列表
   */
  getActiveUsers(): Observable<ResultRes<{ activeUsers: User[] }>> {
    const url = '/api/web/customer/member/list/activeUsers';
    return this.get(url);
  }

  /**
   * Add account
   * 新增帳號
   */
  addAcount(param: {
    role: string;
    userName: string;
    email: string;
    tel: string;
    mobile: string;
  }): Observable<Response> {
    const url = '/api/web/customer/member/list/addAccount';
    return this.post(url, { body: param });
  }

  /**
   * Get add account description
   * 帳號權限說明
   */
  getAddAcountInfo(): Observable<ResultRes<{ addAccountInfo: string }>> {
    const url = '/api/web/customer/member/list/addAccountInfo';
    return this.get(url);
  }

  /**
   * 帳號管理清單
   */
  getAccountList(): Observable<AccountListRes<Account[]>> {
    const url = '/api/web/customer/member/list';
    return this.get(url);
  }

  /**
   * Get customer account
   */
  getCustomerAccount(): Observable<ResultRes<CustomerAccount>> {
    const url = '/api/web/customer/member/customerAccount';
    return this.get(url);
  }

  /**
   * 新增我的追蹤
   */
  addWishList(itemId: number): Observable<Response> {
    const url = '/api/web/customer/member/wishlist';
    LOCAL_STORAGE_CACHE.Invalidate(LOCAL_STORAGE_CACHE.customerInfo);
    return this.post(url, {
      body: {
        itemId: itemId
      }
    }).pipe(
      tap(() => {
        this.addWishListSubject.next();
      })
    );
  }
  onWishlistAdd(): Observable<void> {
    return this.addWishListSubject.asObservable();
  }
  /**
 * 取得發票Pdf
 */


  getInvoiceFile(param: {
    invoiceFile: string;
  }, showDefaultErrorMessage?: boolean): Observable<Blob> {
    const url = '/api/web/customer/member/order/invoiceFile';
    return this.post(url, { body: { ...param }, responseType: 'blob' }, showDefaultErrorMessage); 
  }

  /**
   * Get customer account
   */
  getMemberInfo(dealerView?: string | null): Observable<ResultRes<MemberInfo>> {
    const cacheType = new CustomerInfoCache();
    const url = '/api/web/customer/member/info';

    if (!dealerView?.length)
      dealerView = '';

    return this.getCacheOrQuery(cacheType, url, {queryObject: {dealerView: dealerView}});
  }

  /*
  getInvoiceFile(param: { invoiceFile: string }): Observable<Blob> {
    const url = '/api/web/customer/member/order/invoiceFile';

    // 將 invoiceFile 放在 request 的主體中
    return this.post(url, { body: param });
  }
  */

  /**
* getTaxReference
* 經銷商是否存在確認
*/
  getTaxReference(taxReference: string): Observable<ResultRes<boolean>> {
    const url = `/api/web/customer/member/checkTaxReference/${taxReference}`;
    return this.get(url);
  }


  /**
 * Get Preorder info by purchaseNo
 * 預購訂單明細
 */
  getPreOrderInfo(purchaseNo: string, dealerView?: string | null): Observable<ResultRes<PreOrderDetail>> {
    const url = `/api/web/customer/member/order/preorder/${purchaseNo}`;
    return this.get(url, {queryObject: {dealerView: dealerView}});
  }

  /**
* Get Preorder List
* 預購訂單列表
*/
  getPreOrderList(param: {
    preorderStatus?: number;
    startDate?: string;
    endDate?: string;
    sortField?: null | string;
    sortOrder?: string;
    keyword?: string;
    page?: number;
    pageSize?: number;
    dealerView?: string | null;
  }):Observable<ResultRes<{
      data: any[];
      pagination: Pagination;
    }>>{
    const url = `/api/web/customer/member/order/preorder`;
    return this.get(url, { queryObject: param });
  }


  /**
* Get Preorder List
* 預購訂單匯出
*/
  getExportPreOrderList(param: {
    preorderStatus?: number;
    startDate?: string;
    endDate?: string;
    sortField?: null | string;
    sortOrder?: string;
    keyword?: string;
    page?: number;
    pageSize?: number;
    dealerView?: string | null;
  }): Observable<Blob> {
    const url = `/api/web/customer/member/order/preorder/export`;
    return this.get(url, { queryObject: { ...param }, responseType: 'blob' });
  }


    /**
   * CancelPreOrder
   * 取消訂單
   */
    cancelPreOrder(param: {
      purchaseNo: string;
      cancelReason: string;
    }): Observable<Response> {
      const url = '/api/web/customer/member/order/preorder/cancel';
      return this.post(url, { body: param });
    }

    /**
 * Get gethomepagePopup
 * 首頁彈窗 推播廣告
 */
  gethomepagePopup(param: {
    lastQueried?: string;

  }): Observable<ResultRes<homepagePopup>> {
    const url = `/api/web/customer/homepagePopup`;
    return this.get(url, { queryObject: param });
  }

    /**
 * Get gethomepagePopup
 * 首頁彈窗 推播廣告
 */
    gethomepagePopupAdLink(param: {
      adId: number;
      originalUrl: string;
      isExternal: boolean;
    }): Observable<ResultRes<adLink>> {
      const url = `/api/web/customer/homepagePopup/adLink`;
      return this.post(url, { body: param });
    }

 /**
 * Get getChat
 * 線上客服
 */
   getChat(param: {
    since?: string;
  }): Observable<ResultRes<Chat>> {
    const url = `/api/web/customer/Chat`;
    return this.get(url, { queryObject: param, noLoading: true});
  }

  updateChatReadTime(): Observable<Response> {
    const url = `/api/web/customer/Chat/updateRead`;
    return this.post(url, { noLoading: true });
  }
  /**
  * Post sendMessage
  * 線上客服使用者發送訊息
  */
   sendMessage(param: {
     content:string;
     since: string;
   }): Observable<ResultRes<Chat>> {
     const url = `/api/web/customer/Chat/text`;
     return this.post(url, { body: param, noLoading: true });
   }
   /**
   * Get getChat
  * 線上客服使用者傳送圖片
   */
     sendImage(param : FormData): Observable<ResultRes<Chat>> {
      const url = `/api/web/customer/Chat/img`;
      return this.post(url, { body: param, noLoading: true });
    }

   /**
 * Get getOrderLaw
 * 網路下單條款內容
 */
  getorderLaw(): Observable<ResultRes<any>> {
    const url = `/api/web/customer/member/orderLaw`;
    return this.get(url);
  }

  /**
   * Get Terms and Conditions
   * 內容管理 內容
   */
  getTermsAndConditions(type: number): Observable<ResultRes<any>> {
    const url = `/api/web/customer/member/termsAndConditions`;
    return this.get(url, { queryObject: { type } } );
  }

  //Add by Tako on 2025/02/11 For No.2024037103
  /**
   * Get personCustNo
   * 取得精技員工客戶編號
  */
  getPersonCustNo(): Observable<ResultRes<string>> {
    const url = '/api/web/customer/member/personCustNo';
    return this.get(url);
  }

}
