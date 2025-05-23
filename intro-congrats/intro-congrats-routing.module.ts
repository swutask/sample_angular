import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IntroCongratsPage } from './intro-congrats.page';

const routes: Routes = [
  {
    path: '',
    component: IntroCongratsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntroCongratsPageRoutingModule {}
