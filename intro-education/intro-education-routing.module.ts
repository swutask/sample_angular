import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IntroEducationPage } from './intro-education.page';

const routes: Routes = [
  {
    path: '',
    component: IntroEducationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntroEducationPageRoutingModule {}
