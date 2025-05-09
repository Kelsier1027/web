export const promoTagLabel: { [index: number]: any } = {
    // key 是 promoCategory (1:一般 2:預購 3:任購 4:團購)
    // value 是子陣列, 每個子陣列中的元素的 index 對應 promoMethod
    // 所以可以透過 promoTagLabel[promoCategory][promoMethod] 取得促銷對應的樣式
    // 重複的元素則是因為某些類型的促銷固定顯示成相同樣式
    1: [
      {
        text: '＄',
        label: '經銷價',
        color: 'gray',
      },
      {
        text: '折價',
        label: '折價',
        color: 'red',
      },
      {
        text: '贈品',
        label: '贈品',
        color: 'green',
      },
      {
        text: '加價購',
        label: '加購',
        color: 'purple',
      },
      {
        text: '組合價',
        label: '組合價',
        color: 'yellow',
      },
      {
        text: '量購價',
        label: '組合價',
        color: 'blue',
      },
      {
        text: '任購',
        label: '任購',
        color: 'lightgreen',
      }
    ],
    2:[
      {

      },
      {
      text: '折價',
      label: '折價',
      color: 'red',
      },
      {
      text: '預購',
      label: '預購',
      color: 'yellow',
      },
      {
      text: '加價購',
      label: '加購',
      color: 'purple',
      },
      {
      text: '組合價',
      label: '組合價',
      color: 'yellow',
      },
      {
      text: '預購',
      label: '預購',
      color: 'yellow',
      },
      {
      text: '預購',
      label: '預購',
      color: 'yellow',
      }
    ],
    3:[
      {
      },
      {
        text: '任購',
        label: '任購',
        color: 'lightgreen',
      },
      {
        text: '任購',
        label: '任購',
        color: 'lightgreen',
      },
      {
        text: '任購',
        label: '任購',
        color: 'lightgreen',
      },
      {
        text: '任購',
        label: '任購',
        color: 'lightgreen',
      },
      {
        text: '任購',
        label: '任購',
        color: 'lightgreen',
      },
      {
        text: '任購',
        label: '任購',
        color: 'lightgreen',
      }
    ],
    4:[
      {

      },
      {
      text: '折價',
      label: '折價',
      color: 'red',
      },
      {
      text: '團購',
      label: '團購',
      color: 'orange',
      },
      {
      text: '加價購',
      label: '加購',
      color: 'purple',
      },
      {
      text: '組合價',
      label: '組合價',
      color: 'yellow',
      },
      {
      text: '團購',
      label: '團購',
      color: 'orange',
      },
      {
      text: '團購',
      label: '團購',
      color: 'orange',
      }
    ]
  };
