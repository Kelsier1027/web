import { Pipe, PipeTransform } from '@angular/core';
import { PromoInfo } from 'src/app/models';

@Pipe({ name: 'maxBuyMessage' })
export class MaxBuyMessagePipe implements PipeTransform {
  transform(
    promoInfo: PromoInfo | null | undefined,
    currentQty: number,
    subPromoIndex: number
  ): string {
    const limit =
      currentQty *
      (promoInfo?.subPromoInfo[subPromoIndex]?.mainAndAdditionalRatio ?? 1);

    if (limit == 1) {
      return promoInfo ? `限加購${limit}個商品` : '';
    } else if (
      promoInfo?.subPromoInfo[subPromoIndex]
        ?.canBuyMultipleTypesOfAdditionalItems
    ) {
      return promoInfo ? `限加購${limit}個，可複選商品` : '';
    } else {
      return promoInfo ? `可加購${limit}個，限單選商品` : '';
    }
  }
}
