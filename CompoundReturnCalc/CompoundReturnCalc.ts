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
    templateUrl: 'CompoundReturnCalc.html',
    selector: 'page-compound-return-calc',
    styleUrls: ['CompoundReturnCalc.scss']
})
export class CompoundReturnCalc {
    public currentItem: any = null;
    public mappingData: any = {};
    constructor(public route: ActivatedRoute, public router: Router, public navCtrl: NavController, public userSvc: userService) {
    }
    goBack() {
        this.navCtrl.back();
    }
    ionViewDidEnter() {
        this.pageIonViewDidEnter__j_991();
    }
    async pageIonViewDidEnter__j_991(event ? , currentItem ? ) {
        let __aio_tmp_val__: any;
    }
}