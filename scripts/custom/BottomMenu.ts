import {
    Component, OnInit
} from '@angular/core';
import {
    RouterModule,
    Routes,
    RouterLink,
    Router,
    NavigationEnd
} from '@angular/router';

import {
    ExportedClass as userService
} from './userService';
import { filter} from 'rxjs/operators';
import { Subscription } from 'rxjs';
import {
    ExportedClass as AccountsService
  } from '../../scripts/custom/AccountsService';
  import {
    ExportedClass as TAccountList
  } from '../../scripts/custom/TAccountList';
import { MenuController, NavController } from '@ionic/angular';

/**
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

@Component({
    selector: 'bottom-menu',
    template: `
    <ion-grid class="footer-grid ion-hide-sm-up">
            <ion-row>
                <ion-col class="ion-text-center cursor-pointer no-padding-right-and-left" [routerLink]="['/dashboard']" 
                [ngClass]="this.dashboardActive?'active':''" routerDirection="root">
                    
                    <ion-icon class="icon" src="assets/images/dashboard.svg"></ion-icon>

                    <span>
                        Dashboard
                    </span>
                </ion-col>
                <ion-col class="ion-text-center cursor-pointer no-padding-right-and-left" (click)="openAccounts()" 
                [ngClass]="this.accountActive?'active':''" routerDirection="root">
                    <ion-icon class="icon" src="assets/images/account.svg"></ion-icon>
                    <span>
                        Balance Sheet
                    </span>
                </ion-col>
                
                <ion-col class="ion-text-center cursor-pointer no-padding-right-and-left"
                (click)="navigateToProfile()"
                [ngClass]="this.goalsActive?'active':''" routerDirection="root">
                    <ion-icon class="icon" name="book-outline"></ion-icon>
                    <span>
                        Plan
                    </span>
                </ion-col>
                
                <ion-col class="ion-text-center cursor-pointer no-padding-right-and-left" [routerLink]="['/resources']" 
                [ngClass]="this.learnActive?'active':''" routerDirection="root">
                    <ion-icon class="iconLearn" src="assets/images/learn.svg"></ion-icon>
                    <span class="margin">
                        Learn
                    </span>
                </ion-col>     
                
            </ion-row>
    </ion-grid>`,
    styles: [`
      .footer-grid {
        background-color: #FFF;
        height: 72px !important;
        color: #2C3E50;
        padding-top: 10px !important;
        --safe-area-inset-bottom: env(safe-area-inset-bottom);
        padding-bottom: var(--safe-area-inset-bottom, 1px);
        }
        .footer-grid .icon {
            font-size: 24px;
        }
        .icon, .iconLearn{
            color: var(--disabled-theme);
        }
        .active .icon, .active .iconLearn{
            color: var(--main-theme);
        }
        .dashactive .icon{
            color: var(--main-text-color);
        }
        .footer-grid .iconLearn {
            font-size: 26px;
        }
        .footer-grid span {
            display:block;
            font-size: 12px;
        }
        .margin {
            margin-top: -2px;
        }
        .no-padding-right-and-left {
            padding-left: 0;
            padding-right: 0;
        }

    `]
})
class BottomMenuComponent implements OnInit{

    dashboardActive:boolean = false;
    accountActive:boolean = false;
    learnActive:boolean = false;
    goalsActive:boolean = false;
    public accountList: TAccountList = [];

    constructor(public userSvc: userService,public router:Router, public menuController: MenuController,
         public accountsService: AccountsService, public navCtrl: NavController) {}

    ngOnInit() {
        this.highlightMenu();
        this.router.events.pipe(
          filter(event => event instanceof NavigationEnd)
        ).subscribe(res => {
          this.highlightMenu();
        });
      }

    // openCalculators() {
    //     this.userSvc.browser("https://www.wealthbuilder.io/calculators");
    // }

    openAccounts() {
        this.navCtrl.navigateForward("balancesheet");
    }

    navigateToProfile() {
        this.userSvc.openPlanning.next('open');
        this.menuController.open();
    }

    highlightMenu(){
        switch(this.router.url){
          case '/dashboard':
            this.dashboardActive=true;this.accountActive=false;this.learnActive=false,this.goalsActive=false;break;
          case '/balancesheets':
          case '/balancesheet':
          case '/addaccount':
            this.dashboardActive=false;this.accountActive=true;this.learnActive=false,this.goalsActive=false;break;
          case '/resources':
          case '/articles':
            this.dashboardActive=false;this.accountActive=false;this.learnActive=true,this.goalsActive=false;break;
          case '/freedomnumberdetails':
          case '/lifestylenumberdetails':
          case '/goals':
          case '/nd1details':
          case '/nd2details':
          case '/debtpayoff':
            this.dashboardActive=false;this.accountActive=false;this.learnActive=false,this.goalsActive=true;break;
          default:
            this.dashboardActive=false;this.accountActive=false;this.learnActive=false,this.goalsActive=false;break;
        }
      }

}

/*
    Component class should be exported as ExportedClass
*/
export {
    BottomMenuComponent as ExportedClass
};