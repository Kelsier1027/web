export const AddAccountFormConfig: any = [
  {
    type: 'iconSelect',
    label: '帳號身份',
    labelStyles: {
      'font-weight': '500',
      'font-size': '14px',
      'line-height': '22px',
      color: '#333333',
    },
    inputType: 'text',
    name: 'role',
    default: 'option1',
    styleMargin: '24px 0px 0px 0px',
    options: [
      { value: 'Sales', label: '查價員' },
      { value: 'Account', label: '對帳員' },
      { value: 'Buyer', label: '採購員' },
      { value: 'AccountBuyer', label: '對帳採購員' },
      { value: 'Receiver', label: '收貨員' },
    ],
    class: '',
    placeholder: '請選擇帳號身份',
    iconOption: {
      iconName: 'info',
      modelOption: {
        modelName: 'account-permissions',
        config: {
          data: {
            title: '帳號權限',
            StyleMargin: '0px',
          },
          width: '784px',
          height: '482px',
          hasBackdrop: true,
          autoFocus: false,
          enterAnimationDuration: '300ms',
          exitAnimationDuration: '300ms',
          panelClass: 'account-permissions-panel',
        },
      },
      iconStyle: { color: '#0972E3' },
    },
    validations: {
      hasErrorMessage: true,
      errorMessage: [
        {
          type: 'required',
          message: '必填欄位',
        },
      ],
    },
  },
  {
    type: 'input',
    label: '姓名',
    labelPosition: 'top',
    inputType: 'text',
    name: 'userName',
    placeholder: '請輸入中文全名',
    hint: '',
    class: '',
    styleMargin: '20px 0px 0px 0px',
    validations: {
      hasErrorMessage: true,
      errorMessage: [
        {
          type: 'required',
          message: '必填欄位',
        },
        {
          type: 'pattern',
          message: '請輸入中文字元',
        },
      ],
    },
  },
  {
    type: 'input',
    label: 'Email',
    labelPosition: 'top',
    inputType: 'email',
    name: 'email',
    placeholder: '請輸入Email',
    hint: '',
    class: '',
    styleMargin: '20px 0px 0px 0px',
    validations: {
      hasErrorMessage: true,
      errorMessage: [
        {
          type: 'email',
          message: 'Email格式錯誤',
        },
        {
          type: 'required',
          message: '必填欄位',
        },
      ],
    },
  },
  {
    type: 'input',
    label: '聯絡電話',
    labelPosition: 'top',
    inputType: 'homephone',
    name: 'tel',
    placeholder: '範例 (02)2796-2345#800',
    hint: '',
    class: '',
    styleMargin: '20px 0px 0px 0px',
    validations: {
      hasErrorMessage: true,
      errorMessage: [
        {
          type: 'pattern',
          message: '聯絡電話格式錯誤',
        },
        {
          type: 'required',
          message: '必填欄位',
        },
      ],
    },
  },
  {
    type: 'input',
    label: '行動電話 (選填)',
    labelPosition: 'top',
    inputType: 'phone',
    name: 'mobile',
    placeholder: '09xx-xxx-xxx',
    hint: '',
    class: '',
    styleMargin: '20px 0px 24px 0px',
    validations: {
      hasErrorMessage: true,
      errorMessage: [
        {
          type: 'pattern',
          message: '行動電話格式錯誤',
        },
        {
          type: 'required',
          message: '必填欄位',
        },
      ],
    },
  },
];
