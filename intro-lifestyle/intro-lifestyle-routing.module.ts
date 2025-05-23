import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IntroLifestylePage } from './intro-lifestyle.page';

const routes: Routes = [
  {
    path: '',
    component: IntroLifestylePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntroLifestylePageRoutingModule {}
