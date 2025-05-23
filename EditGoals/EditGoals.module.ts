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
    EditGoals
} from './EditGoals';
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
    ReactiveFormsModule
} from '@angular/forms';
import { BoxSelectComponent } from '../components/box-select/box-select.component';
@NgModule({
    declarations: [
        EditGoals
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PipesModule,
        DirectivesModule,
        ComponentsModule,
        CustomComponentsModule,
        CustomModulesModule, ReactiveFormsModule, RouterModule.forChild([{
            path: '',
            component: EditGoals
        }])
    ],
    exports: [
        EditGoals
    ]
})
export class EditGoalsPageModule {}