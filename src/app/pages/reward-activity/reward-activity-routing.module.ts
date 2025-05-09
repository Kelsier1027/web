import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RewardActivityComponent } from './reward-activity.component'; 


const routes: Routes = [
  {
    path: 'RewardActivity',
    component: RewardActivityComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RewardActivityRoutingModule { }
