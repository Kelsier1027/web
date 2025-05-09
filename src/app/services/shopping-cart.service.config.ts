export const CheckoutModalOptionMap: { [key: string]: { modalOption: any } } = {
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
          title: '商品異動',
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
  'product-commodity-delete-notify': {
    modalOption: {
      modelName: 'product-commodity-delete-notify',
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
};

export const CheckoutCodeMap: {
  [key: string]: { name: string; modalName: string };
} = {
  '0000': {
    name: '加入購物車',
    modalName: 'product-added-to-shopping-cart',
  },
  '20011': {
    name: '配件無庫存到貨補出',
    modalName: 'product-commodity-change-cancel-cart',
  },
  '20012': {
    name: '配件無庫存選擇替代品',
    modalName: 'product-commodity-plan',
  },
  '20020': {
    name: '贈品無庫存不出貨',
    modalName: 'product-commodity-change-cancel-cart',
  },
  '20021': {
    name: '贈品無庫存到貨補出',
    modalName: 'product-commodity-change-cancel-cart',
  },
  '20022': {
    name: '贈品無庫存選擇替代品或不要贈品',
    modalName: 'product-commodity-plan',
  },
  '2002': {
    name: '組合商品無庫存(p2)',
    modalName: 'product-commodity-phone-confirm',
  },
  '2003': {
    name: '加購商品無庫存(p2)',
    modalName: 'product-commodity-change-cancel-cart',
  },
  '2004': {
    name: '加購商品超過限制(p2)',
    modalName: 'product-commodity-change',
  },
  '1005': {
    name: '商品已下架',
    modalName: 'send-password',
  },
  '2005': {
    name: '倉別商品庫存不足(0)',
    modalName: 'product-commodity-change',
  },
  '2006': {
    name: '結帳加購區商品庫存不足或超過限制',
    modalName: 'send-password',
  },
  '2007': {
    name: '商品已下架',
    modalName: 'send-password',
  },
  '20080': {
    name: '倉別商品庫存不足(0)',
    modalName: 'product-commodity-delete-notify',
  },
  '20081': {
    name: '倉別商品庫存不足(>=1)',
    modalName: 'product-commodity-change',
  },
  '2009': {
    name: '促銷已下架',
    modalName: 'product-commodity-change',
  },
  '9999': {
    name: '無此商品資料',
    modalName: 'send-password',
  },
  '1003': {
    name: '加購商品無庫存(p2)',
    modalName: 'send-password',
  },
  '20061': {
    name: '尚未勾選主要商品',
    modalName: 'send-password',
  }
};

export const AddToCartModalOptionMap: { [key: string]: { modalOption: any } } =
  {
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
            title: '商品異動',
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
    'product-commodity-delete-notify': {
      modalOption: {
        modelName: 'product-commodity-delete-notify',
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
  };

export const AddToCartCodeMap: {
  [key: string]: { name: string; modalName: string };
} = {
  '0000': {
    name: '加入購物車',
    modalName: 'product-added-to-shopping-cart',
  },
  '20011': {
    name: '配件無庫存到貨補出',
    modalName: 'product-commodity-change-cancel-cart',
  },
  '20012': {
    name: '配件無庫存選擇替代品',
    modalName: 'product-commodity-plan',
  },
  '20020': {
    name: '贈品無庫存不出貨',
    modalName: 'product-commodity-change-cancel-cart',
  },
  '20021': {
    name: '贈品無庫存到貨補出',
    modalName: 'product-commodity-change-cancel-cart',
  },
  '20022': {
    name: '贈品無庫存選擇替代品或不要贈品',
    modalName: 'product-commodity-plan',
  },
  '2002': {
    name: '組合商品無庫存(p2)',
    modalName: 'product-commodity-phone-confirm',
  },
  '2003': {
    name: '加購商品無庫存(p2)',
    modalName: 'product-commodity-change-cancel-cart',
  },
  '2004': {
    name: '加購商品超過限制(p2)',
    modalName: 'product-commodity-change',
  },
  '1005': {
    name: '商品已下架',
    modalName: 'send-password',
  },
  '2005': {
    name: '倉別商品庫存不足(0)',
    modalName: 'product-commodity-change',
  },
  '2006': {
    name: '結帳加購區商品庫存不足或超過限制',
    modalName: 'send-password',
  },
  '2007': {
    name: '商品已下架',
    modalName: 'send-password',
  },
  '20080': {
    name: '倉別商品庫存不足(0)',
    modalName: 'product-commodity-delete-notify',
  },
  '20081': {
    name: '倉別商品庫存不足(>=1)',
    modalName: 'product-commodity-change',
  },
  '2009': {
    name: '促銷已下架',
    modalName: 'product-commodity-change',
  },
  '9999': {
    name: '無此商品資料',
    modalName: 'send-password',
  },
  '20061': {
    name: '尚未勾選主要商品',
    modalName: 'send-password',
  }
};
