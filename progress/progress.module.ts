import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { NgCircleProgressModule } from 'ng-circle-progress';

import { ProgressPage } from './progress.page';

const routes: Routes = [
  {
    path: '',
    component: ProgressPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgCircleProgressModule.forRoot({}),
    RouterModule.forChild(routes)
  ],
  declarations: [ProgressPage]
})
export class ProgressPageModule {}
