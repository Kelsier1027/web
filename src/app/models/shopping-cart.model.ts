
export interface GuessYouLike {
  itemId: string;
  itemNumber: string;
  itemName: string;
  description: string;
  prodImg: string[];
  unitPrice: number;
  priceWithTax: number;
  isHot: boolean;
  isLimit: boolean;
  productDisplayStatus: string;
  productTag: string;
  promoInfos: any[]; // 此處
}
export interface shoppingListItems {
  shoppingListItemId: number;
  quantity: number;
}
