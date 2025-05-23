import {
    Component
} from '@angular/core';
import {
    ModalController
} from '@ionic/angular';
@Component({
    templateUrl: 'CompoundReturnTutorial.html',
    selector: 'page-compound-return-tutorial',
    styleUrls: ['CompoundReturnTutorial.scss']
})
export class CompoundReturnTutorial {
    public currentItem: any = null;
    public mappingData: any = {};
    close() {
        this.modalController.dismiss();
    }
    constructor(public modalController: ModalController) {
    }
}