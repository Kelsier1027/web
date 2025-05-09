import { Pipe, PipeTransform } from '@angular/core';
import { PromoInfo } from 'src/app/models';
import { not, __, ifElse } from 'ramda';
import { CurrencyPipe } from '@angular/common';
import { PromoMethod, SubMethod } from 'src/app/enums';

@Pipe({
  name: 'totalPrice'
})
export class TotalPricePipe implements PipeTransform {
  constructor(private currencyPipe: CurrencyPipe) {}

  transform(
    promotion: PromoInfo | null | undefined,
    currentQty: number,
    unitPrice: number,
    additionalItemsTotalPrice?: number,
    synologySecondaryPorductNumber?: string
  ): string {
    const aitp = additionalItemsTotalPrice ? additionalItemsTotalPrice : 0;

    return ifElse(
      not, // 這個條件式來自古早前人，用意不明，但 not 在這裡會是 truthy，因為它是個方法。正確應該是 not(...)
           // 所以其實會跑到 onTrue
      () => this.currency(currentQty * unitPrice + aitp),
      () => {
        if (!promotion) {
          return this.currency(currentQty * unitPrice + aitp);
        }
        switch (promotion.promoMethod) {
          case PromoMethod.Discount:
            return this.currency(
              this.getDiscountPrice(promotion, currentQty, unitPrice) + aitp
            );
          case PromoMethod.Combo: {
            if (promotion.subMethod == SubMethod.GeneralCombo) {
              const productTotalPrice = promotion.products.reduce(
                (productTotalPrice: number, product: any) =>{
                  // 排除 BONUS 開頭的 itemNumber
                  if (product?.itemNumber?.startsWith('BONUS')) {
                    return productTotalPrice;
                  }

                  // 否則正常計算加總
                  return productTotalPrice + ((product?.promoPrice ?? 0) * (product?.storageCount ?? 1));
                },
                0
              );
              return this.currency(
                ( ((promotion.price || 0) * currentQty ) + productTotalPrice) + aitp
              );
            } else {
              const sspn =
                synologySecondaryPorductNumber &&
                synologySecondaryPorductNumber.length > 0
                  ? synologySecondaryPorductNumber
                  : '';
              const [primaryProduct] = promotion.synologyItems;
              const primaryProductPromoPrice = primaryProduct
                ? primaryProduct.promoPrice ?? primaryProduct.unitPrice
                : unitPrice;
              const secondaryPorducts = [];
              if (promotion.seagateItems) {
                secondaryPorducts.push(...promotion.seagateItems);
              }
              if (promotion.toshibaItems) {
                secondaryPorducts.push(...promotion.toshibaItems);
              }
              if (promotion.westernDigitalItems) {
                secondaryPorducts.push(...promotion.westernDigitalItems);
              }
              const secondaryPorduct = secondaryPorducts.find(
                (product) => product.itemName == sspn
              );
              return this.currency(
                (((secondaryPorduct?.discValue || 0) +
                  primaryProductPromoPrice) + (promotion.promoPrice || 0)) *
                  currentQty +
                  aitp
              );
            }
          }
          case PromoMethod.AdditionalItem: {
            if (promotion.subMethod == SubMethod.AttachedAdditional) {
              return this.currency(currentQty * unitPrice + aitp);
            } else {
              const productTotalPrice = promotion.products.reduce(
                (productTotalPrice: number, product: any) =>
                  productTotalPrice + (product?.promoPrice || 0),
                0
              );
              return this.currency(
                ((promotion.price || 0) + productTotalPrice) * currentQty + aitp
              );
            }
          }
          case PromoMethod.Bulk: {
            const bulkGradeSetting = promotion.bulkGradeSettings.find(
              (bulkGradeSetting) =>
                bulkGradeSetting.minQuantity <= currentQty &&
                (!bulkGradeSetting.maxQuantity ||
                  currentQty <= bulkGradeSetting.maxQuantity)
            );

            if (bulkGradeSetting) {
              return this.currency(
                currentQty * bulkGradeSetting.promoPrice + aitp
              );
            } else {
              return this.currency(currentQty * unitPrice + aitp);
            }
          }

          default: {
            return this.currency(currentQty * unitPrice + aitp);
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

  private getDiscountPrice(
    promotion: PromoInfo | null | undefined,
    currentQty: number,
    unitPrice: number
  ) {
    const discountPrice = promotion?.price as number;
    const discConditionQty = promotion?.discConditionQty as number;
    const all = currentQty % discConditionQty === 0;

    return all
      ? currentQty * discountPrice
      : this.getRestDiscountPrice(promotion, currentQty, unitPrice);
  }

  private getRestDiscountPrice(
    promotion: PromoInfo | null | undefined,
    currentQty: number,
    unitPrice: number
  ) {
    const discountPrice = promotion?.price as number;
    const discConditionQty = (promotion?.discConditionQty ?? 1) as number;
    const rest = currentQty % discConditionQty;
    const discounts = (currentQty - rest) * discountPrice;

    return discounts + rest * unitPrice;
  }
}
