import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { HttpDefaultOptions } from "../core/model";
import { Router } from "@angular/router";
import { StorageService } from "../core/services/storage.service";
import { NotifierService } from "../shared/services";
import { AddToCartReplaceItem, DetailRes, FilterForm, ListRes, ResultRes } from "../models";
import { Observable } from "rxjs";
import { ErrorServiceService } from "../core/services/error-service.service";
import { LOCAL_STORAGE_CACHE } from '../shared/utils/localStorageCacheUtilities';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService extends ErrorServiceService {

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
   * 取得猜你喜歡與推薦商品
   */
  getExtraProducts(param: FilterForm): Observable<ResultRes<any> | []> {
    const url = '/api/web/product/ShoppingList/GetExtraProducts';
    return this.get(url, { body: { ...param } });
  }

  /**
   *  取得目前登入用戶的 30 天內的暫存採購清單列表
   */
  getLists(): Observable<ResultRes<any>> {
    const url = '/api/web/product/ShoppingList/GetLists';
    return this.get(url);
  }

  /**
   * 取得指定 ID 的採購單內容。若採購單不屬於目前使用者，拋錯
   */
  getSingle(id: string): Observable<ResultRes<any>> {
    const url = '/api/web/product/ShoppingList/Get';
    LOCAL_STORAGE_CACHE.Invalidate(LOCAL_STORAGE_CACHE.customerInfo);
    return this.get(`${url}/${id}`);
  }

  /**
   * 取得指定採購單 ID 的結帳加購專區。
   */
    getAdditionals(id: string): Observable<ResultRes<any>> {
      const url = '/api/web/product/ShoppingList/' + id + '/additional';
      return this.get(`${url}`);
  }

  /** 從購物車刪除指定的購物清單明細資料 ID。當有其他商品的主商品為它時，一併刪除。*/
  removeSingleFromCart(shoppingListId: number, shoppingListItemId: number): Observable<ResultRes<any>> {
    const url = '/api/web/product/product/removeFromCart';
    LOCAL_STORAGE_CACHE.Invalidate(LOCAL_STORAGE_CACHE.customerInfo);
    return this.post(url, {
      body: {
        shoppingListId: shoppingListId,
        shoppingListItemIds: [shoppingListItemId]
      }
    });
  }
  /** 從購物車刪除指定的購物清單明細資料 ID。當有其他商品的主商品為它時，一併刪除。*/
  removeFromCart(shoppingListId: number, shoppingListItemIds: number[]): Observable<ResultRes<any>> {
    const url = '/api/web/product/product/removeFromCart';
    LOCAL_STORAGE_CACHE.Invalidate(LOCAL_STORAGE_CACHE.customerInfo);
    return this.post(url, {
      body: {
        shoppingListId: shoppingListId,
        shoppingListItemIds: shoppingListItemIds
      }
    }); 
  }
  /** 更新購物車中商品的數量。 */
  updateCart(shoppingListId: number, shoppingListItems: {
    purchaseItemId: number,
    quantity: number,
  }[]): Observable<ResultRes<any>> {
    const url = '/api/web/product/product/updateCart';
    LOCAL_STORAGE_CACHE.Invalidate(LOCAL_STORAGE_CACHE.customerInfo);
    return this.post(url, {
      body: {
        shoppingListId: shoppingListId,
        shoppingListItemIdToQuantity: shoppingListItems
      }
    });
  }

  deleteAllShoppingList(id: number) {
    const url = `/api/web/product/ShoppingList/Delete/${id}`;
    LOCAL_STORAGE_CACHE.Invalidate(LOCAL_STORAGE_CACHE.customerInfo);
    return this.delete(url);
  }

  replaceItem(selectedItemIds: number[], itemToReplace: AddToCartReplaceItem): Observable<ResultRes<any>> {
    const url = `/api/web/product/ShoppingList/replace`;
    return this.post(url, {body: {
      selectedItemIds: selectedItemIds, 
      itemToReplace: itemToReplace
    }});
  }

  notifyPayment(purchaseNo: string): Observable<ResultRes<any>> {
    const url = `/api/web/customer/checkout/notifyPayment`;
    return this.post(url, {body: {
      purchaseNo: purchaseNo
    }});
  }
}
