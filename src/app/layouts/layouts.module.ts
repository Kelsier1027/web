import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { SwiperModule } from 'swiper/angular';

import { DialogService } from '../shared/services';
import { SharedModule } from '../shared/shared.module';
import { AnchorLayoutComponent } from './anchor-layout/anchor-layout.component';
import { FixedNavComponent } from './components/fixed-nav/fixed-nav.component';
import { FooterMobileNavComponent } from './components/footer-mobile-nav/footer-mobile-nav.component';
import { HomeFlashSaleComponent } from './components/home-flash-sale/home-flash-sale.component';
import { TimerComponent } from './components/home-flash-sale/timer/timer.component';
import { HomeFooterComponent } from './components/home-footer/home-footer.component';
import { HomeHeaderActionComponent } from './components/home-header-action/home-header-action.component';
import { HomeHeaderBannerCardComponent } from './components/home-header-banner-card/home-header-banner-card.component';
import { HomeHeaderNoticeComponent } from './components/home-header-notice/home-header-notice.component';
import { HomeHeaderProductComponent } from './components/home-header-product/home-header-product.component';
import { HomeHeaderSearchComponent } from './components/home-header-search/home-header-search.component';
import { HomeHeaderSlideshowComponent } from './components/home-header-slideshow/home-header-slideshow.component';
import { HomeHeaderTypeListComponent } from './components/home-header-type-list/home-header-type-list.component';
import { HomeIncentiveActivitiesComponent } from './components/home-incentive-activities/home-incentive-activities.component';
import { HomeStrongDiscountComponent } from './components/home-strong-discount/home-strong-discount.component';
import { LoginFooterComponent } from './components/login-footer/login-footer.component';
import { LoginGuideRowComponent } from './components/login-guide-row/login-guide-row.component';
import { LoginHeaderComponent } from './components/login-header/login-header.component';
import { MemberHeaderInfoComponent } from './components/member-header-info/member-header-info.component';
import { MemberHeaderMobileNavComponent } from './components/member-header-mobile-nav/member-header-mobile-nav.component';
import { MemberMenuComponent } from './components/member-menu/member-menu.component';
import { CustomerServiceCardComponent } from './customer-service-card/customer-service-card.component';
import { CustomerServiceMenuComponent } from './customer-service-menu/customer-service-menu.component';
import { HomeLayoutComponent } from './home-layout/home-layout.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { MemberLayoutComponent } from './member-layout/member-layout.component';
import { ProductLayoutComponent } from './product-layout/product-layout.component';
import { ProductListLayoutComponent } from './product-list-layout/product-list-layout.component';
import { ActivityBonusComponent } from './activity-bonus/activity-bonus.component';
import { RecommendedLikesProductsComponent } from './recommended-likes-products/recommended-likes-products.component';
import { ProductHeaderSlideshowComponent } from './components/product-header-slideshow/product-header-slideshow.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

const layoutComponents = [
  LoginHeaderComponent,
  LoginFooterComponent,
  LoginGuideRowComponent,
  HomeFooterComponent,
  MainLayoutComponent,
  HomeLayoutComponent,
  HomeHeaderNoticeComponent,
  HomeHeaderActionComponent,
  HomeHeaderSearchComponent,
  HomeHeaderProductComponent,
  HomeHeaderSlideshowComponent,
  HomeHeaderBannerCardComponent,
  HomeIncentiveActivitiesComponent,
  HomeStrongDiscountComponent,
  HomeFlashSaleComponent,
  TimerComponent,
  MemberLayoutComponent,
  MemberHeaderInfoComponent,
  MemberHeaderMobileNavComponent,
  FixedNavComponent,
  FooterMobileNavComponent,
  MemberMenuComponent,
  CustomerServiceMenuComponent,
  CustomerServiceCardComponent,
  ProductListLayoutComponent,
  HomeHeaderTypeListComponent,
  ProductLayoutComponent,
  AnchorLayoutComponent,
  ActivityBonusComponent,
  RecommendedLikesProductsComponent,
  ProductHeaderSlideshowComponent
];

@NgModule({
  declarations: [...layoutComponents],
  imports: [
    CommonModule,
    SharedModule,
    SwiperModule,
    RouterModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [DialogService, LayoutService],
  exports: [...layoutComponents],
})
export class LayoutsModule {}
