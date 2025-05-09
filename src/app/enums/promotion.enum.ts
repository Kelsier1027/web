/**
 * 促銷種類 1：一般 2：預購 3：任購 4：團購
 */
export enum PromoCategory {
  General = 1,
  PreOrder = 2,
  CustomisedOffer = 3,
  GroupBuy = 4,
}

export const PromoCategoryName = {
  1: '一般',
  2: '預購',
  3: '任購',
  4: '團購',
};

/**
 * 顯示位置 1：一般 2：結帳加購區 3：福利品區
 */
export enum DisplayArea {
  NormalArea = 1,
  ShoppingCartPage = 2,
  RefurbishedProductPage = 3,
}

export const DisplayAreaName = {
  1: '一般',
  2: '結帳加購區',
  3: '福利品區',
};

/**
 * 促銷方式 1：折價 2：贈品 3：加價購 4：組合價 5：量購價
 */
export enum PromoMethod {
  Distribution = 0,
  Discount = 1,
  Gift = 2,
  AdditionalItem = 3,
  Combo = 4,
  Bulk = 5,
}

export const PromoMethodName = {
  1: '折價',
  2: '贈品',
  3: '加價購',
  4: '組合價',
  5: '量購價',
  0: '經銷價'
};

/**
 * 促銷狀態 1：已排程 2：草稿 3：已下架
 */
export enum PromotionStatus {
  Scheduled = 1,
  Draft = 2,
  Removed = 3,
}

export const PromotionStatusName = {
  1: '已排程',
  2: '草稿',
  3: '已下架',
};

/**
 * 種類 1：附屬加價購, 2：指定加價購
 */
export enum SubMethod {
  AttachedAdditional = 1,
  ChosenAdditional = 2,
  GeneralCombo = 3,
  SynologyCombo = 4,
  AnyChoice = 5,
  MutliAreas = 6
}

export const SubMethodName = {
  1: '附屬加價購',
  2: '指定加價購',
  3: '一般組合價',
  4: '彈性組合價',
  5: '任選',
  6: 'AB配'
}