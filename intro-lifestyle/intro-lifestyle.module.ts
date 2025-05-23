import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IntroLifestylePageRoutingModule } from './intro-lifestyle-routing.module';

import { IntroLifestylePage } from './intro-lifestyle.page';
import { DirectivesModule } from '../scripts/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DirectivesModule,
    IntroLifestylePageRoutingModule
  ],
  declarations: [IntroLifestylePage]
})
export class IntroLifestylePageModule {}
