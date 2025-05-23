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
    TextWithHelpIcon
} from './TextWithHelpIcon';
import {
    PipesModule
} from '../../scripts/pipes.module';
import {
    DirectivesModule
} from '../../scripts/directives.module';
import {
    ComponentsModule
} from '../../scripts/components.module';
import {
    CustomModulesModule
} from '../../scripts/custom-modules.module';
import { BoxSelectComponent } from 'src/app/components/box-select/box-select.component';
@NgModule({
    declarations: [
        TextWithHelpIcon,
        BoxSelectComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PipesModule,
        DirectivesModule,
        ComponentsModule,
        CustomModulesModule, RouterModule
    ],
    exports: [
        TextWithHelpIcon,
        BoxSelectComponent
    ]
})
export class TextWithHelpIconComponentModule {}