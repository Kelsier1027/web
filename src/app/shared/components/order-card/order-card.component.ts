import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubMethod } from 'src/app/enums';
import { StorageCapacityUnitEnum } from 'src/app/enums/storage.enum';
import { ProductDetail, PromoInfo } from 'src/app/models';

@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.scss'],
})
export class OrderCardComponent implements OnInit {
  @Input()
  defaultStyle = true;
  @Input()
  detail!: {header: string, startDate: string, endDate: string, shippingDate?: string, products: { itemName: string, description: string, unitPrice?: number, priceWithTax?: number, promoPrice?: number, ratio?: number }[]}
  @Input()
  remark!: string | null;
  @Input()
  shippingStartDate!: string | null;
  @Input()
  shippingEndDate!: string | null;
  @Input()
  showPrice: boolean = false;
  @Input()
  subMethod?: SubMethod;
  @Input()
  productTag?: string;
  @Input()
  currentPromotion?: PromoInfo;
  @Input()
  isMobileSynology: boolean = false;
  @Input()
  brandOptionsForMobileSynology?: {
    name: string;
    selected: boolean
  }[];
  @Input()
  capacityOptionsForMobileSynology?: {
    name: string;
    selected: boolean;
    storageCapacity: number;
    storageCapacityUnit: StorageCapacityUnitEnum;
  }[];
  @Input()
  productNumberOptionsForMobileSynology!: {
    name: string;
    selected: boolean
  }[];
  SubMethodEnum = SubMethod;

  //出貨日
  @Input()
  shippingDate!: string | null;


  @Output()
  selectionChange = new EventEmitter<{ value: number, name: string }>();

  selectedproduct!: string;
  constructor() {}

  ngOnInit(): void {
  }
  checkProductNumberOptions(productNumberOptions : any){
    if(productNumberOptions == undefined || productNumberOptions == null || productNumberOptions.length == 0){
      return false;
    }else{
      return true
    }
  }
  onRadioButtonClick(product : any,index : number){
    this.selectedproduct = product.itemName;
    this.selectionChange.emit({ value: index, name: 'ProductNumber' });
  }

  selectBrand(idx: number) {
    this.selectionChange.emit({ value: idx, name: 'Brand' });
  }
  selectCapacity(idx: number) {
    this.selectionChange.emit({ value: idx, name: 'Capacity' });
  }
}
