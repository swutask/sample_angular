import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IntroFinishPageRoutingModule } from './intro-finish-routing.module';

import { IntroFinishPage } from './intro-finish.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IntroFinishPageRoutingModule
  ],
  declarations: [IntroFinishPage]
})
export class IntroFinishPageModule {}
