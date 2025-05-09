/** --------------------------------------------------------------------------------
 *-- Description： Product List
 *-- MODIFICATION HISTORY (程式內變更記錄)
 *-- Version： 2023.01.001
 *-- Message：
 *--------------------------------------------------------------------------------
 *-- Modifier                    DateTime      Req. Number       Version changed to     Comments
 *-- Developed_By   Upload_By
 *--------------------------------------------------------------------------------
 */
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MobileMenuService } from 'src/app/services/mobile-menu.service';
import { LayoutService } from 'src/app/shared/services/layout.service';

@Component({
  selector: 'app-product-list-layout',
  templateUrl: './product-list-layout.component.html',
  styleUrls: ['./product-list-layout.component.scss'],
})
export class ProductListLayoutComponent {
  currentScreenSize: string = '';
  title: string = '';
  isProductPage!: boolean;

  constructor(
    private _title: Title,
    private router: Router,
    private route: ActivatedRoute,
    public mobileMenuService: MobileMenuService,
    public layoutService: LayoutService,
  ) {
    this.router.url.includes('Product?itemId') ? (this.isProductPage = true) : (this.isProductPage = false);

    this.router.events
    .subscribe((event) => {
      if (event instanceof NavigationEnd) {

        this.title = this.route.snapshot.data['name'];

        if (this.title)
          this._title.setTitle(this.title);
      }
    });
  }

  goHome() {
    this.router.navigate(['']);
  }
}
