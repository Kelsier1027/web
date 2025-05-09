import { Pipe, PipeTransform } from '@angular/core';
import { UniqByPipe } from './uniq-by.pipe';
import { flatten, map } from 'ramda';
import { promoTagLabel } from 'src/app/constants/product.constants';

@Pipe({ name: 'productListPromos' })
export class ProductListPromosPipe implements PipeTransform {
  constructor(private uniqByPipe: UniqByPipe) {}

  transform(promos: any[], selectedPromoId?: number): any[] {
    if (selectedPromoId !== undefined) {
      promos = promos.filter((promo) => promo.id === selectedPromoId);
    }

    promos.forEach(p => {
      p.tagKey = promoTagLabel[p.promoCategory ?? 1][p.promoMethod ?? 1].text;

      p.subPromoInfo?.forEach((spi: any) => {spi.tagKey = promoTagLabel[spi.promoCategory ?? 1][spi.promoMethod ?? 1].text});
    })

    const newPromos = promos
      ? this.uniqByPipe.transform(promos, 'tagKey')
      : [];
    const subPromos = promos
      ? this.uniqByPipe.transform(
          flatten(
            map((item) => {
              if (item.subPromoInfo && item.subPromoInfo.length > 0) {
                return this.uniqByPipe.transform(
                  item.subPromoInfo,
                  'tagKey'
                );
              } else {
                return [];
              }
            }, promos)
          ),
          'tagKey'
        )
      : [];

    const result = this.uniqByPipe.transform(
      [...newPromos, ...subPromos],
      'tagKey'
    );
    return result;
  }
}
