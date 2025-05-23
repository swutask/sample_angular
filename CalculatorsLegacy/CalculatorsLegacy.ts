import {
    Component
} from '@angular/core';
import {
    LoadingController
} from '@ionic/angular';
import {
    NavController
} from '@ionic/angular';
import {
    Router
} from '@angular/router';
import {
    ExportedClass as userService
} from '../scripts/custom/userService';
import {
    ExportedClass as CmsResourceList
} from '../scripts/custom/CmsResourceList';
import {
    NavigationExtras
} from '@angular/router';
@Component({
    templateUrl: 'CalculatorsLegacy.html',
    selector: 'page-calculators-legacy',
    styleUrls: ['CalculatorsLegacy.scss']
})
export class CalculatorsLegacy {
    public resourceList: CmsResourceList;
    public access: string = 'Free';
    public currentItem: any = null;
    public mappingData: any = {};
    doRefresh(refresher) {
    }
    constructor(public navCtrl: NavController, public userSvc: userService, public loadingCtrl: LoadingController, public router: Router) {
        this.doRefresh(null);
    }
    openND2Calc() {
        const navigationExtras: NavigationExtras = {
            state: Object.assign({}, null)
        };
        this.navCtrl.navigateForward("nd2calcpage", navigationExtras);
    }
    openDebtPayoffCalc() {
        const navigationExtras: NavigationExtras = {
            state: Object.assign({}, null)
        };
        this.navCtrl.navigateForward("debtpayoffcalc", navigationExtras);
    }
    openCompoundReturnCalc() {
        const navigationExtras: NavigationExtras = {
            state: Object.assign({}, null)
        };
        this.navCtrl.navigateForward("compoundreturncalc", navigationExtras);
    }
    openPositionSizeCalc() {
        const navigationExtras: NavigationExtras = {
            state: Object.assign({}, null)
        };
        this.navCtrl.navigateForward("positionsizecalc", navigationExtras);
    }
    openFreedomCalc() {
        const navigationExtras: NavigationExtras = {
            state: Object.assign({}, null)
        };
        this.navCtrl.navigateForward("freedomcalc_legacy", navigationExtras);
    }
    openLifestyleCalc() {
        const navigationExtras: NavigationExtras = {
            state: Object.assign({}, null)
        };
        this.navCtrl.navigateForward("lifestylecalc_legacy", navigationExtras);
    }
    openNetWorthCalc() {
        const navigationExtras: NavigationExtras = {
            state: Object.assign({}, null)
        };
        this.navCtrl.navigateForward("networthcalc", navigationExtras);
    }
    openND1Calc() {
        const navigationExtras: NavigationExtras = {
            state: Object.assign({}, null)
        };
        this.navCtrl.navigateForward("nd1calc_legacy", navigationExtras);
    }
    openGRMCalc() {
        const navigationExtras: NavigationExtras = {
            state: Object.assign({}, null)
        };
        this.navCtrl.navigateForward("grmcalc", navigationExtras);
    }
    hasAccessToPlans() {
        return ["comppro", "pro", "comppremium", "premium", "admin"].indexOf(this.access.toLowerCase()) !== -1;
    }
    goBack() {
        this.navCtrl.back();
    }
}