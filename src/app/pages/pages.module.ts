import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LayoutsModule } from '../layouts/layouts.module';
import { SharedModule } from '../shared/shared.module';
import { PromotionComponent } from './promotion/promotion.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SwiperModule } from "swiper/angular";
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { OnSaleComponent } from './on-sale/on-sale.component';
import { RewardActivityComponent } from './reward-activity/reward-activity.component';
import { ProductComparisonComponent } from './product-comparison/product-comparison.component'; 

import { NgxPaginationModule } from 'ngx-pagination';
import { CustomerServiceComponent } from './customer-service/customer-service.component';
import { OptionalPurchaseComponent } from './optional-purchase/optional-purchase.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    PagesComponent,
     PageNotFoundComponent,
     PromotionComponent, 
     OnSaleComponent, 
     RewardActivityComponent, 
     CustomerServiceComponent, 
     OptionalPurchaseComponent, 
     ProductComparisonComponent
  ],
  imports: [
    LayoutsModule, 
    CommonModule, 
    PagesRoutingModule, 
    ReactiveFormsModule, 
    MatToolbarModule,
    SwiperModule,
    MatIconModule,
    FormsModule,
    NgxPaginationModule,
    SharedModule,
    MatSlideToggleModule
  ],
})
export class PagesModule { }
