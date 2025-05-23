import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  Routes,
  RouterModule
} from '@angular/router';
import {
  IonicModule
} from '@ionic/angular';
import {
  Page1Page
} from './page1.page';
import {
  SharedModule
} from '../shared.module';
import { IonIntlTelInputModule } from 'ion-intl-tel-input';

const routes: Routes = [
  {
    path: '',
    component: Page1Page
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ReactiveFormsModule,
    IonIntlTelInputModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    Page1Page
  ]
})

export class Page1PageModule { }

