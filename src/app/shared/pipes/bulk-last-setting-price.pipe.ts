import { Pipe, PipeTransform } from '@angular/core';
import { PromoInfo } from 'src/app/models';
import { not, __, ifElse } from 'ramda';
import { CurrencyPipe } from '@angular/common';
import { PromoMethod, SubMethod } from 'src/app/enums';

@Pipe({
  name: 'bulkLastSettingPrice'
})
export class BulkLastSettingPricePipe implements PipeTransform {
  constructor(private currencyPipe: CurrencyPipe) {}

  transform(
    promotion: PromoInfo | null | undefined,
    currentQty: number,
    unitPrice: number,
    additionalItemsTotalPrice: number
  ): string {
    return ifElse(
      not,
      () => this.currency(currentQty * unitPrice + additionalItemsTotalPrice),
      () => {
        if (!promotion || promotion?.promoMethod != PromoMethod.Bulk) {
          return this.currency(
            currentQty * unitPrice + additionalItemsTotalPrice
          );
        } else {
          const bulkGradeSetting = promotion.bulkGradeSettings.find(
            (bulkGradeSetting) => !bulkGradeSetting.maxQuantity
          );

          if (bulkGradeSetting) {
            return this.currency(
              currentQty * bulkGradeSetting.promoPrice +
                additionalItemsTotalPrice
            );
          } else {
            return this.currency(
              currentQty * unitPrice + additionalItemsTotalPrice
            );
          }
        }
      }
    )(promotion);
  }

  private currency(currency: number): string {
    if (currency === 0) {
      return '0';
    }

    return this.currencyPipe.transform(
      currency,
      '',
      'symbol',
      '1.0-0'
    ) as string;
  }
}
