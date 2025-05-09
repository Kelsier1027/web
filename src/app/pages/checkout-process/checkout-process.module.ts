import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutProcessRoutingModule } from './checkout-process-routing.module';
import { LayoutsModule } from 'src/app/layouts/layouts.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogService, LayoutService } from 'src/app/shared/services';
import { SwiperModule } from 'swiper/angular';
import { CheckoutProcessComponent } from './checkout-process.component';
import { LoaderComponent } from 'src/app/shared/components/loader/loader.component';
import { MatTableModule } from '@angular/material/table';
import { CommonAddressDialogModule } from 'src/app/shared/components/dialogs/common-address-dialog/common-address-dialog.module';
import { DeliveryRemarkDialogModule } from 'src/app/shared/components/dialogs/delivery-remark-dialog/delivery-remark-dialog.module';
import { InternetTradingTermsModule } from 'src/app/shared/components/dialogs/internet-trading-terms/internet-trading-terms.module';

@NgModule({
  declarations: [CheckoutProcessComponent],
  imports: [
    CommonModule,
    CheckoutProcessRoutingModule,
    LayoutsModule,
    SharedModule,
    ReactiveFormsModule,
    SwiperModule,
    FormsModule,
    MatTableModule,
    CommonAddressDialogModule,
    DeliveryRemarkDialogModule,
    InternetTradingTermsModule
  ],
  exports: [LoaderComponent],
  providers: [DialogService, LayoutService]
})
export class CheckoutProcessModule {}
