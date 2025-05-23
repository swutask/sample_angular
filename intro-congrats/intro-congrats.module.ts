import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IntroCongratsPageRoutingModule } from './intro-congrats-routing.module';

import { IntroCongratsPage } from './intro-congrats.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IntroCongratsPageRoutingModule
  ],
  declarations: [IntroCongratsPage]
})
export class IntroCongratsPageModule {}
