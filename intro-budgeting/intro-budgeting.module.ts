import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IntroBudgetingPageRoutingModule } from './intro-budgeting-routing.module';

import { IntroBudgetingPage } from './intro-budgeting.page';
import { DirectivesModule } from '../scripts/directives.module';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DirectivesModule,
    IntroBudgetingPageRoutingModule,
    ChartsModule,
  ],
  declarations: [IntroBudgetingPage]
})
export class IntroBudgetingPageModule {}
