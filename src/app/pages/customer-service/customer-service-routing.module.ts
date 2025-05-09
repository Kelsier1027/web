import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonProblemComponent } from './common-problem/common-problem.component';
import { CustomerServiceComponent } from './customer-service.component';
import { ImportantNoticeComponent } from './important-notice/important-notice.component';


const routes: Routes = [{
  path: '',
  redirectTo: 'CustomerService',
  pathMatch: 'full',
},
{
  path: '',
  component: CustomerServiceComponent,
  children: [
    {
      path: 'CommonProblom',
      component: CommonProblemComponent,
      data: { name: 'iOrder小幫手' },
    },
    {
      path: 'ImportantNotice',
      component: ImportantNoticeComponent,
      data: { name: '重要公告' },
    },
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerServiceRoutingModule { }
