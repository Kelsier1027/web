import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter, map, startWith } from 'rxjs';
import { GlobalStateService } from '../core/services/global-state.service';
import { LayoutEnum } from '../enums/layout.enum';
import { LayoutService } from '../shared/services/layout.service';
import { StorageService } from '../core/services/storage.service';
import { StorageEnum } from '../enums/storage.enum';
import { ScrollService } from '../services/scroll.service';
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent {
  isHomePage!: boolean;
  isProductPage!: boolean;
  isMemberPage!: boolean;
  isWishlistPage!: boolean;
  isCustomerService!: boolean;
  isCategoryLayout$ = this.globalService.isOpenFixedNav$.pipe(
    map((isOpenFixedNav) => isOpenFixedNav === LayoutEnum.Category)
  );
  scrollToHide: boolean = false;
  fixedProduct: boolean = false;
  layoutZIndex = 4;
  compareItems:any;

  private isComparesInSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    public globalService: GlobalStateService,
    public layoutService: LayoutService,
    private storageService: StorageService,
    private scrollService: ScrollService,
  ) {
    this.router.events
      .pipe(
        startWith(null),
        filter((event) => !event || event instanceof NavigationEnd),
        map(() => this.router.url)
      )
      .subscribe((url) => {
        const urlLower = url.toLowerCase();
        this.isHomePage = url === '/';
        this.isProductPage =
          urlLower.startsWith('/productlist') ||
          urlLower.startsWith('/product');
        this.isMemberPage = urlLower.startsWith('/member');
        this.isCustomerService = urlLower.startsWith('/customerservice');
        this.isWishlistPage = url === '/Member/Wishlist';
      });
  }
  ngOnInit(): void {
    this.isComparesInSubscription = this.storageService.valueChanged().subscribe((res) => {
      this.compareItems = this.storageService.get(StorageEnum.ComparingItems);
    });
  }

  ngOnDestroy(): void {
    if (this.isComparesInSubscription) {
      this.isComparesInSubscription.unsubscribe();
    }
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    let element = document.querySelector('.layout') as HTMLElement;
    if (
      window.scrollY > element.clientHeight ||
      document.documentElement.scrollTop > element.clientHeight
    ) {
      this.scrollToHide = true;
    } else {
      this.scrollToHide = false;
    }

    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollPosition = window.scrollY || document.body.scrollTop + (document.documentElement && document.documentElement.scrollTop || 0);

    const scrollRatio = scrollPosition / (documentHeight - windowHeight);

    this.scrollService.setScrollRatio(scrollRatio);
  }

  toggleMenuType(event: boolean) {
    this.globalService.isOpenFixedNav$.next(event ? LayoutEnum.Category : null);
  }

  fixedProductCol($event: any): void {
    this.fixedProduct = $event;
  }

  layoutZIndexChange($event: any): void {
    this.layoutZIndex = $event;
  }
}
