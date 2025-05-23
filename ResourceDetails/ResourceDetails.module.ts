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
    ResourceDetails
} from './ResourceDetails';
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
    ExportedClass as ResourceDetailsTabsContent
} from '../scripts/custom/ResourceDetailsTabsContent';
import {
    ExportedClass as ResourceDetailsTabsAbout
} from '../scripts/custom/ResourceDetailsTabsAbout';
@NgModule({
    declarations: [
        ResourceDetails
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
            component: ResourceDetails
        }])
    ],
    exports: [
        ResourceDetails
    ]
})
export class ResourceDetailsPageModule {}