export const resetFormConfig: any = [
  {
    type: 'password',
    label: '舊密碼',
    labelPosition: 'fixed',
    inputType: 'password',
    name: 'oldPassword',
    placeholder: '舊密碼',
    hint: '',
    class: '',
    styleMargin: '0px 0px 8px 0px',
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
    type: 'password',
    label: '新密碼',
    labelPosition: 'fixed',
    inputType: 'password',
    name: 'newPassword',
    placeholder: '新密碼',
    hint: '',
    class: '',
    styleMargin: '0px 0px 8px 0px',
    validations: {
      hasErrorMessage: true,
      errorMessage: [
        {
          type: 'required',
          message: '必填欄位',
        },
        {
          type: 'password',
          message: '密碼必須包含英文與數字，最少6碼',
        },
      ],
    },
  },
  {
    type: 'password',
    label: '確認新密碼',
    labelPosition: 'fixed',
    inputType: 'password',
    name: 'confirmPassword',
    placeholder: '確認新密碼',
    hint: '',
    class: '',
    styleMargin: '0px 0px 8px 0px',
    validations: {
      hasErrorMessage: true,
      errorMessage: [
        {
          type: 'required',
          message: '必填欄位',
        },
        {
          type: 'match',
          message: '新密碼不一致',
        },
      ],
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
    label: '確定',
    inputType: 'submit',
    name: 'login_button',
    color: 'primary',
    class: '',
    styleMargin: '0px 0px 12px 0px',
  },
];
