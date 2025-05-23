import {
    NgModule,
    CUSTOM_ELEMENTS_SCHEMA
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
    Dashboard
} from './Dashboard';
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
    CurrencyPipe
} from '@angular/common'
import { SharedModule } from '../shared.module';
import { UserAvatarComponent } from '../components/user-avatar/user-avatar.component';
import { ChartsModule } from 'ng2-charts';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { NgCircleProgressModule } from 'ng-circle-progress';
@NgModule({
    declarations: [
        Dashboard
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
            component: Dashboard
        }]),
        ChartsModule,
        NgCircleProgressModule.forRoot({}),
        NgxTippyModule
    ],
    exports: [
        Dashboard
    ],
    providers: [
        CurrencyPipe
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class DashboardPageModule { }