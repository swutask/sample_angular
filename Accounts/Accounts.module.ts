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
    Accounts
} from './Accounts';
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
import { NgxTippyModule } from 'ngx-tippy-wrapper';
@NgModule({
    declarations: [
        Accounts
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PipesModule,
        DirectivesModule,
        ComponentsModule,
        CustomComponentsModule,
        NgxTippyModule,
        CustomModulesModule, RouterModule.forChild([{
            path: '',
            component: Accounts
        }]),
        SharedModule
    ],
    exports: [
        Accounts
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class AccountsPageModule { }