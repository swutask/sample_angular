import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import {
  ExportedClass as userService
} from '../../scripts/custom/userService';
import {
  ExportedClass as BalanceSheetService
} from '../../scripts/custom/BalanceSheetService';
import {
  ExportedClass as AuthService
} from '../../scripts/custom/AuthService';
import {
  ExportedClass as AccountsService
} from '../../scripts/custom/AccountsService';
import {
  ExportedClass as TAccountList
} from '../../scripts/custom/TAccountList';
import {
  ExportedClass as PlaidService
} from '../../scripts/custom/PlaidService';
import {
  ExportedClass as TAccount
} from '../../scripts/custom/TAccount';
import { 
  ExportedClass as TBalanceSheet 
} from '../../scripts/custom/TBalanceSheet';
import { ExportedClass as SafePipe } from 'src/app/scripts/custom/SafePipe';
import { customAnimation } from '../../animations/customAnimation';
import _ from 'lodash';
import { ModalController, NavController, Platform, PopoverController } from '@ionic/angular';
import { NavigationOptions } from '@ionic/angular/providers/nav-controller';
import { updatedDiff } from 'deep-object-diff';
import moment from 'moment-timezone';
declare var Plaid:any;

@Component({
  selector: 'app-global-nav',
  templateUrl: './global-nav.component.html',
  styleUrls: ['./global-nav.component.scss'],
  providers: [SafePipe]
})
export class GlobalNavComponent implements OnInit, OnDestroy {

  public subscriptions: Subscription[] = [];
  public balanceSheets: any[] = [];
  public defaultAccountList: TAccountList = [];
  public defaultNonExcludedAssets: TAccountList = [];
  public defaultAssetList: TAccountList = [];
  public defaultLiabilityList: TAccountList = [];
  public sheet:any = 'default';
  public userAvatar: string;
  public access: string = 'Free';
  public supportLink: string;
  public upgradeLink: string;
  public docsLink: string;
  public billingLink: string;
  public profileOpen: boolean = false;
  public isProfileDone: boolean = false;
  public isGoalsDone: boolean = false;
  public isFreedomDone: boolean = false;
  public isLifestyleDone: boolean = false;
  public isLegacyDone: boolean = false;
  public isAssetDone: boolean = false;
  public isLiabilityDone: boolean = false;
  public isBudgetingDone: boolean = false;
  public isCapitalDone: boolean = false;
  public isCompoundDone: boolean = false;
  public isIncomeDone: boolean = false;
  public isPorfolioDone: boolean = false;
  public isRiskDone: boolean = false;
  public isTaxDone: boolean = false;
  public isAssetPDone: boolean = false;
  public isDebtDone: boolean = false;
  public isDebtFree: boolean = false;
  public profile: any = {
    firstName: '',
    lastName: '',
    avatar: '',
    bio: '',
    location: '',
    phone: '',
    email: '',
    website: '',
    birthday: '',
    sex: ''
  };

  public actionSheetOptions:any = {
    cssClass:'goals-alert'
  }

  public popoverSheetOptions: any = {
    side: 'bottom',
    size: 'cover',
    cssClass:'min-width-option'
  };

  isManagePlaidPopOpen: boolean = false;
  isManagePlaidModalOpen: boolean = false;

  public isAddBalanceAccountPlaidPopOpen = false;
  public isAddBalanceAccountPlaidModalOpen = false;

  public isAddNewBalanceSheetPopOpen = false;
  public isAddNewBalanceSheetModalOpen = false;

  public isUnlinkItemPopOpen = false;
  public isUnlinkItemModalOpen = false;

  public isSyncItemPopOpen = false;
  public isSyncItemModalOpen = false;

  public isGlobalBalancePopOpen = false;
  public isGlobalBalanceModalOpen = false;

  constructor(public userSvc: userService, public balanceSheetService: BalanceSheetService,
    public platform: Platform, public authService: AuthService, public navCtrl: NavController,
    public popCtrl: PopoverController, public modalCtrl: ModalController, public safePipe: SafePipe,
    public accountsService: AccountsService, public plaidService: PlaidService) {
   }

  ngOnInit() {
    this.authService.isUserLoggedIn().then(()=>{
      this.initilaize();
    })
  }

  initilaize() {
    let getBalanceSheetsSubscription: Subscription, getUserSubscription: Subscription,  getSignedUrlSubscription: Subscription, getDefaultAccountsSubscription: Subscription, getDefaultBalanceSheet: Subscription;
    getBalanceSheetsSubscription = this.balanceSheetService.getBalanceSheets(true).subscribe((res:any) => {
      try{
          if(res.data){
              if(this.balanceSheets?.length != res.data.balanceSheets.length){
                  this.balanceSheets = res.data.balanceSheets
                  this.balanceSheets.sort((a,b) => (a.createdAt > b.createdAt) ? 1 : ((b.createdAt > a.createdAt) ? -1 : 0))
              }
              this.sheet = this.userSvc.activeBalanceSheet
              getDefaultBalanceSheet = this.balanceSheetService.getDefaultBalanceSheet().subscribe(res =>{
                if (res) {
                  // Deep copy response object to avoid mutating the cache object
                  const responseCopy = _.cloneDeep(res);
                  const {
                        name,
                        yearlySnapshotsDebtPayoff,
                        yearlySnapshotsCompoundReturn
                  } = responseCopy;
                  if(!name)
                    return;
                  if(yearlySnapshotsCompoundReturn?.length > 0)
                    this.isCompoundDone = true;
                  else
                    this.isCompoundDone = false;
                  if(yearlySnapshotsDebtPayoff?.length > 0)
                    this.isDebtDone = true;
                  else
                    this.isDebtDone = false;
                }
              })
          }
      }catch(error){
          console.error('error', error)
      }
    });
    getDefaultAccountsSubscription = this.accountsService.getDefaultAccounts().subscribe(() => {
      this.defaultAccountList = this.accountsService.defaultAccounts;
      this.defaultAssetList = this.defaultAccountList.filter(a => a.accountType === 'Asset');
      this.defaultLiabilityList = this.defaultAccountList.filter(a => a.accountType === 'Liability');
      this.defaultNonExcludedAssets = this.defaultAssetList.filter(a => !a.excludeFromCompoundReturnCalc);
      if(this.defaultAssetList.length > 0)
        this.isAssetDone = true
      else
        this.isAssetDone = false
      if(this.defaultLiabilityList.length > 0)
        this.isLiabilityDone = true
      else
        this.isLiabilityDone = false
    });
    getUserSubscription = this.userSvc.getUser().subscribe(({ data: { user } }) => {
      if (user && user.avatar) {
          getSignedUrlSubscription = this.userSvc.getSignedUrl(user.avatar).subscribe((res: any) => {
              if (res) {
                  this.userAvatar = res.data.getSignedUrl.signedUrl;
              }
          })
      }
      const { t1Target, t2Target, t3Target, isDebtFree } = user;
      this.isDebtFree = isDebtFree;
      if(user?.firstName && user?.lastName && user?.birthday && user?.sex){
        this.isProfileDone = true;
      }
      else{
        this.isProfileDone = false;
      }
      if(user?.currentEarnedIncome && user?.earnedIncomeGoal && user?.financialEducation && user?.primaryGoal
        && user?.activePassivePreference && user?.temperament && user?.riskPreference && user?.primaryWealthStrategy
        && user?.secondaryWealthStrategy && user?.legacyModel){
          this.isGoalsDone = true;
      }
      else{
        this.isGoalsDone = false;
      }
      if(user?.resultFreedom > 0){
        this.isFreedomDone = true;
      }
      else{
        this.isFreedomDone = false;
      }
      if(user?.resultLifestyle > user?.resultFreedom){
        this.isLifestyleDone = true;
      }
      else{
        this.isLifestyleDone = false;
      }
      if(user?.legacyStatement){
        this.isLegacyDone = true;
      }
      else{
        this.isLegacyDone = false;
      }
      if(user?.earnedIncomeOptimizationPlan){
        this.isIncomeDone = true;
      }
      else{
        this.isIncomeDone = false;
      }
      if(user?.living > 0 ){
        this.isBudgetingDone = true;
      }
      else{
        this.isBudgetingDone = false;
      }
      if(user?.implementationProgress){
        try{
          let progress = JSON.parse(user?.implementationProgress)
        //   if(progress?.incomeOptimization)
        //     this.isIncomeDone = true
        //   else
        //     this.isIncomeDone = false
          if(progress?.tenPercentPortfolio)
            this.isPorfolioDone = true
          else
            this.isPorfolioDone = false
          if(progress?.riskManagement)
            this.isRiskDone = true
          else
            this.isRiskDone = false
          if(progress?.taxEfficiency)
            this.isTaxDone = true
          else
            this.isTaxDone = false
          if(progress?.assetProtection)
            this.isAssetPDone = true
          else
            this.isAssetPDone = false
        }catch(e){}
      }
      if(t1Target > 0 || t2Target > 0 || t3Target > 0){
        this.isCapitalDone = true
      }
      else{
        this.isCapitalDone = false
      }
    })
    this.userSvc.configurations().toPromise().then(res => {
      const { data: {configurations} } = res;
      this.supportLink = configurations.find(x => x.key === "supportLink").value;
      this.supportLink = this.safePipe.transform(this.supportLink);
      this.upgradeLink =  configurations.find(x => x.key === "upgradeLink").value;
      this.upgradeLink = this.safePipe.transform(this.upgradeLink);
      this.docsLink =  configurations.find(x => x.key === "DOCS_LINK").value;
      this.billingLink = configurations.find(x => x.key === "BILLING_LINK").value;
    })
    if (getBalanceSheetsSubscription) {
      this.subscriptions.push(getBalanceSheetsSubscription);
    }
    if (getUserSubscription) {
      this.subscriptions.push(getUserSubscription);
    }
    if (getSignedUrlSubscription) {
      this.subscriptions.push(getSignedUrlSubscription);
    }
    if (getDefaultAccountsSubscription) {
      this.subscriptions.push(getDefaultAccountsSubscription);
    }
    if (getDefaultBalanceSheet) {
      this.subscriptions.push(getDefaultBalanceSheet);
    }
    this.getProfile();
  }

  async toggleSheet() {
    let nameSubscribe: Subscription;
    this.userSvc.activeBalanceSheet = this.sheet;
    await this.userSvc.presentLoader();
    this.userSvc.updateUser({
        activeBalanceSheet: this.sheet
    }).then(res => {
        nameSubscribe = this.balanceSheetService.getBalanceSheet(this.sheet).subscribe(res=>{
          this.userSvc.toggleBalance.next(res.name);
        },()=>{},()=>{
            if(nameSubscribe)
                nameSubscribe.unsubscribe();
        })
        this.userSvc.dismissLoader();
    }, err => {
        console.error(err)
    });
  }

  getProfile(forceUpdate ? ) {
    return new Promise((resolve) => {
        this.userSvc.getUser(forceUpdate).subscribe(({ data }) => {
            if (data && data.user) {
                const { user } = data;
                this.profile = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    avatar: user.avatar,
                    bio: user.bio,
                    location: user.location,
                    phone: user.phone,
                    email: user.email,
                    website: user.website,
                    birthday: user.birthday,
                    sex: user.sex
                }
                this.access = user.access;

                if(user.avatar) {
                    this.userSvc.getSignedUrl(user.avatar).subscribe((res: any) => {
                        if(res && res.data) {
                            this.profile.avatar = res.data.getSignedUrl.signedUrl;
                            resolve(true);
                        }
                    })
                }
            }
        })
    })
  }

  toggle(){
    this.profileOpen = !this.profileOpen;
  }

  openEditProfile() {
    this.navCtrl.navigateForward("profile");
  }

  openSupport() {
    (document.getElementsByClassName('b24-widget-button-popup')[0] as HTMLDivElement)?.click();
  }

  openDocs() {
    window.open(this.docsLink, "_blank");
  }

  async goToPortal(){
    window.location.href = this.billingLink;
    // await this.userSvc.presentLoader();
    // this.userSvc.createPortal().subscribe( async (data) => {
    //     if (data?.data?.createPortal?.url) {
    //         // window.open(data?.data?.createPortal?.url, "_blank");
    //         window.location.href = data?.data?.createPortal?.url;
    //     }
    //     await this.userSvc.dismissLoader();
    // }, async (error) => {
    //     await this.userSvc.dismissLoader();
    // })
  }

  async logout($event) {
    $event.stopPropagation();
    await this.authService.logout(true);
    this.navCtrl.navigateRoot('login');
  }

  getCompPercentage(isProfileDone, isGoalsDone, isFreedomDone, isLifestyleDone, isLegacyDone, 
    isAssetDone, isLiabilityDone, isBudgetingDone, isCapitalDone, isCompoundDone, isIncomeDone,
    isPorfolioDone, isRiskDone, isTaxDone, isAssetPDone, isDebtDone, isDebtFree){
    let sum=0;
    if(isProfileDone)
      sum++;
    if(isGoalsDone)
      sum++;
    if(isFreedomDone)
      sum++;
    if(isLifestyleDone)
      sum++;
    if(isLegacyDone)
      sum++;
    if(isAssetDone)
      sum++;
    if(isLiabilityDone)
      sum++;
    if(isBudgetingDone)
      sum++;
    if(isCapitalDone)
      sum++;
    if(isCompoundDone)
      sum++;
    if(isIncomeDone)
      sum++;
    if(isPorfolioDone)
      sum++;
    if(isRiskDone)
      sum++;
    if(isTaxDone)
      sum++;
    if(isAssetPDone)
      sum++;
    if(isDebtDone || isDebtFree)
      sum++;
    return Math.round((sum/16) *100);
  }

  openProgress(){
    let options:NavigationOptions={
        animation:customAnimation
    }
    this.navCtrl.navigateForward(`/progress`,options);
}

  async modalDismiss(){
    let modal = await this.modalCtrl.getTop();
    if(modal)
        modal.dismiss();
  }

  async popDismiss(){
    this.accountLabel = '';
    this.accountDescription = '';
    let popover = await this.popCtrl.getTop();
    if(popover)
        await popover.dismiss();
    this.isManagePlaidPopOpen = false;
    this.isManagePlaidModalOpen = false;
      
    this.isAddBalanceAccountPlaidPopOpen = false;
    this.isAddBalanceAccountPlaidModalOpen = false;

    this.isAddPlaidAccountPopOpen = false;
    this.isAddPlaidAccountModalOpen = false;

    this.isReviewAccountPopOpen = false;
    this.isReviewAccountModalOpen = false;

    this.isReviewLiablityAccountModalOpen = false;
    this.isReviewLiablityAccountPopOpen = false;

    this.isAddNewBalanceSheetPopOpen = false;
    this.isAddNewBalanceSheetModalOpen = false;

    this.isUnlinkItemPopOpen = false;
    this.isUnlinkItemModalOpen = false;

    this.isSyncItemPopOpen = false;
    this.isSyncItemModalOpen = false;

    this.isGlobalBalancePopOpen = false;
    this.isGlobalBalanceModalOpen = false;
  }

  hasAccessToAdminOrPro() {
    return ["admin", "comppro", "pro"].indexOf(this.access.toLowerCase()) !== -1;
  }

  isSideMenuOpen(){
    if (document.body.classList.contains('showMenu')) {
      return true;
    }
    else {
      return false
    }
  }

  getMarginLeft(){
    if (this.isSideMenuOpen()){
      if(window.innerWidth < 1540){
        return 30;
      }
      else {
        return (window.innerWidth - 238 - 1252)/2;
      }
    }
    else {
      if(window.innerWidth < 1365){
        return 38;
      }
      else {
        return ((window.innerWidth - 52 - 1252)/2);
      }
    }
  }

  getMarginRight(){
    if (document.body.classList.contains('showMenu')){
      if(window.innerWidth < 1540){
        return 20;
      }
      else {
        return (window.innerWidth - 240 - 1252)/2;
      }
    }
    else {
      if(window.innerWidth < 1365){
        return 20;
      }
      else {
        return ((window.innerWidth - 65 - 1252 - 32)/2) + 14;
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    })
  }

  plaidAccounts = [];
  assetPlaidAccounts = [];
  liablityPlaidAccounts = [];
  plaidItems = [];
  public addAccountOptionPlaid;
  currentItemId: string;
  public isAddPlaidAccountPopOpen = false;
  public isAddPlaidAccountModalOpen = false;
  public isReviewAccountPopOpen = false;
  public isReviewAccountModalOpen = false;
  public isReviewLiablityAccountPopOpen = false;
  public isReviewLiablityAccountModalOpen = false;

  async getPlaidAccountsByUserId(){
    this.plaidItems = [];
    this.userSvc.presentLoader().then(()=>{
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
            await this.popDismiss();
            await this.userSvc.dismissLoader();
            // if the user does not have any accounts, open the Plaid Link modal to add an account
            if (this.plaidItems.length === 0){
              await this.openCreateAccountPlaidOption();
            } else {
            this.platform.width()>640?(this.isManagePlaidPopOpen = !this.isManagePlaidPopOpen):(this.isManagePlaidModalOpen = !this.isManagePlaidModalOpen);
          }
        }, async (error)=> {
            await this.userSvc.dismissLoader();
            console.error(error);
            await this.popDismiss();
        });
    });
  }

  updatePlaid: boolean = false;
  updatePlaidItemId:string;
  async openCreateAccountPlaidOption(updatePlaid = false, updatePlaidItemId = '') {
      await this.popDismiss();
      this.updatePlaid = updatePlaid;
      this.updatePlaidItemId = updatePlaidItemId;
      this.createAccountPlaidOption(true);
      // this.platform.width()>640?(this.isAddBalanceAccountPlaidPopOpen = !this.isAddBalanceAccountPlaidPopOpen):(this.isAddBalanceAccountPlaidModalOpen = !this.isAddBalanceAccountPlaidModalOpen);
  }

  async createAccountPlaidOption(all: boolean) {
    await this.popDismiss();
    if(this.updatePlaid == true)
        this.plaidrelink(this.updatePlaidItemId, true);
    else{
        this.link(this.addAccountOptionPlaid, all);
    }
  }

  async link(type:string, all = false){
    await this.userSvc.presentLoader();
    const liability = type != 'Asset'?true: false;
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

              this.plaidService.setAccessToken(public_token, metadata.institution.institution_id).subscribe(res =>{
                this.currentItemId = res.data.setAccessToken.itemId;
                this.plaidService.getPlaidTransactions(res.data.setAccessToken.itemId,moment().subtract(7,'d').format('YYYY-MM-DD'),moment().format("YYYY-MM-DD")).subscribe(async (res) =>{
                    this.plaidAccounts = res.data.getPlaidTransactions.accounts;
                    for(let account of this.plaidAccounts){
                        account.selected = true;
                    }
                    this.addAccountOptionPlaid = type;
                    if (type != 'Asset') {
                      this.liablityPlaidAccounts = this.plaidAccounts.filter((e)=> e.type=="credit" || e.type=="loan")
                    }
                    else {
                        this.assetPlaidAccounts = this.plaidAccounts.filter((e)=> e.type=="depository" || e.type=="investment")
                    }
                    await this.userSvc.dismissLoader();
                    this.platform.width()>640?(this.isAddPlaidAccountPopOpen = !this.isAddPlaidAccountPopOpen):(this.isAddPlaidAccountModalOpen = !this.isAddPlaidAccountModalOpen);
                })
              }, (error) => {
                    this.userSvc.dismissLoader();
              })
            },
            onExit:async (err, metadata) => {
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

  async plaidrelink(plaidItemId:string, newAccount = false){
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
                this.plaidService.updateAccountsResetByItemId(plaidItemId).subscribe(async (data: any)=>{
                    this.plaidItems = data.data.updateAccountsResetByItemId;
                    await this.userSvc.dismissLoader();
                });
              } else {
                this.currentItemId = plaidItemId;
                this.plaidService.getPlaidTransactions(plaidItemId,moment().subtract(7,'d').format('YYYY-MM-DD'),moment().format("YYYY-MM-DD")).subscribe(async (res) =>{
                    this.plaidAccounts = res.data.getPlaidTransactions.accounts;
                    for(let account of this.plaidAccounts){
                        account.selected = true;
                    }
                    const currentItem = this.plaidItems.find((e) => e.itemId === plaidItemId);
                    const accounts = currentItem.accounts;
                    for(const account of accounts){
                        this.plaidAccounts = this.plaidAccounts.filter(item => item.account_id !== account.plaidAccountId);
                    }
                    if (this.addAccountOptionPlaid != 'Asset') {
                      this.liablityPlaidAccounts = this.plaidAccounts.filter((e)=> e.type=="credit" || e.type=="loan")
                    }
                    else {
                        this.assetPlaidAccounts = this.plaidAccounts.filter((e)=> e.type=="depository" || e.type=="investment")
                    }
                    await this.userSvc.dismissLoader();
                    this.platform.width()>640?(this.isAddPlaidAccountPopOpen = !this.isAddPlaidAccountPopOpen):(this.isAddPlaidAccountModalOpen = !this.isAddPlaidAccountModalOpen);
                })
              }
            },
            onExit:async (err, metadata) => {
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
    }, async (error) =>{
        await this.userSvc.dismissLoader();
    })
  }

  plaidLink(account){
    if( account.plaid == true){
        this.relinkAccount(account.id)
    }
    else{
        this.unlinkAccount(account.id)
    }
  }

  async relinkAccount(id: string){
    let account = this.accountsService.getAccount(id);
    const updatedAcount = _.cloneDeep(account);
    updatedAcount.plaid = true;
    const accountUpdatedProperties = updatedDiff(account, updatedAcount);
    if(!Object.keys(accountUpdatedProperties).length) {
        return;
    }
    this.userSvc.presentLoader().then(()=>{
        this.accountsService.createOrUpdateAccount(accountUpdatedProperties, account, id).subscribe(() => {
            this.userSvc.dismissLoader();
            return;
        }, (error)=> {
            this.userSvc.dismissLoader();
            console.error(error);
            this.userSvc.toast("Error while creating or updating an Account.");
        });
    })
  }

  async unlinkAccount(id: string){
    let account = this.accountsService.getAccount(id);
    const updatedAcount = _.cloneDeep(account);
    updatedAcount.plaid = false;
    const accountUpdatedProperties = updatedDiff(account, updatedAcount);
    if(!Object.keys(accountUpdatedProperties).length) {
        return;
    }
    this.userSvc.presentLoader().then(()=>{
        this.accountsService.createOrUpdateAccount(accountUpdatedProperties, account, id).subscribe(() => {
            this.userSvc.dismissLoader();
            return;
        }, (error)=> {
            this.userSvc.dismissLoader();
            console.error(error);
            this.userSvc.toast("Error while creating or updating an Account.");
        });
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
    await this.popDismiss();
    await this.reviewAccountModal();
}

  async reviewAccountModal() {
    this.platform.width()>640?(this.isReviewAccountPopOpen = !this.isReviewAccountPopOpen):(this.isReviewAccountModalOpen = !this.isReviewAccountModalOpen);
  }

  async reviewLiabilityModal(){
    await this.popDismiss();
    if(this.liablityPlaidAccounts.length > 0) {
        this.platform.width()>640?(this.isReviewLiablityAccountPopOpen = !this.isReviewLiablityAccountPopOpen):(this.isReviewLiablityAccountModalOpen = !this.isReviewLiablityAccountModalOpen);
    }    
  }

  public accountDescription='';
  public accountLabel='';

  hasAccessTo() {
    return ["comppro", "pro", "comppremium", "premium", "admin"].indexOf(this.access.toLowerCase()) !== -1;
  }

  async select(id) {
    await this.userSvc.presentLoader();
    this.sheet = id;
    let nameSubscribe: Subscription;
    this.userSvc.activeBalanceSheet = this.sheet;
    await this.userSvc.presentLoader();
    this.userSvc.updateUser({
        activeBalanceSheet: this.sheet
    }).then(res => {
        nameSubscribe = this.balanceSheetService.getBalanceSheet(this.sheet).subscribe(res=>{
          this.userSvc.toggleBalance.next(res.name);
        },()=>{},()=>{
            if(nameSubscribe)
                nameSubscribe.unsubscribe();
        })
        this.userSvc.dismissLoader();
    }, err => {
        console.error(err)
    });
  }

  addCustomAccount(){
    if (this.accountLabel && this.accountLabel!='') {
        this.balanceSheetService.createBalanceSheet({name:this.accountLabel,description:this.accountDescription})
        .subscribe(async (res) => {
            if(res?.data?.createBalanceSheet?.id){
                this.balanceSheetService.balanceSheets[this.balanceSheetService.balanceSheets.length - 1].id = res.data.createBalanceSheet.id;
                this.balanceSheets[this.balanceSheets.length - 1].id = res.data.createBalanceSheet.id
                this.select(res.data.createBalanceSheet.id);
            }
            let popover = await this.popCtrl.getTop();
            if(popover)
                await popover.dismiss();
            let modal = await this.modalCtrl.getTop();
            if(modal)
                await modal.dismiss();
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

  errorHandler(e) {
    let errorMessage = 'An error occurred. Please try again later';
    try {
        errorMessage = e.error.message;
    } catch (e) {}
    this.userSvc.pushTopErrorToast(errorMessage);
  }

  public isEditPopOpen = false;
  public isEditModalOpen = false;
  public isCloneBalancePopOpen = false;
  public isCloneBalanceModalOpen = false;
  public isClonePopOpen = false;
  public isCloneModalOpen = false;
  public isDeletePopOpen =false;
  public isDeleteModalOpen =false;
  public deleteConfirmationMsg ='';
  public deleteConfirmationHeader ='';
  public cloneAccountBalance ='';
  public selectedAccountId='';
  public cloneMessage = '';
  public selectoptions= {
      cssClass:'selectoptions'
  }
  public bs:TBalanceSheet;
  editEvent:any;

  getSelectedBalanceSheet(){
    return this.balanceSheets?.filter(a=>a.id==this.userSvc.activeBalanceSheet)[0];
  }

  async openEditAlert(event) {
      this.editEvent = event;
      this.balanceSheetService.getBalanceSheet(this.userSvc.activeBalanceSheet).subscribe(async (bs) => {
          this.bs = bs;
          this.accountLabel = bs.name;
          this.accountDescription = bs.description;
          this.platform.width()>640?(this.isEditPopOpen = !this.isEditPopOpen):(this.isEditModalOpen = !this.isEditModalOpen);
          // this.bluractiveedit();
      });
  }

  cloneEvent:any;
  async openCloneAlert(event) {
      this.cloneEvent = event;
      this.platform.width()>640?(this.isCloneBalancePopOpen = !this.isCloneBalancePopOpen):(this.isCloneBalanceModalOpen = !this.isCloneBalanceModalOpen);
  }

  newEvent:any;
  async openNewAlert(event) {
      this.newEvent = event;
      this.platform.width()>640?(this.isAddNewBalanceSheetPopOpen = !this.isAddNewBalanceSheetPopOpen):(this.isAddNewBalanceSheetModalOpen = !this.isAddNewBalanceSheetModalOpen);
  }

  globalBalanceEvent:any;
  async openNewBalanceAlert(event) {
      this.globalBalanceEvent = event;
      this.platform.width()>640?(this.isGlobalBalancePopOpen = !this.isGlobalBalancePopOpen):(this.isGlobalBalanceModalOpen = !this.isGlobalBalanceModalOpen);
  }

  deleteEvent:any
  deleteConfirmation(id,event?){
      this.deleteEvent = event;
      this.deleteConfirmationHeader ='Delete Balance Sheet';
      this.deleteConfirmationMsg = 'Are you sure you want to delete this Balance sheet?';
      
      if(id){
          // this.selectedAccountId = id;
          this.deleteConfirmationMsg = 'Are you sure you want to delete this account? Any holdings associated with this account will also be deleted.';
          this.deleteConfirmationHeader ='Delete Account';
      }
      // else{
      //     this.selectedAccountId ='';
      // }
      
      this.platform.width()>640?(this.isDeletePopOpen = !this.isDeletePopOpen):(this.isDeleteModalOpen = !this.isDeleteModalOpen);
  }

  public editProcess = false;
  async editSheet(){
      if (this.accountLabel && this.accountLabel!='') {
          this.editProcess = true;
          let data= {name:this.accountLabel,description:this.accountDescription}
          // Get only updated properties from object
          let balanceSheetUpdatedProperties = updatedDiff(this.bs, data);

          // If no changes in object, navigate back
          if(!Object.keys(balanceSheetUpdatedProperties).length) {
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
              let sheet = this.balanceSheets.filter((acc)=> {return acc.id==this.bs.id})[0];
              sheet.name = this.accountLabel;
              sheet.description = this.accountDescription;
              let popover = await this.popCtrl.getTop();
              if(popover)
                  await popover.dismiss();
              let modal = await this.modalCtrl.getTop();
              if(modal)
                  await modal.dismiss();
              await this.popDismiss()
              this.editProcess = false
          }, async (err: any) => {
              let popover = await this.popCtrl.getTop();
              if(popover)
                  await popover.dismiss();
              let modal = await this.modalCtrl.getTop();
              if(modal)
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

  public cloneProcess= false;
  addCloneSheet(){
      if (this.accountLabel && this.accountLabel!='') {
          this.cloneProcess = true;
          this.balanceSheetService.clone(this.userSvc.activeBalanceSheet, {name:this.accountLabel,description:this.accountDescription}).subscribe(async (res) => {
              if(res?.data?.cloneBalanceSheet?.id){
                this.select(res.data.cloneBalanceSheet.id);
              }
              let popover = await this.popCtrl.getTop();
              if(popover)
                  await popover.dismiss();
              let modal = await this.modalCtrl.getTop();
              if(modal)
                  await modal.dismiss();
              await this.popDismiss();
              this.cloneProcess = false;
          }, async (err: any) => {
              let popover = await this.popCtrl.getTop();
              if(popover)
                  await popover.dismiss();
              let modal = await this.modalCtrl.getTop();
              if(modal)
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

  async deleteConfirmed(){
    if(this.selectedAccountId){
        // this.deleteAccount(this.selectedAccountId)
        let popover = await this.popCtrl.getTop();
        if(popover)
            await popover.dismiss();
        let modal = await this.modalCtrl.getTop();
        if(modal)
            await modal.dismiss();
            await this.popDismiss();
    }
    else{
        this.openDeleteAlert()
    }
  }

  unlinkItemId = '';

  openUnlinkDialog(id: string){
      this.unlinkItemId = id;
      this.platform.width()>640?(this.isUnlinkItemPopOpen = !this.isUnlinkItemPopOpen):(this.isUnlinkItemModalOpen = !this.isUnlinkItemModalOpen);
  }

  async unlinkPlaidItem(){
    this.userSvc.presentLoader().then(()=>{
        this.plaidService.unlinkPlaidItem(this.unlinkItemId).subscribe(async (data: any) => {
            await this.userSvc.dismissLoader();
            await this.popDismiss();
            await this.userSvc.toast("Financial Institution unlinked successfully");
            this.userSvc.toggleBalance.next(null);
        }, async (error)=> {
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
                this.userSvc.toggleBalance.next(null);
                await this.userSvc.toast("Your account is being updated. Check back momentarily.");
            }, async (error)=> {
                await this.userSvc.dismissLoader();
                console.error(error);
                await this.popDismiss();
            });
        });
    }

  async openDeleteAlert() {
    let popover = await this.popCtrl.getTop();
    if(popover)
        await popover.dismiss();
    let modal = await this.modalCtrl.getTop();
    if(modal)
        await modal.dismiss();
    this.balanceSheetService.getBalanceSheet(this.userSvc.activeBalanceSheet).subscribe(async (bs) => {
        if (!bs?.default) {
            this.balanceSheetService.deleteBalanceSheet(this.userSvc.activeBalanceSheet).subscribe(async (res: any) => {
                this.select(this.balanceSheets[0].id);
                await this.popDismiss();
            }, (err: any) => {
                this.errorHandler(err);
            });
        }
    });
    return;
  }

}
