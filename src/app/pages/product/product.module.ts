import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { LayoutsModule } from 'src/app/layouts/layouts.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from 'src/app/shared/services';
import { ProductComponent } from './product.component';
import { SelectedPromotionDetailsCardComponent } from './components/selected-promotion-details-card/selected-promotion-details-card.component';
import { PromotionCardComponent } from './components/promotion-card/promotion-card.component';
import { TableCardComponent } from './components/table-card/table-card.component';
import { SwiperCardComponent } from './components/swiper-card/swiper-card.component';
import { SwiperModule } from 'swiper/angular';
import { SelectedDetailCardMobileComponent } from './components/selected-detail-card-mobile/selected-detail-card-mobile.component';
import { ShoppingChipComponent } from './components/shopping-chip/shopping-chip.component';
import { ShoppingChipListComponent } from './components/shopping-chip-list/shopping-chip-list.component';

@NgModule({
  declarations: [
    ProductComponent,
    SelectedPromotionDetailsCardComponent,
    PromotionCardComponent,
    TableCardComponent,
    SwiperCardComponent,
    SelectedDetailCardMobileComponent,
    ShoppingChipComponent,
    ShoppingChipListComponent,
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    LayoutsModule,
    SharedModule,
    ReactiveFormsModule,
    SwiperModule,
    FormsModule,
    MatChipsModule,
  ],
  providers: [DialogService],
})
export class ProductModule {}
