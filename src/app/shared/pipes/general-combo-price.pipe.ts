import { Pipe, PipeTransform } from '@angular/core';
import { TotalPricePipe } from './total-price.pipe';
import { CurrencyPipe } from '@angular/common';
import { PromoInfo } from 'src/app/models';

@Pipe({
  name: 'generalComboPrice'
})
export class GeneralComboPricePipe implements PipeTransform {
  constructor(private currencyPipe: CurrencyPipe) {}
  private totalPricePipe = new TotalPricePipe(this.currencyPipe);

  transform(
    promotion: PromoInfo | null | undefined,
    mainItemQty: number,
    unitPrice: number,
    additionalItemsTotalPrice?: number,
    synologySecondaryPorductNumber?: string
  ): string {
    if (!mainItemQty || mainItemQty === 0) {
      mainItemQty = promotion?.mainItemQty ?? 1;
    }

    // 1. 使用 totalPricePipe 計算出未格式化的數值
    let total = (
      this.totalPricePipe['transform'](
        promotion,
        mainItemQty,
        unitPrice,
        additionalItemsTotalPrice,
        synologySecondaryPorductNumber
      )
    );

    return total;
  }
}
