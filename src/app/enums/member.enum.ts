/**
 * 0: 新增寄送地址 1: 新增帳單地址 2: 寄送地址失效 3: 帳單地址失效
 */
export enum AddrAction {
  AddShipAddr,
  AddBillAddr,
  DisableShipAddr,
  DisableBillAddr,
}

export enum AddrStatus {
  Available,
  DelApply,
  AddApply,
}

export enum MemberRole {
  Admin = 'Admin',
  Account = 'Account',
  Buyer = 'Buyer',
  AccountBuyer = 'AccountBuyer',
  Sales = 'Sales',
  Receiver = 'Receiver',
}

export const MemberRoleName = {
  Admin: '帳號管理員',
  Account: '對帳員',
  Buyer: '採購員',
  AccountBuyer: '採購對帳員',
  Sales: '查價員',
  Receiver: '收貨員',
};
