import {
    Component
} from '@angular/core';
import {
    NavController
} from '@ionic/angular';
import {
    Router
} from '@angular/router';
import {
    ActivatedRoute
} from '@angular/router';
import {
    ExportedClass as userService
} from '../scripts/custom/userService';
@Component({
    templateUrl: 'LifestyleCalc_legacy.html',
    selector: 'page-lifestyle-calc_legacy',
    styleUrls: ['LifestyleCalc_legacy.scss']
})
export class LifestyleCalc_legacy {
    public currentItem: any = null;
    public mappingData: any = {};
    constructor(public route: ActivatedRoute, public router: Router, public navCtrl: NavController, public userSvc: userService) {
    }
    goBack() {
        this.navCtrl.back();
    }
    ionViewDidEnter() {
        this.pageIonViewDidEnter__j_1031();
    }
    async pageIonViewDidEnter__j_1031(event ? , currentItem ? ) {
        let __aio_tmp_val__: any;
    }
}