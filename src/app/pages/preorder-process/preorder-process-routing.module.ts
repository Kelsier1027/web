import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreorderProcessComponent } from './preorder-process.component';

const routes: Routes = [
  {
    path: 'PreorderProcess',
    component: PreorderProcessComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreorderProcessRoutingModule {}
