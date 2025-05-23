import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IntroIncomePage } from './intro-income.page';

const routes: Routes = [
  {
    path: '',
    component: IntroIncomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntroIncomePageRoutingModule {}
