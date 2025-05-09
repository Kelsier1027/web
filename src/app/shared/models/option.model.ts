export interface Ioption {
  type: 'link' | 'modal';
  title: string;
  hint: string;
  theme?: 'maintenance' | 'office-building' | 'i-mac' | 'files' | 'bag';
  url?: string;
  modal?: {
    title: string;
    text: string;
    displayFooter?: boolean;
    cancelButton?: string;
    confirmButton: string;
  };
}

export interface Options {
  value: string | number;
  label: string;
}
