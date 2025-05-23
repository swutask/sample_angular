import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IntroGoalsPageRoutingModule } from './intro-goals-routing.module';

import { IntroGoalsPage } from './intro-goals.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IntroGoalsPageRoutingModule
  ],
  declarations: [IntroGoalsPage]
})
export class IntroGoalsPageModule {}
