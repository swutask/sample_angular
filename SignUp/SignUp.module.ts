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
    SignUp
} from './SignUp';
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
import { IonIntlTelInputModule } from 'ion-intl-tel-input';
@NgModule({
    declarations: [
        SignUp
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PipesModule,
        DirectivesModule,
        ComponentsModule,
        CustomComponentsModule,
        IonIntlTelInputModule,
        CustomModulesModule, ReactiveFormsModule, RouterModule.forChild([{
            path: '',
            component: SignUp
        }])
    ],
    exports: [
        SignUp
    ]
})
export class SignUpPageModule {}