import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IntroEducationPageRoutingModule } from './intro-education-routing.module';

import { IntroEducationPage } from './intro-education.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IntroEducationPageRoutingModule
  ],
  declarations: [IntroEducationPage]
})
export class IntroEducationPageModule {}
