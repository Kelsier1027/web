import { Component, HostListener, Input } from '@angular/core';
import { promoTagLabel } from 'src/app/constants/product.constants';

@Component({
  selector: 'app-recommended-likes-products',
  templateUrl: './recommended-likes-products.component.html',
  styleUrls: ['./recommended-likes-products.component.scss'],
})
export class RecommendedLikesProductsComponent {
  @Input() headerText!: string;
  @Input() products!: any[];
  @Input() source: string = "guess-you-like";
  
  promoTagLabel: typeof promoTagLabel = promoTagLabel;
  isDesktop = window.innerWidth >= 1024;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.onSetIsDesktop();
  }

  onSetIsDesktop() {
    this.isDesktop = window.innerWidth >= 1024;
  }

  promoTagLabelIndexModify(element: any): number{
    if(element == null || element == undefined){
      return 1;
    }
    return element;
  }
}
