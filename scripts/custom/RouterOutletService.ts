import {
    Injectable
} from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet, Platform, AlertController } from '@ionic/angular';

@Injectable()
class RouterOutletService {
    private routerOutlet: IonRouterOutlet;
    // private backButton$: any;

    constructor(private alertController: AlertController, private router: Router, private platform: Platform) {
        // this.backButton$ = this.platform.backButton.subscribeWithPriority(0, () => {
        //     if(this.router.url=='/accounts' || this.router.url=='/login'){
                //  this.presentBackButtonAlert();
        //     }
        // });
    }

    init(routerOutlet: IonRouterOutlet) {
        this.routerOutlet = routerOutlet;
    }

    get swipebackEnabled(): boolean {
        if (this.routerOutlet) {
            return this.routerOutlet.swipeGesture;
        } else {
            throw new Error('Call init() first!');
        }
    }

    set swipebackEnabled(value: boolean) {
        if (this.routerOutlet) {
            this.routerOutlet.swipeGesture = value;
        } else {
            throw new Error('Call init() first!');
        }
    }

    // async presentBackButtonAlert() {
    //     const backButtonAlert = await this.alertController.create({
    //         header: 'Exit',
    //         message: 'Exit the app?',
    //         buttons: [{
    //             text: 'No',
    //             role: 'cancel',
    //             handler: () => {}

    //         }, {
    //             text: 'Yes',
    //             handler: () => {
    //                 navigator['app'].exitApp();
    //             }
    //         }]
    //     });
    //     await backButtonAlert.present();
    // }
}

/*
    Service class should be exported as ExportedClass
*/
export {
    RouterOutletService as ExportedClass
};