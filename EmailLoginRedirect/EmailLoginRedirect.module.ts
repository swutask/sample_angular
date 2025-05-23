import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EmailLoginRedirectPage } from './EmailLoginRedirect';

const routes: Routes = [
  {
    path: '',
    component: EmailLoginRedirectPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EmailLoginRedirectPage]
})
export class EmailLoginRedirectPageModule {}
