import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IntroFinish2PageRoutingModule } from './intro-finish2-routing.module';

import { IntroFinish2Page } from './intro-finish2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IntroFinish2PageRoutingModule
  ],
  declarations: [IntroFinish2Page]
})
export class IntroFinish2PageModule {}
