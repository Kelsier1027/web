import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderIncompleteRoutingModule } from './order-incomplete-routing.module';
import { LayoutsModule } from 'src/app/layouts/layouts.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogService, LayoutService } from 'src/app/shared/services';
import { SwiperModule } from 'swiper/angular';
import { OrderIncompleteComponent } from './order-incomplete.component';
import { LoaderComponent } from 'src/app/shared/components/loader/loader.component';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [OrderIncompleteComponent],
  imports: [
    CommonModule,
    OrderIncompleteRoutingModule,
    LayoutsModule,
    SharedModule,
    ReactiveFormsModule,
    SwiperModule,
    FormsModule,
    MatTableModule
  ],
  exports: [LoaderComponent],
  providers: [DialogService, LayoutService]
})
export class OrderIncompleteModule {}
