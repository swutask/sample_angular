import {
    CommonModule
} from '@angular/common';
import {
    NgModule
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import {
    IonicModule
} from '@ionic/angular';
import { IonIntlTelInputModule } from 'ion-intl-tel-input';
import { UserAvatarComponent } from './components/user-avatar/user-avatar.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import {
    EditProfileConfirmationCodeModal
} from './EditProfileConfirmationCodeModal/EditProfileConfirmationCodeModal';
import {
    EditProfileInputChangeModal
} from './EditProfileInputChangeModal/EditProfileInputChangeModal';
import { CompoundReturnComponent } from './components/compound-return/compound-return.component';
import {RouterModule} from '@angular/router';
import { FreedomNumberComponent } from './components/freedom-number/freedom-number.component';
import { LifestyleNumberComponent } from './components/lifestyle-number/lifestyle-number.component';
import { DirectivesModule } from './scripts/directives.module';
import { PopoverMessageComponent } from './components/popover-message/popover-message.component';
import { DebtTutorialComponent } from './components/debt-tutorial/debt-tutorial.component';
import { Nd2TutorialComponent } from './components/nd2-tutorial/nd2-tutorial.component';
import { Nd1TutorialComponent } from './components/nd1-tutorial/nd1-tutorial.component';
import { FreedomTutorialComponent } from './components/freedom-tutorial/freedom-tutorial.component';
import { LifestyleTutorialComponent } from './components/lifestyle-tutorial/lifestyle-tutorial.component';
import { GoalsTutorialComponent } from './components/goals-tutorial/goals-tutorial.component';
import { CompoundTutorialComponent } from './components/compound-tutorial/compound-tutorial.component';
import { GlobalNavComponent } from './components/global-nav/global-nav.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { PipesModule } from './scripts/pipes.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        IonIntlTelInputModule,
        RouterModule,
        DirectivesModule,
        PipesModule,
        NgCircleProgressModule.forRoot({}),
    ],
    declarations: [
        EditProfileConfirmationCodeModal,
        EditProfileInputChangeModal,
        UserAvatarComponent,
        SideMenuComponent,
        GlobalNavComponent,
        CompoundReturnComponent,
        DebtTutorialComponent,
        Nd2TutorialComponent,
        Nd1TutorialComponent,
        FreedomTutorialComponent,
        LifestyleTutorialComponent,
        CompoundTutorialComponent,
        GoalsTutorialComponent,
        PopoverMessageComponent,
        FreedomNumberComponent,
        LifestyleNumberComponent,
    ],
    exports: [
        UserAvatarComponent,
        SideMenuComponent,
        GlobalNavComponent,
        CompoundReturnComponent,
        DebtTutorialComponent,
        Nd2TutorialComponent,
        Nd1TutorialComponent,
        FreedomTutorialComponent,
        LifestyleTutorialComponent,
        CompoundTutorialComponent,
        GoalsTutorialComponent,
        PopoverMessageComponent,
        FreedomNumberComponent,
        LifestyleNumberComponent,
    ]
})

export class SharedModule { }