import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogService, LayoutService } from 'src/app/shared/services';
import { SwiperModule } from 'swiper/angular';
import { MatTableModule } from '@angular/material/table';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonAddressDialogComponent } from './common-address-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [CommonAddressDialogComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SwiperModule,
    FormsModule,
    MatTableModule,
    SharedModule,
    NgxPaginationModule
  ],
  providers: [DialogService, LayoutService]
})
export class CommonAddressDialogModule {}
