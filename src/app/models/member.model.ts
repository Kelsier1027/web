import { Timestamp } from 'rxjs';
import { AddrStatus, MemberRole, ProductDisplayStatus } from '../enums';

export interface Trace {
  id: number;
  itemId: number;
  traceId: string;
  orgId: number;
  prodImg: string;
  itemName: string;
  itemNumber: string;
  description: string;
  unitPrice: number;
  lastUpdateDate: string;
  productDisplayStatus: ProductDisplayStatus;
}

export interface CommonAddress {
  id: number;
  createdBy: string;
  addrName: string;
  addrCity: string;
  addrCityArea: string;
  addr: string;
  fullAddr: string;
  receiver: string;
  contactNo: string;
  phoneNo: string;
}

export interface Gift {
  activityId: number;
  startDate: string;
  endDate: string;
  activityName: string;
  giftName: string;
  quantity: number;
  expireTime: string;
  giftTime: string;
  purchaseNo: string;
  purchaseId: number;
  canClick: boolean;
}

export interface DeliveryRemark {
  id: number;
  title: string;
  comment: string;
}

export interface Prepay {
  trxDate: string;
  trxNumber: string;
  trxAmount: number;
  trxRemaining: number;
}

export interface BillDetail {
  brand: string;
  itemDesc: string;
  itemNumber: string;
  quantityInvoiced: number;
  unitSellingPrice: number;
  total: number;
}

export interface Bill {
  payableDate: string;
  orderNumber: string;
  shipNumber: string;
  taxAmount: number;
  trxAmount: number;
  trxRemaining: number;
  invoiceNo: string;
  showSendInvoice: true;
  showInvoicePdf: true;
  poNo: string;
  buyerName: string;
  dueDate: string;
  invoiceFile: string;
  purchaseNo: string;
  trxDate: string;
  sumAmount: number;
  shipToContact: string;
  shipToAddress: string;
  shipMessage: string;
  purchaseName: string;
  purchaseEmail: string;
  purchasePhone: string;
  shipToPhone: string;
}

export interface OrderItem {
  brand: string;
  description: string;
  inventoryItem: string;
  orderedQuantity: string;
  unitIorderPrice: number;
  price: number;
  downloadURL: string;
  serialIds: number[];
  itemStatus: string;
  sendLater?: boolean;
}

export interface OrderDetail {
  origSysDocumentRef: string;
  creationDate: string;
  tracking: OrderTracking;
  orderItems: OrderItem[];
  orderAmount: number;
  freightCharge: number;
  taxAmount: number;
  bonusAmount: number;
  totalAmount: number;
  shipToName: string;
  shipAddr: string;
  invoiceToName: string;
  billAddr: string;
  shipMessage: string;
  customerPoNumber: string;
  invoiceType: string;
  invoiceNo: string;
  buyerName: string;
  email: string;
  proofList: string[];
  isSerialListHasItem: boolean;
  subInventory: string;
  orderStatus: string;
  canCancel: boolean;
  shippingMethodCode: string;
  FreightChargeType: string;
  noChargeThreshold: number;
  originalFreightCharge: number;
}
export interface CheckOrderCancel {
  purchaseId: number;
  isAlreadyCancelled: boolean;
}

export interface Order {
  creationDate: string;
  orderStatus: string;
  tracking: OrderTracking;
  orderNumber: string;
  shipNumber: string;
  subInventory: string;
  poNo: string;
  purchaseNumber: string;
  amountWithoutTax: number;
  buyerName: string;
  invoiceNo: string;
  invoiceFile: string;
  deliveryCompany: string;
  proofOfDelivery: boolean;
  purchaseId: number;
}

export interface GroupOrder {
  orderDate: string,
  groupBuyStatus: number,
  groupBuyStatusName: string,
  orderStatus: string,
  shipNumber: string | null,
  purchaseNo: string,
  itemName: string,
  amountWithoutTax: number,
  shippingStartDate: string,
  shippingEndDate: string,
  invoiceNo: string | null,
  invoiceFile: string | null,
  canCancel: true,
}

export interface OrderTracking {
  transferedDatetime: string;
  pickDate: string;
  estimateDeliverTime: string;
  lastUpdatedDate: string;
  isSendMail: boolean;
}

export interface ItemArriveNotification {
  creationDate: Date;
  lastName: string;
  itemId: number;
  itemSeg: string;
  description: string;
  itemQty: number;
  notificationMail: string[];
  processStatus: string;
  notificationDeadline: Date;
  notificationDate: Date;
  notificationStatus: null | string;
}

export interface City {
  city: string;
}

export interface CityArea {
  area: string;
  zipCode: string;
}

export interface AddrManage {
  defaultAddr: {
    defaultShipAddrId: number;
    defaultBillAddrId: number;
    defaultShipContact: number;
    defaultBillContact: number;
  };
  shipAddrList: Address[];
  billAddrList: Address[];
  shipAddrApplyList: Address[];
  billAddrApplyList: Address[];
  shipContactList: Contact[];
  billContactList: Contact[];
}

export interface Contact {
  id: number;
  name: string;
  jobTitle: string;
  phone: string;
  email: string;
}

export interface Address {
  id: number;
  fullAddr: string;
  status: AddrStatus;
}

export interface User {
  role: MemberRole;
  lastName: string;
  email: string;
}

export interface Account {
  role: MemberRole;
  email: string;
  lastName: string;
  isAvailable: boolean;
  jobTitle: string;
  id: number;
  customerId: number;
  contactId: number;
  userName?: string;
  passwordChangeReason?: string;
  isApplyingForPasswordChange: boolean;
}
export interface CustomerAccount {
  customerName: string;
  customerLevel: string;
  taxReference: string;
  userName: string;
  creditAmount: number;
  creditBalanceAmount: number;
  contact: {
    contactName: string;
    tel: string;
    skypeId: string;
    lineId: string;
    email: string;
    ext: string;   // Add by Tako At 2024/11/06 For 2024023106
  };
  //#region Add by Tako At 2024/10/25 For 2024023106
  opContact: {
    opName: string;
    tel: string;
    ext: string;
    skypeId: string;
  }[];
  //#endregion
  payAmount: number;
  thisMonth: number;
  lastMonth: number;
  thisYear: number;
  lastYear: number;
}


export interface MemberInfo {
  customerName: string;
  companyName: string;
  email: string;
  customerClass: number;
  usableBonusPoints: number;
  availableAwards: number,
  tracingItems: number,
  cartCount: number,
  restockNotifyCount: number,
  canUseDealerView: boolean,
  isAdmin: boolean,
  displayBonus: boolean,
  userId: number,
  city: string,
  subinventory: string,
  isSales: boolean,
  canOrder: boolean
}

export interface PreOrderDetail {
  tracking: any;
  // 促銷名稱
  PromoName: string,
  // 促銷備註說明
  PromoDescription: string,
  // 活動期間起日
  PromoStartDate: Date,
  // 活動期間迄日
  PromoEndDate: Date,
  // 預計出貨日
  ShippingDate: Date,
  // 此預購目前已達成數量
  CurrentCount: number,
  // 此預購上限數量
  TargetCount: number,
  // 預購狀態 1:預購中 2:已達成 3:已取消
  GroupBuyStatus: number
  // 簽收單
  proofList: string[];
}

export interface PreOrderList {
  // 下單日期
  orderDate: Date,
  // 預購狀態（列舉值）
  // 1:預購中
  // 2:已達成
  // 3:已取消
  preorderStatus: number,
  // 預購狀態（中文）
  preorderStatusName: string,
  // 訂單狀態（中文）
  orderStatus: string,
  // 出貨單號，可能為 null
  shipNumber: string | null,
  // 採購單號
  purchaseNo: string,
  // 商品
  itemName: string,
  // 總價（未）
  amountWithoutTax: number,
  // 預計出貨日
  shippingDate: Date,
  // 發票號碼，可能為 null
  // 有值時，顯示「寄送」
  invoiceNo: string | null,
  // 發票檔案，可能為 null
  // 有值時，顯示「PDF」
  invoiceFile: string | null,
  // 是否可取消訂單
  canCancel: boolean
}

export interface homepagePopup {
  // 今天此使用者是否需要首頁彈窗。
  hasPopup: boolean,

  // 首頁彈窗內容。
  // 可能為 null，表示今天此使用者已不需要首頁彈窗。
  popup: {
    // 電腦版圖片網址（不包含網域）

    imageUrlForPc: string,

    // RWD 版圖片網址（不包含網域）
    imageUrlForMobile: string,


    // 圖片超連結。不是 null 時，為圖片加上新開分頁的超連結屬性。
    url: string | null,

    adId : number,

    isExternal : boolean

  } | null
}

export interface adLink {
    // 接下來操作對象的網址
    url: string,

    // 是否需要 POST form data。
    // true：需要，利用 formData 對 url 走 formdata post 流程。
    // false：不需要，直接新開分頁到 url。
    needsPost: boolean,

    formData: any,
}
export interface ChatMessage {
  // 訊息的 GUID
  id: string;

  // 訊息時間
  creationTime: Date;

  // 此訊息是否為使用者所發送
  // true：此為使用者發送訊息，顯示在右邊
  // false：此為精技發送訊息，顯示在左邊
  isSentByUser: boolean;

  // 訊息圖片。可能為 null，表示沒有圖片。
  imagePath: string | null;

  // 訊息標題。可能為 null，表示沒有標題。
  title: string | null;

  // 訊息內容
  message: string;

  // 此訊息是否只包含連結。若只包含連結，以連結訊息的樣式顯示之。
  isUrlOnly: boolean;

  // 訊息下方的按鈕的集合。保證不為 null。可能為空，表示沒有按鈕。
  buttons: ChatButton[];

  //用來顯示分隔日期，如果前面一個日期和自己的日期同一天為null，否則會有值。
  groupDate: Date | null;

  adId : number,

  isExternal : boolean,

  // 是否已讀
  isRead: boolean
}

export interface ChatButton {
  // 按鈕文字
  text: string;

  // 按鈕超連結，點擊後新開分頁跳轉之。
  url: string;
}

export interface Chat {
  // 這次回傳結果的起始日期
  since: Date;

  // 訊息的集合
  messages: ChatMessage[];
}
