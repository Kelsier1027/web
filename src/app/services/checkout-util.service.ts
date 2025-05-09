import { Injectable } from '@angular/core';
import { GuessYouLike } from "../models/shopping-cart.model";

@Injectable()
export class CheckoutUtilService {

  constructor() { }

  flatSelectedPurchaseItemIds(data: any[][] | undefined, checkSelected: boolean = true): number[] {
    if (!data) return [];

    const selectedPurchaseItemIds: number[] = [];
    for (const itemList of data) {
      // 主促銷有勾
      let selected = false;
      for (const item of itemList) {
        if (checkSelected) {
          if (item.selected) {
            selected = true;
          }
        } else {
          selected = true;
        }
      }

      // 主促銷有勾，其他促銷也要一起帶
      if (selected) {
        for (const item of itemList) {
          if(item.purchaseItemId != null) {
            selectedPurchaseItemIds.push(item.purchaseItemId);
          }
        }
      }
    }

    return selectedPurchaseItemIds;
  }

  public sharedMapper = (e: any) => {
    return {
      itemId: e.itemId,
      itemNumber: e.itemNumber,
      itemName: e.itemName,
      description: e.description,
      prodImg: e.prodImg,
      unitPrice: e.unitPrice,
      priceWithTax: e.priceWithTax,
      isHot: e.isHot,
      isLimit: e.isLimit,
      productDisplayStatus: e.productDisplayStatus,
      productTag: e.productTag,
      promoInfos: e.promoInfos?.map((info: any) => {
        return {
          promoString: e.promoString,
          id: e.id,
          name: e.name,
          remark: e.remark,
          promoCategory: e.promoCategory,
          displayArea: e.displayArea,
          promoMethod: info.promoMethod,
          subMethod: info.subMethod,
          marketType: e.marketType,
          status: e.status,
          startDate: e.startDate,
          endDate: e.endDate,
          discConditionQty: e.discConditionQty,
          discConditionMultiple: e.discConditionMultiple,
          isLimitQty: e.isLimitQty,
          price: e.price,
          listLineId: e.listLineId
        };
      })
    } as GuessYouLike;
  };
}
