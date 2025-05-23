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
  Page2Page
} from './page2.page';
import {
  SharedModule
} from '../shared.module';
import { IonIntlTelInputModule } from 'ion-intl-tel-input';

const routes: Routes = [
  {
    path: '',
    component: Page2Page
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
  declarations: [Page2Page]
})

export class Page2PageModule { }
