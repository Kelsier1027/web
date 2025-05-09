import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { HttpDefaultOptions, Response } from "../core/model";
import { Router } from "@angular/router";
import { StorageService } from "../core/services/storage.service";
import { NotifierService } from "../shared/services";
import { ErrorServiceService } from "../core/services/error-service.service";
import { Observable, of } from "rxjs";
import { FilterForm, ResultRes } from "../models";
import { ValidateCheckout } from 'src/app/models/checkout.model';
import { LOCAL_STORAGE_CACHE } from '../shared/utils/localStorageCacheUtilities';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService extends ErrorServiceService{

  constructor(
    http: HttpClient,
    options: HttpDefaultOptions,
    router: Router,
    storage: StorageService,
    notifier: NotifierService
  ) {
    super(http, options, router, storage, notifier);
  }

  validateCheckout(validateCheckout: ValidateCheckout): Observable<Response> {
    const url = '/api/web/customer/checkout/validate';
    return this.post(url, {
      body: {...validateCheckout},
    });
  }

  /** 取得結帳用的明細頁面 */
  getCheckout(purchaseId: {
    purchaseId: number;
    purchaseItemIds: number[]; }): Observable<ResultRes<{
    purchaseId: number;
    purchaseNo: string;
    deliveryFee: number;
    deliveryFeeExemptedThreshold: number;
    specifiedDeliveryFee: number;
    specifiedDeliveryFeeExemptedThreshold: number;
    bonusPoints: number;
    usableBonusPoints: number;
    rewards: string[];
    subInventory: {
      code: string;
      chineseName: string;
      count: number;
      productBatches: any[];
    };
    addressesAndContacts: {
      defaultAddr: {
        defaultShipAddrId: number;
        defaultBillAddrId: number;
        defaultShipContact: number;
        defaultBillContact: number;
        companyDefaultShipAddrId: number;
        companyDefaultBillAddrId: number;
      };
      /** 送貨地址 */
      shipAddrList: {
        id: number;
        fullAddr: string;
        status: number;
        isQualifiedForNightlyDelivery: boolean;
        isQualifiedForSaturdayDelivery: boolean;
        isQualifiedForDesignatedDelivery: boolean;
      }[];
      billAddrList: {
        id: number;
        fullAddr: string;
        status: number;
        isQualifiedForNightlyDelivery: boolean;
        isQualifiedForSaturdayDelivery: boolean;
        isQualifiedForDesignatedDelivery: boolean;
      }[];
      shipAddrApplyList: {
        id: number;
        fullAddr: string;
        status: number;
        isQualifiedForNightlyDelivery: boolean;
        isQualifiedForSaturdayDelivery: boolean;
        isQualifiedForDesignatedDelivery: boolean;
      }[];
      billAddrApplyList: {
        id: number;
        fullAddr: string;
        status: number;
        isQualifiedForNightlyDelivery: boolean;
        isQualifiedForSaturdayDelivery: boolean;
        isQualifiedForDesignatedDelivery: boolean;
      }[];
      shipContactList: {
        id: number;
        name: string;
        jobTitle: string;
        phone: string;
        email: string;
      }[];
      billContactList: {
        id: number;
        name: string;
        jobTitle: string;
        phone: string;
        email: string;
      }[];
    };
    commonlyUsedAddr: any[];
    hasPurchaserRemarks:boolean;
    latestPurchaserRemark:any[];
    purchaserJobTitle: string;
    purchaserName: string;
    purchaserEmail: string;
    saturdayDeliveryDate: string;
    purchaserRemarks: any[];
    isQualifiedForCloudInvoice: boolean;
    isQualifiedForNightlyDelivery: boolean;
    isQualifiedForSaturdayDelivery: boolean;
    isQualifiedForDesignatedDelivery: boolean;
    awards: any[];
    defaultBarcode: string | null;
    canUseBonus: boolean;
  }>> {
    const url = `/api/web/customer/checkout/detail`;
    return this.post(url, {
      body: {
        ...purchaseId,
      }
    });
  }

  getDelivery(): Observable<ResultRes< { result: { 
    availabilities: {
      isQualifiedForSaturdayDelivery: boolean,
      isQualifiedForNightlyDelivery: boolean,
      isQualifiedForDesignatedDelivery: boolean,
    }
  }}>> {
    const url = '/api/web/customer/checkout/deliveries';
    return this.get(url)
  }

  createOrder(purchaseData: {
    purchaseId: number;
    purchaseItemIds: number[];
    shipAddressId: number;
    invoiceAddressId: number;
    shipContactId: number;
    shipContactPhone: string;
    invoiceContactId: number;
    customerPoNumber: string;
    purchaserRemarkId: number;
    purchaserRemarkTitle: string | null;
    purchaserRemark: string;
    email: string;
    shippingMethod: number;
    useBonusPoint: number;
    lastSeenBonusPoints: number;
    loveCode: string;
    carrierId: string;
    citizenPersonalCertificate: string;
    invoiceType: string;
  }, mock: any | null = null): Observable<ResultRes<{ result: { purchaseItemId: string } }>> {
    const url = '/api/web/customer/checkout/createOrder';
    if (mock) {
      return of<ResultRes<{ result: { purchaseItemId: string } }>>(mock);
    }
    LOCAL_STORAGE_CACHE.Invalidate(LOCAL_STORAGE_CACHE.customerInfo);
    return this.post(url, {
      body: {
        ...purchaseData,
      }
    });
  }

  createGroupOrder(purchaseData: {
    addToCart: {
      itemId: number,
      promoId: number,
      orderQuantity: number,
      subInventoryCode: string,
    },
    shipAddressId: number,
    invoiceAddressId: number,
    shipContactId: number,
    shipContactPhone: string | null,
    invoiceContactId: number,
    customerPoNumber: string | null,
    purchaserRemarkId: number | null,
    purchaserRemarkTitle: string | null,
    purchaserRemark: string | null,
    email: string | null,
    shippingMethod: number,
    commonlyUsedAddr: {
      addrName: string,
      fullAddr: string,
      addrCity: string,
      addrCityArea: string,
      addrZipCode: string,
      addr: string,
      receiver: string,
      contactNo: string,
      phoneNo: string,
    } | undefined;
  }): Observable<ResultRes<{ result: {
    purchaseNo: string,
    sentToEmail: string,
    groupBuyCurrentCount: number,
    groupBuyTargetCount: number,
    shippingStartDate: string,
    shippingEndDate: string,
  } }>> {
    const url = '/api/web/product/groupBuy/checkout';
    LOCAL_STORAGE_CACHE.Invalidate(LOCAL_STORAGE_CACHE.customerInfo);
    return this.post(url, {
      body: {
        ...purchaseData,
      }
    })
  }

  createNotify(purchaseId: {
    purchaseId: number,
    purchaseItems: number[],
    notifyType: number,
    subTotal: number,
    freightCharge: number,
    tax: number,
    total: number,
    giftListId?: number[]
  }): Observable<Response> {
    const url = '/api/web/product/shoppingList/notify';
    return this.post(url, {
      body: {
        ...purchaseId
      }
    });
  }
}
