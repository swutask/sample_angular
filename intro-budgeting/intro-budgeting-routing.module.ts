import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IntroBudgetingPage } from './intro-budgeting.page';

const routes: Routes = [
  {
    path: '',
    component: IntroBudgetingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntroBudgetingPageRoutingModule {}
