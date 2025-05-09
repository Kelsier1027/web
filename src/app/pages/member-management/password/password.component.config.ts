export const memberFormConfig: any = [
  {
    type: 'textareaInput',
    label: '重設密碼原因',
    inputType: 'text',
    name: 'reason',
    labelPosition: 'outside',
    class: 'inline',
    value: '',
    placeholder: '請輸入重設密碼原因',
    color: 'primary',
    isModal: false,
    count: 60,
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
    type: 'reCaptcha',
    name: 'recaptcha',
    class: '',
    styleMargin: '',
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
    label: '變更密碼',
    inputType: 'submit',
    name: 'login_button',
    color: 'primary',
    class: '',
    styleMargin: '0px 0px 12px 0px',
  },
];

export const memberMobileFormConfig: any = [
  {
    type: 'textareaInput',
    label: '重設密碼原因',
    inputType: 'text',
    name: 'reason',
    labelPosition: 'top',
    class: 'inline',
    value: '',
    placeholder: '請輸入重設密碼原因',
    color: 'primary',
    isModal: false,
    count: 60,
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
    type: 'reCaptcha',
    name: 'recaptcha',
    class: '',
    styleMargin: '',
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
    label: '變更密碼',
    inputType: 'submit',
    name: 'login_button',
    color: 'primary',
    class: '',
    styleMargin: '0px 0px 12px 0px',
  },
];

export const adminFormConfig: any = [
  {
    type: 'password',
    label: '舊密碼',
    labelPosition: 'outside',
    inputType: 'password',
    name: 'oldPassword',
    placeholder: '請輸入舊密碼',
    hint: '',
    class: '',
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
    labelPosition: 'outside',
    inputType: 'password',
    name: 'newPassword',
    placeholder: '請輸入新密碼',
    hint: '密碼必須包含英文與數字，最少6碼',
    class: '',
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
    labelPosition: 'outside',
    inputType: 'password',
    name: 'confirmPassword',
    placeholder: '請輸入新密碼',
    hint: '',
    class: '',
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
    type: 'textareaInput',
    label: '重設密碼原因',
    inputType: 'text',
    name: 'reason',
    labelPosition: 'outside',
    class: 'inline',
    value: '',
    placeholder: '請輸入重設密碼原因',
    color: 'primary',
    isModal: false,
    count: 60,
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
    type: 'reCaptcha',
    name: 'recaptcha',
    class: '',
    styleMargin: '',
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
    label: '變更密碼',
    inputType: 'submit',
    name: 'login_button',
    color: 'primary',
    class: '',
    styleMargin: '0px 0px 12px 0px',
  },
];

export const adminMobileFormConfig: any = [
  {
    type: 'password',
    label: '舊密碼',
    labelPosition: 'top',
    inputType: 'password',
    name: 'oldPassword',
    placeholder: '請輸入舊密碼',
    hint: '',
    class: '',
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
    labelPosition: 'top',
    inputType: 'password',
    name: 'newPassword',
    placeholder: '請輸入新密碼',
    hint: '密碼必須包含英文與數字，最少6碼',
    class: '',
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
    labelPosition: 'top',
    inputType: 'password',
    name: 'confirmPassword',
    placeholder: '請輸入新密碼',
    hint: '',
    class: '',
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
    type: 'textareaInput',
    label: '重設密碼原因',
    inputType: 'text',
    name: 'reason',
    labelPosition: 'top',
    class: 'inline',
    value: '',
    placeholder: '請輸入重設密碼原因',
    color: 'primary',
    isModal: false,
    count: 60,
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
    type: 'reCaptcha',
    name: 'recaptcha',
    class: '',
    styleMargin: '',
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
    label: '變更密碼',
    inputType: 'submit',
    name: 'login_button',
    color: 'primary',
    class: '',
    styleMargin: '0px 0px 12px 0px',
  },
];
