import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShoppingCartRoutingModule } from './shopping-cart-routing.module';
import { LayoutsModule } from 'src/app/layouts/layouts.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from 'src/app/shared/services';
import { SwiperModule } from 'swiper/angular';
import { ShoppingCartComponent } from './shopping-cart.component';
import { LoaderComponent } from 'src/app/shared/components/loader/loader.component';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [
    ShoppingCartComponent,
  ],
  imports: [
    CommonModule,
    ShoppingCartRoutingModule,
    LayoutsModule,
    SharedModule,
    ReactiveFormsModule,
    SwiperModule,
    FormsModule,
    MatTableModule
  ],
  exports: [
    LoaderComponent
  ],
  providers: [DialogService],
})
export class ShoppingCartModule {}
