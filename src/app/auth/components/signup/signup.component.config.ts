export const SignupFormConfig: any = [
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
    label: '公司名稱',
    labelPosition: '',
    inputType: 'text',
    name: 'companyName',
    placeholder: '公司名稱',
    hint: '',
    class: '',
    styleMargin: '0px 0px 8px 0px',
    validations: {
      hasErrorMessage: true,
      errorMessage: [
        {
          type: 'required',
          message: '請輸入公司名稱',
        },
        {
          type: 'maxlength',
          message: '請勿超過20個字',
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
    label: '姓名',
    labelPosition: '',
    inputType: 'text',
    name: 'contactName',
    placeholder: '姓名',
    hint: '',
    class: '',
    styleMargin: '0px 0px 8px 0px',
    validations: {
      hasErrorMessage: true,
      errorMessage: [
        {
          type: 'required',
          message: '請輸入姓名',
        },
        {
          type: 'pattern',
          message: '請輸入中文字元',
        },
        {
          type: 'maxlength',
          message: '請勿超過15個字',
        },
      ],
    },
  },
  {
    type: 'input',
    label: '聯絡電話',
    labelPosition: '',
    inputType: 'text',
    name: 'tel',
    placeholder: '聯絡電話',
    hint: '',
    class: '',
    styleMargin: '0px 0px 8px 0px',
    validations: {
      hasErrorMessage: true,
      errorMessage: [
        {
          type: 'required',
          message: '請輸入聯絡電話',
        },
        {
          type: 'pattern',
          message: '聯絡電話格式錯誤',
        },
      ],
    },
  },
  {
    type: 'input',
    label: '帳號',
    labelPosition: '帳號',
    inputType: 'email',
    name: 'account',
    placeholder: 'Email帳號',
    hint: '請輸入帳戶管理員Email帳號 (此為網站之登入帳號)',
    class: '',
    validations: {
      hasErrorMessage: true,
      errorMessage: [
        {
          type: 'email',
          message: 'Email格式錯誤',
        },
        {
          type: 'required',
          message: '請輸入帳戶管理員Email',
        },
      ],
    },
  },
  {
    type: 'checkboxTerms',
    label: '我已閱讀並同意iOrder',
    name: 'terms_of_service',
    modelName: '會員約定同意書',
    class: '',
    styleMargin: '26px 0px 34px 0px',
    styleAlign: 'flex-start',
    prefix: '「',
    suffix: '」',
    validations: {
      hasErrorMessage: true,
      errorMessage: [
        {
          type: 'required',
          message: '請勾選同意條款',
        },
      ],
    },
    modelOption: {
      modelName: 'terms-of-service',
      config: {
        data: {
          title: '會員約定同意書',
          cancelButton: '不同意',
          confirmButton: '同意',
          StyleWidthFooter: '430px',
          confirmDisabled: true,
        },
        width: '820px',
        height: '600px',
        hasBackdrop: true,
        autoFocus: false,
        enterAnimationDuration: '300ms',
        exitAnimationDuration: '300ms',
        panelClass: 'terms-of-service-dialog',
      },
    },
  },
  {
    type: 'reCaptcha',
    name: 'recaptcha',
    class: '',
    styleMargin: '0px 0px 16px 0px',
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
    label: '註冊',
    inputType: 'submit',
    name: 'login_button',
    color: 'primary',
    class: '',
    styleMargin: '0px 0px 12px 0px',
  },
];
