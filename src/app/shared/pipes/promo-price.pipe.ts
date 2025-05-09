import { Pipe, PipeTransform } from '@angular/core';
import { AveragePricePipe } from './average-price.pipe';
import { CurrencyPipe } from '@angular/common';
import { PromoInfo } from 'src/app/models';
@Pipe({
  name: 'promoPrice'
})
export class PromoPricePipe implements PipeTransform {
  constructor(private currencyPipe: CurrencyPipe) {}
  private averagePricePipe = new AveragePricePipe(this.currencyPipe);

  transform(
    promotion: PromoInfo | null | undefined,
    currentQty: number,
    unitPrice: number,
    additionalItemsTotalPrice?: number,
    synologySecondaryPorductNumber?: string
  ): string {
    let discConditionQty = (promotion?.discConditionQty ?? 1) as number;

    // 使用 averagePricePipe 計算出促銷價格
    let promoPrice = (
      this.averagePricePipe['transform'](
        promotion,
        discConditionQty,
        unitPrice,
        additionalItemsTotalPrice,
        synologySecondaryPorductNumber
      )
    );

    return promoPrice;
  }

}
