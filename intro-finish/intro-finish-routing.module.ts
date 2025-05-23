import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IntroFinishPage } from './intro-finish.page';

const routes: Routes = [
  {
    path: '',
    component: IntroFinishPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntroFinishPageRoutingModule {}
