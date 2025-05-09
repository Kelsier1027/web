import { ProductDisplayStatus } from '../enums';

export interface ReviewedList {
  itemId: string;
  lastViewedTime: number;
  refreshAfter: number;
}

export interface RecentProduct {
  time: string;
  list: Product[];
}

export interface Product {
  itemId: string;
  itemNumber: string;
  productName: string;
  productPrice: string;
  imgUrl: string;
  status: string;
  favorite: boolean;
  productDisplayStatus: ProductDisplayStatus;
  description: string;
}
