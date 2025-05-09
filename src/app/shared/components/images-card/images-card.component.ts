import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-images-card',
  templateUrl: './images-card.component.html',
  styleUrls: ['./images-card.component.scss'],
})
export class ImagesCardComponent implements OnInit {
  @Input() border?: boolean = false;
  @Input() select?: boolean = false;
  @Input() simple?: boolean = false;

  @Input() data?: any = {
    imgUrl: '../../../../../assets/images//Product_Image.png',
    title: 'ASUS 90XB0450-BMU000',
    price: 590,
    discount: 500,
    promoName: "",
    promoRemark: "",
  };
  constructor() {}

  ngOnInit(): void {}
}
