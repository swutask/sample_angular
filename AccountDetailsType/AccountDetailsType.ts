import {
    AfterViewInit,
    Component, Input, OnInit
} from '@angular/core';
import {
    AlertController, AnimationController, ModalController, Platform, PopoverOptions
} from '@ionic/angular';
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
    ActivatedRoute
} from '@angular/router';
import {
    ExportedClass as TAccount
} from '../scripts/custom/TAccount';
import {
    ExportedClass as TAccountList
} from '../scripts/custom/TAccountList';
import {
    ExportedClass as userService
} from '../scripts/custom/userService';
import {
    ExportedClass as AccountsService
} from '../scripts/custom/AccountsService';
import {
    ExportedClass as RouterOutletService
} from '../scripts/custom/RouterOutletService';
import {
    ExportedClass as DebtPayoffService
} from '../scripts/custom/DebtPayoffService';
import {
    ExportedClass as CompoundReturnService
} from '../scripts/custom/CompoundReturnService';
import {
    ExportedClass as TCompoundReturn
} from '../scripts/custom/TCompoundReturn';
import {
    ExportedClass as BalanceSheetService
} from '../scripts/custom/BalanceSheetService';
import {
    ExportedClass as AppSideMenuService
} from '../scripts/custom/AppSideMenuService';
import { 
    ExportedClass as AccountsGraphQLService
} from '../scripts/custom/GraphQLServices/AccountsGraphQLService';
import { 
    updatedDiff 
} from 'deep-object-diff';
import { AccountDetails } from '../AccountDetails/AccountDetails';
import { NavigationOptions } from '@ionic/angular/providers/nav-controller';
import { slidecustomAnimation } from '../animations/slideDownAnimation';

@Component({
    templateUrl: 'AccountDetailsType.html',
    selector: 'page-account-details-type',
    styleUrls: ['AccountDetailsType.scss']
})
export class AccountDetailsType implements AfterViewInit,OnInit{

    @Input() id:string;
    @Input() type:string;
    @Input() onboarding:boolean;
    public actionSheetOptions:any = {
        cssClass:'goals-alert'
    }
    

    public popoverSheetOptions: any = {
        side: 'bottom',
        size: 'cover',
        cssClass:'full-width-option'

    };
    public reinvestIncome: boolean = false;
    public previousInvestmentType: string;
    constructor(public navCtrl: NavController, public userSvc: userService, public modalCtrl: ModalController,
        public loadingCtrl: LoadingController, public accountsService: AccountsService, public platform: Platform,
        public route: ActivatedRoute, public router: Router, public alertController: AlertController, 
        public debtPayoffService: DebtPayoffService, public compoundReturnService: CompoundReturnService, 
        public balanceSheetService: BalanceSheetService, public appSideMenuService: AppSideMenuService, 
        public routerOutletService: RouterOutletService, public accountsGraphQLService: AccountsGraphQLService,
        public animationCtrl: AnimationController) {
    }
    ngOnInit(): void {
        let id = this.id || this.route.snapshot.paramMap.get('id')
        let account = (id === 'new') ? {} : this.accountsService.getAccount(id);   
        const getNavState = this.router.getCurrentNavigation()?.extras.state;
    }
    ngAfterViewInit(): void {
    }

    ionViewWillLeave() {
        this.routerOutletService.swipebackEnabled = true;
    }
    ionViewWillEnter() {
        this.routerOutletService.swipebackEnabled = false;
    }
    ionViewDidEnter() {
        this.pageIonViewDidEnter();
    }
    async pageIonViewDidEnter(event ? , currentItem ? ) {
    }

    private enterAnimation = (baseEl: any) => {
        const root = baseEl.shadowRoot;
  
        const backdropAnimation = this.animationCtrl.create()
          .addElement(root.querySelector('ion-backdrop')!)
          .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');
  
        const wrapperAnimation = this.animationCtrl.create()
          .addElement(root.querySelector('.modal-wrapper')!)
          .beforeStyles({ opacity: 1, transform: 'translateY(0px)' })
          .keyframes([
            { offset: 0, opacity: '0', transform: 'translateX(var(--width))' },
            { offset: 1, opacity: '0.99', transform: 'translateX(0)' }
          ]);
  
        return this.animationCtrl.create()
          .addElement(baseEl)
          .easing('ease-in-out')
          .duration(300)
          .addAnimation([backdropAnimation, wrapperAnimation]);
      }
  
      private leaveAnimation = (baseEl: any) => {
        return this.enterAnimation(baseEl).direction('reverse');
      }

      async goBack() {
        let modal = await this.modalCtrl.getTop()
        modal.dismiss();
        this.userSvc.dismissLoader();
    }

    async createNewAccount(type: string,goBack?:boolean) {
        const modal = await this.modalCtrl.create({
            component: AccountDetails,
            enterAnimation: this.platform.width()>640?this.enterAnimation:undefined,
            leaveAnimation: this.platform.width()>640?this.leaveAnimation:undefined,
            cssClass: 'side-menu2',
            backdropDismiss: false,
            componentProps:{
                id:'new',
                type
            }
        });
        await this.modalCtrl.dismiss();
        let subscriptionBalance;
        modal.onWillDismiss().then(async (data)=>{
            if(this.onboarding && this.id=="new"){
                if(this.type=="Asset"){
                    let options:NavigationOptions={
                        animation: slidecustomAnimation
                      }
                      this.navCtrl.navigateForward('intro-finish2',options);
                }
                if(this.type=="Liability"){
                    let options:NavigationOptions={
                        animation: slidecustomAnimation
                      }
                      this.navCtrl.navigateForward('intro-congrats',options);
                }
            }
        })
        modal.present();
    }
}
