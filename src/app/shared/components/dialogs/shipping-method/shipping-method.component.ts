/** --------------------------------------------------------------------------------
 *-- Description：寄送密碼 / Message box
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogAction } from 'src/app/enums';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-shipping-method',
  templateUrl: './shipping-method.component.html',
  styleUrls: ['./shipping-method.component.scss'],
  viewProviders: [{ provide: FormGroupDirective }]
})
export class ShippingMethodComponent implements OnInit {
  shippingMethod: number = 1;
  
  shippingMethods: {
    label: string;
    value: number;
  }[] = [];
  defaultDelivery = {
    label: '貨運',
    value: 1,
  };
  nightlyDelivery = {
    label: '夜配',
    value: 3,
  };
  saturdayDelivery= {
    label: `${this.thisSaturday} 到貨`,
    value: 2,
  };
  designatedDelivery = {
    label: '賣場專車',
    value: 4,
  };

  
  
  constructor(
    public shippingMehtodDialogRef: MatDialogRef<ShippingMethodComponent>,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.shippingMethods.push(this.defaultDelivery);
    this.shippingMethods.push(this.nightlyDelivery);
    this.shippingMethods.push(this.saturdayDelivery);
  }

  onConfirm() {
    this.shippingMehtodDialogRef.close({
      action: DialogAction.Save,
      data: {
        shippingMethod: this.shippingMethods 
      }
    });
  }
  get thisSaturday() {
    // 取得今天的日期
    const today = new Date();

    // 取得今天是星期幾（0 是星期日，1 是星期一，以此類推）
    const dayOfWeek = today.getDay();

    // 計算要加多少天才能到達下個星期六
    const daysUntilSaturday = 6 - dayOfWeek;

    // 複製今天的日期並加上天數，得到這週六的日期
    const nextSaturday = new Date(today);
    nextSaturday.setDate(today.getDate() + daysUntilSaturday);
    return this.datePipe.transform(
      nextSaturday,
      'yyyy/MM/dd'
    )
  }
}
