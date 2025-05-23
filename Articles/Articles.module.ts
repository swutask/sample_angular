import {
    CUSTOM_ELEMENTS_SCHEMA,
    NgModule
} from '@angular/core';
import {
    CommonModule
} from '@angular/common';
import {
    FormsModule
} from '@angular/forms';
import {
    RouterModule
} from '@angular/router';
import {
    IonicModule
} from '@ionic/angular';
import {
    Articles
} from './Articles';
import {
    PipesModule
} from '../scripts/pipes.module';
import {
    DirectivesModule
} from '../scripts/directives.module';
import {
    ComponentsModule
} from '../scripts/components.module';
import {
    CustomComponentsModule
} from '../scripts/custom-components.module';
import {
    CustomModulesModule
} from '../scripts/custom-modules.module';
import { SharedModule } from '../shared.module';
@NgModule({
    declarations: [
        Articles
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PipesModule,
        SharedModule,
        DirectivesModule,
        ComponentsModule,
        CustomComponentsModule,
        CustomModulesModule, RouterModule.forChild([{
            path: '',
            component: Articles
        }]),
    ],
    exports: [
        Articles
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class ArticlesPageModule {}