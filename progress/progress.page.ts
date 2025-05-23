import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import {
  ExportedClass as AppSideMenuService
} from '../scripts/custom/AppSideMenuService';
import _ from 'lodash';
import { Subscription } from 'rxjs';
import {
  ExportedClass as userService
} from '../scripts/custom/userService';
import {
  ExportedClass as AccountsService
} from '../scripts/custom/AccountsService';
import {
  ExportedClass as BalanceSheetService
} from '../scripts/custom/BalanceSheetService';
import {
  ExportedClass as TAccountList
} from '../scripts/custom/TAccountList';
import { NavigationExtras } from '@angular/router';
import { updatedDiff } from 'deep-object-diff';

@Component({
  selector: 'app-progress[start-page]',
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
})
export class ProgressPage implements OnInit {

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
  public subscriptions: Subscription[] = [];
  public accountList: TAccountList = [];
  public nonExcludedAssets: TAccountList = [];
  public assetList: TAccountList = [];
  public liabilityList: TAccountList = [];

  constructor(public appSideMenuService: AppSideMenuService, public navCtrl:NavController, public platform: Platform,
    public userSvc: userService, public accountsService: AccountsService, public balanceSheetService: BalanceSheetService) {
     }

  ngOnInit() {
  }

  ionViewWillEnter(){
    let getUserSubscription: Subscription, getAccountsSubscription: Subscription, getBalanceSheetsSubscription: Subscription, getDefaultBalanceSheet: Subscription;
    getUserSubscription = this.userSvc.getUser().subscribe(({ data: { user } }) => {
      if (user) {
        const { t1Target, t2Target, t3Target, isDebtFree } = user;
        this.isDebtFree =  isDebtFree;
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
            // if(progress?.incomeOptimization)
            //   this.isIncomeDone = true
            // else
            //   this.isIncomeDone = false
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
      }
    })

    getDefaultBalanceSheet = this.balanceSheetService.getDefaultBalanceSheet().subscribe(res =>{
      if (res) {
        // Deep copy response object to avoid mutating the cache object
        const responseCopy = _.cloneDeep(res);
        const {
            yearlySnapshotsDebtPayoff,
            yearlySnapshotsCompoundReturn
        } = responseCopy;
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
    
    getAccountsSubscription = this.accountsService.getDefaultAccounts().subscribe(() => {
      this.accountList = this.accountsService.defaultAccounts;
      this.assetList = this.accountList.filter(a => a.accountType === 'Asset');
      this.liabilityList = this.accountList.filter(a => a.accountType === 'Liability');
      this.nonExcludedAssets = this.assetList.filter(a => !a.excludeFromCompoundReturnCalc);
      if(this.assetList.length > 0)
        this.isAssetDone = true
      else
        this.isAssetDone = false
      if(this.liabilityList.length > 0)
        this.isLiabilityDone = true
      else
        this.isLiabilityDone = false
      
    });

    if (getUserSubscription) {
        this.subscriptions.push(getUserSubscription);
    }
    if (getAccountsSubscription){
      this.subscriptions.push(getAccountsSubscription);
    }
    if (getDefaultBalanceSheet){
      this.subscriptions.push(getDefaultBalanceSheet);
    }
    let enable = _.debounce(()=>{
      this.appSideMenuService.disableSideMenu();
    },450);
    enable();
  }

  ionViewWillLeave() {
    this.subscriptions.forEach(sub => {
        sub.unsubscribe();
    })
}

  openDashboard() {
    this.navCtrl.navigateBack("dashboard");
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

  openMyProfile() {
    this.navCtrl.navigateForward("profile");
    let enable = _.debounce(()=>{
      this.appSideMenuService.enableSideMenu();
    },450);
    enable();
  }
  openGoals() {
    this.navCtrl.navigateForward("goals");
    let enable = _.debounce(()=>{
      this.appSideMenuService.enableSideMenu();
    },450);
    enable();
  }
  openFreedom(){
    this.navCtrl.navigateForward("freedomnumberdetails");
    let enable = _.debounce(()=>{
      this.appSideMenuService.enableSideMenu();
    },450);
    enable();
  }
  openLifestyle(){
    this.navCtrl.navigateForward("lifestylenumberdetails");
    let enable = _.debounce(()=>{
      this.appSideMenuService.enableSideMenu();
    },450);
    enable();
  }
  openLegacy() {
    let navigationExtras: NavigationExtras = {
      state: {
        legacy: true
      }
    };
    this.navCtrl.navigateForward("goals",navigationExtras);
    let enable = _.debounce(()=>{
      this.appSideMenuService.enableSideMenu();
    },450);
    enable();
  }
  toBalanceSheet(type:any){
    let navigationExtras: NavigationExtras = {
        state: {
          asset:type=='asset'?true:false,
          liability:type=='liablility'?true:false,
        }
      };
    this.navCtrl.navigateForward(`balancesheet`,navigationExtras);
  }
  openBudgeting(){
    this.navCtrl.navigateForward("nd1details");
    let enable = _.debounce(()=>{
      this.appSideMenuService.enableSideMenu();
    },450);
    enable();
  }
  openDebt(){
    this.navCtrl.navigateForward("debtpayoff");
    let enable = _.debounce(()=>{
      this.appSideMenuService.enableSideMenu();
    },450);
    enable();
  }
  openCapital(){
    this.navCtrl.navigateForward("nd2details");
    let enable = _.debounce(()=>{
      this.appSideMenuService.enableSideMenu();
    },450);
    enable();
  }
  openCompound(){
    this.navCtrl.navigateForward("compoundreturn");
    let enable = _.debounce(()=>{
      this.appSideMenuService.enableSideMenu();
    },450);
    enable();
  }

  openPortfolio(){
    this.navCtrl.navigateForward("resourceDetails/ck0eai0tsbid50a30b9we6la7");
    let enable = _.debounce(()=>{
      this.appSideMenuService.enableSideMenu();
    },450);
    enable();
  }

  updateProgress(type){
    // if(type == "isIncomeDone")
    //   this.isIncomeDone = !this.isIncomeDone;
    if(type == "isPorfolioDone")
      this.isPorfolioDone = !this.isPorfolioDone;
    if(type == "isRiskDone")
      this.isRiskDone = !this.isRiskDone;
    if(type == "isTaxDone")
      this.isTaxDone = !this.isTaxDone;
    if(type == "isAssetPDone")
      this.isAssetPDone = !this.isAssetPDone;
    const progress = {
      // incomeOptimization: this.isIncomeDone,
      tenPercentPortfolio: this.isPorfolioDone,
      riskManagement: this.isRiskDone,
      taxEfficiency: this.isTaxDone,
      assetProtection: this.isAssetPDone,
    }
    const completeProgress = {
      implementationProgress:JSON.stringify(progress)
    }
    const getUserSubscription = this.userSvc.getUser().subscribe(({ data: { user } }) => {
      const userUpdatedProperties = updatedDiff(user, completeProgress);
      if(userUpdatedProperties && Object.keys(userUpdatedProperties).length) {
            this.userSvc.updateUser(userUpdatedProperties).then(res => {
            })
      }
    })
     if(getUserSubscription) {
         this.subscriptions.push(getUserSubscription);
     }
  }

  mobileUpdateProgress(type){
    if(this.platform.width() < 640)
      this.updateProgress(type);
    else
      return
  }

}
