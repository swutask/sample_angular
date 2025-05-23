import { Component, OnInit } from '@angular/core';
import { AlertController, AnimationController, ModalController, NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FreedomNumberComponent } from '../freedom-number/freedom-number.component';
import { updatedDiff } from 'deep-object-diff';
import _ from 'lodash';
import {
  ExportedClass as userService
} from '../../scripts/custom/userService';
import {
  ExportedClass as TCompoundReturn
} from '../../scripts/custom/TCompoundReturn';
import {
  ExportedClass as BalanceSheetService
} from '../../scripts/custom/BalanceSheetService';
import {
  ExportedClass as AccountsService
} from '../../scripts/custom/AccountsService';
import {
  ExportedClass as TAccountList
} from '../../scripts/custom/TAccountList';
import {
  ExportedClass as TND1Calculator
} from '../../scripts/custom/TND1Calculator';
import {
  ExportedClass as CompoundReturnService
} from '../../scripts/custom/CompoundReturnService';
import {
    ExportedClass as TAccount
} from '../../scripts/custom/TAccount';
import { LifestyleNumberComponent } from '../lifestyle-number/lifestyle-number.component';
import { threadId } from 'worker_threads';
import { AccountDetails } from 'src/app/AccountDetails/AccountDetails';

@Component({
  selector: 'app-compound-return',
  templateUrl: './compound-return.component.html',
  styleUrls: ['./compound-return.component.scss'],
})
export class CompoundReturnComponent implements OnInit {

  public data: TCompoundReturn;
  freedomNumber: number;
  lifestyleNumber: number;
  currentEarnedIncome: number;
  public subscriptions: Subscription[] = [];
  public accountList: TAccountList;
  public assets: TAccountList;
  public nonExcludedAssets: TAccountList;
  public accountsWithReinvestIntoOtherAssets: TAccountList;
  public calculatedUnearnedIncomeValueOfAccounts: number;
  public toggleIconAccount:boolean = false;
  public nonExcludedAlertIsOpened: boolean;
  public nd1CalculatorData: TND1Calculator;
  public onlyReinvestAlertIsOpened: boolean;
  public lastDataPassedInCompoundReturn;
  public calculatedOutputs: any;
  public freedomAndLifestyleText: any;
  public freedomMonth: number;
  public lifestyleMonth: number;
  public customGoalsResult: any[] = [];
  public noInvestmentTypeAlertIsOpened: boolean;
  public everyAssetHasInvestmentType: boolean;
  public noAssetAlertIsOpened: boolean;
  public onlyZvaAlertIsOpened: boolean;
  public showMonthly: boolean;
  public access: string = 'Free';

  public enterAnimation = (baseEl: any) => {
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

  public leaveAnimation = (baseEl: any) => {
    return this.enterAnimation(baseEl).direction('reverse');
  }

  constructor(public modalCtrl: ModalController, public animationCtrl: AnimationController, public userSvc: userService,
    public balanceSheetService: BalanceSheetService, public accountsService: AccountsService,
    public alertController: AlertController, public compoundReturnService: CompoundReturnService,
    public platform: Platform, public navCtrl: NavController) {

    this.freedomNumber = 0;
    this.lifestyleNumber = 0;
    this.currentEarnedIncome = 0;
    this.data = {
      // _id: null,
      monthlyEarnedIncome: null,
      useND1WealthValue: null,
      monthlyUnearnedIncome: null,
      useUnearnedIncomeValues: false,
      annualContribution: null,
      annualIncreaseContribution: null,
      annualWithdrawal: null,
      withdrawalStartingYear: null,
      volatilityDrawdown: null,
      everyNumberYears: null,
      yearsInvested: null,
      showMonthly: null
    }
    this.calculatedOutputs = {
      assetsOwned: 0,
      balance: 0,
      basis: 0,
      dividendInAbsoluteDollars: 0,
      income: 0,
      isMultipleAssets: false,
      isPortfolio: false,
      isUnits: false,
      lastMonthsAssetPrice: 0,
      lastMonthsYield: 0,
      returns: 0,
      riskAdjustedBasis: 0,
      totalAnnualWithdrawal: 0,
      totalContributions: 0,
      totalDistribution: 0,
      year: 0,
      yieldOnCost: 0,
    };
    this.freedomAndLifestyleText = {
        freedomText: '',
        lifestyleText: '',
    }
    this.freedomMonth = 0;
    this.lifestyleMonth = 0;
    this.freedomNumber = 0;
    this.lifestyleNumber = 0;
    this.nd1CalculatorData = {
        wealth: null,
    };
    this.access = this.userSvc.access || this.access;
    this.setUserData().then(()=>{
        this.setBalanceSheetData();
    });
   }

  ngOnInit() {}

  ionViewWillEnter(){
    this.pageIonViewDidEnter__j_504();
  }

  hasAccessToPro() {
    return ["comppro", "pro", "admin"].indexOf(this.access.toLowerCase()) !== -1;
}

  async openFreedomCalculator(){
    const modal = await this.modalCtrl.create({
        component: FreedomNumberComponent,
        enterAnimation: this.platform.width()>640?this.enterAnimation:undefined,
        leaveAnimation: this.platform.width()>640?this.leaveAnimation:undefined,
        cssClass: 'side-menu'
    });
    modal.onDidDismiss().then((data)=>{
        this.pageIonViewDidEnter__j_504();
    });
    modal.present();
  }

  async openLifestyleCalculator(){
    const modal = await this.modalCtrl.create({
        component: LifestyleNumberComponent,
        enterAnimation: this.platform.width()>640?this.enterAnimation:undefined,
        leaveAnimation: this.platform.width()>640?this.leaveAnimation:undefined,
        cssClass: 'side-menu'
    });
    modal.onDidDismiss().then((data)=>{
        this.pageIonViewDidEnter__j_504();
    });
    modal.present();
  }

  async setUserData() {
    // const getUserSubscription = this.userSvc.getUser(true).subscribe(({ data }) => {
    //     if (data && data.user) {
    //         const { user } = data;
    //         // this.getFreedomNumber();
    //         this.freedomNumber = user.resultFreedom;

    //         // this.getLifestyleNumber();
    //         this.lifestyleNumber = user.resultLifestyle;

    //         // this.getCurrentEarnedIncome();
    //         this.currentEarnedIncome = user.currentEarnedIncome || 0;

    //         // this.getAllND1Data(); 
    //         this.nd1CalculatorData.giving = user.giving;
    //         this.nd1CalculatorData.wealth = user.wealth;
    //         this.nd1CalculatorData.debt = user.debt;
    //         this.nd1CalculatorData.living = user.living;
    //         this.nd1CalculatorData.customAccounts = user.customAccounts;

    //         //moac settings
    //         const responseCopy = _.cloneDeep(data.user);
    //         const {
    //             monthlyEarnedIncome,
    //             useND1WealthValue,
    //             useUnearnedIncomeValues,
    //             annualContribution,
    //             annualIncreaseContribution,
    //             annualWithdrawal,
    //             withdrawalStartingYear,
    //             volatilityDrawdown,
    //             everyNumberYears,
    //             yearsInvested
    //         } = responseCopy;
    //         this.data = {
    //             monthlyEarnedIncome,
    //             useND1WealthValue,
    //             useUnearnedIncomeValues: useUnearnedIncomeValues || false,
    //             annualContribution,
    //             annualIncreaseContribution,
    //             annualWithdrawal,
    //             withdrawalStartingYear,
    //             volatilityDrawdown,
    //             everyNumberYears,
    //             yearsInvested: yearsInvested || 20
    //         }
    //         if (useND1WealthValue === null) {
    //             this.data.useND1WealthValue = true;
    //         } else if (useND1WealthValue && this.data.monthlyEarnedIncome > 0) {
    //             this.data.useND1WealthValue = true;
    //         } else if (useND1WealthValue === false && this.data.monthlyEarnedIncome > 0) {
    //             this.data.useND1WealthValue = false;
    //         } else if (!this.data.monthlyEarnedIncome){
    //             this.data.useND1WealthValue = false;
    //         }
    //     }
    // })

    const getUser = await this.userSvc.getUserOnce().toPromise();
        if (getUser.data && getUser.data.user) {
            const { user } = getUser.data;

            this.freedomNumber = user.resultFreedom;
            this.lifestyleNumber = user.resultLifestyle;
            this.currentEarnedIncome = user.currentEarnedIncome || 0;
            this.nd1CalculatorData.giving = user.giving;
            this.nd1CalculatorData.wealth = user.wealth;
            this.nd1CalculatorData.debt = user.debt;
            this.nd1CalculatorData.living = user.living;
            this.nd1CalculatorData.customAccounts = user.customAccounts;

            //moac settings
            const responseCopy = _.cloneDeep(getUser.data.user);
            const {
                monthlyEarnedIncome,
                useND1WealthValue,
                useUnearnedIncomeValues,
                annualContribution,
                annualIncreaseContribution,
                annualWithdrawal,
                withdrawalStartingYear,
                volatilityDrawdown,
                everyNumberYears,
                showMonthly,
                yearsInvested
            } = responseCopy;
            this.data = {
                monthlyEarnedIncome,
                useND1WealthValue,
                useUnearnedIncomeValues: useUnearnedIncomeValues || false,
                annualContribution,
                annualIncreaseContribution,
                annualWithdrawal,
                withdrawalStartingYear,
                volatilityDrawdown,
                everyNumberYears,
                showMonthly,
                yearsInvested: yearsInvested || 20
            }
            if (useND1WealthValue === null) {
                this.data.useND1WealthValue = true;
            } else if (useND1WealthValue && this.data.monthlyEarnedIncome > 0) {
                this.data.useND1WealthValue = true;
            } else if (useND1WealthValue === false && this.data.monthlyEarnedIncome > 0) {
                this.data.useND1WealthValue = false;
            } else if (!this.data.monthlyEarnedIncome){
                this.data.useND1WealthValue = false;
            }
            console.log(this.data);
        }

    // if(getUserSubscription) {
    //     this.subscriptions.push(getUserSubscription);
    // }
  }

  setBalanceSheetData(toastMessage?,fromPageLoad?) {
    const balanceSubscription = this.balanceSheetService.getActiveV2(true).subscribe((res: any) => {
        if (res && res.data) {
            const responseCopy = _.cloneDeep(res.data.balanceSheet);
            const {
                // monthlyEarnedIncome,
                // useND1WealthValue,
                monthlyUnearnedIncome,
                // useUnearnedIncomeValues,
                // annualContribution,
                // annualIncreaseContribution,
                // annualWithdrawal,
                // withdrawalStartingYear,
                // volatilityDrawdown,
                // everyNumberYears,
                // yearsInvested
            } = responseCopy;

            // if (toastMessage && !yearsInvested) {
            //     this.userSvc.toast(toastMessage);
            // }

            // this.data = {
                // monthlyEarnedIncome,
                // useND1WealthValue,
                // monthlyUnearnedIncome,
                // useUnearnedIncomeValues: useUnearnedIncomeValues || false,
                // annualContribution,
                // annualIncreaseContribution,
                // annualWithdrawal,
                // withdrawalStartingYear,
                // volatilityDrawdown,
                // everyNumberYears,
                // yearsInvested: yearsInvested || 20
            // }
            this.data.monthlyUnearnedIncome = monthlyUnearnedIncome;
            // if (useND1WealthValue === null) {
            //     this.data.useND1WealthValue = true;
            // } else if (useND1WealthValue && this.data.monthlyEarnedIncome > 0) {
            //     this.data.useND1WealthValue = true;
            // } else if (useND1WealthValue === false && this.data.monthlyEarnedIncome > 0) {
            //     this.data.useND1WealthValue = false;
            // } else if (!this.data.monthlyEarnedIncome){
            //     this.data.useND1WealthValue = false;
            // }
        }
        if(fromPageLoad){
            this.updateCompoundReturnCalculator(fromPageLoad);
        }
    })
    if(balanceSubscription)
        this.subscriptions.push(balanceSubscription);
  }

  ionViewWillLeave() {
    this.subscriptions.forEach(sub => {
        sub.unsubscribe();
    })
    this.subscriptions = [];
  }

  async pageIonViewDidEnter__j_504(event?, currentItem?) {
    let __aio_tmp_val__: any;
    /* Run TypeScript */
    /* Run TypeScript */
    // ensure that getAccounts is pulling FRESH data, NOT cached data
    const getAccountsSubscription = this.accountsService.getAccounts().subscribe(res => {
        this.accountList = this.accountsService.accounts;
        this.assets = this.accountList.filter(a => a.accountType === 'Asset');
        const nonParentHoldingAssets = this.assets.filter((account) => !account.parentHolding);
        nonParentHoldingAssets.map((a) => {
            if (a.parentHoldingId && a.accountType === 'Asset') {
                a.parent = this.accountsService.getAccount(a.parentHoldingId);
            }
            return a;
        })
        this.nonExcludedAssets = nonParentHoldingAssets.filter(a => !a.excludeFromCompoundReturnCalc);
        const assetsWithNoInvestmentType = this.nonExcludedAssets.filter(a => !a.investmentType);
        this.everyAssetHasInvestmentType = assetsWithNoInvestmentType.length === 0;
        const assetsWithoutWithdrawalExcluded = this.nonExcludedAssets.filter(a => !a.excludeFromWithdrawal);
        const zeroValueAssets = this.nonExcludedAssets.filter(a => a.investmentType === 'zeroValue');
        const onlyZeroValueAssets = this.nonExcludedAssets.length === zeroValueAssets.length;
        const everyAssetHasReinvestIntoOtherAssetsChecked = this.nonExcludedAssets.every(a => a.reinvestIntoOtherAssets);
        // check for a withdrawal amount in the input
        // if withdrawal exists AND all assets have been excluded from withdrawal
        if (this.assets.length > 0 && this.data.annualWithdrawal && assetsWithoutWithdrawalExcluded.length === 0) {
            this.openAllAssetsWithdrawalExcludeAlert();
            // NO return because we want the other alert checks to continue;
        }
        // Scenario 1
        // if user has no assets display alert message
        if (this.assets.length === 0) {
            this.openNoAssetsAlert();
            return;
        }
        // Scenario 2
        // every asset has the "exclude checkbox selected"
        else if (this.nonExcludedAssets.length === 0) {
            this.openNonExcludedAssetsAlert();
            return;
        }
        // Scenario 3
        // if user has any asset with display alert message that includes a list of those assets' names
        else if (!this.everyAssetHasInvestmentType) {
            this.openAssetWithNoInvestmentTypeAlert(assetsWithNoInvestmentType);
            return;
        }
        // Scenario 4
        // if user has only zero value assets
        else if (onlyZeroValueAssets) {
            this.openOnlyZvaAlert();
            return;
        }
        // Scenario 5
        // every asset has Reinvest checked
        else if (everyAssetHasReinvestIntoOtherAssetsChecked) {
            this.openOnlyReinvestAlert();
            return;
        } else {
            // this is to populate the unearned income field if "Use income from non DRIP accounts is checked"
            if (this.data.useUnearnedIncomeValues) {
                if (this.nonExcludedAssets) {
                    this.accountsWithReinvestIntoOtherAssets = this.nonExcludedAssets.filter(a => a.estimatedYearlyIncome && a.reinvestIntoOtherAssets);
                    this.accountsWithReinvestIntoOtherAssets.sort((a, b) => {
                        if (a.name?.toLowerCase() > b.name?.toLowerCase()) return 1;
                        if (a.name?.toLowerCase() < b.name?.toLowerCase()) return -1;
                        return 0;
                    });
                    const calculatedYearlyUnearnedIncomeValueOfAccounts = this.accountsWithReinvestIntoOtherAssets.reduce((accumulator, account) => {
                        return accumulator + account.estimatedYearlyIncome
                    }, 0);
                    this.calculatedUnearnedIncomeValueOfAccounts = roundToTwoDecimals(calculatedYearlyUnearnedIncomeValueOfAccounts / 12);
                    // need to divide by 12 to get the monthly amound and round to the nearest dollar
                    this.data.monthlyUnearnedIncome = Math.round(this.calculatedUnearnedIncomeValueOfAccounts);
                    if (isNaN(this.data.monthlyUnearnedIncome) || this.data.monthlyUnearnedIncome?.toString() === "NaN") {
                        this.data.monthlyUnearnedIncome = 0;
                    }
                    this.update(true);
                    // this.setBalanceSheetDashboardData();
                }
            } else {
                // this.data.monthlyUnearnedIncome = 0;
                this.update(true);
                // this.setBalanceSheetDashboardData();
            }
        }
    },
        (err: any) => {
            console.error(err);
        }
    );

    if(getAccountsSubscription) {
        this.subscriptions.push(getAccountsSubscription);
    }

    function roundToTwoDecimals(num) {
        return Math.round(num * 100) / 100;
    }
}

async openNoAssetsAlert() {
  /*
   *   REGRESSION SCENARIO
   *   when a user has no accounts that are assets
   *   Or no assets that do not have "exclude" unchecked
   *   this alert will open
   */
  let noAssetsAlert = await this.alertController.create({
      message: `You must add at least one non-exluded Asset to continue.`,
      buttons: [{
          text: 'Ok',
          handler: () => {
              this.noAssetAlertIsOpened = false;
          }
      }]
  });
  noAssetsAlert.present();
}

async openNonExcludedAssetsAlert() {
  /*
   *   REGRESSION SCENARIO
   *   when a user has no assets where the "exclude" is unchecked
   *   this alert will open
   */
  let nonExcludedAssetsAlert = await this.alertController.create({
      message: `Add at least one Asset account that does not have the “Exclude From Compound Return (MOAC)” checkbox checked.`,
      buttons: [{
          text: 'Ok',
          handler: () => {
              this.nonExcludedAlertIsOpened = false;
          }
      }]
  });
  nonExcludedAssetsAlert.present();
}

async openOnlyZvaAlert() {
  /*
   *   When a user only has accounts that are Zero Value Assets
   *   this alert will open
   */
  let onlyZvaAlert = await this.alertController.create({
      message: "There are no qualifying assets to invest income into (only Zero Value Assets exist). Please add another account to your Balance Sheet with a different Asset Sub-type.",
      buttons: [{
          text: 'Ok',
          handler: () => {
              this.onlyZvaAlertIsOpened = false;
          }
      }]
  });
  onlyZvaAlert.present();
}

  roundToTwoDecimals(num) {
    return Math.round(num * 100) / 100;
  }

  getAssetTypeIndicatorLabel(account) {
    let typeIndicatorLabel = '';
    if ((account.assetType === 'C' || account.assetType === 'DA') && (account.liquidityChaosHedge)) {
        typeIndicatorLabel += 'T1';
    }
    if (account.assetType === 'CFA') {
        typeIndicatorLabel += 'T2';
    }
    if (account.assetType === 'AA') {
        typeIndicatorLabel += 'T3';
    }
    return typeIndicatorLabel;
  }

  changeEarnedIncome() {
    if (this.data.useND1WealthValue === false) {
        this.data.monthlyEarnedIncome = null;
    }
    else{
        this.data.monthlyEarnedIncome = Math.round(this.nd1CalculatorData.wealth / 100 * this.currentEarnedIncome);
    }
    if (isNaN(this.data.monthlyEarnedIncome) || this.data.monthlyEarnedIncome?.toString() === "NaN") {
        this.data.monthlyEarnedIncome = 0;
    }
  }
  changeUnearnedIncome() {
        if (this.data.useUnearnedIncomeValues === false) {
            ;
            this.data.monthlyUnearnedIncome = null;
        } else {
            this.calculateUnearnedIncomeValueOfAccounts();
        }
        if (isNaN(this.data.monthlyUnearnedIncome) || this.data.monthlyUnearnedIncome?.toString() === "NaN") {
            this.data.monthlyUnearnedIncome = 0;
        }
  }
  calculateUnearnedIncomeValueOfAccounts() {
        // ensure that getAccounts is pulling FRESH data, NOT cached data
        const getAccountsSubscription = this.accountsService.getAccounts().subscribe(res => {
            this.accountList = this.accountsService.accounts;
            this.assets = this.accountList.filter(a => a.accountType === 'Asset');
            this.nonExcludedAssets = this.assets.filter(a => !a.excludeFromCompoundReturnCalc);
            if (this.data.useUnearnedIncomeValues) { // also need else statement??
                if (this.nonExcludedAssets) {
                    this.accountsWithReinvestIntoOtherAssets = this.nonExcludedAssets.filter(a => a.estimatedYearlyIncome && a.reinvestIntoOtherAssets);
                    this.accountsWithReinvestIntoOtherAssets.sort((a, b) => {
                        if (a.name?.toLowerCase() > b.name?.toLowerCase()) return 1;
                        if (a.name?.toLowerCase() < b.name?.toLowerCase()) return -1;
                        return 0;
                    });
                    const calculatedYearlyUnearnedIncomeValueOfAccounts = this.accountsWithReinvestIntoOtherAssets.reduce((accumulator, account) => {
                        return accumulator + account.estimatedYearlyIncome
                    }, 0);
                    this.calculatedUnearnedIncomeValueOfAccounts = this.roundToTwoDecimals(calculatedYearlyUnearnedIncomeValueOfAccounts / 12);
                    // need to divide by 12 to get the monthly amount and round to the nearest dollar
                    this.data.monthlyUnearnedIncome = Math.round(this.calculatedUnearnedIncomeValueOfAccounts);
                    if (isNaN(this.data.monthlyUnearnedIncome) || this.data.monthlyUnearnedIncome?.toString() === "NaN") {
                        this.data.monthlyUnearnedIncome = 0;
                    }
                }
            }
        },
            (err: any) => {
                console.error(err);
            }
        );

        if(getAccountsSubscription) {
            this.subscriptions.push(getAccountsSubscription);
        }
  }

  withdrawalAmountChange() {
    if (this.nonExcludedAssets) {
        const assetsWithoutWithdrawalExcluded = this.nonExcludedAssets.filter(a => !a.excludeFromWithdrawal);
        // check for a withdrawal amount in the input
        // if withdrawal exists AND all assets have been excluded from withdrawal
        if (this.assets.length > 0 && this.data.annualWithdrawal && assetsWithoutWithdrawalExcluded.length === 0) {
            this.openAllAssetsWithdrawalExcludeAlert();
        }
    }
  }

  async openAllAssetsWithdrawalExcludeAlert() {
    /*
     *   When a user enters a Withdrawal amaount but has no assets where the "Exclude from withdrawal" is unchecked
     *   this alert will open
     */
    let withdrawalExcludedAssetsAlert = await this.alertController.create({
        message: `You have entered an Annual Withdrawal amount but you must have at least one Asset account that does not have the “Exclude From Compound Return (MOAC)” checkbox checked.`,
        buttons: [{
            text: 'Ok',
            handler: () => {
                this.nonExcludedAlertIsOpened = false;
            }
        }]
    });
    withdrawalExcludedAssetsAlert.present();
  }

  async openOnlyReinvestAlert() {
    /*
     *   When a user has only assets
     *   with Reinvest income into other assets checked
     *   this alert will open
     */
    let onlyReinvestAlert = await this.alertController.create({
        message: `All assets have "Reinvest income into other assets checked" You must have at least one asset that does not have this checkbox checked to continue.`,
        buttons: [{
            text: 'Ok',
            handler: () => {
                this.onlyReinvestAlertIsOpened = false;
            }
        }]
    });
    onlyReinvestAlert.present();
}

  goBack(){
    this.modalCtrl.dismiss();
  }

  

  updateCompoundReturnCalculator(fromPageLoad) {
    if(typeof(this.data.yearsInvested) == 'string')
    {
        if(this.data.yearsInvested != null || this.data.yearsInvested != '')
            this.data.yearsInvested = parseFloat((this.data.yearsInvested as String).replace(/,/g, ''));
        else
            this.data.yearsInvested = 0;
    }
    if(typeof(this.data.monthlyEarnedIncome) == 'string')
    {
        if(this.data.monthlyEarnedIncome != null || this.data.monthlyEarnedIncome != '')
            this.data.monthlyEarnedIncome = parseFloat((this.data.monthlyEarnedIncome as String).replace(/,/g, ''));
        else
            this.data.monthlyEarnedIncome = 0;
    }
    if(typeof(this.data.monthlyUnearnedIncome) == 'string')
    {
        if(this.data.monthlyUnearnedIncome != null || this.data.monthlyUnearnedIncome != '')
            this.data.monthlyUnearnedIncome = parseFloat((this.data.monthlyUnearnedIncome as String).replace(/,/g, ''));
        else
            this.data.monthlyUnearnedIncome = 0;
    }
    if(typeof(this.data.annualContribution) == 'string')
    {
        if(this.data.annualContribution != null || this.data.annualContribution != '')
            this.data.annualContribution = parseFloat((this.data.annualContribution as String).replace(/,/g, ''));
        else
            this.data.annualContribution = 0;
    }
    if(typeof(this.data.annualIncreaseContribution) == 'string')
    {
        if(this.data.annualIncreaseContribution != null || this.data.annualIncreaseContribution != '')
            this.data.annualIncreaseContribution = parseFloat((this.data.annualIncreaseContribution as String).replace(/,/g, ''));
        else
            this.data.annualIncreaseContribution = 0;
    }
    if(typeof(this.data.annualWithdrawal) == 'string')
    {
        if(this.data.annualWithdrawal != null || this.data.annualWithdrawal != '')
            this.data.annualWithdrawal = parseFloat((this.data.annualWithdrawal as String).replace(/,/g, ''));
        else
            this.data.annualWithdrawal = 0;
    }
    if(typeof(this.data.volatilityDrawdown) == 'string')
    {
        if(this.data.volatilityDrawdown != null || this.data.volatilityDrawdown != '')
            this.data.volatilityDrawdown = parseFloat((this.data.volatilityDrawdown as String).replace(/,/g, ''));
        else
            this.data.volatilityDrawdown = 0;
    }
    if(typeof(this.data.withdrawalStartingYear) == 'string')
    {
        if(this.data.withdrawalStartingYear != null || this.data.withdrawalStartingYear != '')
            this.data.withdrawalStartingYear = parseFloat((this.data.withdrawalStartingYear as String).replace(/,/g, ''));
        else
            this.data.withdrawalStartingYear = 0;
    }
    if(typeof(this.data.everyNumberYears) == 'string')
    {
        if(this.data.everyNumberYears != null || this.data.everyNumberYears != '')
            this.data.everyNumberYears = parseFloat((this.data.everyNumberYears as String).replace(/,/g, ''));
        else
            this.data.everyNumberYears = 0;
    }
    const dataChanged = updatedDiff(this.lastDataPassedInCompoundReturn, this.data);
    if(fromPageLoad || (!fromPageLoad && dataChanged && Object.keys(dataChanged).length)) {
        this.lastDataPassedInCompoundReturn = _.cloneDeep(this.data);
        if(!fromPageLoad && dataChanged && Object.keys(dataChanged).length)
            this.userSvc.presentLoader();
        this.compoundReturnService.calculateCompoundReturn(this.data).toPromise().then((res: any) => {
            if(!fromPageLoad && dataChanged && Object.keys(dataChanged).length)
                this.userSvc.dismissLoader();
            if (res && res.data) {
                const results = res['data']['calculateCompoundReturn'];
                const multipleAssets = !!results.weightedResults;
                const resultsForTable = (multipleAssets && results.weightedResults.length >= 1) ? results.weightedResults : results.results;
                this.calculatedOutputs = results.calculatedOutputs;
                this.freedomAndLifestyleText.freedomText = results.freedomText;
                this.freedomAndLifestyleText.lifestyleText = results.lifestyleText;
                this.freedomMonth = results.freedomAndLifestyleNumbers.freedomMonth;
                this.lifestyleMonth = results.freedomAndLifestyleNumbers.lifestyleMonth;
                const customNumbers = [...(results.customNumbers || []), 
                    {customName: 'Freedom Number', customNumber: this.freedomNumber, customText: results.freedomText, customMonth: this.freedomMonth},
                    {customName: 'Lifestyle Number', customNumber: this.lifestyleNumber, customText: results.lifestyleText, customMonth: this.lifestyleMonth}]
                this.customGoalsResult = customNumbers ? customNumbers.sort((a,b) => {
                    if (a.customNumber < b.customNumber) {
                        return -1;
                    } else if (a.customNumber > b.customNumber) {
                        return 1;
                    } else {
                        return 0;
                    }
                }) : [];
                if(fromPageLoad == false){
                    this.modalCtrl.dismiss({
                        data:this.lastDataPassedInCompoundReturn,
                        calculatedOutputs:this.calculatedOutputs,
                        freedomAndLifestyleText:this.freedomAndLifestyleText,
                        freedomMonth:this.freedomMonth,
                        lifestyleMonth:this.lifestyleMonth,
                        customGoalsResult: this.customGoalsResult,
                        resultsForTable,
                        multipleAssets});
                }
            }
        },
            (err: any) => {
                if(!fromPageLoad && dataChanged && Object.keys(dataChanged).length)
                    this.userSvc.dismissLoader();
                console.error(err);
                this.userSvc.toast((err.error && err.error.message) || err.message ? (err?.error?.message || err?.message) : "Data save error updating compound return calculator");
            },
        );
    }
    else{
        if(fromPageLoad == false){
            this.modalCtrl.dismiss({
                data:this.data,
                calculatedOutputs:this.calculatedOutputs,
                freedomAndLifestyleText:this.freedomAndLifestyleText,
                freedomMonth:this.freedomMonth,
                lifestyleMonth:this.lifestyleMonth,
                customGoalsResult: this.customGoalsResult,
                resultsForTable:null,
                multipleAssets:null, 
                noUpdate: true});
        }
    }
}

async openAssetWithNoInvestmentTypeAlert(assetsWithNoInvestmentType) {
  /*
   *   REGRESSION SCENARIO
   *   when a user has an account with no investment type selected
   *   this alert will open
   */
  let assetList = `<ul>`;
  assetsWithNoInvestmentType.forEach(a => {
      const assetItem = `<li>${a.name}</li>`;
      assetList += assetItem;
  });
  assetList += "</ul>";
  let noInvestmentTypeAlert = await this.alertController.create({
      message: `No Investment Type has been selected for the following accounts. Please return to each Acccount and select an Investment Type in order to continue. ${assetList}`,
      buttons: [{
          text: 'Ok',
          handler: () => {
              this.noInvestmentTypeAlertIsOpened = false;
          }
      }]
  });
  noInvestmentTypeAlert.present();
}

  async update(fromPageLoad) {
    if (!this.data.yearsInvested) {
        this.data.yearsInvested = 20;
    }
    // to ensure updated numbers if an account toggles Reinvest into other assets from the MOAC page
    if (this.data.useUnearnedIncomeValues) {
        this.calculateUnearnedIncomeValueOfAccounts();
    }

    if (fromPageLoad) {
        await this.setUserData();
    }

    if (this.data.useND1WealthValue === true) {
        // populate the object with the value from ND1 * current Earned income
        this.data.monthlyEarnedIncome = Math.round(this.nd1CalculatorData.wealth / 100 * this.currentEarnedIncome);
        if (isNaN(this.data.monthlyEarnedIncome) || this.data.monthlyEarnedIncome?.toString() === "NaN") {
            this.data.monthlyEarnedIncome = 0;
        }
    }
    // only submit if all accounts have an investment type
    // this also implies that there are assets and that they are NOT excluded
    // see code in the DESIGN tab, Events drawer, Page component to see how everyAssetHasInvestmentType is defined
    const assets = this.accountList.filter(a => a.accountType === 'Asset');
    const nonParentHoldingAssets = assets.filter(a => !a.parentHolding);
    nonParentHoldingAssets.map((a) => {
        if (a.parentHoldingId && a.accountType === 'Asset') {
            a.parent = this.accountsService.getAccount(a.parentHoldingId);
        }
        return a;
    })
    const nonExcludedAssets = nonParentHoldingAssets.filter(a => !a.excludeFromCompoundReturnCalc);
    const assetsWithNoInvestmentType = nonExcludedAssets.filter(a => !a.investmentType);
    const everyAssetHasInvestmentType = assetsWithNoInvestmentType.length === 0;
    const everyAssetHasReinvestIntoOtherAssetsChecked = nonExcludedAssets.every(a => a.reinvestIntoOtherAssets);
    if (everyAssetHasReinvestIntoOtherAssetsChecked) {
        // display modal about every asset has Reinvest checked
        this.openOnlyReinvestAlert();
        return;
    }
    if (everyAssetHasInvestmentType) {
        this.assets = assets;
        this.nonExcludedAssets = nonExcludedAssets;
        if (fromPageLoad) {
            this.setBalanceSheetData(null,fromPageLoad);
        } else {
            // if no years invested set default to 20
            if (!this.data.yearsInvested) {
                this.data.yearsInvested = 20;
            }
            this.updateCompoundReturnCalculator(fromPageLoad);
        }
    } else {
        // display modal about every asset needs an investment type
        this.openAssetWithNoInvestmentTypeAlert(assetsWithNoInvestmentType);
    }
}

goToNd1(){
    if(this.data.useND1WealthValue){
        this.modalCtrl.dismiss();
        this.navCtrl.navigateForward('nd1details');
    }
}

isInValid(){
    if(this.data.volatilityDrawdown && this.data.volatilityDrawdown != 0){
        if(!this.data.everyNumberYears || this.data.everyNumberYears.toString() == ''){
            return true;
        }
    }
    if(this.data.annualWithdrawal && this.data.annualWithdrawal != 0){
        if(!this.data.withdrawalStartingYear || this.data.withdrawalStartingYear.toString() == ''){
            return true;
        }
    }
    return false;
}

// async editHoldings(id: string, newAccount?: TAccount) {
//     const modal = await this.modalCtrl.create({
//         component: AccountDetails,
//         enterAnimation: this.platform.width() > 640 ? this.enterAnimation : undefined,
//         leaveAnimation: this.platform.width() > 640 ? this.leaveAnimation : undefined,
//         cssClass: 'side-menu2',
//         backdropDismiss: false,
//         componentProps: {
//             id,
//             type: 'Asset',
//             childHolding: true,
//             newAccount: id == 'new' ? newAccount : null,
//         }
//     });
//     modal.onWillDismiss().then(async (dismiss: any) => {
//         if (dismiss.data) {
//                 let updatedAccountIndex = this.accountsWithReinvestIntoOtherAssets.findIndex((account: TAccount) => account.id === dismiss.data.id)
//                 if (updatedAccountIndex !== -1)
//                     this.accountsWithReinvestIntoOtherAssets[updatedAccountIndex] = { ...dismiss.data };
//         }
//     })
//     modal.present();
// }

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
        // await this.popDismiss();
    })
    modal.present();
}

toggleList(ionItem: any) {
    this.toggleIconAccount=!this.toggleIconAccount;
    var content = ionItem.el.nextElementSibling;
    if (content.style.maxHeight){
        content.style.maxHeight = null;
    } else {
        content.style.maxHeight = '100%';
    }
}

}
