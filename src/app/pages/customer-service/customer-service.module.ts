import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { LayoutsModule } from 'src/app/layouts/layouts.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomerServiceRoutingModule } from './customer-service-routing.module';
import { CommonProblemComponent } from './common-problem/common-problem.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonProblemRowComponent } from './common-problem-row/common-problem-row.component';
import { ImportantNoticeComponent } from './important-notice/important-notice.component';
import { ImportantNoticeContentComponent } from './important-notice-content/important-notice-content.component';


@NgModule({
  declarations: [
    CommonProblemComponent,
    CommonProblemRowComponent,
    ImportantNoticeComponent,
    ImportantNoticeContentComponent
  ],
  imports: [
    CommonModule,
    CustomerServiceRoutingModule,
    LayoutsModule,
    SharedModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ]
})
export class CustomerServiceModule { }
