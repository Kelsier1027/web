export const ErrorMessageMap: {
  [key: string]: { type: string; message: string };
} = {
  404: { type: 'error', message: '系統忙碌中，請稍後再試' },  // '網路連線異常，請再嘗試一次'
  500: { type: 'error', message: '發生問題，請稍後再試' },   // '發生問題，請再嘗試一次'
  504: { type: 'error', message: '系統忙碌中，請稍後再試' }, // '發生問題，請再嘗試一次'
  0: { type: 'error', message: '發生問題，請再嘗試一次' },
};
