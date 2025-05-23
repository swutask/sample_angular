import {
    Component
} from '@angular/core';
import {
    ModalController,
    NavController
} from '@ionic/angular';
@Component({
    templateUrl: 'ND2Tutorial.html',
    selector: 'page-n-d2-tutorial',
    styleUrls: ['ND2Tutorial.scss']
})
export class ND2Tutorial {
    public currentItem: any = null;
    public mappingData: any = {};
    close() {
        this.modalController.dismiss();
    }
    openMore() {
        this.navCtrl.navigateForward("resourceDetails/ck0eaggd9bi210a30bgas8560/ck0so32fablqa0a30w10beaee");
        this.modalController.dismiss();
    }
    constructor(public modalController: ModalController, public navCtrl: NavController) {
    }
}