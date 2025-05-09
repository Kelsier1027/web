import { Pipe, PipeTransform } from '@angular/core';
import { TotalPricePipe } from './total-price.pipe';
import { CurrencyPipe } from '@angular/common';
import { PromoInfo } from 'src/app/models';

@Pipe({
  name: 'averagePrice'
})
export class AveragePricePipe implements PipeTransform {
  constructor(private currencyPipe: CurrencyPipe) {}
  private totalPricePipe = new TotalPricePipe(this.currencyPipe);

  transform(
    promotion: PromoInfo | null | undefined,
    currentQty: number,
    unitPrice: number,
    additionalItemsTotalPrice?: number,
    synologySecondaryPorductNumber?: string
  ): string {
    if (!currentQty || currentQty === 0) {
      currentQty = 1; // 避免除以 0
    }

    // 1. 使用 totalPricePipe 計算出未格式化的數值
    let total = (
      this.totalPricePipe['transform'](
        promotion,
        currentQty,
        unitPrice,
        additionalItemsTotalPrice,
        synologySecondaryPorductNumber
      )
    );

    // 2. 格式化金額（如果你有原始未格式化金額也可以重寫 Pipe 傳回 number）
    let numericTotal = parseFloat(
      total.replace(/[^0-9.-]+/g, '') // 移除 $, , 或其他非數字符號
    );

    return this.totalPricePipe['currency'](numericTotal / currentQty);
  }
}
