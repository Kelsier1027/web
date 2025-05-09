import { CreateOrderEnum } from "../enums/order.enum";

export const OrderModalOptionMap: { [key: string]: { modalOption: any } } = {
  'create-order-failed': {
    modalOption: {
      modelName: 'common-cancel-confirm',
      config: {
        data: {
          title: '交易失敗',
          StyleMargin: '0px',
          displayFooter: false,
          confirmButton: '請業務聯繫我',
          cancelButton: '返回購物車',
        },
        width: '500px',
        height: '204px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: ''
      }
    },
  },
  'delivery-method': {
    modalOption: {
      modelName: 'shipping-method',
      config: {
        data: {
          title: '交易失敗',
          StyleMargin: '0px',
        },
        width: '500px',
        height: '286px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: ''
      }
    },
  },
  'credit-balance-insufficient': {
    modalOption: {
      modelName: 'common-cancel-confirm',
      config: {
        data: {
          title: '信用餘額不足',
          StyleMargin: '0px',
          displayFooter: false,
          confirmButton: '請業務聯繫我',
          cancelButton: '返回購物車',
        },
        width: '500px',
        height: '204px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: ''
      }
    },
  },
  'product-commodity-phone-confirm': {
    modalOption: {
      modelName: 'product-commodity-phone-confirm',
      config: {
        data: {
          title: '商品異動',
          StyleMargin: '0px',
          text: '',
          isIcon: true,
        },
        width: '500px',
        height: '204px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: '',
      },
    },
  },
  'product-commodity-change-cancel-cart': {
    modalOption: {
      modelName: 'product-commodity-change-cancel-cart',
      config: {
        data: {
          title: '商品異動',
          StyleMargin: '0px',
          text: '',
          isIcon: true,
        },
        width: '500px',
        height: '204px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: '',
      },
    },
  },
  'product-commodity-change': {
    modalOption: {
      modelName: 'product-commodity-change',
      config: {
        data: {
          title: '商品異動',
          StyleMargin: '0px',
          text: '',
          isIcon: true,
        },
        width: '500px',
        height: '204px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: '',
      },
    },
  },
  'gifts-or-accessories-fully-given': {
    modalOption: {
      modelName: 'simple-dialog',
      config: {
        data: {
          title: '商品異動',
          displayFooter: true,
          confirmButton: '確定',
        },
        width: '500px',
        height: '226px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: '',
      },
    },
  },
  'purchase-amount-qualifies-free-shipping': {
    modalOption: {
      modelName: 'send-password',
      config: {
        data: {
          title: '指送未達免運門檻',
          text: '',
          displayFooter: true,
          confirmButton: '確定',
        },
        width: '500px',
        height: '226px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: '',
      },
    },
  },
  'replace-gifts-or-accessories-out-of-stock': {
    modalOption: {
      modelName: 'product-commodity-plan',
      config: {
        data: {
          title: '商品替換方案',
          StyleMargin: '0px',
          isIcon: false,
          replaceItem: {
            // mainItemId: hasErrorProduct.id,
            // mainItemImg: hasErrorProduct.imgSrc,
            // mainItemName: hasErrorProduct.name,
            // mainQty: hasErrorProduct.qty,
            // replaceItemId: replaceProduct.id,
            // replaceItemImg: replaceProduct.imgSrc,
            // replaceItemName: replaceProduct.name,
            // replaceQty: replaceProduct.qty
          }
        },
        width: '500px',
        height: '424px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: ''
      },
    },
  },
  'credit-limit-sufficient-digital-product': {
    modalOption: {
      modelName: 'common-cancel-confirm',
      config: {
        data: {
          title: '信用餘額不足',
          StyleMargin: '0px',
          displayFooter: false,
          confirmButton: '請業務聯繫我',
          cancelButton: '返回購物車',
        },
        width: '500px',
        height: '204px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: ''
      }
    },
  },
  'credit-limit-sufficient-non-digital-product': {
    modalOption: {
      modelName: 'common-cancel-confirm',
      config: {
        data: {
          title: '信用餘額不足',
          StyleMargin: '0px',
          displayFooter: false,
          //cancelButton: '聯絡客服',
          cancelButton: '請業務聯繫我',
          confirmButton: '先送出訂單',
        },
        width: '500px',
        height: '204px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: ''
      }
    },
  },
  'simple-dialog': {
    modalOption: {
      modelName: 'simple-dialog',
      config: {
        data: {
          title: '送出訂單發生錯誤',
          text: '',
          displayFooter: true,
          confirmButton: '確定',
        },
        width: '500px',
        height: '226px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: '',
      },
    },
  },

};

export const OrderCodeMap: {
  [key: string]: { name: string; modalName: string };
} = {
  [CreateOrderEnum.WebsiteTransactionPaused]: {
    name: '網站是否暫停交易',
    modalName: 'create-order-failed',
  },
  [CreateOrderEnum.AccountHasTransactionPermission]: {
    name: '帳號是否有交易權限',
    modalName: 'create-order-failed',
  },
  [CreateOrderEnum.AccountTransactionStopped]: {
    name: '帳號是否停止交易',
    modalName: 'create-order-failed',
  },
  [CreateOrderEnum.PurchaseOrderExists]: {
    name: '採購單是否仍然存在',
    modalName: 'create-order-failed',
  },
  [CreateOrderEnum.PurchaseOrderItemExists]: {
    name: '採購單商品是否有此資料',
    modalName: 'create-order-failed',
  },
  [CreateOrderEnum.ShippingFeeSettingExists]: {
    name: '運費設定是否仍然存在',
    modalName: 'create-order-failed',
  },
  [CreateOrderEnum.RequiredFieldsFilled]: {
    name: '必填欄位是否已填寫',
    modalName: 'required-fields-filled',
  },
  [CreateOrderEnum.FieldsAreCorrect]: {
    name: '欄位是否正確',
    modalName: 'fields-are-correct',
  },
  [CreateOrderEnum.NightDeliveryTimeOverdue]: {
    name: '夜配時間是否逾時',
    modalName: 'delivery-method',
  },
  [CreateOrderEnum.SaturdayDeliveryOverdue]: {
    name: '週六送是否逾時',
    modalName: 'delivery-method',
  },
  [CreateOrderEnum.StoreDeliveryTruckOverdue]: {
    name: '賣場專車是否逾時',
    modalName: 'delivery-method',
  },
  [CreateOrderEnum.PurchaseListItemsUnchanged]: {
    name: '採購清單商品是否無異動',
    modalName: 'create-order-failed',
  },
  [CreateOrderEnum.GiftAchievementCorrect]: {
    name: '達成禮是否無誤',
    modalName: 'create-order-failed',
  },
  [CreateOrderEnum.PurchaseAmountQualifiesFreeShipping]: {
    name: '採購金額是否達免運費',
    modalName: 'purchase-amount-qualifies-free-shipping',
  },
  [CreateOrderEnum.GiftsOrAccessoriesFullyGiven]: {
    name: '贈品、配件已贈完，將不會進行出貨',
    modalName: 'gifts-or-accessories-fully-given',
  },
  [CreateOrderEnum.ReplaceGiftsOrAccessoriesOutOfStock]: {
    name: '贈品、配件庫存量不足，請確認是否要替代其他商品',
    modalName: 'replace-gifts-or-accessories-out-of-stock',
  },
  [CreateOrderEnum.GiftsOrAccessoriesOutOfStockLater]: {
    name: '贈品、配件庫存量不足，將事後進行補貨',
    modalName: 'gifts-or-accessories-fully-given',
  },
  [CreateOrderEnum.SubmitBeforeRemittance]: {
    name: '是否不是先拋單後匯款',
    modalName: 'create-order-failed',
  },
  [CreateOrderEnum.CreditBalanceCorrect]: {
    name: '信用餘額是否無誤',
    modalName: 'credit-balance-insufficient',
  },
  [CreateOrderEnum.CreditBalanceCalculated]: {
    name: '信用餘額是否有計算出來',
    modalName: 'create-order-failed',
  },
  [CreateOrderEnum.CreditLimitSufficientDigitalProduct]: {
    name: '額度是否足夠，數位商品',
    modalName: 'credit-limit-sufficient-digital-product',
  },
  [CreateOrderEnum.CreditLimitSufficientNonDigitalProduct]: {
    name: '額度是否足夠，非數位商品',
    modalName: 'credit-limit-sufficient-non-digital-product',
  },
  [CreateOrderEnum.OrderDataExistsInDatabase]: {
    name: '資料庫內是否有這筆訂單資料',
    modalName: 'create-order-failed',
  },
};
