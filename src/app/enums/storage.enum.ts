export enum StorageEnum {
  /** 結帳清單 */
  checkoutList = 'checkoutList',
  /** 送出定單結果 */
  CheckoutResult = 'CheckoutResult',
  GroupCheckoutResult = 'GroupCheckoutResult',
  PreOrderCheckoutResult = 'PreOrderCheckoutResult',
  /** 最近瀏覽 */
  RecentlyViewed = 'RecentlyViewed',
  /** 比較商品 */
  ComparingItems = 'ComparingItems',

  /** 使用者客服聊天訊息 */
  UserMessage = 'UserMessage',

  /** 預購商品列表 */
  Preorder = 'Preorder',

  GroupOrder = 'GroupOrder',
}

export enum BrandEnum {
  Seagate,
  WesternDigital,
  TOSHIBA,
}

export enum StorageCapacityUnitEnum {
  TB = 1,
  GB,
  MB,
}
