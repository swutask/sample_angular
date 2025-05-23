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
    templateUrl: 'ND1Calc_legacy.html',
    selector: 'page-n-d1-calc_legacy',
    styleUrls: ['ND1Calc_legacy.scss']
})
export class ND1Calc_legacy {
    public currentItem: any = null;
    public mappingData: any = {};
    constructor(public route: ActivatedRoute, public router: Router, public navCtrl: NavController, public userSvc: userService) {
    }
    goBack() {
        this.navCtrl.back();
    }
    ionViewDidEnter() {
        this.pageIonViewDidEnter__j_1047();
    }
    async pageIonViewDidEnter__j_1047(event ? , currentItem ? ) {
        let __aio_tmp_val__: any;
    }
}