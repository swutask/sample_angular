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
    templateUrl: 'ND2Calc.html',
    selector: 'page-n-d2-calc',
    styleUrls: ['ND2Calc.scss']
})
export class ND2Calc {
    public currentItem: any = null;
    public mappingData: any = {};
    constructor(public route: ActivatedRoute, public router: Router, public navCtrl: NavController, public userSvc: userService) {
    }
    goBack() {
        this.navCtrl.back();
    }
    ionViewDidEnter() {
        this.pageIonViewDidEnter__j_791();
    }
    async pageIonViewDidEnter__j_791(event ? , currentItem ? ) {
        let __aio_tmp_val__: any;
    }
}