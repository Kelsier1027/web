import { Injectable } from '@angular/core';
import { OrderModalOptionMap, OrderCodeMap } from "./order.service.config";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor() { }

  _modalOptionMap: { [key: string]: { modalOption: any } } = OrderModalOptionMap;
  _addToCartCheckCodeMap: {
    [key: string]: { name: string; modalName: string };
  } = OrderCodeMap;

  set modalOptionMap(modalOptionMap: { [key: string]: { modalOption: any } }) {
    this._modalOptionMap = modalOptionMap;
  }
  get modalOptionMap() {
    return this._modalOptionMap;
  }

  get addToCartCheckCodeMap(): { [p: string]: { name: string; modalName: string } } {
    return this._addToCartCheckCodeMap;
  }

  set addToCartCheckCodeMap(value: { [p: string]: { name: string; modalName: string } }) {
    this._addToCartCheckCodeMap = value;
  }

  getModalOption(response: any): any {
    const option =
      this.modalOptionMap[this.addToCartCheckCodeMap[response.responseCode]?.modalName]?.modalOption
      ?? this.modalOptionMap['simple-dialog'].modalOption;

    switch (response.responseCode) {
      case '0000':
        break;
      default:
        option.config.data.text = response.responseMessage;
        break;
    }
    return option;
  }
}
