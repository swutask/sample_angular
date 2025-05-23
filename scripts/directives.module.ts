import {
    NgModule
} from '@angular/core';
import {
    IonicModule
} from '@ionic/angular';
import {
    ExportedClass as VideoFrameDirective
} from './custom/VideoFrameDirective';
import {
    ExportedClass as MarkedDirective
} from './custom/MarkedDirective';
import {
    ExportedClass as InAppBrowserLinkDirective
} from './custom/InAppBrowserLinkDirective';
import {
    ExportedClass as ShowHelpMessageDirective
} from './custom/ShowHelpMessageDirective';
import { CustomMaskDirective } from '../scripts/custom/CustomMaskDirective';
import IonIconTitleDirective from './custom/ionIconTitleDirective';
@NgModule({
    declarations: [
        VideoFrameDirective,
        MarkedDirective,
        InAppBrowserLinkDirective,
        ShowHelpMessageDirective,
        CustomMaskDirective,
        IonIconTitleDirective,
    ],
    imports: [IonicModule],
    exports: [
        VideoFrameDirective,
        MarkedDirective,
        InAppBrowserLinkDirective,
        ShowHelpMessageDirective,
        CustomMaskDirective,
        IonIconTitleDirective,
    ]
})
export class DirectivesModule {}