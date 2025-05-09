import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupByProcessComponent } from './group-by-process.component';
import { GroupByProcessRoutingModule } from './group-by-process-routing.module';
import { LayoutsModule } from 'src/app/layouts/layouts.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { InternetTradingTermsModule } from 'src/app/shared/components/dialogs/internet-trading-terms/internet-trading-terms.module';
import { DeliveryRemarkDialogModule } from 'src/app/shared/components/dialogs/delivery-remark-dialog/delivery-remark-dialog.module';
import { CommonAddressDialogModule } from 'src/app/shared/components/dialogs/common-address-dialog/common-address-dialog.module';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwiperModule } from 'swiper/angular';
import { LoaderComponent } from 'src/app/shared/components/loader/loader.component';
import { DialogService, LayoutService } from 'src/app/shared/services';


@NgModule({
  declarations: [
    GroupByProcessComponent
  ],
  imports: [
    CommonModule,
    GroupByProcessRoutingModule,
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
export class GroupByProcessModule { }
