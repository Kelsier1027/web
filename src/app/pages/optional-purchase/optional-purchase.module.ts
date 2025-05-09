import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionalPurchaseRoutingModule } from './optional-purchase-routing.module';
import { SwiperModule } from 'swiper/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    OptionalPurchaseRoutingModule,
    SwiperModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class OptionalPurchaseModule { }
