import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderCompleteRoutingModule } from './order-complete-routing.module';
import { LayoutsModule } from 'src/app/layouts/layouts.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogService, LayoutService } from 'src/app/shared/services';
import { SwiperModule } from 'swiper/angular';
import { OrderCompleteComponent } from './order-complete.component';
import { LoaderComponent } from 'src/app/shared/components/loader/loader.component';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [OrderCompleteComponent],
  imports: [
    CommonModule,
    OrderCompleteRoutingModule,
    LayoutsModule,
    SharedModule,
    ReactiveFormsModule,
    SwiperModule,
    FormsModule,
    MatTableModule,
    MatProgressBarModule
  ],
  exports: [LoaderComponent],
  providers: [DialogService, LayoutService],
})
export class OrderCompleteModule {}
