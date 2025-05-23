import {
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
    LifestyleCalc_legacy
} from './LifestyleCalc_legacy';
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
@NgModule({
    declarations: [
        LifestyleCalc_legacy
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PipesModule,
        DirectivesModule,
        ComponentsModule,
        CustomComponentsModule,
        CustomModulesModule, RouterModule.forChild([{
            path: '',
            component: LifestyleCalc_legacy
        }])
    ],
    exports: [
        LifestyleCalc_legacy
    ]
})
export class LifestyleCalc_legacyPageModule {}