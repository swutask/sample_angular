import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ArticleDetails } from './ArticleDetails';
import { PipesModule } from '../scripts/pipes.module';
import { DirectivesModule } from '../scripts/directives.module';
import { ComponentsModule } from '../scripts/components.module';
import { CustomComponentsModule } from '../scripts/custom-components.module';
import { CustomModulesModule } from '../scripts/custom-modules.module';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [ArticleDetails],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    DirectivesModule,
    ComponentsModule,
    CustomComponentsModule,
    CustomModulesModule,
    RouterModule.forChild([
      {
        path: '',
        component: ArticleDetails,
      },
    ]),
  ],
  exports: [ArticleDetails],
  providers: [SocialSharing],
})
export class ArticleDetailsPageModule {}
