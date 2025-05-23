import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IntroIncomePageRoutingModule } from './intro-income-routing.module';
import { DirectivesModule } from '../scripts/directives.module';

import { IntroIncomePage } from './intro-income.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DirectivesModule,
    IntroIncomePageRoutingModule
  ],
  declarations: [IntroIncomePage]
})
export class IntroIncomePageModule {}
