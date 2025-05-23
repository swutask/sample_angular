import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IntroGoalsPage } from './intro-goals.page';

const routes: Routes = [
  {
    path: '',
    component: IntroGoalsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntroGoalsPageRoutingModule {}
