import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-detail-card',
  templateUrl: './product-detail-card.component.html',
  styleUrls: ['./product-detail-card.component.scss'],
})
export class ProductDetailCardComponent implements OnInit {
  @Input() data?: any = {
    title: '90XB0450-BMU000',
    subTitle: 'ASUS WT300 無線光電滑鼠',
    hint: '促銷備註',
    price: '$0',
    discount: '$690',
    priceHint: '(未)'
  };

  constructor() {}

  ngOnInit(): void {}
}
