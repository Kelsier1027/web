export const LoginFormConfig: any = [
  {
    type: 'input',
    label: '公司統編',
    labelPosition: 'top',
    inputType: 'text',
    name: 'companyNo',
    placeholder: '請輸入公司統編',
    hint: '',
    styleMargin: '24px 0px 0px 0px',
    validations: {
      hasErrorMessage: true,
      errorMessage: [
        {
          type: 'pattern',
          message: '公司統編格式錯誤',
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
    label: '帳號',
    labelPosition: 'top',
    inputType: 'email',
    name: 'account',
    placeholder: '請輸入Email',
    hint: '若忘記註冊Email請洽本公司電子商務部：(02)27962345分機837',
    class: '',
    styleMargin: '24px 0px 0px 0px',
    validations: {
      hasErrorMessage: true,
      errorMessage: [
        {
          type: 'email',
          message: 'Email 格式錯誤',
        },
        {
          type: 'required',
          message: '必填欄位',
        },
      ],
    },
  },
];
