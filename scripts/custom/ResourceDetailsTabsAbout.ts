import {
    Component,
    Input
} from '@angular/core';
import {
    ModalController
} from '@ionic/angular';
import {
    ExportedClass as InfoModal
} from '../../scripts/custom/InfoModal';
import { OldModal } from 'src/app/OldModal/OldModal';
/**
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

@Component({
    selector: 'resource-details-tabs-about',
    template: `
        <ion-item (click)="presentModal()">
            About this resource
            <ion-icon item-start name="information-circle-outline">
            </ion-icon>
        </ion-item>
    `,
    styles: []
})
class ResourceDetailsTabsAbout {
    @Input() resource: any;

    constructor(public modalCtrl: ModalController) {

    }

    async presentModal() {
        let modal = await this.modalCtrl.create({
            component: OldModal,
            componentProps: {
                'content': this.resource.about
            }
        });
        return await modal.present();
    };

}

/*
    Component class should be exported as ExportedClass
*/
export {
    ResourceDetailsTabsAbout as ExportedClass
};