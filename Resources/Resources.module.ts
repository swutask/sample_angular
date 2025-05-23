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
    Resources
} from './Resources';
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
        Resources
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PipesModule,
        DirectivesModule,
        ComponentsModule,
        SharedModule,
        CustomComponentsModule,
        CustomModulesModule, RouterModule.forChild([{
            path: '',
            component: Resources
        }]),
    ],
    exports: [
        Resources
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class ResourcesPageModule { }