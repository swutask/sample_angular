import {
    Component, OnInit
} from '@angular/core';
import {
    AlertController, AnimationController, IonContent, IonInput, MenuController, ModalController, PopoverController
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
    ViewChild
} from '@angular/core';
import {
    ActivatedRoute,
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
    ExportedClass as PlaidService
} from '../scripts/custom/PlaidService';
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
import {
    Observable, of, Subscription
} from 'rxjs';
import {
    ExportedClass as TBalanceSheet
} from './../scripts/custom/TBalanceSheet';
import {
    ExportedClass as TBalanceSheetList
} from '../scripts/custom/TBalanceSheetList';
import { AccountDetails } from '../AccountDetails/AccountDetails';
import { updatedDiff } from 'deep-object-diff';
import { CommonProvider } from '../utility/common';
import { AccountDetailsType } from '../AccountDetailsType/AccountDetailsType';
import {
    ExportedClass as TAccount
} from '../scripts/custom/TAccount';
import moment from 'moment-timezone';
declare var Plaid: any;

@Component({
    templateUrl: 'Accounts.html',
    selector: 'page-accounts',
    styleUrls: ['Accounts.scss']
})
export class Accounts implements OnInit {
    public accountList: TAccountList = [{ parent:null, id: '', accountType: '', assetAssociation: '', assetType: '', costBasis: 0, currentBalance: 0, debtPaidOffIn: '', description: '', excludeFromDebtPayoffCalc: false, interestRate: 0, liabilityType: '', liquidationPriority: 0, minPayment: 0, monthlyExpense: 0, monthlyIncome: 0, name: '', newMonthlyPayment: 0, owner: '', referenceURL: '' }];
    public parentAccountList: TAccountList;
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
    public accountsDataLoadingPromise: Promise<any>;
    public userMessage: string;
    public dataLoadingPromise: Promise<any>;
    public compoundReturnData: TCompoundReturn;
    public compoundReturnPromise: Promise<any>;
    public isBsExperimentActivated: boolean;
    public activeBalanceSheet: any;
    @ViewChild('accountsList') public accountsList: IonList;
    @ViewChild('accountLabelInputEdit') accountLabelInputEdit: IonInput;
    @ViewChild('balancepopmobile') myDiv: any;
    @ViewChild('accountContent') cont: IonContent;
    public access: string = 'Free';
    public searchTerm: string = '';
    public sortBy: string = 'createdAt';
    public currentItem: any = null;
    public mappingData: any = {};
    public userAvatar: string;
    public userTimeZone: string = 'America/Chicago';
    public subscriptions: Subscription[] = [];
    public balanceSheetsList: TBalanceSheetList;
    public selectedAsset: boolean = false;
    public selectedLiabiltiy: boolean = false;
    public accountDescription = '';
    public accountLabel = '';
    posY: number = 0;
    public isClonePopOpen = false;
    public isCloneModalOpen = false;

    public isClonePopOpenAccount = false;
    public isCloneModalOpenAccount = false;


    public isEditPopOpen = false;
    public isEditModalOpen = false;
    public selectoptions = {
        cssClass: 'selectoptions'
    }

    public cloneMessage = '';
    public copyMessage = '';
    public balanceSheets: any = [];

    public selectedBalance = this.userSvc.activeBalanceSheet;

    public selectedAccountId = '';

    public cloneAccountBalance = '';
    public copyAccountBalance = '';

    public isDeletePopOpen = false;
    public isDeleteModalOpen = false;

    public deleteConfirmationMsg = '';

    public deleteConfirmationHeader = '';

    public isCloneBalancePopOpen = false;

    public isCloneBalanceModalOpen = false;

    public isAddPlaidAccountPopOpen = false;

    public isAddPlaidAccountModalOpen = false;

    public isAddBalanceAccountPopOpen = false;

    public isAddBalanceAccountModalOpen = false;

    public isAddBalanceAccountPlaidPopOpen = false;

    public isAddBalanceAccountPlaidModalOpen = false;

    public isReviewAccountPopOpen = false;

    public isReviewAccountModalOpen = false;

    public isReviewLiablityAccountPopOpen = false;

    public isReviewLiablityAccountModalOpen = false;

    public plaidItem = '';

    public isReviewDeletedAccountPopOpen = false;

    public isReviewDeletedAccountModalOpen = false;

    public isDeletePlaidItemPopOpen = false;

    public isDeletePlaidItemModalOpen = false;

    public isAddNewBalanceSheetPopOpen = false;

    public isAddNewBalanceSheetModalOpen = false;

    public isUnlinkItemPopOpen = false;

    public isUnlinkItemModalOpen = false;

    public isSyncItemPopOpen = false;

    public isSyncItemModalOpen = false;

    public isSyncAllItemPopOpen = false;

    public isSyncAllItemModalOpen = false;

    public deletedAccounts = [];

    public newAccountType;

    public addAccountOptionPlaid;

    public popoverSheetOptions: any = {
        side: 'bottom',
        size: 'cover',
        cssClass: 'full-width-option'
    };

    addAccountOption = 'manual';

    isManagePlaidPopOpen: boolean = false;
    isManagePlaidModalOpen: boolean = false;

    constructor(public menuController: MenuController, public userSvc: userService,
        public navCtrl: NavController, public loadingCtrl: LoadingController, public plaidService: PlaidService,
        public alertController: AlertController, public accountsService: AccountsService,
        public platform: Platform, public router: Router, public popCtrl: PopoverController,
        public routerOutletService: RouterOutletService, public debtPayoffService: DebtPayoffService,
        public compoundReturnService: CompoundReturnService, public balanceSheetService: BalanceSheetService,
        public animationCtrl: AnimationController, public modalCtrl: ModalController,
        public route: ActivatedRoute, public common: CommonProvider) {
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
    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            let navParams = this.router.getCurrentNavigation().extras.state;
            if (navParams?.addAssets) {
                this.createNewAccount('Asset', true)
            }
            else if (navParams?.addLiability) {
                this.createNewAccount('Liability', true);
            }
            else if (navParams?.asset) {
                this.showList('asset');
            }
            else if (navParams?.liability) {
                this.showList('liability');
            }
        });
        let toggleSubscribe = this.userSvc.toggleBalance.subscribe((res)=>{
            this.subscriptions.forEach(sub => {
                sub.unsubscribe();
            })
            this.doRefresh(true,null,res);
        })
        // this.subscriptions.push(toggleSubscribe);
    }
    getBalanceSheets() {
        this.balanceSheetService.getBalanceSheets().subscribe((res: any) => {
            if (this.balanceSheetsList?.length != res.data.balanceSheets.length) {
                this.balanceSheetsList = res.data.balanceSheets;
                this.balanceSheetsList = this.balanceSheetsList.sort((a, b) => { return this.compareDate(new Date(a.createdAt), new Date(b.createdAt)); })
            }
        }, (err: any) => {
            let errorMessage = 'An error occurred. Please try again later';
            try {
                errorMessage = err.error.message;
            } catch (e) { }
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
    doRefresh(forceUpdate, $event?, name?) {

        let inputsBalance = [];
        let getBalanceSheetsSubscription: Subscription, getAccountsSubscription: Subscription, getUserSubscription: Subscription, getSignedUrlSubscription: Subscription;

        getBalanceSheetsSubscription = this.balanceSheetService.getBalanceSheets(forceUpdate).subscribe((bsItemsList: [TBalanceSheet]) => {
            this.balanceSheetService.isBsExperimentActivated().subscribe((isBsExperimentActivated) => {
                this.isBsExperimentActivated = isBsExperimentActivated; // setting false value if activebalanacesheet is null
                this.balanceSheetService.getActive().subscribe((activeBalanceSheet) => {
                    this.activeBalanceSheet = activeBalanceSheet; // setting null if activebalanacesheet is null
                });
            });

            bsItemsList['data']['balanceSheets'].forEach((bsItem) => {
                inputsBalance.push({
                    name: bsItem.id,
                    label: bsItem.name,
                    value: bsItem.id,
                    checked: false
                });
            });
        })

        getAccountsSubscription = this.accountsService.getAccounts(forceUpdate).subscribe(() => {
            this.showAccountMessage();
            this.accountList = this.accountsService.accounts;
            const duplicateAccount = [];
            this.accountList.map((account) => {
                if (account.parentHolding) {
                    account.childAccount = [];
                    if(account.childHoldingIds){
                        for (let id of account.childHoldingIds) {
                            account.childAccount.push(this.accountsService.getAccount(id));
                            duplicateAccount.push(id);
                        }
                        account.childAccount.sort((a, b) => {
                            if (a.name > b.name) return 1;
                            if (a.name < b.name) return -1;
                            return 0;
                        });
                    }
                }
            });
            for (let id of duplicateAccount) {
                this.accountList = this.accountList.filter(a => a.id != id);
            }
            this.assetAccountList = this.accountList.filter(a => a.accountType == "Asset");
            this.liabilityAccountList = this.accountList.filter(a => a.accountType == "Liability");
            this.accountsSummary = this.accountsService.accountsSummary;
            if ($event) {
                $event.target.complete();
            }
            if (name) {
                this.userSvc.dismissLoader();
                if (name?.toLowerCase() === 'default')
                    this.common.toast('Default mode: Your data is updated with your default Balance Sheet', 'top')
                else
                    this.common.toast('Sim mode: Your data is updated with ' + name + ' Balance Sheet and is in simulator mode!', 'top')
            }
        }, (err: any) => {
            console.error(err);
        });

        getUserSubscription = this.userSvc.getUser().subscribe(({ data: { user } }) => {
            if (user.accountSortOrderPref)
                this.sortBy = user.accountSortOrderPref
            else
                this.sortBy = "createdAt";
            if (user.timeZone)
                this.userTimeZone = user.timeZone
            else
                this.userTimeZone = "America/Chicago"
            if (user && user.avatar) {
                getSignedUrlSubscription = this.userSvc.getSignedUrl(user.avatar).subscribe((res: any) => {
                    if (res) {
                        this.userAvatar = res.data.getSignedUrl.signedUrl;
                    }
                })
            }
        })

        if (getBalanceSheetsSubscription) {
            this.subscriptions.push(getBalanceSheetsSubscription);
        }

        if (getAccountsSubscription) {
            this.subscriptions.push(getAccountsSubscription);
        }

        if (getUserSubscription) {
            this.subscriptions.push(getUserSubscription);
        }

        if (getSignedUrlSubscription) {
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
            this.openDeleteAccountAlert(id);
        }
    }

    deleteEvent: any
    deleteConfirmation(id, event?) {
        this.deleteEvent = event;
        this.deleteConfirmationHeader = 'Delete Balance Sheet';
        this.deleteConfirmationMsg = 'Are you sure you want to delete this Balance sheet?';

        if (id) {
            this.selectedAccountId = id;
            this.deleteConfirmationMsg = 'Are you sure you want to delete this account? Any holdings associated with this account will also be deleted.';
            this.deleteConfirmationHeader = 'Delete Account';
        }
        else {
            this.selectedAccountId = '';
        }

        this.platform.width() > 640 ? (this.isDeletePopOpen = !this.isDeletePopOpen) : (this.isDeleteModalOpen = !this.isDeleteModalOpen);
    }

    async deleteConfirmed() {
        if (this.selectedAccountId) {
            this.deleteAccount(this.selectedAccountId);
            let popover = await this.popCtrl.getTop();
            if (popover)
                await popover.dismiss();
            let modal = await this.modalCtrl.getTop();
            if (modal)
                await modal.dismiss();
            await this.popDismiss();
        }
        else {
            this.openDeleteAlert()
        }
    }
    async deleteAccount(id) {

        let popover = await this.popCtrl.getTop();
        if (popover)
            popover.dismiss();
        let modal = await this.modalCtrl.getTop();
        if (modal)
            modal.dismiss();
        const accountToBeDeleted = this.accountsService.getAccount(id ? id : this.selectedAccountId);
        if(accountToBeDeleted.parentHoldingId) {
            await this.userSvc.presentLoader();
            const parentAccount = this.accountsService.getAccount(accountToBeDeleted.parentHoldingId);
            if (parentAccount) {
                let childHoldingIds = parentAccount.childHoldingIds;
                childHoldingIds = childHoldingIds.filter(item => item !== (id ? id : this.selectedAccountId))
                const accountUpdatedProperties = {
                    id: parentAccount.id,
                    childHoldingIds
                }
                await this.accountsService.createOrUpdateAccount(accountUpdatedProperties, parentAccount, parentAccount.id).toPromise()
            }
        }
        if(accountToBeDeleted.childHoldingIds && accountToBeDeleted.childHoldingIds.length > 0) {
            await this.userSvc.presentLoader();
            try {
                for (let holdingId of accountToBeDeleted.childHoldingIds) {
                    await this.accountsService.deleteAccount(holdingId).toPromise();
                }
            }catch(e) {
                console.error(e);
            }
        }
        this.accountsService.deleteAccount(id ? id : this.selectedAccountId).subscribe(async (res: any) => {
            if(accountToBeDeleted.childHoldingIds && accountToBeDeleted.childHoldingIds.length > 0)
                await this.userSvc.dismissLoader();
            if(accountToBeDeleted.parentHoldingId) {
                await this.userSvc.dismissLoader();
            }
        }, (err: any) => {
            console.error(err);
            this.userSvc.toast("Error while deleting account");
        });
    }

    async openDeleteAccountAlert(id) {
        const deleteAccountAlert = await this.alertController.create({
            header: 'Delete Account',
            message: 'Are you sure you want to delete this Account?',
            buttons: [{
                text: 'Cancel',
                handler: () => {
                    deleteAccountAlert.dismiss().then(() => this.alertIsOpened = false);
                },
            }, {
                text: 'Delete',
                handler: () => {
                    this.alertIsOpened = false;
                    this.deleteAccount(id);
                },
            }]
        });
        deleteAccountAlert.present();
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
    async createNewAccount(type: string, goBack?: boolean) {
        const modal = await this.modalCtrl.create({
            component: AccountDetails,//AccountDetailsType,
            enterAnimation: this.platform.width() > 640 ? this.enterAnimation : undefined,
            leaveAnimation: this.platform.width() > 640 ? this.leaveAnimation : undefined,
            cssClass: 'side-menu2',
            backdropDismiss: false,
            componentProps: {
                id: 'new',
                type
            }
        });
        let subscriptionBalance;
        modal.onWillDismiss().then(async (data) => {
            // if(goBack){
            //     if(this.accountList.length==0){
            //         this.navCtrl.navigateBack('addaccount');
            //     }
            // }
        })
        modal.present();
    }
    async editAccount(id: string, type: string) {
        const modal = await this.modalCtrl.create({
            component: AccountDetails,
            enterAnimation: this.platform.width() > 640 ? this.enterAnimation : undefined,
            leaveAnimation: this.platform.width() > 640 ? this.leaveAnimation : undefined,
            backdropDismiss: false,
            cssClass: 'side-menu2',
            componentProps: {
                id,
                type
            }
        });
        let subscriptionBalance;
        modal.onDidDismiss().then(async (data) => {
            await this.popDismiss();
        })
        modal.present();
    }
    ionViewWillLeave() {
        this.routerOutletService.swipebackEnabled = true;
        this.subscriptions.forEach(sub => {
            sub.unsubscribe();
        })
        this.subscriptions = [];
        this.popDismiss();
    }
    ionViewWillEnter() {
        if (this.selectedAsset == false && this.selectedLiabiltiy == false)
            this.showList('');
        this.doRefresh(true);
        this.routerOutletService.swipebackEnabled = false;
        let id = 'segmentas-' + this.userSvc.activeBalanceSheet;
        if (id) {
            document.getElementById(id)?.scrollIntoView({
                block: 'center',
                inline: 'center'
            });
        }
    }
    navigateToProfile() {
        this.menuController.open();
    }
    // TODO deprecated with v5 
    // remove this and all associations: showAccountMessage, this.userMessage, getHelloMessage
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
    getAssetTypeIndicatorLabel(account) {
        let typeIndicatorLabel = '';
        if (account) {
            if ((account.assetType === 'C' || account.assetType === 'DA') && (account.liquidityChaosHedge)) {
                typeIndicatorLabel += 'T1';
            }
            if (account.assetType === 'CFA') {
                typeIndicatorLabel += 'T2';
            }
            if (account.assetType === 'AA') {
                typeIndicatorLabel += 'T3';
            }
        }
        return typeIndicatorLabel;
    }
    getAssetAssociationLabel(account) {
        const associatedAsset = _.find(this.accountList, {
            id: account.assetAssociation
        });
        return account.assetAssociation !== 'none' && associatedAsset ? associatedAsset.name : '';
    }
    // getCompoundReturnNumbers() {
    // this.compoundReturnPromise = this.compoundReturnService.getCompoundReturnNumbers().toPromise().then(res => {
    //     if (res && res[0]) {
    //         this.compoundReturnData = res[0];
    //     }
    // });
    // }
    // onBSExperimentChange($event) {
    //     this.balanceSheetService.isBsExperimentActivated().subscribe((isBsExperimentActivated) => {
    //         if (this.isBsExperimentActivated !== isBsExperimentActivated) {
    //             if (this.isBsExperimentActivated) {
    //                 this.router.navigate(['balancesheets']);
    //             } else {
    //                 // revert to default
    //                 this.userSvc.updateUser({
    //                     activeBalanceSheet: this.userSvc.defaultBalanceSheet
    //                 }).then(res => {
    //                     this.userSvc.activeBalanceSheet = this.userSvc.defaultBalanceSheet;
    //                     this.doRefresh(true);
    //                 }, err => {
    //                     console.error(err);
    //                 });
    //             }
    //         }
    //     });
    // }
    navigateToAccountDetails(id) {
        this.accountsList.closeSlidingItems();
        this.navCtrl.navigateForward(`accountDetails/${id}`);
    }
    // async buildBSAlertOptions() {
    //     const inputs = [];
    //     const getBalanceSheetsSubscription = this.balanceSheetService.getBalanceSheets(false).subscribe((bsItemsList: [TBalanceSheet]) => {

    //         bsItemsList['data']['balanceSheets'].forEach((bsItem) => {
    //             inputs.push({
    //                 name: bsItem.id,
    //                 type: 'radio',
    //                 label: bsItem.name,
    //                 value: bsItem.id,
    //                 checked: bsItem.id === this.userSvc.activeBalanceSheet
    //             });
    //         });

    //     });
    //     if(getBalanceSheetsSubscription) {
    //         this.subscriptions.push(getBalanceSheetsSubscription);
    //     }

    //     return inputs;
    // }
    async cloneAccount(id) {
        this.cloneAccountBalance = '';
        this.copyAccountBalance = '';
        let popover = await this.popCtrl.getTop();
        if (popover)
            await popover.dismiss();
        let modal = await this.modalCtrl.getTop();
        if (modal)
            await modal.dismiss();

        this.selectedAccountId = id;

        this.platform.width() > 640 ? (this.isClonePopOpen = !this.isClonePopOpen) : (this.isCloneModalOpen = !this.isCloneModalOpen)
        // const alertInputsOptions= await this.buildBSAlertOptions();
        const accountOption = this.accountsService.getAccount(id);

        // the following is from v4
        // this.cloneMessage  = alertInputsOptions.length > 0 ? 'Please select the balance sheet you want to copy your account to.' : `Do you want to create a copy of account ${accountOption.name}`;

        this.cloneMessage = `Please select to which balance sheet you want to copy the account: ${accountOption.name}`;

        const assets = this.accountList.filter(a => a.accountType === 'Asset');
        this.parentAccountList = assets.filter(a => a.parentHolding === true);

        if ( this.parentAccountList.length > 0 && accountOption.accountType === 'Asset') {
            this.copyMessage = `Please select to which Parent Account you want to copy the account: ${accountOption.name}`;
        } else if(accountOption.accountType === 'Liability') {
            this.copyMessage = null;
        } else {
            this.copyMessage = `No Parent Accounts avaialble`;
        }
        return;
    }

    async addCloneInfo() {
        if (this.cloneAccountBalance) {
            const accountInfo = this.accountsService.getAccount(this.selectedAccountId);
            this.accountsService.cloneAccount(accountInfo, this.cloneAccountBalance)
                .toPromise().then(() => {
                    // const getBsObservable = of (this.cloneAccountBalance);
                    const getBsObservable = this.cloneAccountBalance
                        ? this.balanceSheetService.getBalanceSheet(this.cloneAccountBalance)
                        : of(this.cloneAccountBalance);

                    (getBsObservable as Observable<any>).subscribe((targetBalanceSheet: any) => {
                        const notificationMessage = targetBalanceSheet ? `Account '${accountInfo.name}' has been copied to '${targetBalanceSheet.name}' balance sheet` : `Account '${accountInfo.name}' has been copied`;
                        this.userSvc.pushTopToast(notificationMessage);
                        this.popDismiss()
                    });
                });
        } else if (this.copyAccountBalance) {
            await this.userSvc.presentLoader();
            const accountInfo = this.accountsService.getAccount(this.selectedAccountId);
            const parentAccountInfo = this.accountsService.getAccount(this.copyAccountBalance);
            await this.accountsService.copyAccount(accountInfo, this.copyAccountBalance, parentAccountInfo).toPromise()
            const getBsObservable = this.cloneAccountBalance
            ? this.balanceSheetService.getBalanceSheet(this.cloneAccountBalance)
            : of(this.cloneAccountBalance);

            (getBsObservable as Observable<any>).subscribe((targetBalanceSheet: any) => {
                const notificationMessage = `Account '${accountInfo.name}' has been copied to '${parentAccountInfo.name}' holdings`;
                this.userSvc.pushTopToast(notificationMessage);
                this.userSvc.dismissLoader();
                this.popDismiss();
                this.accountsService.getAccounts();
            });
        }
    }
    hasAccessTo() {
        return ["comppro", "pro", "comppremium", "premium", "admin"].indexOf(this.access.toLowerCase()) !== -1;
    }
    hasAccessToAdmin() {
        return ["admin"].indexOf(this.access.toLowerCase()) !== -1;
    }
    hasAccessToAdminOrPro() {
        return ["admin", "comppro", "pro"].indexOf(this.access.toLowerCase()) !== -1;
    }

    segmentChanged(value: any) {
        this.select(value.detail.value);
    }

    balanceClick(id: any, scroll = false) {
        id = 'segmentas-' + id;
        // let balancefocus = _.debounce(()=>{
        //     if(this.accountList.length==0)
        //         this.navCtrl.navigateBack('addaccount');
        // },1000,{'trailing':true});
        // balancefocus();
        if (scroll && id) {
            let tabfocus = _.debounce(() => {
                if (document.getElementById(id)) {
                    document.getElementById(id).scrollIntoView({
                        block: 'center',
                        inline: 'center'
                    });
                }
            }, 1000, { 'trailing': true });
            tabfocus();
        }
    }

    async select(id, scroll = false) {
        await this.userSvc.presentLoader();
        this.selectedBalance = id;
        this.userSvc.updateUser({
            activeBalanceSheet: id
        }).then(res => {
            this.userSvc.activeBalanceSheet = id;
            this.balanceClick(id, scroll);
            let nameSubscribe = this.balanceSheetService.getBalanceSheet(id).subscribe(res => {
                this.subscriptions.forEach(sub => {
                    sub.unsubscribe();
                })
                this.doRefresh(true, null, res?.name);
            }, () => { }, () => {
                setTimeout(() => {
                    nameSubscribe.unsubscribe();
                }, 0);
            })
        }, err => {
            console.error(err)
        });
    }

    showList(selected: string) {
        if (selected == 'asset') {
            this.selectedAsset = true;
            this.selectedLiabiltiy = false;
        }
        else if (selected == 'liability') {
            this.selectedAsset = false;
            this.selectedLiabiltiy = true;
        }
        else {
            this.selectedAsset = false;
            this.selectedLiabiltiy = false;
        }
    }

    updateSort() {
        this.userSvc.updateUser({
            accountSortOrderPref: this.sortBy
        }).then(res => {
        }, err => {
            console.error(err)
        });
    }

    async popDismiss() {
        this.accountLabel = '';
        this.accountDescription = '';
        let popover = await this.popCtrl.getTop();
        if (popover)
            await popover.dismiss();
        let modal = await this.modalCtrl.getTop();
        if (modal)
            await modal.dismiss();

        this.isClonePopOpen = false;
        this.isCloneModalOpen = false;

        this.isClonePopOpenAccount = false;
        this.isCloneModalOpenAccount = false;

        this.isDeletePopOpen = false;

        this.isDeleteModalOpen = false;

        this.isEditPopOpen = false;
        this.isEditModalOpen = false;

        this.isCloneBalancePopOpen = false;
        this.isCloneBalanceModalOpen = false;

        this.isAddPlaidAccountModalOpen = false;
        this.isAddPlaidAccountPopOpen = false;

        this.isAddBalanceAccountModalOpen = false;
        this.isAddBalanceAccountPopOpen = false;

        this.isAddBalanceAccountPlaidModalOpen = false;
        this.isAddBalanceAccountPlaidPopOpen = false;

        this.isReviewAccountPopOpen = false;
        this.isReviewAccountModalOpen = false;

        this.isReviewDeletedAccountPopOpen = false;
        this.isReviewDeletedAccountModalOpen = false;

        if (this.isDeletePlaidItemModalOpen || this.isDeletePlaidItemPopOpen) {
            this.doRefresh(true);
        }
        this.isDeletePlaidItemPopOpen = false;
        this.isDeletePlaidItemModalOpen = false;

        this.isManagePlaidPopOpen = false;
        this.isManagePlaidModalOpen = false;

        this.isAddNewBalanceSheetPopOpen = false;
        this.isAddNewBalanceSheetModalOpen = false;

        this.isUnlinkItemPopOpen = false;
        this.isUnlinkItemModalOpen = false;

        this.isSyncItemPopOpen = false;
        this.isSyncItemModalOpen = false;

        this.isSyncAllItemPopOpen = false;
        this.isSyncAllItemModalOpen = false;
    }

    addCustomAccount() {
        if (this.accountLabel && this.accountLabel != '') {
            this.balanceSheetService.createBalanceSheet({ name: this.accountLabel, description: this.accountDescription })
                .subscribe(async (res) => {
                    if (res?.data?.createBalanceSheet?.id) {
                        this.balanceSheetService.balanceSheets[this.balanceSheetService.balanceSheets.length - 1].id = res.data.createBalanceSheet.id;
                        this.balanceSheetsList[this.balanceSheetsList.length - 1].id = res.data.createBalanceSheet.id
                        this.select(res.data.createBalanceSheet.id, true);
                    }
                    let popover = await this.popCtrl.getTop();
                    if (popover)
                        await popover.dismiss();
                    let modal = await this.modalCtrl.getTop();
                    if (modal)
                        await modal.dismiss();
                    this.doRefresh(true);
                    this.selectedBalance = this.balanceSheetsList[this.balanceSheetsList.length - 2].id;
                    let selectSegement = _.debounce(() => {
                        this.selectedBalance = this.balanceSheetsList[this.balanceSheetsList.length - 1].id;
                    }, 1000, { 'trailing': true });
                    selectSegement();
                }, async (err: any) => {
                    let popover = await this.popCtrl.getTop();
                    if (popover)
                        popover.dismiss();
                    let modal = await this.modalCtrl.getTop();
                    if (modal)
                        modal.dismiss();
                    this.errorHandler(err);
                });
        } else {
            this.userSvc.pushTopErrorToast('Name  is required');
            return false;
        }
    }

    public cloneProcess = false;
    addCloneSheet() {
        if (this.accountLabel && this.accountLabel != '') {
            this.cloneProcess = true;
            this.balanceSheetService.clone(this.userSvc.activeBalanceSheet, { name: this.accountLabel, description: this.accountDescription }).subscribe(async (res) => {
                if (res?.data?.cloneBalanceSheet?.id) {
                    this.select(res.data.cloneBalanceSheet.id, true);
                }
                let popover = await this.popCtrl.getTop();
                if (popover)
                    await popover.dismiss();
                let modal = await this.modalCtrl.getTop();
                if (modal)
                    await modal.dismiss();
                await this.popDismiss();
                this.cloneProcess = false;
            }, async (err: any) => {
                let popover = await this.popCtrl.getTop();
                if (popover)
                    await popover.dismiss();
                let modal = await this.modalCtrl.getTop();
                if (modal)
                    await modal.dismiss();
                await this.popDismiss();
                this.cloneProcess = false;
                this.errorHandler(err);
            });
        } else {
            this.userSvc.pushTopErrorToast('Name is required');
            return false;
        }
    }

    public bs: TBalanceSheet;

    editEvent: any;
    async openEditAlert(event) {
        this.editEvent = event;
        this.balanceSheetService.getBalanceSheet(this.userSvc.activeBalanceSheet).subscribe(async (bs) => {
            this.bs = bs;
            this.accountLabel = bs.name;
            this.accountDescription = bs.description;
            this.platform.width() > 640 ? (this.isEditPopOpen = !this.isEditPopOpen) : (this.isEditModalOpen = !this.isEditModalOpen);
            this.bluractiveedit();
        });
    }

    cloneEvent: any;
    async openCloneAlert(event) {
        this.cloneEvent = event;
        this.platform.width() > 640 ? (this.isCloneBalancePopOpen = !this.isCloneBalancePopOpen) : (this.isCloneBalanceModalOpen = !this.isCloneBalanceModalOpen);
    }

    newEvent: any;
    async openNewAlert(event) {
        this.newEvent = event;
        this.platform.width() > 640 ? (this.isAddNewBalanceSheetPopOpen = !this.isAddNewBalanceSheetPopOpen) : (this.isAddNewBalanceSheetModalOpen = !this.isAddNewBalanceSheetModalOpen);
    }

    public editProcess = false;
    async editSheet() {
        if (this.accountLabel && this.accountLabel != '') {
            this.editProcess = true;
            let data = { name: this.accountLabel, description: this.accountDescription }
            // Get only updated properties from object
            let balanceSheetUpdatedProperties = updatedDiff(this.bs, data);

            // If no changes in object, navigate back
            if (!Object.keys(balanceSheetUpdatedProperties).length) {
                await this.popDismiss();
                await this.popDismiss();
                this.editProcess = false;
                return;
            }
            this.balanceSheetService.updateBalanceSheet(balanceSheetUpdatedProperties, {
                id: this.bs.id,
                ...data
            }).subscribe(async () => {
                this.bs.name = this.accountLabel;
                this.bs.description = this.accountDescription;
                let sheet = this.balanceSheetsList.filter((acc) => { return acc.id == this.bs.id })[0];
                sheet.name = this.accountLabel;
                sheet.description = this.accountDescription;
                let popover = await this.popCtrl.getTop();
                if (popover)
                    await popover.dismiss();
                let modal = await this.modalCtrl.getTop();
                if (modal)
                    await modal.dismiss();
                await this.popDismiss()
                this.editProcess = false
            }, async (err: any) => {
                let popover = await this.popCtrl.getTop();
                if (popover)
                    await popover.dismiss();
                let modal = await this.modalCtrl.getTop();
                if (modal)
                    await modal.dismiss();
                await this.popDismiss()
                this.editProcess = false;
                this.errorHandler(err);
            });
        } else {
            this.userSvc.pushTopErrorToast('Name  is required');
            return false;
        }
    }

    async openDeleteAlert() {

        let popover = await this.popCtrl.getTop();
        if (popover)
            await popover.dismiss();
        let modal = await this.modalCtrl.getTop();
        if (modal)
            await modal.dismiss();
        this.balanceSheetService.getBalanceSheet(this.userSvc.activeBalanceSheet).subscribe(async (bs) => {
            if (!bs?.default) {
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

    comapare() {
        this.popCtrl.dismiss();
        this.router.navigate(['dashboard']);
    }

    errorHandler(e) {
        let errorMessage = 'An error occurred. Please try again later';
        try {
            errorMessage = e.error.message;
        } catch (e) { }
        this.userSvc.pushTopErrorToast(errorMessage);
    }

    getSelectedBalanceSheet() {
        return this.balanceSheetsList?.filter(a => a.id == this.userSvc.activeBalanceSheet)[0];
    }

    async closePopovers() {
        await this.popDismiss();
        await this.popDismiss();
    }

    bluractiveedit() {
        var activeElement = document.activeElement as HTMLElement;
        activeElement.blur();
        let setFocus = _.debounce(() => {
            this.accountLabelInputEdit.setFocus();
        }, 1000, { 'trailing': true });
        setFocus();
    }

    plaidAccounts = [];
    assetPlaidAccounts = [];
    liablityPlaidAccounts = [];
    plaidItems = [];
    currentItemId: string;

    triggerFalseClick() {
        if(this.platform.is('ios')){
            let el: HTMLElement = this.myDiv.el;
            el.click();
        }
     }

    async link(type: string, all = false) {
        await this.userSvc.presentLoader();
        const liability = type != 'Asset' ? true : false;
        this.plaidService.createLinkToken(liability, all).subscribe(res => {
            const link = res?.data?.createLinkToken.link_token;
            var handler = Plaid.create({
                // Create a new link_token to initialize Link
                token: link,
                onLoad: () => {
                    // Optional, called when Link loads
                },
                onSuccess: (public_token, metadata) => {
                    // Send the public_token to your app server.
                    // The metadata object contains info about the institution the
                    // user selected and the account ID or IDs, if the
                    // Account Select view is enabled.
                    this.plaidService.setAccessToken(public_token, metadata.institution.institution_id).subscribe(res => {
                        this.currentItemId = res.data.setAccessToken.itemId;
                        this.plaidService.getPlaidTransactions(res.data.setAccessToken.itemId, moment().subtract(7, 'd').format('YYYY-MM-DD'), moment().format("YYYY-MM-DD")).subscribe(async (res) => {
                            this.plaidAccounts = res.data.getPlaidTransactions.accounts;
                            for (let account of this.plaidAccounts) {
                                account.selected = true;
                            }
                            this.newAccountType = type;
                            if (type != 'Asset') {
                                this.liablityPlaidAccounts = this.plaidAccounts.filter((e) => e.type == "credit" || e.type == "loan")
                            }
                            else {
                                this.assetPlaidAccounts = this.plaidAccounts.filter((e) => e.type == "depository" || e.type == "investment")
                            }
                            await this.userSvc.dismissLoader();
                            this.platform.width() > 640 ? (this.isAddPlaidAccountPopOpen = !this.isAddPlaidAccountPopOpen) : (this.isAddPlaidAccountModalOpen = !this.isAddPlaidAccountModalOpen);
                            this.triggerFalseClick();
                        })
                    }, (error) => {
                        this.userSvc.dismissLoader();
                    })
                },
                onExit: async (err, metadata) => {
                    // The user exited the Link flow.
                    if (err != null) {
                        // The user encountered a Plaid API error prior to exiting.
                    }
                    await this.userSvc.dismissLoader();
                    // metadata contains information about the institution
                    // that the user selected and the most recent API request IDs.
                    // Storing this information can be helpful for support.
                },
                onEvent: (eventName, metadata) => {
                    // Optionally capture Link flow events, streamed through
                    // this callback as your users connect an Item to Plaid.
                    // For example:
                    // eventName = "TRANSITION_VIEW"
                    // metadata  = {
                    //   link_session_id: "123-abc",
                    //   mfa_type:        "questions",
                    //   timestamp:       "2017-09-14T14:42:19.350Z",
                    //   view_name:       "MFA",
                    // }
                }
            });
            handler.open();
        })
    }

    async plaidrelink(plaidItemId: string, newAccount = false) {
        await this.userSvc.presentLoader();
        this.plaidService.updateLinkToken(plaidItemId, newAccount).subscribe(res => {
            const link = res?.data?.updateLinkToken.link_token;
            var handler = Plaid.create({
                // Create a new link_token to initialize Link
                token: link,
                onLoad: () => {
                    // Optional, called when Link loads
                },
                onSuccess: async (public_token, metadata) => {
                    // Send the public_token to your app server.
                    // The metadata object contains info about the institution the
                    // user selected and the account ID or IDs, if the
                    // Account Select view is enabled.
                    if (!newAccount) {
                        this.plaidService.updateAccountsResetByItemId(plaidItemId).subscribe(async (data: any) => {
                            this.plaidItems = data.data.updateAccountsResetByItemId;
                            await this.userSvc.dismissLoader();
                        });
                    } else {
                        this.currentItemId = plaidItemId;
                        this.plaidService.getPlaidTransactions(plaidItemId, moment().subtract(7, 'd').format('YYYY-MM-DD'), moment().format("YYYY-MM-DD")).subscribe(async (res) => {
                            this.plaidAccounts = res.data.getPlaidTransactions.accounts;
                            for (let account of this.plaidAccounts) {
                                account.selected = true;
                            }
                            const currentItem = this.plaidItems.find((e) => e.itemId === plaidItemId);
                            const accounts = currentItem.accounts;
                            for (const account of accounts) {
                                this.plaidAccounts = this.plaidAccounts.filter(item => item.account_id !== account.plaidAccountId);
                            }
                            if (this.addAccountOptionPlaid != 'Asset') {
                                this.liablityPlaidAccounts = this.plaidAccounts.filter((e) => e.type == "credit" || e.type == "loan")
                            }
                            else {
                                this.assetPlaidAccounts = this.plaidAccounts.filter((e) => e.type == "depository" || e.type == "investment")
                            }
                            this.newAccountType = this.addAccountOptionPlaid;
                            await this.userSvc.dismissLoader();
                            this.platform.width() > 640 ? (this.isAddPlaidAccountPopOpen = !this.isAddPlaidAccountPopOpen) : (this.isAddPlaidAccountModalOpen = !this.isAddPlaidAccountModalOpen);
                            this.triggerFalseClick();
                        })
                    }
                },
                onExit: async (err, metadata) => {
                    // The user exited the Link flow.
                    if (err != null) {
                        // The user encountered a Plaid API error prior to exiting.
                    }
                    await this.userSvc.dismissLoader();
                    // metadata contains information about the institution
                    // that the user selected and the most recent API request IDs.
                    // Storing this information can be helpful for support.
                },
                onEvent: (eventName, metadata) => {
                    // Optionally capture Link flow events, streamed through
                    // this callback as your users connect an Item to Plaid.
                    // For example:
                    // eventName = "TRANSITION_VIEW"
                    // metadata  = {
                    //   link_session_id: "123-abc",
                    //   mfa_type:        "questions",
                    //   timestamp:       "2017-09-14T14:42:19.350Z",
                    //   view_name:       "MFA",
                    // }
                }
            });
            handler.open();
        }, async (error) => {
            await this.userSvc.dismissLoader();
        })
    }

    async addAccount() {
        await this.userSvc.presentLoader();
        try {
            const brokerageAccounts = this.plaidAccounts.filter((data) => data.type == "investment" &&
                (data.subtype == "brokerage" || data.subtype == "non-taxable brokerage account" ||
                    data.subtype == "ugma" || data.subtype == "utma"));
            let total = 0;
            for (let plaidAccount of this.plaidAccounts) {
                let id = "new";
                let accountUpdatedProperties = null;
                let account: TAccount;
                if(plaidAccount.holdings && plaidAccount.holdings.length > 0){
                    let parentAccount: TAccount = {
                        id: "",
                        accountType: (plaidAccount.type == "depository" || plaidAccount.type == "investment") ? "Asset" : "Liability",
                        additionalContribution: null,
                        additionalContribHowOften: "",
                        annualAppreciation: null,
                        annualIncomeIncrease: null,
                        assetAssociation: "none",
                        assetType: "",
                        parentHolding: true,
                        childHoldingIds: [],
                        compoundDRIP: false,
                        costBasis: null,
                        currentBalance: plaidAccount?.balances?.current,
                        currentYield: null,
                        debtPaidOffIn: "",
                        description: "",
                        distributionFrequency: "",
                        excludeFromCompoundReturnCalc: true,
                        excludeFromDebtPayoffCalc: false,
                        excludeFromWithdrawal: false,
                        fractionalReinvestment: false,
                        interestRate: null,
                        investmentType:'',
                        liabilityType: "",
                        liquidationPriority: null,
                        liquidityChaosHedge: false,
                        minPayment: null,
                        monthlyExpense: null,
                        monthlyIncome: null,
                        name: plaidAccount?.name,
                        newMonthlyPayment: null,
                        owner: "USER",
                        payTaxFromExistingAsset: false,
                        plaid: true,
                        referenceURL: "",
                        reinvestIntoOtherAssets: false,
                        sharesOwned: null,
                        sharePrice: null,
                        taxRate: null,
                        unitsOwned: null,
                        unitPrice: null,
                        useNominalValues: false,
                        volatilityRatio: null,
                        yieldGrowthRate: null,
                        zvaIncome: null,
                        zvaFrequency: "",
                        plaidItemid: this.currentItemId,
                        plaidAccountId: plaidAccount?.account_id,
                        ...account
                    }
                    if (plaidAccount.selected === true) {
                        const data = await this.accountsService.createOrUpdateAccount(accountUpdatedProperties, parentAccount, id).toPromise();
                        parentAccount = data?.data?.createAccount;
                        accountUpdatedProperties = {};
                        accountUpdatedProperties.childHoldingIds = [];
                        accountUpdatedProperties.id = parentAccount.id;
                        for(let holding of plaidAccount.holdings){
                            let holdingAccount = {
                                id: "",
                                accountType: (plaidAccount.type == "depository" || plaidAccount.type == "investment") ? "Asset" : "Liability",
                                additionalContribution: null,
                                additionalContribHowOften: "monthly",
                                annualAppreciation: null,
                                annualIncomeIncrease: null,
                                assetAssociation: "none",
                                assetType: "",
                                compoundDRIP: false,
                                costBasis: holding?.cost_basis,
                                currentBalance: holding?.institution_value,
                                currentYield: null,
                                debtPaidOffIn: "",
                                description: holding?.security?.name,
                                distributionFrequency: "monthly",
                                excludeFromCompoundReturnCalc: true,
                                excludeFromDebtPayoffCalc: false,
                                excludeFromWithdrawal: false,
                                fractionalReinvestment: false,
                                interestRate: null,
                                investmentType: "stock",
                                liabilityType: "C",
                                liquidationPriority: null,
                                liquidityChaosHedge: false,
                                minPayment: null,
                                monthlyExpense: null,
                                monthlyIncome: null,
                                name: holding?.security?.ticker_symbol==null?holding?.security?.name:holding?.security?.ticker_symbol,
                                newMonthlyPayment: null,
                                owner: "USER",
                                payTaxFromExistingAsset: false,
                                plaid: true,
                                referenceURL: "",
                                reinvestIntoOtherAssets: false,
                                sharesOwned: holding?.quantity,
                                sharePrice: holding?.institution_price,
                                taxRate: null,
                                unitsOwned: null,
                                unitPrice: null,
                                useNominalValues: false,
                                volatilityRatio: null,
                                yieldGrowthRate: null,
                                zvaIncome: null,
                                zvaFrequency: "",
                                plaidItemid: this.currentItemId,
                                plaidHoldingId: holding?.security_id,
                                parentHoldingId: parentAccount.id,
                                ...account
                            }
                            const createdAccount = await this.accountsService.createOrUpdateAccount(accountUpdatedProperties, holdingAccount, id).toPromise();
                            accountUpdatedProperties.childHoldingIds.push(createdAccount.data.createAccount.id);
                        }
                        await this.accountsService.createOrUpdateAccount(accountUpdatedProperties, parentAccount, parentAccount.id).toPromise();
                    }
                }
                else{
                    account = {
                        id: "",
                        accountType: (plaidAccount.type == "depository" || plaidAccount.type == "investment") ? "Asset" : "Liability",
                        additionalContribution: null,
                        additionalContribHowOften: "monthly",
                        annualAppreciation: null,
                        annualIncomeIncrease: null,
                        assetAssociation: "none",
                        assetType: "C",
                        compoundDRIP: false,
                        costBasis: null,
                        currentBalance: plaidAccount?.balances?.current,
                        currentYield: null,
                        debtPaidOffIn: "",
                        description: "",
                        distributionFrequency: "monthly",
                        excludeFromCompoundReturnCalc: true,
                        excludeFromDebtPayoffCalc: false,
                        excludeFromWithdrawal: false,
                        fractionalReinvestment: false,
                        interestRate: null,
                        investmentType: (plaidAccount.type == "depository" || plaidAccount.type == "investment") ? "portfolio" : '',
                        liabilityType: "C",
                        liquidationPriority: null,
                        liquidityChaosHedge: false,
                        minPayment: null,
                        monthlyExpense: null,
                        monthlyIncome: null,
                        name: plaidAccount?.name,
                        newMonthlyPayment: null,
                        owner: "USER",
                        payTaxFromExistingAsset: false,
                        plaid: true,
                        referenceURL: "",
                        reinvestIntoOtherAssets: false,
                        sharesOwned: null,
                        sharePrice: null,
                        taxRate: null,
                        unitsOwned: null,
                        unitPrice: null,
                        useNominalValues: false,
                        volatilityRatio: null,
                        yieldGrowthRate: null,
                        zvaIncome: null,
                        zvaFrequency: "",
                        plaidItemid: this.currentItemId,
                        plaidAccountId: plaidAccount?.account_id,
                        ...account
                    }
                    if (plaidAccount.selected === true) {
                        const createdAccount = await this.accountsService.createOrUpdateAccount(accountUpdatedProperties, account, id).toPromise();
                    }
                }
            }
        } catch (error) {
            console.error(error);
            this.userSvc.toast("Error while creating or updating an Account.");
        }
        await this.userSvc.dismissLoader();
        await this.closePopovers();
        await this.reviewAccountModal();
    }

    async createAccountModal(type: string) {
        if ('default' == this.getSelectedBalanceSheet()?.name?.toLowerCase() && this.hasAccessToAdminOrPro()) {
            this.newAccountType = type;
            this.platform.width() > 640 ? (this.isAddBalanceAccountPopOpen = !this.isAddBalanceAccountPopOpen) : (this.isAddBalanceAccountModalOpen = !this.isAddBalanceAccountModalOpen);
        }
        else {
            this.createNewAccount(type);
        }
    }

    async reviewAccountModal() {
        this.platform.width() > 640 ? (this.isReviewAccountPopOpen = !this.isReviewAccountPopOpen) : (this.isReviewAccountModalOpen = !this.isReviewAccountModalOpen);
    }

    async reviewLiabilityModal() {
        await this.closePopovers();
        if (this.liablityPlaidAccounts.length > 0) {
            this.platform.width() > 640 ? (this.isReviewLiablityAccountPopOpen = !this.isReviewLiablityAccountPopOpen) : (this.isReviewLiablityAccountModalOpen = !this.isReviewLiablityAccountModalOpen);
        }
    }

    async createAccountOption() {
        await this.popDismiss();
        if (this.addAccountOption == "manual") {
            this.createNewAccount(this.newAccountType);
        }
        else {
            // this.getPlaidAccountsByUserId();
            this.link(this.newAccountType);
        }
    }

    updatePlaid: boolean = false;
    updatePlaidItemId: string;
    async openCreateAccountPlaidOption(updatePlaid = false, updatePlaidItemId = '') {
        await this.popDismiss();
        this.updatePlaid = updatePlaid;
        this.updatePlaidItemId = updatePlaidItemId;
        this.createAccountPlaidOption(true);
        this.platform.width() > 640 ? (this.isAddBalanceAccountPlaidPopOpen = !this.isAddBalanceAccountPlaidPopOpen) : (this.isAddBalanceAccountPlaidModalOpen = !this.isAddBalanceAccountPlaidModalOpen);
    }

    async createAccountPlaidOption(all: boolean) {
        await this.popDismiss();
        if (this.updatePlaid == true)
            this.plaidrelink(this.updatePlaidItemId, true);
        else {
            this.link(this.addAccountOptionPlaid, all);
        }
    }

    async unlinkAccount(id: string) {
        let account = this.accountsService.getAccount(id);
        const updatedAcount = _.cloneDeep(account);
        updatedAcount.plaid = false;
        const accountUpdatedProperties = updatedDiff(account, updatedAcount);
        if (!Object.keys(accountUpdatedProperties).length) {
            return;
        }
        this.userSvc.presentLoader().then(() => {
            this.accountsService.createOrUpdateAccount(accountUpdatedProperties, account, id).subscribe(() => {
                this.userSvc.dismissLoader();
                return;
            }, (error) => {
                this.userSvc.dismissLoader();
                console.error(error);
                this.userSvc.toast("Error while creating or updating an Account.");
            });
        })
    }

    async relinkAccount(id: string) {
        let account = this.accountsService.getAccount(id);
        const updatedAcount = _.cloneDeep(account);
        updatedAcount.plaid = true;
        const accountUpdatedProperties = updatedDiff(account, updatedAcount);
        if (!Object.keys(accountUpdatedProperties).length) {
            return;
        }
        this.userSvc.presentLoader().then(() => {
            this.accountsService.createOrUpdateAccount(accountUpdatedProperties, account, id).subscribe(() => {
                this.userSvc.dismissLoader();
                return;
            }, (error) => {
                this.userSvc.dismissLoader();
                console.error(error);
                this.userSvc.toast("Error while creating or updating an Account.");
            });
        })
    }

    plaidLink(account) {
        if (account.plaid == true) {
            this.relinkAccount(account.id)
        }
        else {
            this.unlinkAccount(account.id)
        }
    }

    showDeletePlaid() {
        this.platform.width() > 640 ? (this.isDeletePlaidItemPopOpen = !this.isDeletePlaidItemPopOpen) : (this.isDeletePlaidItemModalOpen = !this.isDeletePlaidItemModalOpen);
    }

    async deletePlaidItemById() {
        this.deletedAccounts = [];
        this.userSvc.presentLoader().then(() => {
            this.plaidService.deleteAccountByPlaidItemId(this.plaidItem).subscribe(async (data: any) => {
                this.deletedAccounts = data.data.deleteAccountByPlaidItemId;
                await this.userSvc.dismissLoader();
                await this.popDismiss();
                if (this.deletedAccounts.length > 0) {
                    this.platform.width() > 640 ? (this.isReviewDeletedAccountPopOpen = !this.isReviewDeletedAccountPopOpen) : (this.isReviewDeletedAccountModalOpen = !this.isReviewDeletedAccountModalOpen);
                }
                else {
                    await this.userSvc.toast("No accounts found. Item deleted successfully");
                }
                this.plaidItem = '';
            }, async (error) => {
                await this.userSvc.dismissLoader();
                console.error(error);
                // await this.userSvc.toast("Error while deleting an Account.");
                await this.popDismiss();
            });
        });
    }

    unlinkItemId = '';

    openUnlinkDialog(id: string) {
        this.unlinkItemId = id;
        this.platform.width() > 640 ? (this.isUnlinkItemPopOpen = !this.isUnlinkItemPopOpen) : (this.isUnlinkItemModalOpen = !this.isUnlinkItemModalOpen);
    }

    async unlinkPlaidItem() {
        this.deletedAccounts = [];
        this.userSvc.presentLoader().then(() => {
            this.plaidService.unlinkPlaidItem(this.unlinkItemId).subscribe(async (data: any) => {
                await this.userSvc.dismissLoader();
                await this.popDismiss();
                await this.userSvc.toast("Financial Institution unlinked successfully");
                this.doRefresh(true);
            }, async (error) => {
                await this.userSvc.dismissLoader();
                console.error(error);
                // await this.userSvc.toast("Error while deleting an Account.");
                await this.popDismiss();
            });
        });
    }

    syncItemId = '';

    openSyncDialog(id: string, accounts?){
        if(accounts && accounts.length>0){
            for(let account of accounts){
                if(account.updateRequired == true){
                    this.plaidrelink(account.plaidItemid, false);
                    return;
                }
            }
        }
        this.syncItemId = id;
        this.platform.width()>640?(this.isSyncItemPopOpen = !this.isSyncItemPopOpen):(this.isSyncItemModalOpen = !this.isSyncItemModalOpen);
    }

    async syncPlaidItem(){
        this.userSvc.presentLoader().then(()=>{
            this.plaidService.syncByPlaidItemId(this.syncItemId).subscribe(async (data: any) => {
                await this.userSvc.dismissLoader();
                await this.popDismiss();
                await this.userSvc.toast(data?.data?.syncByPlaidItemId?.msg || "Your account is being updated. Check back momentarily.");
                this.doRefresh(true);
            }, async (error)=> {
                await this.userSvc.dismissLoader();
                console.error(error);
                await this.popDismiss();
            });
        });
    }
    
    getLastUpdated(time) {
        if(moment.tz.zone(this.userTimeZone)) {
            return moment(time).utc().tz(this.userTimeZone).fromNow();
        } else {
            return moment(time).utc().tz("America/Chicago").fromNow();
        }
    }

    async getPlaidAccountsByUserId() {
        this.plaidItems = [];
        this.userSvc.presentLoader().then(() => {
            this.plaidService.getPlaidAccountsByUserId().subscribe(async (data: any) => {
                this.plaidItems = data.data.getPlaidAccountsByUserId;
                for(let item of this.plaidItems){
                    const duplicateAccount = [];
                    item.accounts.map((account) => {
                        if (account.parentHolding) {
                            if(account.childHoldingIds){
                                for (let id of account.childHoldingIds) {
                                    duplicateAccount.push(id);
                                }
                            }
                        }
                    });
                    for (let id of duplicateAccount) {
                        item.accounts = item.accounts.filter(a => a.id != id);
                    }
                }
                await this.userSvc.dismissLoader();
                await this.popDismiss();
                // if the user does not have any accounts, open the Plaid Link modal to add an account
                if (this.plaidItems.length === 0) {
                    await this.openCreateAccountPlaidOption();
                } else {
                    this.platform.width() > 640 ? (this.isManagePlaidPopOpen = !this.isManagePlaidPopOpen) : (this.isManagePlaidModalOpen = !this.isManagePlaidModalOpen);
                }
            }, async (error) => {
                await this.userSvc.dismissLoader();
                console.error(error);
                await this.popDismiss();
            });
        });
    }

    async scrollEnd() {
        const el = await this.cont.getScrollElement();
		this.posY = el.scrollTop;
    }

    toggleList(ionItem: any, account: any) {
        account.toggleIconAccount=!account.toggleIconAccount;
        var content = ionItem.el.nextElementSibling;
        if (content.style.maxHeight){
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = '100%';
        }
    }

    forceAllSync() {
        this.platform.width()>640?(this.isSyncAllItemPopOpen = !this.isSyncAllItemPopOpen):(this.isSyncAllItemModalOpen = !this.isSyncAllItemModalOpen);
    }

    syncAllPlaidItem() {
        this.userSvc.presentLoader().then(()=>{
            this.plaidService.syncAllPlaidItems().subscribe(async (data: any) => {
                await this.userSvc.dismissLoader();
                await this.popDismiss();
                await this.userSvc.toast(data?.data?.syncAllPlaidItems?.msg || "Your account is being updated. Check back momentarily.");
                this.doRefresh(true);
            }, async (error)=> {
                await this.userSvc.dismissLoader();
                console.error(error);
                await this.popDismiss();
            });
        });
    }
}
