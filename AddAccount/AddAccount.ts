import {
    Component
} from '@angular/core';
import {
    AlertController, AnimationController, MenuController, ModalController, PopoverController
} from '@ionic/angular';
import {
    LoadingController
} from '@ionic/angular';
import {
    NavController
} from '@ionic/angular';
import {
    Platform
} from '@ionic/angular';
import {
    NavigationExtras,
    Router
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
import {
    ExportedClass as TAccountsSummary
} from '../scripts/custom/TAccountsSummary';
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
import _ from 'lodash';
import {
    IonList
} from '@ionic/angular';
import { of, Subscription
} from 'rxjs';
import {
    ExportedClass as TBalanceSheetList
} from '../scripts/custom/TBalanceSheetList';
import { 
    ExportedClass as TBalanceSheet 
} from './../scripts/custom/TBalanceSheet';
import { updatedDiff } from 'deep-object-diff';

@Component({
    templateUrl: 'AddAccount.html',
    selector: 'page-add-account',
    styleUrls: ['AddAccount.scss']
})
export class AddAccount {
    public toggleIcon: boolean = false;
    public accountList: TAccountList = [];
    public accountsSummary: TAccountsSummary = {
        netWorth: 0,
        assetWorth: 0,
        liabilityWorth: 0,
        excludedLiabilityWorth: 0,
        tier1: 0,
        tier2: 0,
        tier3: 0,
        totalWealthAccount: 0
    };
    public assetAccountList: TAccountList;
    public liabilityAccountList: TAccountList;
    public alertIsOpened: boolean;
    public accountsDataLoadingPromise: Promise < any > ;
    public userMessage: string;
    public dataLoadingPromise: Promise < any > ;
    public compoundReturnData: TCompoundReturn;
    public compoundReturnPromise: Promise < any > ;
    public isBsExperimentActivated: boolean;
    public activeBalanceSheet: any;
    public access: string = 'Free';
    public searchTerm: string = '';
    public sortBy: string = 'createdAt';
    public currentItem: any = null;
    public mappingData: any = {};
    public userAvatar: string;
    public subscriptions: Subscription[] = [];
    public balanceSheetsList: TBalanceSheetList;
    public selectedAsset: boolean = false;
    public selectedLiabiltiy: boolean = false;
    public accountDescription='';
    public accountLabel='';
    public isClonePopOpen = false;
    public isCloneModalOpen = false;
    public isEditPopOpen = false;
    public isEditModalOpen = false;
    public selectoptions= {
        cssClass:'selectoptions'
    }

    constructor(public menuController: MenuController, public userSvc: userService, 
        public navCtrl: NavController, public loadingCtrl: LoadingController, 
        public alertController: AlertController, public accountsService: AccountsService, 
        public platform: Platform, public router: Router, public popCtrl:PopoverController,
        public routerOutletService: RouterOutletService, public debtPayoffService: DebtPayoffService, 
        public compoundReturnService: CompoundReturnService, public balanceSheetService: BalanceSheetService,
        public animationCtrl: AnimationController, public modalCtrl:ModalController) {
        const userId = this.userSvc.userId;
        this.access = this.userSvc.access || this.access;
        this.accountsSummary = {
            netWorth: 0,
            assetWorth: 0,
            liabilityWorth: 0,
            excludedLiabilityWorth: 0,
            tier1: 0,
            tier2: 0,
            tier3: 0,
            totalWealthAccount: 0
        }
        this.compoundReturnData = {
            _id: null,
            monthlyEarnedIncome: null,
            useND1WealthValue: null,
            monthlyUnearnedIncome: null,
            annualContribution: null,
            annualIncreaseContribution: null,
            annualWithdrawal: null,
            withdrawalStartingYear: null,
            volatilityDrawdown: null,
            everyNumberYears: null,
            yearsInvested: null,
        };
        this.getBalanceSheets();
    }
    goBack(){
        this.navCtrl.back();
    }
    toBalanceSheet(type:any){
        let navigationExtras: NavigationExtras = {
            state: {
              addAssets:type=='asset'?true:false,
              addLiability:type=='liablility'?true:false,
            } 
          };
        this.navCtrl.navigateForward(`balancesheet`,navigationExtras);
    }
    balanceClick(id:any,scroll = false){
        id = 'segment-'+id;
        let balancefocus = _.debounce(()=>{
            if(this.accountList.length>0)
                this.navCtrl.navigateForward('balancesheet');
        },1000,{'trailing':true});
        balancefocus();
        if(scroll){
            let tabfocus = _.debounce(()=>{
                if(document.getElementById(id)){
                    document.getElementById(id).scrollIntoView({
                        block: 'center',
                        inline: 'center'
                        });
                }
            },1000,{'trailing':true});
            tabfocus();
        }
        // else{
        //     if(document.getElementById(id)){
        //         document.getElementById(id).scrollIntoView({
        //             block: 'center',
        //             inline: 'center'
        //             });
        //     }
        // }
    }
    getBalanceSheets(){
        this.balanceSheetService.getBalanceSheets().subscribe((res: any) => {
            if(this.balanceSheetsList?.length != res.data.balanceSheets.length){
                this.balanceSheetsList = res.data.balanceSheets;
                this.balanceSheetsList = this.balanceSheetsList.sort((a,b)=>{return this.compareDate(new Date(a.createdAt), new Date(b.createdAt));})
            }
        }, (err: any) => {
            let errorMessage = 'An error occurred. Please try again later';
            try {
                errorMessage = err.error.message;
            } catch (e) {}
            this.userSvc.pushTopErrorToast(errorMessage);
        });
    }
    private compareDate(date1: Date, date2: Date): number {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const same = d1.getTime() === d2.getTime();
        if (same) {
            return 0;
        }
        if (d1 > d2) {
            return 1;
        }
        if (d1 < d2) {
            return -1;
        }
    }
    i=0;
    doRefresh(forceUpdate, $event ? ) {
        let getBalanceSheetsSubscription: Subscription, getAccountsSubscription: Subscription, getUserSubscription: Subscription, getSignedUrlSubscription: Subscription; 
        getBalanceSheetsSubscription = this.balanceSheetService.getBalanceSheets(forceUpdate).subscribe(() => {
            this.balanceSheetService.isBsExperimentActivated().subscribe((isBsExperimentActivated) => {
                this.isBsExperimentActivated = isBsExperimentActivated; // setting false value if activebalanacesheet is null
                this.balanceSheetService.getActive().subscribe((activeBalanceSheet) => {
                    this.activeBalanceSheet = activeBalanceSheet; // setting null if activebalanacesheet is null
                });
            });
        })
        getAccountsSubscription = this.accountsService.getAccounts(forceUpdate).subscribe(() => {
            this.showAccountMessage();
            this.accountList = this.accountsService.accounts;
            this.assetAccountList = this.accountList.filter(a => a.accountType=="Asset");
            this.liabilityAccountList = this.accountList.filter(a => a.accountType=="Liability");
            this.accountsSummary = this.accountsService.accountsSummary;
            if ($event) {
                $event.target.complete();
            }
        },(err: any) => {
            console.error(err);
        });

        getUserSubscription = this.userSvc.getUser().subscribe(({ data: { user } }) => {
            if (user && user.avatar) {
                getSignedUrlSubscription = this.userSvc.getSignedUrl(user.avatar).subscribe((res: any) => {
                    if (res) {
                        this.userAvatar = res.data.getSignedUrl.signedUrl;
                    }
                })
            }
        })

        if(getBalanceSheetsSubscription) {
            this.subscriptions.push(getBalanceSheetsSubscription);
        }

        if(getAccountsSubscription) {
            this.subscriptions.push(getAccountsSubscription);
        }

        if(getUserSubscription) {
            this.subscriptions.push(getUserSubscription);
        }

        if(getSignedUrlSubscription) {
            this.subscriptions.push(getSignedUrlSubscription);
        }
    }
    onDrag(event) {
        let {
            ratio
        } = event.detail;
        let id = event.target.getAttribute("data-id");
        if (ratio > 7 && !this.alertIsOpened) {
            this.alertIsOpened = true;
        }
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
    ionViewWillLeave() {
        //this.accountsService.outdated = true;
        this.routerOutletService.swipebackEnabled = true;
        this.subscriptions.forEach(sub => {
            sub.unsubscribe();
        })
        this.subscriptions = [];
        this.popDismiss();
    }
    ionViewWillEnter() {
        this.doRefresh(true);
        this.routerOutletService.swipebackEnabled = false;
        let id = 'segment-'+this.userSvc.activeBalanceSheet;
        document.getElementById(id).scrollIntoView({
            block: 'center',
            inline: 'center'
            });
    }
    navigateToProfile() {
        this.menuController.open();
    }
    showAccountMessage() {
        if (this.accountList.length > 0) {
            this.userMessage = this.getHelloMessage() + 'Below is your net worth and balance sheet.';
        } else {
            this.userMessage = this.getHelloMessage() + 'You haven\'t added any accounts yet! Click the + button to get started.';
        }
    }
    getHelloMessage() {
        const userName = this.userSvc.firstName != null ? this.userSvc.firstName : this.userSvc.username;
        return `Hello ${userName}! Update your profile to maximize Wealth Builder. `;
    }
    hasAccessTo() {
        return ["comppro", "pro", "comppremium", "premium", "admin"].indexOf(this.access.toLowerCase()) !== -1;
    }

    segmentChanged(value:any){
        this.select(value.detail.value);
    }

    select(id, scroll = false) {
        this.userSvc.updateUser({
            activeBalanceSheet: id
        }).then(res => {
            this.userSvc.activeBalanceSheet = id;
            this.doRefresh(true);
            this.balanceClick(this.userSvc.activeBalanceSheet, scroll);
            // this.goBack();
        }, err => {
            // this.errorHandler(err);
            console.error(err)
        });
    }


    async popDismiss(){
        this.accountLabel = '';
        this.accountDescription = '';
        let popover = await this.popCtrl.getTop();
        if(popover)
            popover.dismiss();
        let modal = await this.modalCtrl.getTop();
        if(modal)
            modal.dismiss();
        this.isClonePopOpen = false;
        this.isCloneModalOpen = false;
        this.isEditPopOpen = false;
        this.isEditModalOpen = false;
    }

    comapare(){
        this.popCtrl.dismiss();
        this.router.navigate(['dashboard']);
    }

    errorHandler(e) {
        let errorMessage = 'An error occurred. Please try again later';
        try {
            errorMessage = e.error.message;
        } catch (e) {}
        this.userSvc.pushTopErrorToast(errorMessage);
    }

    public deleteConfirmationMsg ='';

    public deleteConfirmationHeader ='';

    public selectedAccountId='';

    public isDeletePopOpen =false;
    public isDeleteModalOpen =false;

    public isCloneBalancePopOpen = false;

    public isCloneBalanceModalOpen = false;

    public bs:TBalanceSheet;

    getSelectedBalanceSheet(){
        return this.balanceSheetsList?.filter(a=>a.id==this.userSvc.activeBalanceSheet)[0];
    }

    deleteConfirmation(id){
        this.deleteConfirmationHeader ='Delete Balance Sheet';
        this.deleteConfirmationMsg = 'Are you sure you want to delete this Balance sheet?';
       
        if(id){
            this.selectedAccountId = id;
            this.deleteConfirmationMsg = 'Are you sure you want to delete this account? Any holdings associated with this account will also be deleted.';
            this.deleteConfirmationHeader ='Delete Account';
        }
        else{
            this.selectedAccountId ='';
        }
        
        this.platform.width()>640?(this.isDeletePopOpen = !this.isDeletePopOpen):(this.isDeleteModalOpen = !this.isDeleteModalOpen);
    }

    async openEditAlert() {
        this.balanceSheetService.getBalanceSheet(this.userSvc.activeBalanceSheet).subscribe(async (bs) => {
            this.bs = bs;
            this.accountLabel = bs.name;
            this.accountDescription = bs.description;
            this.platform.width()>640?(this.isEditPopOpen = !this.isEditPopOpen):(this.isEditModalOpen = !this.isEditModalOpen)
        });
    }

    addCustomAccount(){
        if (this.accountLabel && this.accountLabel!='') {
            this.balanceSheetService.createBalanceSheet({name:this.accountLabel,description:this.accountDescription})
            .subscribe(async (res) => {
                if(res?.data?.createBalanceSheet?.id){
                    this.select(res.data.createBalanceSheet.id,true);
                }
                else{
                    this.select(this.balanceSheetsList[this.balanceSheetsList.length - 1].id,true);
                }
                let popover = await this.popCtrl.getTop();
                if(popover)
                    popover.dismiss();
                let modal = await this.modalCtrl.getTop();
                if(modal)
                    modal.dismiss();
                this.doRefresh(true);
            }, async (err: any) => {
                let popover = await this.popCtrl.getTop();
                if(popover)
                    popover.dismiss();
                let modal = await this.modalCtrl.getTop();
                if(modal)
                    modal.dismiss();
                this.errorHandler(err);
            });
        } else {
            this.userSvc.pushTopErrorToast('Name  is required');
            return false;
        }
    }

    editSheet(){
        if (this.accountLabel && this.accountLabel!='') {
            let data= {name:this.accountLabel,description:this.accountDescription}
            // Get only updated properties from object
            let balanceSheetUpdatedProperties = updatedDiff(this.bs, data);

            // If no changes in object, navigate back
            if(!Object.keys(balanceSheetUpdatedProperties).length) {
                this.popDismiss();
                return;
            }
            this.balanceSheetService.updateBalanceSheet(balanceSheetUpdatedProperties, {
                id: this.bs.id,
                ...data
            }).subscribe(async () => {
                this.bs.name = this.accountLabel;
                this.bs.description = this.accountDescription;
                let popover = await this.popCtrl.getTop();
                if(popover)
                    popover.dismiss();
                let modal = await this.modalCtrl.getTop();
                if(modal)
                    modal.dismiss();
            }, async (err: any) => {
                let popover = await this.popCtrl.getTop();
                if(popover)
                    popover.dismiss();
                let modal = await this.modalCtrl.getTop();
                if(modal)
                    modal.dismiss();
                this.errorHandler(err);
            });
        } else {
            this.userSvc.pushTopErrorToast('Name  is required');
            return false;
        }
    }

    addCloneSheet(){
        if (this.accountLabel && this.accountLabel!='') {
            this.balanceSheetService.clone(this.userSvc.activeBalanceSheet, {name:this.accountLabel,description:this.accountDescription}).subscribe(async (res) => {
                if(res?.data?.cloneBalanceSheet?.id){
                    this.select(res.data.cloneBalanceSheet.id,true);
                }
                let popover = await this.popCtrl.getTop();
                if(popover)
                    popover.dismiss();
                let modal = await this.modalCtrl.getTop();
                if(modal)
                    modal.dismiss();
            }, async (err: any) => {
                let popover = await this.popCtrl.getTop();
                if(popover)
                    popover.dismiss();
                let modal = await this.modalCtrl.getTop();
                if(modal)
                    modal.dismiss();
                this.errorHandler(err);
            });
        } else {
            this.userSvc.pushTopErrorToast('Name  is required');
            return false;
        }
    }

    async deleteConfirmed(){
        if(this.selectedAccountId){
            let popover = await this.popCtrl.getTop();
            if(popover)
                popover.dismiss();
            let modal = await this.modalCtrl.getTop();
            if(modal)
                modal.dismiss();
        }
        else{
            this.openDeleteAlert()
        }
    }

    async openDeleteAlert() {
        let popover = await this.popCtrl.getTop();
        if(popover)
            await popover.dismiss();
        let modal = await this.modalCtrl.getTop();
        if(modal)
            await modal.dismiss();
        this.balanceSheetService.getBalanceSheet(this.userSvc.activeBalanceSheet).subscribe(async (bs) => {
            if (!bs.default) {
                this.balanceSheetService.deleteBalanceSheet(this.userSvc.activeBalanceSheet).subscribe(async (res: any) => {
                    this.doRefresh(true);
                    this.select(this.balanceSheetsList[0].id, true);
                    await this.popDismiss();
                }, (err: any) => {
                    this.errorHandler(err);
                });
            }
        });
        return;
    }
}