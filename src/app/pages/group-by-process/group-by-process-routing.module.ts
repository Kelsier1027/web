import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupByProcessComponent } from './group-by-process.component';

const routes: Routes = [
  {
    path: 'GrooupByProcess',
    component: GroupByProcessComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupByProcessRoutingModule {}
