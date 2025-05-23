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
    ExportedClass as userService
} from '../scripts/custom/userService';
import { Subscription } from 'rxjs';
@Component({
    templateUrl: 'Notifications.html',
    selector: 'page-notifications',
    styleUrls: ['Notifications.scss']
})
export class Notifications {
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
    constructor(public menuController: MenuController, public navCtrl: NavController, public router: Router, public userSvc: userService) {
    }

    ionViewDidEnter() {
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