export const LoginFormConfig: any = [
  {
    type: 'input',
    label: '公司統編',
    labelPosition: '',
    inputType: 'text',
    name: 'companyNo',
    placeholder: '公司統編',
    hint: '',
    class: '',
    styleMargin: '0px 0px 8px 0px',
    validations: {
      hasErrorMessage: true,
      errorMessage: [
        {
          type: 'pattern',
          message: '公司統編格式錯誤',
        },
        {
          type: 'required',
          message: '請輸入公司統編',
        },
      ],
    },
  },
  {
    type: 'input',
    label: '帳號',
    labelPosition: '',
    inputType: 'email',
    name: 'account',
    placeholder: 'Email',
    hint: '',
    class: '',
    styleMargin: '0px 0px 8px 0px',
    validations: {
      hasErrorMessage: true,
      errorMessage: [
        {
          type: 'email',
          message: '帳號格式錯誤',
        },
        {
          type: 'required',
          message: '請輸入Email',
        },
      ],
    },
  },
  {
    type: 'password',
    label: '密碼',
    labelPosition: '',
    inputType: 'password',
    name: 'password',
    placeholder: '密碼',
    hint: '',
    class: '',
    styleMargin: '0px 0px 8px 0px',
    validations: {
      hasErrorMessage: true,
      errorMessage: [
        {
          type: 'required',
          message: '請輸入密碼',
        },
      ],
    },
  },
  {
    type: 'modelcheckbox',
    label: '記住我',
    name: 'rememberMe',
    modelName: '忘記密碼',
    class: '',
    styleMargin: '8px 0px 8px 0px',
    prefix: '',
    suffix: '',
    validations: {
      hasErrorMessage: false,
      errorMessage: [],
    },
    modelOption: {
      modelName: 'forget-password',
      config: {
        data: {
          title: '忘記密碼',
          subtitle: '請輸入您的註冊帳號，系統將發送密碼至您的Email信箱。',
        },
        width: '500px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: 'password-dialog',
      },
    },
  },
  {
    type: 'reCaptcha',
    name: 'recaptcha',
    class: '',
    styleMargin: '32px 0px 16px',
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
    type: 'button',
    label: '登入',
    inputType: 'submit',
    name: 'login_button',
    color: 'primary',
    class: '',
    styleMargin: '0px 0px 12px 0px',
  },
];
