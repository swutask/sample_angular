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
    MyProfile
} from './MyProfile';
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
import {
    SharedModule
} from '../shared.module';
import { 
    HttpClientModule 
} from '@angular/common/http';
import { IonIntlTelInputModule } from 'ion-intl-tel-input';

@NgModule({
    declarations: [
        MyProfile
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SharedModule,
        PipesModule,
        DirectivesModule,
        ComponentsModule,
        CustomComponentsModule,
        HttpClientModule,
        IonIntlTelInputModule,
        CustomModulesModule, ReactiveFormsModule, RouterModule.forChild([{
            path: '',
            component: MyProfile
        }])
    ],
    exports: [
        MyProfile
    ]
})
export class MyProfilePageModule { }