import { Timestamp } from 'rxjs';
import {
  DisplayArea,
  PromoCategory,
  PromoMethod,
  PromotionStatus,
  SubMethod
} from '../enums';
import { SubPromoInfo } from './product.model';
import { StorageCapacityUnitEnum } from 'src/app/enums/storage.enum';

export interface PromoInfo {
  id: number;
  name: string;
  remark: string;
  promoCategory: PromoCategory;
  displayArea: DisplayArea;
  promoMethod: PromoMethod;
  status: PromotionStatus;
  startDate: string;
  endDate: string;
  discConditionAmount: number | null;
  discConditionQty: number | null;
  discConditionMultiple: number;
  mainItemQty: number | null;
  isLimitQty: boolean;
  price: number;
  priceWithTax?: number;
  prodImg: string[];
  listLineId: string;
  promoString?: string;
  subPromoInfo: SubPromoInfo[];
  storageCount: number;
  subMethod?: SubMethod;
  unitPrice?: number;
  promoPrice?: number;
  canBuyMultipleTypesOfAdditionalItems?: boolean;
  mainAndAdditionalRatio?: number;
  products: any;
  productsOfGift: any;

  shippingDaysCount: number;
  shippingStartDate: string;
  shippingEndDate: string;
  softLimit: number;

  shippingDate: string;
  daysUntilPreorderCloses: Timestamp<string>;

  bulkGradeSettings: {
    level: number;
    minQuantity: number;
    maxQuantity: number;
    promoPrice: number;
  }[];

  seagateItems: SubItem[];
  synologyItems: SubItem[];
  toshibaItems: SubItem[];
  westernDigitalItems: SubItem[];
  promoIdToAdditionalBlocks: {
    promoId: number;
    additionalBlockIds: number[];
  }[];
  additionalBlocks: {
    id: number;
    canPurchaseDifferentItem: boolean;
    mainAndAdditionalRatio: number;
    promoCapacity: number;
    products: any[];
  }[];
  synologyComboBrandNameToSubItems: { [key: string]: ComboBrandSubItem[] };
  isInMarketTimeRange?:boolean;
  marketTimeRange?:string;
  marketType?:number;
  purchaseLimitString?: string;
  purchaseLimit?: number;
  subInventoryBuyCount?: {
    key: string;
    value: number;
  }[];
}

export interface ComboBrandSubItem extends SubItem {
  brandId: number;
  brandName: string;
  synologyBrandSortOrder: number;
  useOverridePromoPriceText: boolean;
  overridePromoPriceText: null | string;
}

export interface SubItem {
  segment3: string;
  unitPrice: number;
  promoPrice: number | undefined;
  itemNumber: string;
  itemSubNumber: string;
  itemName: string;
  segment5: string;
  discMethod: null;
  discValue: number;
  isComboSubItem: boolean;
  itemId: number;
  newPrice: null;
  active: null;
  storageCapacity: number;
  storageCapacityUnit: StorageCapacityUnitEnum;
  storageCount: number;
  synologySubItemType: number;
}
