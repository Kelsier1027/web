export interface ITableData {
  userDetail?: string;
  advancedSettings?: string;
  resetPassword?: string;
  shippingInformation?: string;
  transactionRecord?: string;
  review?: string;
  sendNotification?: string;
  add?: string;
}

export interface IColumns_Schema {
  key: string;
  type: string;
  label: string;
  class: string;
  display?: boolean;
  stickyEnd?: boolean;
}
