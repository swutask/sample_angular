import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IntroFreedomPage } from './intro-freedom.page';

const routes: Routes = [
  {
    path: '',
    component: IntroFreedomPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntroFreedomPageRoutingModule {}
