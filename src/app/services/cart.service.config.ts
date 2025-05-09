export const ModalOptionMap: { [key: string]: { modalOption: any } } = {
  'product-added-to-shopping-cart': {
    modalOption: {
      modelName: 'product-added-to-shopping-cart',
      config: {
        data: {
          title: '',
          StyleMargin: '0px',
          text: '商品已加入購物車',
        },
        width: '368px',
        height: '179px',
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
  'product-commodity-plan': {
    modalOption: {
      modelName: 'product-commodity-plan',
      config: {
        data: {
          title: '商品替換方案',
          StyleMargin: '0px',
          text: '',
          isIcon: false,
          item: {
            mainItemId: 0,
            mainItemImg: '',
            mainItemName: '',
            mainQty: 0,
            replaceItemId: 0,
            replaceItemImg: '',
            replaceItemName: '',
            replaceQty: 0,
          },
        },
        width: '500px',
        height: '424px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: '',
      },
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
  'send-password': {
    modalOption: {
      modelName: 'send-password',
      config: {
        data: {
          title: '無法加入購物車',
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

export const AddToCartCheckCodeMap: {
  [key: string]: { name: string; modalName: string };
} = {
  '0000': {
    name: '加入購物車',
    modalName: 'product-added-to-shopping-cart',
  },
  '10011': {
    name: '配件無庫存到貨補出',
    modalName: 'product-commodity-change-cancel-cart',
  },
  '10012': {
    name: '配件無庫存選擇替代品',
    modalName: 'product-commodity-plan',
  },
  '10020': {
    name: '贈品無庫存不出貨',
    modalName: 'product-commodity-change-cancel-cart',
  },
  '10021': {
    name: '贈品無庫存到貨補出',
    modalName: 'product-commodity-change-cancel-cart',
  },
  '10022': {
    name: '贈品無庫存選擇替代品或不要贈品',
    modalName: 'product-commodity-plan',
  },
  '1002': {
    name: '組合商品無庫存(p2)',
    modalName: 'product-commodity-phone-confirm',
  },
  '1003': {
    name: '加購商品無庫存(p2)',
    modalName: 'product-commodity-change-cancel-cart',
  },
  '1004': {
    name: '加購商品超過限制(p2)',
    modalName: 'product-commodity-change',
  },
  '10041': {
    name: '只可加購單一種商品',
    modalName: 'send-password',
  },
  '1005': {
    name: '商品已下架',
    modalName: 'send-password',
  },
  '1006': {
    name: '未選擇促銷(fe)',
    modalName: 'send-password',
  },
  '1007': {
    name: '未選擇倉別(fe)',
    modalName: 'send-password',
  },
  '1008': {
    name: '促銷已下架',
    modalName: 'product-commodity-change',
  },
  '10081': {
    name: '主商品庫存不符購買限制',
    modalName: 'product-commodity-change',
  },
  '10090': {
    name: '倉別商品庫存不足(0)',
    modalName: 'product-commodity-change',
  },
  '10091': {
    name: '倉別商品庫存不足(>=1)',
    modalName: 'product-commodity-change',
  },
  '9999': {
    name: '無此商品資料',
    modalName: 'send-password',
  },
};
