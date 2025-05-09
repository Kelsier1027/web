/** --------------------------------------------------------------------------------
 *-- Description： 購物車service
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Injectable } from '@angular/core';
import { AddToCartCheckCodeMap, ModalOptionMap } from './cart.service.config';
import { response } from "express";

@Injectable()
export class CartService {
  constructor() {}

  _modalOptionMap: { [key: string]: { modalOption: any } } = ModalOptionMap;
  _addToCartCheckCodeMap: {
    [key: string]: { name: string; modalName: string };
  } = AddToCartCheckCodeMap;

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

  getCartCheckModalOption(response: any): any {
    const option =
      this.modalOptionMap[this.addToCartCheckCodeMap[response.responseCode].modalName]
        .modalOption;
    switch (response.responseCode) {
      case '0000':
        // do nothing
        break;
      case '1003':
        option.config.data.replaceItem = response.result;
        option.config.data.text = response.responseMessage;
        break
      case '10011':
        option.config.data.replaceItem = response.result;
        option.config.data.text = response.responseMessage;
        break;
      case '10012':
        option.config.data.replaceItem = response.result;
        option.config.data.text = response.responseMessage;
        break;
      case '10020':
        option.config.data.replaceItem = response.result;
        option.config.data.text = response.responseMessage;
        break;
      case '10021':
        option.config.data.replaceItem = response.result;
        option.config.data.text = response.responseMessage;
        break;
      case '10022':
        option.config.data.replaceItem = response.result;
        option.config.data.text = response.responseMessage;
        break;
      default:
        option.config.data.replaceItem = response.result;
        option.config.data.text = response.responseMessage;
        break;
    }
    return option;
  }
}
