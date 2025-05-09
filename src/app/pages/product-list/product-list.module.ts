import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LayoutsModule } from 'src/app/layouts/layouts.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogService } from 'src/app/shared/services';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductListRoutingModule } from './product-list-routing.module';
import { ProductListComponent } from './product-list.component';

const Components: any[] = [];
@NgModule({
  declarations: [ProductListComponent],
  imports: [
    ProductListRoutingModule,
    CommonModule,
    LayoutsModule,
    SharedModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ],
  providers: [DialogService],
})
export class ProductListModule {}
