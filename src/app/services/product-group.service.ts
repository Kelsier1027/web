import { PromoMethod } from "../enums";

export interface Warehouse {
  id?: number;
  title: string;
  productGroups: ProductGroup[][];
}

export interface ProductGroup {
  id?: number;
  name: string;
  desc: string;
  imgSrc: string;
  price: number;
  priceWithTax: number;
  qty: number;
  stepQuantities?: number;
  availableQuantities?: number;
  maxQuantities?: number;
  mainProductId?: number;
  promotionMethod: PromoMethod;
  promoCategory: number;
  priceError?: string;
  selected: boolean;
  follow: boolean;
  replaced?: boolean;
  canReplace?: boolean;
}

export class ProductGroupService {

  private readonly selectedWarehouse: Warehouse;

  constructor(selectedWarehouse: Warehouse) {
    this.selectedWarehouse = selectedWarehouse;
  }

  productGroupHandler(predict: any, foundHandler: any) {
    if (!this.selectedWarehouse) return;
    let foundProduct;
    for (
      let index = 0;
      index < this.selectedWarehouse?.productGroups.length;
      index++
    ) {
      const products = this.selectedWarehouse.productGroups[index];
      foundProduct = products.find(() => {
        return predict(products);
      });
      if (foundProduct) {
        foundHandler(foundProduct);
        break;
      }
    }
  }

  productHandler(predict: any, foundHandler: any) {
    if (!this.selectedWarehouse) return;
  
    for (
      let index = 0;
      index < this.selectedWarehouse?.productGroups.length;
      index++
    ) {
      const products = this.selectedWarehouse.productGroups[index];
      products.filter(predict).forEach((product: any) => {
        foundHandler(product);
      });
    }
  }
}
