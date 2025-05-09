import { Component, HostBinding, Input, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-chip',
  templateUrl: './shopping-chip.component.html',
  styleUrls: ['./shopping-chip.component.scss'],
})
export class ShoppingChipComponent {
  @Input()
  text!: string;

  @Input()
  path!: string[];

  @Input()
  promoId!: string[];

  @HostBinding('class')
  class = 'shopping-chip';

  private readonly router = inject(Router);

  onGoto(): void {
   
    let basePath =this.path.toString();
    let queryParams = {};
    const questionMarkIndex = this.path.toString().indexOf('?');
    if (questionMarkIndex !== -1) {
        const basePath = this.path.toString().substring(0, questionMarkIndex);
        const queryString = this.path.toString().substring(questionMarkIndex + 1);
        const params = new URLSearchParams(queryString);
        queryParams = { promoId: queryString };
        this.router.navigate([basePath], { queryParams: queryParams });
        return;
    }
    this.router.navigate([basePath], { queryParams: queryParams });
}
}
