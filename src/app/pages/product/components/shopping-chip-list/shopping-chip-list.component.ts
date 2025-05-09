import { Component, HostBinding, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-shopping-chip-list',
  templateUrl: './shopping-chip-list.component.html',
  styleUrls: ['./shopping-chip-list.component.scss'],
})
export class ShoppingChipListComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,

  ) { }
  @Input()
  items: { text: string; path: string[] }[] = [];
  @Input()
  text!: string;

  @Input()
  path!: string[];

  @Input()
  promoId!: string[];

  @HostBinding('class')
  class = 'shopping-chip-list';

  navigateTo(ThisqueryParams: any) {
    //this.router.navigate('OptionalPurchase', { queryParams });
    this.router.navigate(['OptionalPurchase'], { queryParams: { promoId: true } });
  }

  onGoto(): void {

    let basePath = this.items[0].path.toString();
    let queryParams = {};
    const questionMarkIndex = this.items[0].path.toString().indexOf('?');
    if (questionMarkIndex !== -1) {
      const basePath = this.items[0].path.toString().substring(0, questionMarkIndex);
      const queryString = this.items[0].path.toString().substring(questionMarkIndex + 1);
      const params = new URLSearchParams(queryString);
      queryParams = { promoId: queryString };
      this.router.navigate([basePath], { queryParams: queryParams });
      return;
    }
    this.router.navigate([basePath], { queryParams: queryParams });
  }


}
