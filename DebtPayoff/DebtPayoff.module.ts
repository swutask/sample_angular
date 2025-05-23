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
    DebtPayoff
} from './DebtPayoff';
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
import { 
    ChartsModule 
} from 'ng2-charts';
@NgModule({
    declarations: [
        DebtPayoff
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PipesModule,
        DirectivesModule,
        ComponentsModule,
        CustomComponentsModule,
        ChartsModule,
        CustomModulesModule, RouterModule.forChild([{
            path: '',
            component: DebtPayoff
        }])
    ],
    exports: [
        DebtPayoff
    ]
})
export class DebtPayoffPageModule {}