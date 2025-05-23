import {
    Component
} from '@angular/core';
import {
    ModalController,
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
import {
    ExportedClass as TFreedomCalculator
} from '../scripts/custom/TFreedomCalculator';
import {
    ExportedClass as PlansService
} from '../scripts/custom/PlansService';
@Component({
    templateUrl: 'FreedomNumberDetailsModal.html',
    selector: 'page-freedom-number-details-modal',
    styleUrls: ['FreedomNumberDetailsModal.scss']
})
export class FreedomNumberDetailsModal {
    public data: TFreedomCalculator;
    public access: string = 'Free';
    public currentItem: any = null;
    public mappingData: any = {};
    constructor(public modalController: ModalController, public plansService: PlansService, public route: ActivatedRoute, public router: Router, public navCtrl: NavController, public userSvc: userService) {
        this.data = Object.assign({}, this.plansService.getFreedomCalculator());
    }
    calculate() {
        let result = 0;
        result += this.data.housing ? this.data.housing : 0;
        result += this.data.food ? this.data.food : 0;
        result += this.data.utilities ? this.data.utilities : 0;
        result += this.data.transportation ? this.data.transportation : 0;
        result += this.data.other ? this.data.other : 0;
        this.data.result = result;
    }
    saveToAccount() {
        // this.plansService.updateFreedomCalculator(this.data).subscribe(result => {
        //         this.modalController.dismiss();
        //     },
        //     (err: any) => {
        //         console.error(err);
        //         this.userSvc.toast(err.error && err.error.message ? err.error.message : "Data save error");
        //     });
    }
    close() {
        this.modalController.dismiss();
    }
}