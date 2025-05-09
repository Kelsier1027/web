import { PromoInfo } from '.';
import {
  AccessoryType,
  ProductDisplayStatus,
  ProductTag,
  SoldOutPlan,
} from '../enums';
import { StorageCapacityUnitEnum } from '../enums/storage.enum';

export interface Menu {
  type1List: Type1List[];
}

export interface Type1List {
  id: number;
  name: string;
  type2List: Type2List[];
  isWelfare?: boolean;
}

export interface Type2List {
  id: number;
  name: string;
  brandList: BrandList[];
  prodImg: string;
}

export interface BrandList {
  id: number;
  name: string;
}

export interface FilterData {
  brands: Brand[];
  defaultFilters: DefaultFilter[];
  subInventory: string[];
}

export interface Brand {
  brandId: number;
  brandName: string;
  filters: Filter[];
  selected?: boolean;
}
export interface MainType{
  type1Id:number | null;
  type1Name:string;
  type2Filters:SubType[]
}
export interface SubType{
  type2Id:number | null;
  type2Name:string;
}
export interface FilterForm {
  filterId?: number;
  filterName?: string;
  type1?: number | null;
  type2?: number | null;
  brandList?: any[];
  filters?: any[];
  keyword?: null | string;
  activity?: any;
  subInventory?: any;
  lowestPrice?: null | number;
  highestPrice?: null | number;
  sortField?: null | string;
  sortOrder?: string;
  page?: number;
  pageSize?: number;
  brandId?: number;
  brandName?: string;
  brandNameList?: string[];
  isUnitPrice?: boolean;
  filterDescription?: string;
  isWelfare?: boolean;
  specialEventId?: number;
  itemIds?: number[];
  showPeriodPromotion?: boolean;
  ignoreWelfareOrNot?: boolean;
  dealerView?: string | null;
}

export interface Filter {
  id: number;
  name: string;
  index: number;
  spDatas: { [index: number]: SpData };
}

export interface SpData {
  spId: number;
  typeName: string;
  index: number;
}

export interface DefaultFilter {
  id: number;
  name: string;
  spDatas: { [index: number]: SpData };
}

export interface HomePageProduct {
  itemId: number;
  itemNumber: string;
  itemName: string;
  description: string;
  prodImg: string;
  unitPrice: number;
  priceWithTax: number;
  isHot: boolean;
  isLimit: boolean;
  productDisplayStatus: ProductDisplayStatus;
  productTag: ProductTag;
  promoInfos: PromoInfo[];
}

export interface ProductSpec {
  name: string;
  description: string;
}

export interface SubInventory {
  subinventoryName: string;
  subinventoryCode: string;
  productDisplayStatus: number;
  qty: number;
  maxBuyCount: number;
  minBuyCount: number;
}

export interface Accessory {
  id: number;
  itemId: number;
  orgId: number;
  accessoryType: AccessoryType;
  accessoryItemId: number;
  accessorySeg: string;
  accessorySubSeg: string;
  accessoryName: string;
  type: string;
  quantity: number;
  soldOutPlan: SoldOutPlan;
  replaceAccessory?: Accessory;
  replaceStartDate: string;
  availableQty: number;
  prodImg: string;
  description: string;
}

export interface ProductDetail {
  iorderDescription: string;
  itemId: number;
  itemNumber: string;
  itemName: string;
  description: string;
  prodImg: string[];
  accessoryName: string[];
  accessories: Accessory[];
  comboAccessories: Accessory[];
  unitPrice: number;
  priceWithTax: number;
  promoInfos: SubPromoInfo[];
  favorite: boolean;
  isLimit: boolean;
  productDisplayStatus: ProductDisplayStatus;
  subInventory: SubInventory[];
  detailUrl: string;
  productSpecs: ProductSpec[];
  warranty: string;
  recommended: HomePageProduct[];
  guessYouLike: HomePageProduct[];
  subPromoInfos: SubPromoInfo[];
  minBuyCount: number | null;
  brandOptions: { name: string; selected: boolean }[];
  capacityOptions:
      { name: string;
        selected: boolean;
        storageCapacity: number;
        storageCapacityUnit: StorageCapacityUnitEnum;
      }[];
  productNumberOptions: { name: string; selected: boolean }[];
  type1Id: number;
  type1Name: string;
  type2Id: number;
  type2Name: string;
  brandId: number;
  brandName: string;
  bindingProductAttachedPromoInfos: PromoInfo[];
  productTag?: string;
  promoIdToAdditionalBlocks: any[];
  additionalBlocks: any[];
  awardActivities?: any[];
  isTracedByUser: boolean;
  hasMoreCustomPromos?: boolean;
  customPromos: any[];
}
export interface SubPromoInfo extends PromoInfo {
  products: null | any[];
  promoString?: string;
}

export interface ViewFilter {
  id: number;
  name: string;
  spDatas: SpData[];
}

export interface Sales {
  empName: string;
  tel: string;
  skype: string;
  line: string;
  mail: string;
}

export interface AddToCartGift {
  uniqueId: string;
  itemId: number;
  listLineId: string;
  qty: number;
  promoId: number;
  soldOutPlan: number;
  storageCount: number;
}

export interface AddToCartAccessory {
  uniqueId: string;
  itemId: number;
  listLineId: string;
  qty: number;
  soldOutPlan: number;
}

export interface AddToCartReplaceItem {
  itemId: number;
  uniqueId: string;
  mainItemId: number;
  mainItemImg: string;
  mainItemName: string;
  mainQty: number;
  replaceItemId: number;
  replaceItemImg: string;
  replaceItemName: string;
  replaceQty: number;
  purchaseItemId?: number;
}

export interface ArrivalNotice {
  defaultReply: string;
  hasDefaultReply :boolean;
  subinventoryList: [
    {
      subinventoryName: string;
      subinventoryCode: string;
      qty: number;
      iorderQty: number;
      minCount: number;
    }
  ];
  mailList: [
    {
      mailString: string;
      mail: string;
    }
  ];
  userMail: string;
}

export interface PromoReq {
  promoId: number;
  page: number;
  pageSize: number;
  type1Id: number;
  type2Id: number;
  brandId: number;
  subInventoryNames: string;
  priceMin: number;
  priceMax: number;
}

export interface SubInventoryBuyCount {
  key: string;
  value: number;
}

export interface Product2 {
  itemId: number;
  itemNumber: string;
  itemSubNumber: string;
  itemName: string;
  description: string;
  prodImg: string;
  unitPrice: number;
  productType: string;
  priceWithTax: number;
  isHot: boolean;
  isLimit: boolean;
  productDisplayStatus: number;
  productTag: string;
  promoInfos: PromoInfo2[];
  subinventory: SubInventory[];
  favorite: boolean;
}

export interface PromoInfo2 {
  promoString: string;
  id: number;
  name: string;
  remark: string;
  promoCategory: number;
  displayArea: number;
  promoMethod: number;
  subMethod: number;
  marketType: number;
  status: number;
  startDate: string;
  endDate: string;
  discConditionQty: number;
  discConditionMultiple: number;
  isLimitQty: boolean;
  price: number;
  listLineId: string;
  products: Product2[];
  subPromoInfo: SubPromoInfo2[];
  homePageDisplayItemId: number;
  carouselDisplayItemId: number;
  lastUpdateTime: string;
  bulkGradeSettings: BulkGradeSetting[];
  mainAndAdditionalRatio: number;
  canBuyMultipleTypesOfAdditionalItems: boolean;
  synologyItems: SynologyItem[];
  seagateItems: SeagateItem[];
  westernDigitalItems: WesternDigitalItem[];
  toshibaItems: ToshibaItem[];
}

export interface SubPromoInfo2 {
  id: number;
  promoString: string;
  name: string;
  promoCategory: number;
  marketType: number;
  displayArea: number;
  promoMethod: number;
  subMethod: number;
  status: number;
  startDate: string;
  endDate: string;
  products: Product2[];
  listLineId: string;
  unitPrice: number;
  price: number;
  priceWithTax: number;
  prodImg: string;
  lastUpdateTime: string;
  bulkGradeSettings: BulkGradeSetting[];
  mainAndAdditionalRatio: number;
  canBuyMultipleTypesOfAdditionalItems: boolean;
  synologyItems: SynologyItem[];
  seagateItems: SeagateItem[];
  westernDigitalItems: WesternDigitalItem[];
  toshibaItems: ToshibaItem[];
}

export interface BulkGradeSetting {
  itemId: number;
  minQuantity: number;
  discValue: number;
  promoPrice: number;
  level: number;
  maxQuantity: number;
}

export interface SynologyItem {
  itemId: number;
  newPrice: number;
  active: boolean;
  isComboSubItem: boolean;
  storageCapacity: number;
  storageCapacityUnit: number;
  storageCount: number;
  synologySubItemType: number;
  segment3: string;
  unitPrice: number;
  itemNumber: string;
  itemSubNumber: string;
  itemName: string;
  segment5: string;
  discMethod: number;
  discValue: number;
}

export interface SeagateItem {
  itemId: number;
  newPrice: number;
  active: boolean;
  isComboSubItem: boolean;
  storageCapacity: number;
  storageCapacityUnit: number;
  storageCount: number;
  synologySubItemType: number;
  segment3: string;
  unitPrice: number;
  itemNumber: string;
  itemSubNumber: string;
  itemName: string;
  segment5: string;
  discMethod: number;
  discValue: number;
}

export interface WesternDigitalItem {
  itemId: number;
  newPrice: number;
  active: boolean;
  isComboSubItem: boolean;
  storageCapacity: number;
  storageCapacityUnit: number;
  storageCount: number;
  synologySubItemType: number;
  segment3: string;
  unitPrice: number;
  itemNumber: string;
  itemSubNumber: string;
  itemName: string;
  segment5: string;
  discMethod: number;
  discValue: number;
}

export interface ToshibaItem {
  itemId: number;
  newPrice: number;
  active: boolean;
  isComboSubItem: boolean;
  storageCapacity: number;
  storageCapacityUnit: number;
  storageCount: number;
  synologySubItemType: number;
  segment3: string;
  unitPrice: number;
  itemNumber: string;
  itemSubNumber: string;
  itemName: string;
  segment5: string;
  discMethod: number;
  discValue: number;
}

export interface SubInventory {
  subinventoryName: string;
  subinventoryCode: string;
  qty: number;
  iorderQty: number;
  minCount: number;
}

export interface FlashSalesAdvertise {
  flashSalesAdvertiseList: Product[];
  flashSalesMenu: FlashSalesMenu[];
  flashSalesList: Product2[];
}

export interface FlashSalesAdvertise2 {
  itemId: number;
  itemName: string;
  description: string;
  priceWithTax: number;
  unitPrice: number;
  prodImg: string;
}

export interface FlashSalesMenu {
  promoId: number;
  date: string;
  endDate: string;
}

export interface RootObject {
  rootObject: FlashSalesAdvertise[];
}

export interface Product {
  name: string;
  promoId: number;
  itemId: number;
  itemName: string;
  itemNumber: string;
  brandName : string;
  description: string;
  unitPrice: string;
  priceWithTax: string;
  promoPrice: string;
  prodImg: string[];
  subInventoryBuyCount: [
    {
      key: string;
      value: number;
    }
  ];
  useOverridePromoPriceText: boolean;
  overridePromoPriceText: string;
}

export interface ClearanceSaleListReq {
  page: number;
  pageSize: number;
}

export interface ClearanceSaleReq {
  type1Id: number;
  type2Id: number;
  brandId: number;
  subInventoryNames: string;
  priceMin: number;
  priceMax: number;
}

export interface ClearanceSaleItem {
  itemId: number;
  itemNumber: string;
  itemSubNumber: string;
  itemName: string;
  description: string;
  prodImg: string;
  unitPrice: number;
  productType: string;
  priceWithTax: number;
  isHot: boolean;
  isLimit: boolean;
  productDisplayStatus: number;
  productTag: string;
  promoInfos: PromoInfo3[];
  subinventory: SubInventory[];
  promoMethods: number[];
  firstPromoPrice: number;
  favorite: boolean;
}

export interface PromoHomeItem {
  promoId: number;
  promoName: string;
  remark: string;
  endDate: string;
  prodImg: string;
  promoString: string;
}
export interface SubInventory {
  subinventoryName: string;
  subinventoryCode: string;
  qty: number;
  iorderQty: number;
  minCount: number;
}

export interface ClearanceSaleList {
  clearanceSaleAdvertiseList: ClearanceSaleItem[];
  clearanceSaleList: ClearanceSaleItem[];
}

export interface PromoInfo3 {
  promoString: string;
  id: number;
  name: string;
  remark: string;
  promoCategory: number;
  displayArea: number;
  promoMethod: number;
  subMethod: number;
  marketType: number;
  status: number;
  startDate: Date;
  endDate: Date;
  discConditionQty: number;
  discConditionMultiple: number;
  isLimitQty: boolean;
  listLineId: string;
  products: Product3[];
  subPromoInfo: PromoInfo3[];
  unitPrice: number;
  price: number;
  priceWithTax: number;
  prodImg: string;
  lastUpdateTime: Date;
  bulkGradeSettings: BulkGradeSetting[];
  mainAndAdditionalRatio: number;
  canBuyMultipleTypesOfAdditionalItems: boolean;
  synologyItems: SynologyItem[];
  seagateItems: SeagateItem[];
  westernDigitalItems: WesternDigitalItem[];
  toshibaItems: ToshibaItem[];
}

export interface Product3 {
  orgId: number;
  itemId: number;
  itemNumber: string;
  unitPrice: number;
  itemSeg: string;
  itemSubNumber: string;
  itemName: string;
  segment5: string;
  segment3: string;
  type1Id: number;
  type1Name: string;
  type2Id: number;
  type2Name: string;
  type3Id: number;
  brandId: number;
  brandName: string;
  segment3Name: string;
  grossMargin: number;
  productType: string;
  description: string;
  prodImg: string[];
  cargoStatus: boolean;
  itemType: string;
  itemKeep: string;
  promoPrice: number;
  newPrice: number;
  importNewPrice: number;
  isComboSubItem: boolean;
  subInventoryBuyCount: SubInventoryBuyCount[];
}

export interface ClearanceSaleList {
  clearanceSaleAdvertiseList: ClearanceSaleItem[];
  clearanceSaleList: ClearanceSaleItem[];
}

export interface BonusPoint {
  active: number;
  inActive: number;
  used: number;
  expireSoon: number;
  expireSoonList: BonusExpireSoonItem[];
}

export interface BonusItem {
  creationDate: string;
  origSysDocumentRef: string;
  bonusName: string;
  bonusPointResult: string;
  orderNumber: number;
  transactionQty: number;
  usedQty: number;
  bonusStatus: number;
  releaseDate: string;
  effectiveDate: string;
}

export interface BonusExpireSoonItem {
  expireDate: string;
  expireQuantity: number;
}

export interface BonusListReq {
  status: number;
  releaseDate: string;
  effectiveDate: string;
  keyword: string;
  sortField: string;
  sortOrder: string;
  page: number;
  pageSize: number;
  dealerView?: string | null;
}

export interface AwardActivityList {
  promoteId: string;
  reward: string;
  //#region 精技新增 Add by Kelsier at 2024 / 11 /07 for No.2024035201
  rewardThis: string;
  //#endregion 精技新增 Add by Kelsier at 2024/11/07 for No.2024035201
  rewardType: string;
  rewardActivityName: string;
  rewardActivityDate: string;
  achievementProgress: number;
  achievementDescription: string;
  progress: string;
  endDate: string;
  detailUrl: string;
}

export interface AwardActivityDetailList {
  status: string;
  rewardActivityDate: string;
  rewardActivityName: string;
  promoteId: string;
  detailUrl: string;
}

export interface PeriodSale {
  name: string;
  periodSaleProducts: PeriodSaleProduct[];
}

export interface PeriodSaleProduct {
  itemId: number;
  itemNumber: string;
  itemSubNumber: string;
  itemName: string;
  description: string;
  prodImg: string;
  unitPrice: number;
  productType: string;
  priceWithTax: number;
  isHot: boolean;
  isLimit: boolean;
  productDisplayStatus: number;
  productTag: string;
  promoInfos: PromoInfo4[];
  firstPromoPrice: number;
}

export interface PromoInfo4 {
  promoString: string;
  id: number;
  name: string;
  remark: string;
  promoCategory: number;
  displayArea: number;
  promoMethod: number;
  subMethod: number;
  marketType: number;
  status: number;
  startDate: string;
  endDate: string;
  discConditionQty: number;
  discConditionMultiple: number;
  isLimitQty: boolean;
  price: number;
  listLineId: string;
  products: Product3[];
  subPromoInfo: SubPromoInfo3[];
  unitPrice: number;
  priceWithTax: number;
  prodImg: string;
  lastUpdateTime: string;
  gifts: Gifts;
  bulkGradeSettings: BulkGradeSetting[];
  mainAndAdditionalRatio: number;
  canBuyMultipleTypesOfAdditionalItems: boolean;
  synologyItems: SynologyItem[];
  seagateItems: SeagateItem[];
  westernDigitalItems: WesternDigitalItem[];
  toshibaItems: ToshibaItem[];
}

export interface Product3 {
  orgId: number;
  itemId: number;
  itemNumber: string;
  unitPrice: number;
  itemSeg: string;
  itemSubNumber: string;
  itemName: string;
  segment5: string;
  segment3: string;
  type1Id: number;
  type1Name: string;
  type2Id: number;
  type2Name: string;
  type3Id: number;
  brandId: number;
  brandName: string;
  segment3Name: string;
  grossMargin: number;
  productType: string;
  description: string;
  prodImg: string[];
  cargoStatus: boolean;
  itemType: string;
  itemKeep: string;
  promoPrice: number;
  newPrice: number;
  importNewPrice: number;
  isComboSubItem: boolean;
  subInventoryBuyCount: SubInventoryBuyCount[];
}

export interface SubInventoryBuyCount {
  key: string;
  value: number;
}

export interface SubPromoInfo3 {
  id: number;
  promoString: string;
  name: string;
  promoCategory: number;
  marketType: number;
  displayArea: number;
  remark: string;
  promoMethod: number;
  subMethod: number;
  status: number;
  startDate: string;
  endDate: string;
  products: Product3[];
  listLineId: string;
  unitPrice: number;
  price: number;
  priceWithTax: number;
  prodImg: string;
  lastUpdateTime: string;
}

export interface Gifts {
  additionalProp1: number;
  additionalProp2: number;
  additionalProp3: number;
}

export interface BulkGradeSetting {
  itemId: number;
  minQuantity: number;
  discValue: number;
  promoPrice: number;
  level: number;
  maxQuantity: number;
}

export interface SynologyItem {
  itemId: number;
  newPrice: number;
  active: boolean;
  isComboSubItem: boolean;
  storageCapacity: number;
  storageCapacityUnit: number;
  storageCount: number;
  synologySubItemType: number;
  segment3: string;
  unitPrice: number;
  itemNumber: string;
  itemSubNumber: string;
  itemName: string;
  segment5: string;
  discMethod: number;
  discValue: number;
}

export interface SeagateItem {
  itemId: number;
  newPrice: number;
  active: boolean;
  isComboSubItem: boolean;
  storageCapacity: number;
  storageCapacityUnit: number;
  storageCount: number;
  synologySubItemType: number;
  segment3: string;
  unitPrice: number;
  itemNumber: string;
  itemSubNumber: string;
  itemName: string;
  segment5: string;
  discMethod: number;
  discValue: number;
}

export interface WesternDigitalItem {
  itemId: number;
  newPrice: number;
  active: boolean;
  isComboSubItem: boolean;
  storageCapacity: number;
  storageCapacityUnit: number;
  storageCount: number;
  synologySubItemType: number;
  segment3: string;
  unitPrice: number;
  itemNumber: string;
  itemSubNumber: string;
  itemName: string;
  segment5: string;
  discMethod: number;
  discValue: number;
}

export interface ToshibaItem {
  itemId: number;
  newPrice: number;
  active: boolean;
  isComboSubItem: boolean;
  storageCapacity: number;
  storageCapacityUnit: number;
  storageCount: number;
  synologySubItemType: number;
  segment3: string;
  unitPrice: number;
  itemNumber: string;
  itemSubNumber: string;
  itemName: string;
  segment5: string;
  discMethod: number;
  discValue: number;
}
export interface Banner {
  imageUrlForPc: string;
  imageUrlForMobile: string;
  name: string;
  relatedUrl: string;
  type: number;
  // （首頁橫幅廣告用）橫幅廣告 ID
  bannerAdId?: number | null;
  // （首頁橫幅廣告用）預設圖 ID
  defaultAdId?: number | null;
  // （商品列表橫幅廣告用）商品列表廣告 ID
  adId?: number | null;
}

export interface HomePageBannersList {
  topBanners: Banner[];
  middleOptionalPurchaseBanners: Banner[];
  middlePeriodBanners: Banner[];
  bottomBanners: Banner[];
}
export interface ProductListPageBannersList {
  banners: Banner[];
}

export interface CustomHomePageBannersList {
  topBanners: Banner[];
  middleOptionalPurchaseBanners: Banner[];
  middlePeriodBanners: Banner[];
  bottomBanners: Banner[];
}

export interface Subinventory {
  subinventoryName: string;
  subinventoryCode: string;
  qty: number;
  iorderQty: number;
  minCount: number;
}

export interface BulkGradeSettings {
  itemId: number;
  minQuantity: number;
  discValue: number;
  promoPrice: number;
  level: number;
  maxQuantity: number;
}

export interface SynologyItem {
  itemId: number;
  newPrice: number;
  active: boolean;
  isComboSubItem: boolean;
  storageCapacity: number;
  storageCapacityUnit: number;
  storageCount: number;
  synologySubItemType: number;
  segment3: string;
  unitPrice: number;
  itemNumber: string;
  itemSubNumber: string;
  itemName: string;
  segment5: string;
  discMethod: number;
  discValue: number;
}

// why is there 2 periodSaleProduct????
export interface PeriodSaleProduct {
  itemId: number;
  itemNumber: string;
  itemSubNumber: string;
  itemName: string;
  description: string;
  prodImg: string;
  unitPrice: number;
  productType: string;
  priceWithTax: number;
  isHot: boolean;
  isLimit: boolean;
  productDisplayStatus: number;
  productTag: string;
  promoInfos: PromoInfo4[];
  subinventory: Subinventory[];
  firstPromoPrice: number;
}

export interface PeriodSale {
  name: string;
  periodSaleProducts: PeriodSaleProduct[];
}

export interface PeriodSalesList {
  periodSales: PeriodSale[];
}

export interface HotSaleProductsList {
  itemId: number;
  itemName: string;
  description: string;
  promoMethods: number[];
  unitPrice: number;
  prodImg: string;
}

export interface CompareProduct {
  itemId: number;
  imgUrl: string;
  name: string;
  price: string;
  favorite: boolean;
}

export interface CompareProduct2 {
  itemId: number;
  imgUrl: string | string[];
  name: string;
  price: number;
}

export interface CompareItem {
  title: string;
  values: string[];
}

export interface CustomPromo {
  promoId: number;
  subMethod: number;
  startDate: Date;
  endDate: Date;
  subInventories: {
    subInventoryCode: string;
    subInventoryName: string;
  }[];
  thresholds: CustomPromoThreshold[];
  products: CustomPromoProduct[];
}

export interface CustomPromoThreshold {
  level: number;
  description: string;
  conditionMethod: number;
  conditionValueAny: number;
  conditionValueA: number | null;
  conditionValueB: number | null;
  offerMethod: number;
  offerValue: number;
  giftName: string | null;
  bonusDiscount: number | null;
}

export interface CustomPromoProduct {
  itemId: number;
  name: string;
  description: string;
  prodImg: string;
  price: number;
  unitPrice: number;
  subInventory: { subInventoryCode: string; qty: number }[];
  customPromoArea: string | null;
}

export interface AwardActivityUrl {
  url : string;
  formData: any;
}
