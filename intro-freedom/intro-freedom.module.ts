import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IntroFreedomPageRoutingModule } from './intro-freedom-routing.module';

import { IntroFreedomPage } from './intro-freedom.page';
import { DirectivesModule } from '../scripts/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DirectivesModule,
    IntroFreedomPageRoutingModule
  ],
  declarations: [IntroFreedomPage]
})
export class IntroFreedomPageModule {}
