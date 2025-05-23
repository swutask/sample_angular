import {
    AfterViewInit,
    ChangeDetectorRef,
    Component, ElementRef, Input, OnInit, ViewChild
} from '@angular/core';
import {
    AlertController, AnimationController, IonContent, IonModal, ModalController, Platform, PopoverController,
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
import {
    ExportedClass as TBalanceSheetList
} from '../scripts/custom/TBalanceSheetList';
import { NgForm, NgModel } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import moment from 'moment-timezone';
import _ from 'lodash';

@Component({
    templateUrl: 'AccountDetails.html',
    selector: 'page-account-details',
    styleUrls: ['AccountDetails.scss']
})
export class AccountDetails implements AfterViewInit, OnInit {
    public account: TAccount;
    public assetList: any;
    public accountList: TAccountList;
    public parentAccountList: TAccountList;
    public accountsDataLoadingPromise: Promise<any>;
    public accountOrDebtText: any;
    public deleteAccountAlertIsOpened: boolean;
    public access: string = 'Free';
    public noInvestmentTypeOnAssetAlertIsOpened: boolean;
    public compoundReturnData: TCompoundReturn;
    public compoundReturnPromise: Promise<any>;
    public currentItem: any = null;
    public mappingData: any = {};
    public userTimeZone: string = 'America/Chicago';
    public subscriptions: Subscription[] = [];
    public childAccount: TAccount[] = [];
    public toggleIconAccount: boolean = false;
    public isCancelModalOpen: boolean = false;
    public isCancelPopOpen: boolean = false;
    public isUnsavedModalOpen = false;
    public isUnsavedPopOpen = false;
    isAssetTypeValid = "";
    isInvestmentTypeValid = "";
    posY: number = 0;
    @ViewChild('accountForm') accountForm: NgForm;
    @ViewChild('investmentType') investmentType: NgModel;
    @ViewChild('assetType') assetType: NgModel;
    @ViewChild('interestRate') interestRate: NgModel;
    @ViewChild('toogleItem') toogleItem: any;

    public defaultCurrentYield: any = null;
    @Input() id: string;
    @Input() type: string;
    @Input() childHolding = false;
    @Input() newAccount: TAccount;
    @ViewChild('accountDetailsContent') cont: IonContent;
    public actionSheetOptions: any = {
        cssClass: 'goals-alert'
    }


    public popoverSheetOptions: any = {
        side: 'bottom',
        size: 'cover',
        cssClass: 'full-width-option'

    };
    public reinvestIncome: boolean = false;
    public previousInvestmentType: string;
    constructor(public navCtrl: NavController, public userSvc: userService, public modalCtrl: ModalController,
        public loadingCtrl: LoadingController, public accountsService: AccountsService, public platform: Platform,
        public route: ActivatedRoute, public router: Router, public alertController: AlertController,
        public debtPayoffService: DebtPayoffService, public compoundReturnService: CompoundReturnService,
        public balanceSheetService: BalanceSheetService, public appSideMenuService: AppSideMenuService,
        public routerOutletService: RouterOutletService, public accountsGraphQLService: AccountsGraphQLService,
        public animationCtrl: AnimationController, private el: ElementRef, public popCtrl: PopoverController,
        private changeDetector : ChangeDetectorRef) {
            this.access = this.userSvc.access || this.access;
            this.getBalanceSheets();
    }
    ngOnInit(): void {
        let id = this.id || this.route.snapshot.paramMap.get('id')
        let account = (id === 'new') ? {} : this.accountsService.getAccount(id);
        const getNavState = this.router.getCurrentNavigation()?.extras.state;
        this.accountOrDebtText = (getNavState && getNavState.origin === "debtPayoff") ? "Debt Details" : "Account Details";
        this.account = {
            parent: null,
            id: "",
            accountType: "",
            additionalContribution: null,
            additionalContribHowOften: "monthly",
            annualAppreciation: null,
            annualIncomeIncrease: null,
            assetAssociation: "none",
            assetType: "",
            compoundDRIP: false,
            costBasis: null,
            currentBalance: null,
            currentYield: null,
            debtPaidOffIn: "",
            description: "",
            distributionFrequency: "monthly",
            excludeFromCompoundReturnCalc: false,
            excludeFromDebtPayoffCalc: false,
            excludeFromWithdrawal: false,
            fractionalReinvestment: false,
            interestRate: null,
            investmentType: "",
            liabilityType: "C",
            liquidationPriority: null,
            liquidityChaosHedge: false,
            minPayment: null,
            monthlyExpense: null,
            monthlyIncome: null,
            name: "",
            newMonthlyPayment: null,
            owner: "USER",
            payTaxFromExistingAsset: false,
            referenceURL: "",
            reinvestIntoDebtPayOff: false,
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
            ...account
        }
        if (this.newAccount) {
            this.account = this.newAccount

        }

        if (this.account?.compoundDRIP || this.account?.reinvestIntoOtherAssets || this.account?.reinvestIntoDebtPayOff) {
            this.reinvestIncome = true
        }
        else {
            this.reinvestIncome = false
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
        }
        if (id === 'new') {
            if(!this.newAccount)
                delete this.account.id;
            if (this.accountOrDebtText === "Debt Details") {
                // presets the type to Liability (when coming from the debt payoff page)
                this.account.accountType = "Liability";
            }
        }
        this.assetList = this.accountsService.assetList;
        this.assetList.map((a) => {
            if (a.parentHoldingId) {
                a.parent = this.accountsService.getAccount(a.parentHoldingId);
            }
            return a;
        })
        this.assetList.sort((a, b) => {
            if (a.name?.toLowerCase() > b.name?.toLowerCase()) return 1;
            if (a.name?.toLowerCase() < b.name?.toLowerCase()) return -1;
            return 0;
        });
        const getAccountsSubscription = this.accountsService.getAccounts().subscribe(() => {
            this.accountList = this.accountsService.accounts;
        },
            (err: any) => {
                console.error(err);
            }
        );
        this.subscriptions.push(getAccountsSubscription);
        // REGRESSION SCENARIO for release 3.7
        // investmentType was added to account for the 3.7 release as a required field
        // users that have existing accounts need to select an investment type in order to save the account
        if (this.account.accountType === 'Asset' && !this.account.investmentType && !this.account.parentHolding) {
            this.openNoInvestmentTypeAlert();
        }
        if (this.account.childHoldingIds) {
            if (this.account.childHoldingIds.length > 0) {
                this.childAccount = [];
                for (const id of this.account.childHoldingIds) {
                    const account = this.accountsService.getAccount(id);
                    this.childAccount.push(account);
                }
                this.childAccount.sort((a, b) => {
                    if (a.name?.toLowerCase() > b.name?.toLowerCase()) return 1;
                    if (a.name?.toLowerCase() < b.name?.toLowerCase()) return -1;
                    return 0;
                });
            }
        }

        this.previousInvestmentType = this.account.investmentType;
        let getUserSubscription: Subscription;
        getUserSubscription = this.userSvc.getUser().subscribe(({ data: { user } }) => {
            if (user.timeZone)
                this.userTimeZone = user.timeZone
            else
                this.userTimeZone = "America/Chicago"
            if (getUserSubscription)
                this.subscriptions.push(getUserSubscription);
        })

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

    ngAfterViewInit(): void {
        if (this.type)
            this.account.accountType = this.type;
        setTimeout(() => {
            if(this.childAccount.length > 0) {
                this.toggleList(this.toogleItem);
            }
        }, 600);
    }

    openAccount(event, account?) {
        this.platform.width()>640?this.editHoldings(account?.id, account):this.isAsset()
    }

    isAsset(account?) {
        account = account || this.account;
        return this.type == 'Asset' || account.accountType === 'Asset';
    }
    onChangeAssetAssociation() {
        if (this.account.assetAssociation === 'none') {
            this.account.liabilityType = "C";
        } else {
            // get asset type from associated asset
            this.account.liabilityType = this.accountsService.getAccount(this.account.assetAssociation).assetType;
        }
    }
    submitForm() {
        let id = this.id || this.route.snapshot.paramMap.get('id');
        let accountUpdatedProperties = null;
        let total = 0;

        // if compound/DRIP is unchecked (false), set fractional reinvest as false
        if (!this.account.compoundDRIP) {
            this.account.fractionalReinvestment = false;
        }
        // if compound/DRIP is checked (true), set reinvestIntoOtherAssets as false
        if (this.account.compoundDRIP) {
            this.account.reinvestIntoOtherAssets = false;
            this.account.reinvestIntoDebtPayOff = false;
        }
        if (!this.account.additionalContribution) {
            this.account.additionalContribHowOften = "monthly";
        }
        if (this.account.assetType === 'CFA' || this.account.assetType === 'AA') {
            this.account.liquidityChaosHedge = false;
        }
        // if use Nominal values is unchecked, clear any values in the monthly income and monthly expense fields
        if (!this.account.useNominalValues) {
            this.account.monthlyExpense = null;
            this.account.monthlyIncome = null;
        }
        if (this.account.investmentType === 'portfolio') {
            this.account.sharesOwned = null;
            this.account.sharePrice = null;
            this.account.unitsOwned = null;
            this.account.unitPrice = null;
            this.account.zvaIncome = null;
            this.account.zvaFrequency = "";
            this.account.useNominalValues = false;
            this.account.monthlyIncome = null;
            this.account.monthlyExpense = null;
            this.account.annualIncomeIncrease = null;
        }
        else if (this.account.investmentType === 'stock') {
            this.account.unitsOwned = null;
            this.account.unitPrice = null;
            this.account.zvaIncome = null;
            this.account.zvaFrequency = "";
            this.account.useNominalValues = false;
            this.account.monthlyIncome = null;
            this.account.monthlyExpense = null;
            this.account.annualIncomeIncrease = null;
        }
        else if (this.account.investmentType === 'units') {
            this.account.sharesOwned = null;
            this.account.sharePrice = null;
            this.account.zvaIncome = null;
            this.account.zvaFrequency = "";
            this.account.annualIncomeIncrease = null;
        }
        else if (this.account.investmentType === 'zeroValue') {
            this.account.sharesOwned = null;
            this.account.sharePrice = null;
            this.account.unitsOwned = null;
            this.account.unitPrice = null;
            this.account.annualAppreciation = null;
            this.account.additionalContribution = null;
            this.account.additionalContribHowOften = "monthly";
            this.account.currentYield = null;
            this.account.yieldGrowthRate = null;
            this.account.distributionFrequency = null;
            this.account.costBasis = null;
            this.account.volatilityRatio = null;
            this.account.liquidationPriority = null;
            this.account.useNominalValues = false;
            this.account.monthlyIncome = null;
            this.account.monthlyExpense = null;
        }
        this.account = this.preProcessAccountData(this.account);
        if (id !== 'new') {
            let existingAccountData = this.accountsService.getAccount(id);
            // Get only updated properties from object
            accountUpdatedProperties = updatedDiff(existingAccountData, this.account);
            if (this.account.childHoldingIds) {
                accountUpdatedProperties.childHoldingIds = this.account.childHoldingIds;
            }

            // If no changes in object, navigate back
            if (!Object.keys(accountUpdatedProperties).length) {
                return this.goBack();
            }

            accountUpdatedProperties.id = this.account.id;
        }

        if (!this.validateForm()) {
            return;
        } else {
            let account = this.filterAccount(this.account.accountType);
            const assets = this.accountList.filter(a => a.accountType === 'Asset');
            const nonExcludedAssets = assets.filter(a => !a.excludeFromCompoundReturnCalc);
            const assetsWithNoInvestmentType = nonExcludedAssets.filter(a => !a.investmentType);
            const everyAssetHasInvestmentType = assetsWithNoInvestmentType.length === 0;
            if (this.childHolding) {
                if (id == 'new') {
                    account.id = 'new';
                }
                this.goBack(account);
            }
            else {
                this.userSvc.presentLoader().then(() => {
                    this.accountsService.createOrUpdateAccount(accountUpdatedProperties, account, id).subscribe(async (data) => {
                        let newAccountData = await data;
                        if (newAccountData?.data?.createAccount) {
                            newAccountData = newAccountData.data.createAccount;
                        } else if (newAccountData?.data?.updateAccount) {
                            newAccountData = newAccountData.data.updateAccount;
                        }
                        if (this.childAccount.length > 0) {
                            accountUpdatedProperties = {};
                            accountUpdatedProperties.id = newAccountData.id;
                            accountUpdatedProperties.childHoldingIds = [];
                            for (let holding of this.childAccount) {
                                holding.parentHoldingId = newAccountData.id;
                                let childAccountUpdatedProperties = null;
                                holding = this.preProcessAccountData(holding);
                                if (holding.id !== 'new') {
                                    let existingAccountData = this.accountsService.getAccount(holding.id);
                                    // Get only updated properties from object
                                    childAccountUpdatedProperties = updatedDiff(existingAccountData, holding);

                                    childAccountUpdatedProperties.id = holding.id;
                                }
                                let childData = await this.accountsService.createOrUpdateAccount(childAccountUpdatedProperties, holding, holding.id).toPromise();
                                if (childData?.data?.createAccount) {
                                    childData = childData.data.createAccount;
                                } else if (childData?.data?.updateAccount) {
                                    childData = childData.data.updateAccount;
                                }
                                accountUpdatedProperties.childHoldingIds.push(childData.id);
                            }
                            await this.accountsService.createOrUpdateAccount(accountUpdatedProperties, newAccountData, newAccountData.id).toPromise();
                        }
                        if (this.account.parentHoldingId && !this.childHolding) {
                            let parentAccount = this.accountsService.getAccount(account.parentHoldingId);
                            if (parentAccount) {
                                let total = 0;
                                for (let id of parentAccount.childHoldingIds) {
                                    total += this.accountsService.getAccount(id).currentBalance;
                                }
                                let parentAccountUpdatedProperties = {
                                    currentBalance: total,
                                    id: parentAccount.id
                                }
                                await this.accountsService.createOrUpdateAccount(parentAccountUpdatedProperties, parentAccount, account.parentHoldingId).toPromise();
                            }
                        }
                        this.goBack(newAccountData);
                    }, (error) => {
                        console.error(error);
                        this.userSvc.toast("Error while creating or updating an Account.");
                    });
                })
            }
        }
    }

    preProcessAccountData(account: TAccount) {
        if (typeof (account.currentBalance) == 'string') {
            if (account.currentBalance != null || account.currentBalance != '')
                account.currentBalance = parseFloat((account.currentBalance as String).replace(/,/g, ''));
            else
                account.currentBalance = 0;
        }
        if (typeof (account.annualAppreciation) == 'string') {
            if (account.annualAppreciation != null || account.annualAppreciation != '')
                account.annualAppreciation = parseFloat((account.annualAppreciation as String).replace(/,/g, ''));
            else
                account.annualAppreciation = 0;
        }
        if (typeof (account.sharesOwned) == 'string') {
            if (account.sharesOwned != null || account.sharesOwned != '')
                account.sharesOwned = parseFloat((account.sharesOwned as String).replace(/,/g, ''));
            else
                account.sharesOwned = 0;
        }
        if (typeof (account.unitsOwned) == 'string') {
            if (account.unitsOwned != null || account.unitsOwned != '')
                account.unitsOwned = parseFloat((account.unitsOwned as String).replace(/,/g, ''));
            else
                account.unitsOwned = 0;
        }
        if (typeof (account.sharePrice) == 'string') {
            if (account.sharePrice != null || account.sharePrice != '')
                account.sharePrice = parseFloat((account.sharePrice as String).replace(/,/g, ''));
            else
                account.sharePrice = 0;
        }
        if (typeof (account.unitPrice) == 'string') {
            if (account.unitPrice != null || account.unitPrice != '')
                account.unitPrice = parseFloat((account.unitPrice as String).replace(/,/g, ''));
            else
                account.unitPrice = 0;
        }
        if (typeof (account.additionalContribution) == 'string') {
            if (account.additionalContribution != null || account.additionalContribution != '')
                account.additionalContribution = parseFloat((account.additionalContribution as String).replace(/,/g, ''));
            else
                account.additionalContribution = 0;
        }
        if (typeof (account.zvaIncome) == 'string') {
            if (account.zvaIncome != null || account.zvaIncome != '')
                account.zvaIncome = parseFloat((account.zvaIncome as String).replace(/,/g, ''));
            else
                account.zvaIncome = 0;
        }
        if (typeof (account.annualIncomeIncrease) == 'string') {
            if (account.annualIncomeIncrease != null || account.annualIncomeIncrease != '')
                account.annualIncomeIncrease = parseFloat((account.annualIncomeIncrease as String).replace(/,/g, ''));
            else
                account.annualIncomeIncrease = 0;
        }
        if (typeof (account.monthlyIncome) == 'string') {
            if (account.monthlyIncome != null || account.monthlyIncome != '')
                account.monthlyIncome = parseFloat((account.monthlyIncome as String).replace(/,/g, ''));
            else
                account.monthlyIncome = 0;
        }
        if (typeof (account.monthlyExpense) == 'string') {
            if (account.monthlyExpense != null || account.monthlyExpense != '')
                account.monthlyExpense = parseFloat((account.monthlyExpense as String).replace(/,/g, ''));
            else
                account.monthlyExpense = 0;
        }
        if (typeof (account.annualDividend) == 'string') {
            if (account.annualDividend != null || account.annualDividend != '')
                account.annualDividend = parseFloat((account.annualDividend as String).replace(/,/g, ''));
            else
                account.annualDividend = 0;
        }
        if (typeof (account.currentYield) == 'string') {
            if (account.currentYield != null || account.currentYield != '')
                account.currentYield = parseFloat((account.currentYield as String).replace(/,/g, ''));
            else
                account.currentYield = 0;
        }
        if (typeof (account.yieldGrowthRate) == 'string') {
            if (account.yieldGrowthRate != null || account.yieldGrowthRate != '')
                account.yieldGrowthRate = parseFloat((account.yieldGrowthRate as String).replace(/,/g, ''));
            else
                account.yieldGrowthRate = 0;
        }
        if (typeof (account.costBasis) == 'string') {
            if (account.costBasis != null || account.costBasis != '')
                account.costBasis = parseFloat((account.costBasis as String).replace(/,/g, ''));
            else
                account.costBasis = 0;
        }
        if (typeof (account.volatilityRatio) == 'string') {
            if (account.volatilityRatio != null || account.volatilityRatio != '')
                account.volatilityRatio = parseFloat((account.volatilityRatio as String).replace(/,/g, ''));
            else
                account.volatilityRatio = 0;
        }
        if (typeof (account.taxRate) == 'string') {
            if (account.taxRate != null || account.taxRate != '')
                account.taxRate = parseFloat((account.taxRate as String).replace(/,/g, ''));
            else
                account.taxRate = 0;
        }
        if (typeof (account.minPayment) == 'string') {
            if (account.minPayment != null || account.minPayment != '')
                account.minPayment = parseFloat((account.minPayment as String).replace(/,/g, ''));
            else
                account.minPayment = 0;
        }
        if (typeof (account.interestRate) == 'string') {
            if (account.interestRate != null || account.interestRate != '')
                account.interestRate = parseFloat((account.interestRate as String).replace(/,/g, ''));
            else
                account.interestRate = 0;
        }
        return account;
    }

    isLiability(account?) {
        account = account || this.account;
        return this.type == 'Liability' || account.accountType === 'Liability';
    }
    filterAccount(accountType) {
        const that = this;
        const accountProps = Object.keys(this.account);
        const assetProps = accountProps.filter(x => (x !== 'assetAssociation' && x !== 'excludeFromDebtPayoffCalc' && x !== 'minPayment' && x !== 'liabilityType'));
        const liabilityProps = accountProps.filter(x => (x !== 'assetType' && x !== 'liquidationPriority' && x !== 'costBasis' && x !== 'monthlyExpense' && x !== 'monthlyIncome'));
        return accountType === "Asset" ?
            assetProps.reduce((acc, key) => (acc[key] = this.account[key], acc), {}) :
            rebuildTransformLiability(liabilityProps);

        function rebuildTransformLiability(liabilityProps) {
            // builtProps is an object
            const builtProps = liabilityProps.reduce((acc, key) => (acc[key] = that.account[key], acc), {});
            if (builtProps.assetAssociation) {
                const acct = that.accountList.find(obj => obj.id === builtProps.assetAssociation);
                if (acct) {
                    const {
                        assetType
                    } = acct;
                    if (assetType === 'DA') {
                        builtProps.liabilityType = 'DA';
                    }
                    if (assetType === 'CFA') {
                        builtProps.liabilityType = 'CFA';
                    }
                    if (assetType === 'AA') {
                        builtProps.liabilityType = 'AA';
                    }
                }
            }
            return builtProps;
        }
    }
    showSnackbarForAccounts(message) {
        (this.assetList.length === 0) && this.userSvc.toast(message);
    }
    isShowLiquidityChaos() {
        // adds condition that Asset Type should NOT be Liability
        return (['C', 'DA'].indexOf(this.account.assetType) !== -1) && this.account.accountType === 'Asset';
    }
    isShowNominalValues() {
        return this.account.investmentType === "units"
    }

    onChangeCurrentYield(currentYield) {
        if (currentYield || currentYield === 0) {
            this.defaultCurrentYield = JSON.parse(JSON.stringify(currentYield));
        }
    }
    isNominalValuesChecked() {
        if (this.account.useNominalValues === true) {
            // clear the Current Yield first
            // this.account.currentYield = null;
            // set current yield value to display
            let monthlyIncome = 0;
            let monthlyExpense = 0;
            let currentBalance = 0;
            if (typeof (this.account.monthlyIncome) == 'string') {
                if (this.account.monthlyIncome != null || this.account.monthlyIncome != '')
                    monthlyIncome = parseFloat((this.account.monthlyIncome as String).replace(/,/g, ''));
            }
            else if (typeof (this.account.monthlyIncome) == 'number') {
                monthlyIncome = this.account.monthlyIncome;
            }
            if (typeof (this.account.monthlyExpense) == 'string') {
                if (this.account.monthlyExpense != null || this.account.monthlyExpense != '')
                    monthlyExpense = parseFloat((this.account.monthlyExpense as String).replace(/,/g, ''));
            }
            else if (typeof (this.account.monthlyExpense) == 'number') {
                monthlyExpense = this.account.monthlyExpense;
            }
            if (typeof (this.account.currentBalance) == 'string') {
                if (this.account.currentBalance != null || this.account.currentBalance != '')
                    currentBalance = parseFloat((this.account.currentBalance as String).replace(/,/g, ''));
            }
            else if (typeof (this.account.currentBalance) == 'number') {
                currentBalance = this.account.currentBalance;
            }
            const calculatedCurrentYield = (monthlyIncome - monthlyExpense) * 12 / currentBalance * 100;
            const roundedCalculatedCurrentYield = Math.round(calculatedCurrentYield * 1000) / 1000;

            // TODO do we also need to add this condition: || currentYield === 0
            if (this.account.currentYield) {
                this.defaultCurrentYield = JSON.parse(JSON.stringify(this.account.currentYield));
            }

            this.account.currentYield = roundedCalculatedCurrentYield;
            return true;
        } else {
            if (this.defaultCurrentYield && this.account.investmentType !== 'stock') {
                this.account.currentYield = JSON.parse(JSON.stringify(this.defaultCurrentYield));
            }
            return false;
        }
    }

    calculateYield() {
        if (typeof (this.account.annualDividend) == 'string' && this.account.annualDividend !== '0.' && this.account.annualDividend !== '0.0' && this.account.annualDividend !== '0.00') {
            if (this.account.annualDividend != null || this.account.annualDividend != ''){}
                // this.account.annualDividend = parseFloat((this.account.annualDividend as String).replace(/,/g, ''));
            else
                this.account.annualDividend = 0;
        }
        if (typeof (this.account.sharesOwned) == 'string') {
            if (this.account.sharesOwned != null || this.account.sharesOwned != '')
                this.account.sharesOwned = parseFloat((this.account.sharesOwned as String).replace(/,/g, ''));
            else
                this.account.sharesOwned = 0;
        }
        if (typeof (this.account.currentBalance) == 'string') {
            if (this.account.currentBalance != null || this.account.currentBalance != '')
                this.account.currentBalance = parseFloat((this.account.currentBalance as String).replace(/,/g, ''));
            else
                this.account.currentBalance = 0;
        }
        const annualDividendString = _.cloneDeep(this.account.annualDividend?.toString());
        const annualDividend = parseFloat(annualDividendString?.replace(/,/g, ''));
        if (!isNaN(annualDividend)) {
            const annualIncome = annualDividend * this.account.sharesOwned;
            const calculatedCurrentYield = (annualIncome / this.account.currentBalance) * 100;
            const roundedCalculatedCurrentYield = Math.round(calculatedCurrentYield * 1000) / 1000;
            if (this.account.currentYield) {
                this.defaultCurrentYield = JSON.parse(JSON.stringify(this.account.currentYield));
            }
            this.account.currentYield = roundedCalculatedCurrentYield;
        } else {
            this.account.currentYield = 0;
        }
    }

    async goBack(data?: any) {
        let modal = await this.modalCtrl.getTop();
        if (data)
            modal?.dismiss(data);
        else
            modal?.dismiss();
        await this.userSvc.dismissLoader();
    }
    async openDeleteAccountAlert(id) {
        let deleteAccountAlert = await this.alertController.create({
            header: "Delete Account",
            message: "Are you sure you want to delete this Account? Any holdings associated with this account will also be deleted.",
            buttons: [{
                text: 'Cancel',
                handler: () => {
                    deleteAccountAlert.dismiss().then(() => this.deleteAccountAlertIsOpened = false);
                },
            }, {
                text: 'Delete',
                handler: () => {
                    this.deleteAccountAlertIsOpened = false;
                    this.deleteAccount(id);
                },
            }]
        });
        deleteAccountAlert.present();
    }

    validateForm() {
        const excludeCheckboxIsChecked = this.account.excludeFromDebtPayoffCalc;
        const isNotZeroValueAsset = this.account.investmentType !== 'zeroValue'
        // the following rules do not apply to Zero Value assets
        if (isNotZeroValueAsset) {
            // Current Balance cannot be 0 UNLESS it is a Zero Value Asset
            // if (this.account.currentBalance === 0) {
            //     this.userSvc.toast('Current Balance/Value cannot be $0!');
            //     return false;
            // }
            // Current Balance required
            if (this.account.currentBalance === null || this.account.currentBalance === undefined) {
                this.userSvc.toast('Current Balance/Value is required!');
                return false;
            }
            /**
             * DECEMBER 2022
             * We now allow a negative current balance since importing investments from Plaid.
             * A negative balance such as an option contract can be negative
             */
            // Current Balance
            // if (this.account.currentBalance && this.account.currentBalance < 0) {
            //     this.userSvc.toast('Current Balance/Value cannot be negative!');
            //     return false;
            // }
        }
        if (this.account.accountType === 'Asset') {
            // Asset Type required
            if (!this.account.assetType && !this.account.parentHolding) {
                this.userSvc.toast('Asset type is required!');
                return false;
            }
            // Annual Appreciation cannot be negative
            if (this.account.annualAppreciation < 0) {
                this.userSvc.toast('Annual Appreciation cannot be negative!');
                return false;
            }
            // Current Yield cannot be negative
            if (this.account.currentYield < 0) {
                this.userSvc.toast('Current Yield cannot be negative!');
                return false;
            }
            // Yield Growth Rate cannot be negative
            if (this.account.yieldGrowthRate < 0) {
                this.userSvc.toast('Yield Growth Rate cannot be negative!');
                return false;
            }
            /**
            * DECEMBER 2022
            * We now allow a negative cost basis since importing investments from Plaid.
            * A negative balance such as an option contract can be negative
            */
            // Cost Basis
            // if (this.account.costBasis < 0) {
            //     this.userSvc.toast('Cost Basis cannot be negative!');
            //     return false;
            // }
            // Monthly Income cannot be negative
            if (this.account.monthlyIncome < 0) {
                this.userSvc.toast('Monthly Income cannot be negative!');
                return false;
            }
            // Monthly Expense cannot be negative
            if (this.account.monthlyExpense < 0) {
                this.userSvc.toast('Monthly Expense cannot be negative!');
                return false;
            }
            // Tax Rate cannot be negative
            if (this.account.taxRate < 0) {
                this.userSvc.toast('Tax Rate cannot be negative!');
                return false;
            }
        }
        // required checks for liabilities
        if (this.account.accountType === 'Liability') {
            // Min Monthly Payment required
            if (this.account.minPayment === null || this.account.minPayment === undefined) {
                this.userSvc.toast('Min Monthly payment is required! $0 is acceptable.');
                return false;
            }
            // Interest Rate required
            if (this.account.interestRate === null || this.account.interestRate === undefined) {
                this.userSvc.toast('Interest Rate is required! 0% is acceptable.');
                return false;
            }

            // allow Min monthly payment to be 0
            // do NOT allow Min monthly payment to be negative
            // allow interest rate to be 0
            // do NOT allow interest rate to be negative
            // if Min Monthly Payment exists it must be larger than 0
            if (this.account.minPayment && this.account.minPayment < 0) {
                this.userSvc.toast('Min Monthly Payment cannot be negative!');
                return false;
            }
            // if interest rate exists it must be larger than 0
            if (this.account.interestRate && this.account.interestRate < 0) {
                this.userSvc.toast('Interest Rate cannot be negative!');
                return false;
            }
            /**
             * August 2022
             * We are allowing $0 minimum monthly payment
             * Backend can now accept $0 monthly payment
             Min Monthly Payment cannot be 0
             if (this.account.minPayment == 0) {
                 this.userSvc.toast('Min Monthly Payment cannot be $0 unless the "Exclude" checkbox is checked');
                 return false;
             }
             */

            /**
             * June 2022
             * We are allowing 0% interest liabilities
             * Backend can now accept an interest rate = 0
             */
        }
        return true;
    }
    onChangeReInvest(event: any) {
        if ("checked" in event.detail) {
            if (!event.detail.checked) {
                this.account.compoundDRIP = false;
                this.account.reinvestIntoOtherAssets = false;
                this.account.reinvestIntoDebtPayOff = false;
                if (this.account.investmentType == "zeroValue") {
                    this.account.excludeFromWithdrawal = false;
                }
                return;
            }
            else {
                if (this.account.investmentType == "zeroValue") {
                    this.account.compoundDRIP = false;
                    this.account.reinvestIntoOtherAssets = true;
                    this.account.reinvestIntoDebtPayOff = false;
                    this.account.excludeFromWithdrawal = true;
                }
            }
        }
        if (event.detail.value === "compound") {
            this.account.compoundDRIP = true;
            this.account.reinvestIntoOtherAssets = false;
            this.account.reinvestIntoDebtPayOff = false;
            this.account.excludeFromWithdrawal = false;
        }
        else if (event.detail.value === "into") {
            this.account.compoundDRIP = false;
            this.account.reinvestIntoOtherAssets = true;
            this.account.reinvestIntoDebtPayOff = false;
            this.account.excludeFromWithdrawal = true;
        }
        else if (event.detail.value === "debt") {
            this.account.compoundDRIP = false;
            this.account.reinvestIntoOtherAssets = false;
            this.account.reinvestIntoDebtPayOff = true;
            this.account.excludeFromWithdrawal = true;
        }
    }
    onChangeAssetType() {
        if(this.account.assetType && this.investmentType)
            this.accountForm.getControl(this.investmentType)?.markAsTouched();
    }
    private portfolioBalance = null;
    onChangeInvestmentType() {
        // Regression scenario for users with accounts that already exist
        // if this is a new account when a user switches investment types, account balance should clear
        // if the account already exists and the user chooses an investment type, we do not want the account balance to change
        if (!this.account.id && this.newAccount == null) {
            this.account.currentBalance = null;
        }
        if (this.previousInvestmentType === 'portfolio') {
            this.portfolioBalance = this.account.currentBalance;
            this.account.useNominalValues = false;
        }
        if (this.account.investmentType === 'portfolio')
            this.account.currentBalance = this.portfolioBalance;
        if ((this.account.investmentType === 'stock' || this.account.investmentType === 'portfolio') && this.account.useNominalValues === true) {
            this.account.useNominalValues = false;
            this.account.currentYield = null;
        }
        if (this.account.investmentType === 'zeroValue') {
            this.account.currentBalance = 0;
            this.account.zvaFrequency = this.account.zvaFrequency || 'monthly';
            this.account.useNominalValues = false;
        } else {
            this.account.zvaFrequency = '';
            this.account.distributionFrequency = this.account.distributionFrequency || 'monthly';
        }
        this.previousInvestmentType = this.account.investmentType;
        if(this.account.investmentType)
            this.accountForm.getControl(this.assetType)?.markAsTouched();
    }
    onChangeStockOrUnitsInputs() {
        if (this.account.investmentType === "stock") {
            if (this.account.sharesOwned && this.account.sharePrice) {
                let sharesOwned = 0;
                let sharePrice = 0;
                if (typeof (this.account.sharesOwned) == 'string') {
                    if (this.account.sharesOwned != null || this.account.sharesOwned != '')
                        sharesOwned = parseFloat((this.account.sharesOwned as String).replace(/,/g, ''));
                }
                else if (typeof (this.account.sharesOwned) == 'number') {
                    sharesOwned = this.account.sharesOwned;
                }
                if (typeof (this.account.sharePrice) == 'string') {
                    if (this.account.sharePrice != null || this.account.sharePrice != '')
                        sharePrice = parseFloat((this.account.sharePrice as String).replace(/,/g, ''));
                }
                else if (typeof (this.account.sharePrice) == 'number') {
                    sharePrice = this.account.sharePrice;
                }
                this.account.currentBalance = this.roundToEightDecimals(sharesOwned * sharePrice)
            } else {
                this.account.currentBalance = null;
            }
            this.calculateYield();
        }
        if (this.account.investmentType === "units") {
            if (this.account.unitsOwned && this.account.unitPrice) {
                let unitsOwned = 0;
                let unitPrice = 0;
                if (typeof (this.account.unitsOwned) == 'string') {
                    if (this.account.unitsOwned != null || this.account.unitsOwned != '')
                        unitsOwned = parseFloat((this.account.unitsOwned as String).replace(/,/g, ''));
                }
                else if (typeof (this.account.unitsOwned) == 'number') {
                    unitsOwned = this.account.unitsOwned;
                }
                if (typeof (this.account.unitPrice) == 'string') {
                    if (this.account.unitPrice != null || this.account.unitPrice != '')
                        unitPrice = parseFloat((this.account.unitPrice as String).replace(/,/g, ''));
                }
                else if (typeof (this.account.unitPrice) == 'number') {
                    unitPrice = this.account.unitPrice;
                }
                this.account.currentBalance = this.roundToEightDecimals(unitsOwned * unitPrice)
            } else {
                this.account.currentBalance = null;
            }
        }
    }
    roundToTwoDecimals(num) {
        return Math.round(num * 100) / 100;
    }
    roundToEightDecimals(num) {
        return Math.round(num * 100000000) / 100000000;
    }
    async openNoInvestmentTypeAlert() {
        /*
         *   REGRESSION SCENARIO
         *   when a user has an account with no investment type selected
         *   this alert will open
         */
        let noInvestmentTypeAlert = await this.alertController.create({
            message: "No Investment Type has been selected for this account. Please select an Investment Type in order to continue.",
            buttons: [{
                text: 'Ok',
                handler: () => {
                    this.noInvestmentTypeOnAssetAlertIsOpened = false;
                }
            }]
        });
        noInvestmentTypeAlert.present();
    }
    openTutorial() {
        this.navCtrl.navigateForward("resourceDetails/ck2c9royvdnxd0a30rwd2zjz9");
    }

    ionViewWillLeave() {
        this.routerOutletService.swipebackEnabled = true;
        this.subscriptions.forEach(sub => {
            sub.unsubscribe();
        })
    }
    ionViewWillEnter() {
        this.routerOutletService.swipebackEnabled = false;
    }
    ionViewDidEnter() {
        this.pageIonViewDidEnter();
    }
    async pageIonViewDidEnter(event?, currentItem?) {
        let __aio_tmp_val__: any;
    }

    resolveNaN(prop?: any) {
        if (prop == null || prop == undefined || prop == '') {
            if (this.account.volatilityRatio === 0) {
                return;
            }
            if (this.account.taxRate === 0) {
                return;
            }
            this.account.volatilityRatio = this.account.volatilityRatio || null;
            this.account.taxRate = this.account.taxRate || null;
            // this.account.interestRate = this.account.interestRate || null;
        }

        if (isNaN(prop)) {
            if (isNaN(this.account.volatilityRatio) || this.account.volatilityRatio?.toString() === "NaN") {
                this.account.volatilityRatio = 0;
            }
            if (isNaN(this.account.taxRate) || this.account.taxRate?.toString() === "NaN") {
                this.account.taxRate = 0;
            }
        }
    }

    resolveNaNInterestRate(prop?: any) {
        if (prop === null || prop === undefined || prop === '') {
            this.account.interestRate = this.account.interestRate || 0;
        }
        if (isNaN(this.account.interestRate)) {
            let interest = String(this.account.interestRate).split('.');
            if (interest.length > 2) {
                this.account.interestRate = parseFloat(interest[0] + '.' + interest[1]);
                this.interestRate.control.setValue(this.account.interestRate);
            }
            else {
                this.account.interestRate = 0;
            }
        }
    }

    keyPressNumbersWithDecimal(event) {
        var charCode = (event.which) ? event.which : event.keyCode;
        if (charCode != 46 && charCode > 31
            && (charCode < 48 || charCode > 57)) {
            event.preventDefault();
            return false;
        }
        return true;
    }

    getRelativeTime(time) {
        if(moment.tz.zone(this.userTimeZone)) {
            return moment(time).utc().tz(this.userTimeZone).fromNow();
        } else {
            return moment(time).utc().tz("America/Chicago").fromNow();
        }
    }

    getTimeStamp(time) {
        if(moment.tz.zone(this.userTimeZone)) {
            const b = moment(time).utc().tz(this.userTimeZone);
            return b.format('MM/DD/yyyy') + ' at ' + b.format('h:mm a');
        } else {
            const b = moment(time).utc().tz("America/Chicago");
            return b.format('MM/DD/yyyy') + ' at ' + b.format('h:mm a');
        }
    }

    getLastUpdated(time) {
        if(moment.tz.zone(this.userTimeZone)) {
            return moment(time).utc().tz(this.userTimeZone).fromNow();
        } else {
            return moment(time).utc().tz("America/Chicago").fromNow();
        }
    }

    getCreatedAt(time) {
        if(moment.tz.zone(this.userTimeZone)) {
            const b = moment(time).utc().tz(this.userTimeZone);
            return b.format('MM/DD/yyyy')
        } else {
            const b = moment(time).utc().tz("America/Chicago");
            return b.format('MM/DD/yyyy')
        }
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

    async addHoldings() {
        const modal = await this.modalCtrl.create({
            component: AccountDetails,
            enterAnimation: this.platform.width() > 640 ? this.enterAnimation : undefined,
            leaveAnimation: this.platform.width() > 640 ? this.leaveAnimation : undefined,
            cssClass: 'side-menu2',
            backdropDismiss: false,
            componentProps: {
                id: 'new',
                type: this.type,
                childHolding: true
            }
        });
        modal.onWillDismiss().then(async (dismiss: any) => {
            if (dismiss.data) {
                if (dismiss.data.id == 'new')
                    this.childAccount.push(dismiss.data);
                else if (dismiss.data.data.updateAccount) {
                    let updatedAccountIndex = this.childAccount.findIndex((account: TAccount) => account.id === dismiss.data.id)
                    if (updatedAccountIndex !== -1)
                        this.childAccount[updatedAccountIndex] = dismiss.data;
                }
                this.changeDetector.detectChanges();
                if(this.childAccount.length == 1) {
                    this.toggleList(this.toogleItem);
                }
            }
            let total = 0;
            for (const account of this.childAccount) {
                total += account.currentBalance;
            }
            this.account.parentHolding = true;
            this.account.currentBalance = total;
        })
        modal.present();
    }

    async editHoldings(id: string, newAccount?: TAccount) {
        const modal = await this.modalCtrl.create({
            component: AccountDetails,
            enterAnimation: this.platform.width() > 640 ? this.enterAnimation : undefined,
            leaveAnimation: this.platform.width() > 640 ? this.leaveAnimation : undefined,
            cssClass: 'side-menu2',
            backdropDismiss: false,
            componentProps: {
                id,
                type: this.type,
                childHolding: true,
                newAccount: id == 'new' ? newAccount : null,
            }
        });
        modal.onWillDismiss().then(async (dismiss: any) => {
            if (dismiss.data) {
                if (dismiss.data.id == 'new') {
                    if (newAccount) {
                        let updatedAccountIndex = this.childAccount.findIndex((account: TAccount) => account === newAccount)
                        if (updatedAccountIndex !== -1)
                            this.childAccount[updatedAccountIndex] = dismiss.data;
                    }
                    else {
                        this.childAccount.push(dismiss.data);
                    }
                }
                else {
                    let updatedAccountIndex = this.childAccount.findIndex((account: TAccount) => account.id === dismiss.data.id)
                    if (updatedAccountIndex !== -1)
                        this.childAccount[updatedAccountIndex] = { ...dismiss.data };
                }
            }
            let total = 0;
            for (let account of this.childAccount) {
                account = this.preProcessAccountData(account);
                total += account.currentBalance;
            }
            this.account.parentHolding = true;
            this.account.currentBalance = total;
        })
        modal.onDidDismiss().then(async (dismiss: any) => {
            let popover = await this.popCtrl.getTop();
            if (popover?.getAttribute('name') == "detailPop")
                popover.dismiss();
            let modal = await this.modalCtrl.getTop();
            if (modal?.getAttribute('name') == "detailModal")
                modal.dismiss();
        })
        modal.present();
    }

    isParentHoldingValid() {
        if (this.account.parentHolding) {
            if (this.account.name == null || this.account.name == undefined || this.account.name == '')
                return false;
            if (this.account.description == null || this.account.description == undefined || this.account.description == '')
                return false;
            if (!this.account.childHoldingIds)
                return false;
            if (this.account.childHoldingIds.length == 0)
                return false;
            return true;
        }
        return true;
    }

    async popDismiss(dismissBackModal?: boolean) {
        if (this.platform.width() < 640 && dismissBackModal) {
            const modal = await this.modalCtrl.getTop();
            modal.onDidDismiss().then(() => {
                this.goBack();
            })
        }
        if (this.platform.width() > 640 && dismissBackModal) {
            this.goBack();
        }
        this.isCancelModalOpen = false;
        this.isCancelPopOpen = false;
        this.isClonePopOpen = false;
        this.isCloneModalOpen = false;
        this.isDeletePopOpen = false;
        this.isDeleteModalOpen = false;
        this.isUnsavedModalOpen = false;
        this.isUnsavedPopOpen = false;
    }

    async openCancelDialog() {
        const newChildAccounts = this.childAccount.filter(a => a?.id === 'new');
        const controls = Object.keys(this.accountForm.controls);
        let dirtyFormControl  = false;
        for (let control of controls) {
            if (this.accountForm.controls[control]?.dirty && this.accountForm.controls[control]?.touched) {
                dirtyFormControl = true;
            }
        }
        let isHoldingChanged = false;
        const originalAccount = this.accountsService.getAccount(this.account.id);
        if (this.account.id !== 'new' && (originalAccount?.childAccount?.length > 0 || this.childAccount?.length > 0)) {
            isHoldingChanged =  !(_.isEqual(originalAccount?.childAccount, this.childAccount));
        }
        if (newChildAccounts.length > 0) {
            this.platform.width() > 640 ? (this.isCancelPopOpen = !this.isCancelPopOpen) : (this.isCancelModalOpen = !this.isCancelModalOpen);
        } else if (dirtyFormControl || isHoldingChanged) {
            this.platform.width() > 640 ? (this.isUnsavedPopOpen = !this.isUnsavedPopOpen) : (this.isUnsavedModalOpen = !this.isUnsavedModalOpen);
        }
        else {
            this.goBack();
        }
    }

    hasAccessTo() {
        return ["comppro", "pro", "comppremium", "premium", "admin"].indexOf(this.access.toLowerCase()) !== -1;
    }

    validateAssetType() {
        this.accountForm.form.markAllAsTouched();
        const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
            "form .ng-invalid"
          );
        firstInvalidControl?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }

    public balanceSheetsList: TBalanceSheetList;
    public selectedAccountId = '';
    public isClonePopOpen = false;
    public isCloneModalOpen = false;
    public isDeletePopOpen = false;
    public isDeleteModalOpen = false;
    public cloneMessage = '';
    public copyMessage = '';
    public cloneAccountBalance = '';
    public copyAccountBalance = '';
    public deleteConfirmationMsg = 'Are you sure you want to delete this account?';
    public deleteConfirmationHeader = 'Delete Account';
    deleteEvent: any

    async cloneAccount(id) {
        // let popover = await this.popCtrl.getTop();
        // if (popover)
        //     await popover.dismiss();
        // let modal = await this.modalCtrl.getTop();
        // if (modal)
        //     await modal.dismiss();

        this.selectedAccountId = id;

        this.platform.width() > 640 ? (this.isClonePopOpen = !this.isClonePopOpen) : (this.isCloneModalOpen = !this.isCloneModalOpen)

        const accountOption = this.accountsService.getAccount(id);

        this.cloneMessage = `Please select to which balance sheet you want to copy the account: ${accountOption.name}`;

        const assets = this.accountList.filter(a => a.accountType === 'Asset');
        this.parentAccountList = assets.filter(a => a.parentHolding === true);

        if ( this.parentAccountList.length > 0) {
            this.copyMessage = `Please select to which Parent Account you want to copy the account: ${accountOption.name}`;
        } else {
            this.copyMessage = `No Parent Accounts avaialble`;
        }
        return;
    }

    deleteIndex = this.childAccount.length - 1;

    deleteConfirmation(id, event?, deleteIndex = -1) {
        this.deleteEvent = event;
        this.deleteIndex = deleteIndex;
        if (id) {
            this.selectedAccountId = id;
        }
        else {
            this.selectedAccountId = '';
        }
        this.platform.width() > 640 ? (this.isDeletePopOpen = !this.isDeletePopOpen) : (this.isDeleteModalOpen = !this.isDeleteModalOpen);
    }

    async deleteConfirmed() {
        if (this.selectedAccountId) {
            this.deleteAccount(this.selectedAccountId)
            if(this.platform.width() > 640) {
                let popover = await this.popCtrl.getTop();
                if (popover)
                    await popover.dismiss();
            }
            else {
                let modal = await this.modalCtrl.getTop();
                if (modal)
                    await modal.dismiss();
            }
            let popover2 = await this.popCtrl.getTop();
            if (popover2?.getAttribute('name') == "detailPop")
                popover2.dismiss();
            let modal = await this.modalCtrl.getTop();
            if (modal?.getAttribute('name') == "detailModal")
                modal.dismiss();
            await this.popDismiss();
        }
    }
    async deleteAccount(id) {

        // let popover = await this.popCtrl.getTop();
        // if (popover)
        //     popover.dismiss();
        // let modal = await this.modalCtrl.getTop();
        // if (modal)
        //     modal.dismiss();
        const accountToBeDeleted = this.accountsService.getAccount(id ? id : this.selectedAccountId);
        if(id === 'new') {
            if (this.deleteIndex > -1)
                this.childAccount.splice(this.deleteIndex, 1);
            return;
        }
        if(accountToBeDeleted.parentHoldingId) {
            await this.userSvc.presentLoader();
            const parentAccount = this.accountsService.getAccount(accountToBeDeleted.parentHoldingId);
            let childHoldingIds = parentAccount.childHoldingIds;
            childHoldingIds = childHoldingIds.filter(item => item !== (id ? id : this.selectedAccountId))
            let total = 0;
            for (let id of childHoldingIds) {
                total += this.accountsService.getAccount(id).currentBalance;
            }
            const accountUpdatedProperties = {
                id: parentAccount.id,
                currentBalance: total,
                childHoldingIds
            }
            this.account.currentBalance = total;
            this.account.childHoldingIds = childHoldingIds;
            await this.accountsService.createOrUpdateAccount(accountUpdatedProperties, parentAccount, parentAccount.id).toPromise()
            if (childHoldingIds.length > 0) {
                this.childAccount = [];
                for (const id of childHoldingIds) {
                    const account = this.accountsService.getAccount(id);
                    this.childAccount.push(account);
                }
                this.childAccount.sort((a, b) => {
                    if (a.name?.toLowerCase() > b.name?.toLowerCase()) return 1;
                    if (a.name?.toLowerCase() < b.name?.toLowerCase()) return -1;
                    return 0;
                });
            } else {
                this.childAccount = [];
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

    async addCloneInfo() {
        if (this.cloneAccountBalance) {
            const accountInfo = this.accountsService.getAccount(this.selectedAccountId);
            await this.accountsService.cloneAccount(accountInfo, this.cloneAccountBalance).toPromise()
            // const getBsObservable = of (this.cloneAccountBalance);
            const getBsObservable = this.cloneAccountBalance
            ? this.balanceSheetService.getBalanceSheet(this.cloneAccountBalance)
            : of(this.cloneAccountBalance);
            (getBsObservable as Observable<any>).subscribe(async (targetBalanceSheet: any) => {
                const notificationMessage = targetBalanceSheet ? `Account '${accountInfo.name}' has been copied to '${targetBalanceSheet.name}' balance sheet` : `Account '${accountInfo.name}' has been copied`;
                await this.userSvc.pushTopToast(notificationMessage);
                this.popDismiss();
                let popover = await this.popCtrl.getTop();
                if (popover)
                    await popover.dismiss();
                let modal = await this.modalCtrl.getTop();
                if (modal)
                    await modal.dismiss();
                let popover2 = await this.popCtrl.getTop();
                if (popover2?.getAttribute('name') == "detailPop")
                    popover2.dismiss();
                let modal2 = await this.modalCtrl.getTop();
                if (modal2?.getAttribute('name') == "detailModal")
                    modal2.dismiss();
                await this.goBack();
            });
        } else if (this.copyAccountBalance) {
            await this.userSvc.presentLoader();
            const accountInfo = this.accountsService.getAccount(this.selectedAccountId);
            const parentAccountInfo = this.accountsService.getAccount(this.copyAccountBalance);
            await this.accountsService.copyAccount(accountInfo, this.copyAccountBalance, parentAccountInfo).toPromise()
            // const getBsObservable = of (this.cloneAccountBalance);
            const getBsObservable = this.cloneAccountBalance
            ? this.accountsService.getAccounts(true)
            : of(this.copyAccountBalance);
            (getBsObservable as Observable<any>).subscribe(async () => {
                this.accountList = this.accountsService.accounts;
                const notificationMessage = `Account '${accountInfo.name}' has been copied to '${parentAccountInfo.name}' holdings`;
                await this.userSvc.dismissLoader();
                await this.userSvc.pushTopToast(notificationMessage);
                this.popDismiss();
                let popover = await this.popCtrl.getTop();
                if (popover)
                    await popover.dismiss();
                let modal = await this.modalCtrl.getTop();
                if (modal)
                    await modal.dismiss();
                let popover2 = await this.popCtrl.getTop();
                if (popover2?.getAttribute('name') == "detailPop")
                    popover2.dismiss();
                let modal2 = await this.modalCtrl.getTop();
                if (modal2?.getAttribute('name') == "detailModal")
                    modal2.dismiss();
                this.accountsService.refreshAccountsData();
                await this.goBack();
            });
        }
    }

    async scrollEnd() {
        const el = await this.cont.getScrollElement();
		this.posY = el.scrollTop;
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

    async checkPreviousPriority(event: any) {
        if (this.account.priorityDebtPayoff === true && this.accountList && this.accountList.length > 0) {
            const previousPriority = this.accountList.find(a => a.priorityDebtPayoff === true);
            if (previousPriority && previousPriority.id !== this.account.id) {
                await this.userSvc.toast(`${previousPriority.name} is already selected as Priority for Debt Payoff. Please remove ${previousPriority.name} from priority to make this new priority`)
                this.account.priorityDebtPayoff = false;
            }
        }
    }
}
