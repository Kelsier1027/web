export interface DynamicFormConfig {
  type: string;
  label: string;
  labelPosition?: string;
  inputType?: string;
  name?: string;
  start?: string;
  end?: string;
  options?: { value: string | number | boolean; name: string }[];
  iconOption?: { label: string; icon: string; matSuffix: boolean };
  value: string | number | boolean;
  color?: string;
  hint?: string;
  class?: string;
  styleMargin?: string;
  styleFontWeight?: string;
  icon?: string;
  matType?: string;
  minCreateDate?: string;
  stylePadding?: string;
  placeholder?: string;
  isModal?: boolean;

  validations?: {
    hasErrorMessage: boolean;
    errorMessage: { type: string; message: string }[];
  };
}

export interface DynamicFormValue {
  [key: string]: string | number;
}

export interface CounterFieldConfig {
  type: string;
  _label: string;
  inputType: string;
  name: string;
  class: string;
  _value: number;
  _step: number;
  _min: number;
  _max: number;
  _wrap: boolean;
}
