export const environment = {
  production: true,
  enableLogging: false,
  baseApiUrl: 'http://localhost',
  orgId: 151,
  siteKey: '6LfClXcpAAAAAJfoD0pXu6uTdSZ5FukwqzVjR19V',
  rememberMeKey: 'jingho-web-rememberme',
  googleAnalyticsKey: 'G-7L1TQ70F7Z',
loginGuide: [
    {
      type: 'link',
      title: '線上報修',
      hint: '提供網站報修服務',
      theme: 'maintenance',
      url: 'https://www.unitech.com.tw/login.aspx',
    },
    {
      type: 'link',
      title: '精技電腦',
      hint: '提供完整的服務',
      theme: 'office-building',
      url: 'https://www.unitech.com.tw/',
    },
    {
      type: 'link',
      title: '精技電腦',
      hint: '線上購物平台',
      theme: 'bag',
      url: 'https://io2ts.unitech.com.tw:5443',
    }
  ],
  fireBaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: 'https://localhost',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '1:',
    measurementId: '',
  }
};
