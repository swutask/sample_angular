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
    PipesModule
} from './pipes.module';
import {
    DirectivesModule
} from './directives.module';
import {
    ExportedClass as IonCollapsibleCardComponent
} from './custom/IonCollapsibleCardComponent';
import {
    ExportedClass as ResourceDetailsTabsContent
} from './custom/ResourceDetailsTabsContent';
import {
    ExportedClass as ResourceDetailsTabsAbout
} from './custom/ResourceDetailsTabsAbout';
import {
    ExportedClass as InfoModal
} from './custom/InfoModal';
import {
    ExportedClass as BottomMenu
} from './custom/BottomMenu';
import {
    ExportedClass as IonCollapsibleWrapperComponent
} from './custom/IonCollapsibleWrapperComponent';
@NgModule({
    declarations: [
        IonCollapsibleCardComponent,
        ResourceDetailsTabsContent,
        ResourceDetailsTabsAbout,
        InfoModal,
        BottomMenu,
        IonCollapsibleWrapperComponent,
    ],
    imports: [CommonModule, FormsModule, RouterModule, IonicModule, PipesModule, DirectivesModule],
    exports: [
        IonCollapsibleCardComponent,
        ResourceDetailsTabsContent,
        ResourceDetailsTabsAbout,
        InfoModal,
        BottomMenu,
        IonCollapsibleWrapperComponent,
    ]
})
export class ComponentsModule {}