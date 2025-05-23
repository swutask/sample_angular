import {
    Component
} from '@angular/core';
import {
    MenuController,
    NavController
} from '@ionic/angular';
import {
    Router
} from '@angular/router';
import {
    ActivatedRoute
} from '@angular/router';
import {
    ExportedClass as TAccountList
} from '../scripts/custom/TAccountList';
import {
    ExportedClass as userService
} from '../scripts/custom/userService';
import {
    ExportedClass as AccountsService
} from '../scripts/custom/AccountsService';
import { Subscription } from 'rxjs';
@Component({
    templateUrl: 'Checklist.html',
    selector: 'page-checklist',
    styleUrls: ['Checklist.scss']
})
export class Checklist {
    public accountsService: AccountsService;
    public accountList: TAccountList;
    public assetAccountList: TAccountList;
    public liabilityAccountList: TAccountList;
    public currentItem: any = null;
    public mappingData: any = {};
    public userAvatar: string;
    public subscriptions: Subscription[] = [];
    createNewAccount() {
        this.navCtrl.navigateForward("accountDetails/new");
    }
    navigateToProfile() {
        this.menuController.open();
    }
    constructor(public menuController: MenuController, public userSvc: userService, public navCtrl: NavController, public router: Router, public route: ActivatedRoute) {
    }
    ionViewDidEnter() {
        this.pageIonViewDidEnter__j_1390();
    }
    async pageIonViewDidEnter__j_1390(event ? , currentItem ? ) {
        let __aio_tmp_val__: any;
        /* Run TypeScript */
        // this.accountsService.getAccountsFromBE()
        //     .subscribe(res => {
        //             this.accountList = res;
        //         },
        //         (err: any) => {
        //             console.error(err);
        //         }
        //     )

        let getUserSubscription: Subscription, getAvatarSubscription: Subscription;
        getUserSubscription = this.userSvc.getUser().subscribe(({ data: { user } }) => {
            if (user && user.avatar) {
                getAvatarSubscription = this.userSvc.getSignedUrl(user.avatar).subscribe((res: any) => {
                    if (res) {
                        this.userAvatar = res.data.getSignedUrl.signedUrl;
                    }
                })
            }
        })

        if(getUserSubscription) {
            this.subscriptions.push(getUserSubscription);
        }  

        if(getAvatarSubscription) {
            this.subscriptions.push(getAvatarSubscription);
        }  
    }
    ionViewWillLeave() {
        this.subscriptions.forEach(sub => {
            sub.unsubscribe();
        })
    }
}