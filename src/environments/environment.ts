// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  enableLogging: true,
  // baseApiUrl: 'http://localhost',
  baseApiUrl: 'http://localhost:5245',
  orgId: 83,
  siteKey: '6LfClXcpAAAAAJfoD0pXu6uTdSZ5FukwqzVjR19V',
  rememberMeKey: '-rememberme',
  googleAnalyticsKey: 'G-HLXS83WXTJ',
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
      url: 'https://www.unitech.com.tw',
    },
    {
      type: 'link',
      title: '精豪電腦',
      hint: 'Apple 獨家專區',
      theme: 'i-mac',
      url: 'https://io2ts.unitech.com.tw:8082',
    },
    //{
    //  type: 'modal',
    //  title: '經銷商專區',
    //  hint: '提供更多資訊服務',
    //   theme: 'files',
    //   modal: {
    //     title: ' 經銷商專區需先登入iOrder',
    //     text: ' 登入iOrder後即可進入經銷商專區。',
    //     displayFooter: true,
    //     confirmButton: '確認',
    //   },
    // },
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
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
