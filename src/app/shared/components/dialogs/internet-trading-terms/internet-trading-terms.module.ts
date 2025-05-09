import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogService, LayoutService } from 'src/app/shared/services';
import { SwiperModule } from 'swiper/angular';
import { MatTableModule } from '@angular/material/table';
import { NgxPaginationModule } from 'ngx-pagination';
import { InternetTradingTermsComponent } from './internet-trading-terms.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutsModule } from 'src/app/layouts/layouts.module';

@NgModule({
  declarations: [InternetTradingTermsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SwiperModule,
    FormsModule,
    MatTableModule,
    SharedModule,
    NgxPaginationModule,
    LayoutsModule
  ],
  providers: [DialogService, LayoutService]
})
export class InternetTradingTermsModule {}
