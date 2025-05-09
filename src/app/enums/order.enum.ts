export enum CreateOrderEnum {
  /**
   * 建立定單成功
   */
  Success = '0000',

  /**
   * 網站未暫停交易
   */
  WebsiteTransactionPaused = '30001',

  /**
   * 帳號有交易權限
   */
  AccountHasTransactionPermission = '30002',

  /**
   * 帳號未停止交易
   */
  AccountTransactionStopped = '30003',

  /**
   * 採購單是否仍然存在
   */
  PurchaseOrderExists = '30004',

  /**
   * 採購單商品是否有此資料
   */
  PurchaseOrderItemExists = '30005',

  /**
   * 運費設定仍然存在
   */
  ShippingFeeSettingExists = '30006',

  /**
   * 必填欄位是否已填寫
   */
  RequiredFieldsFilled = '30007',

  /**
   * 欄位是否正確
   */
  FieldsAreCorrect = '30008',

  /**
   * 夜配時間未逾時
   */
  NightDeliveryTimeOverdue = '30009',

  /**
   * 週六送未逾時
   */
  SaturdayDeliveryOverdue = '30010',

  /**
   * 賣場專車未逾時
   */
  StoreDeliveryTruckOverdue = '30011',

  /**
   * 採購清單商品是否無異動
   */
  PurchaseListItemsUnchanged = '30012',

  /**
   * 達成禮是否無誤
   */
  GiftAchievementCorrect = '30013',

  /**
   * 採購金額是否達免運費
   */
  PurchaseAmountQualifiesFreeShipping = '30014',

  /**
   * 贈品、配件已贈完，將不會進行出貨
   */
  GiftsOrAccessoriesFullyGiven = '30015',

  /**
   * 贈品、配件庫存量不足，將事後進行補貨
   */
  GiftsOrAccessoriesOutOfStockLater = '30016',

  /**
   * 贈品、配件庫存量不足，請確認是否要替代其他商品
   */
  ReplaceGiftsOrAccessoriesOutOfStock = '30017',

  /**
   * 是否不是先拋單後匯款
   */
  SubmitBeforeRemittance = '30018',

  /**
   * 信用餘額是否無誤
   */
  CreditBalanceCorrect = '30019',

  /**
   * 信用餘額是否有計算出來
   */
  CreditBalanceCalculated = '30020',

  /**
   * 額度是否足夠，數位商品
   */
  CreditLimitSufficientDigitalProduct = '30021',

  /**
   * 額度是否足夠，非數位商品
   */
  CreditLimitSufficientNonDigitalProduct = '30022',

  /**
   * 資料庫內是否有這筆訂單資料
   */
  OrderDataExistsInDatabase = '30023',
}

export enum NotifyType {
  ContactSales = 1,
  AbandonOrder = 2
}
