/** 前台商品狀態分類
0 = General (一般商品)
1 = OutOfStock (缺貨商品(貨到通知我))
2 = ContactSales (請洽業務)
3 = UpToLimit (商品限制條件-被限制客戶)
 */
export enum ProductDisplayStatus {
  General,
  OutOfStock,
  ContactSales,
  UpToLimit,
}

/** 配件類型 "1"主配件 "2"替代配件 */
export enum AccessoryType {
  Main = 1,
  Replaced = 2,
}

/** 無庫存機制 "1"貨到補寄 "2"替代料號 (若配件類型為"2"，則必為"1") */
export enum SoldOutPlan {
  Resend = '1',
  Replace = '2',
}

/** 前台商品分類(右上的六角形)
0 = Preorder (預購)
1 = GroupBuy (團購)
2 = Welfare (福利品)
3 = CTC (中信)
4 = AQI (獨享)
5 = Digital (數位) */
export enum ProductTag {
  Preorder,
  GroupBuy,
  Welfare,
  CTC,
  AQI,
  Digital,
}

/*
0 = Yet (待生效)
1 = Effective (生效)
2 = Expired (失效)
3 = Other (其它)
*/
export enum BonusStatus {
  Yet = 0,
  Effective = 1,
  Expired = 2,
  Other = 3,
}

export const BonusStatusName = {
  0: '待生效',
  1: '生效',
  2: '失效',
  3: '其它',
};