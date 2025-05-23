import {
    Component, ElementRef
} from '@angular/core';
import {
    AlertController, AnimationController, IonContent, MenuController, ModalController, PopoverController
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
    ExportedClass as TND1Calculator
} from '../scripts/custom/TND1Calculator';
import {
    ExportedClass as UserProfileService
} from '../scripts/custom/UserProfileService';
import {
    ExportedClass as ND1Service
} from '../scripts/custom/ND1Service';
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
    NavigationExtras
} from '@angular/router';
import {
    Subscription,
    throwError
} from 'rxjs';
import {
    ViewChild
} from '@angular/core';
import _ from 'lodash';
import { updatedDiff } from 'deep-object-diff';
import { CompoundReturnComponent } from '../components/compound-return/compound-return.component';
import { BaseChartDirective } from 'ng2-charts';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Platform } from '@ionic/angular';
import { AccountDetails } from '../AccountDetails/AccountDetails';
import { CompoundTutorialComponent } from '../components/compound-tutorial/compound-tutorial.component';
import { take } from 'rxjs/operators';
import ShowHelpMessageDirective from '../scripts/custom/ShowHelpMessageDirective';
import moment from 'moment';
@Component({
    templateUrl: 'CompoundReturn.html',
    selector: 'page-compound-return',
    styleUrls: ['CompoundReturn.scss']
})
export class CompoundReturn {
    @ViewChild(BaseChartDirective) chartComponent: BaseChartDirective;
    // @ViewChild('legendsItems') legendsItems: ElementRef;
    @ViewChild('myCanvas') canvasRef: ElementRef;
    @ViewChild('compoundContent') cont: IonContent;
    public accountList: TAccountList;
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
    public graphColors = {
        '--graph-aero': '#66C6FF',
        '--graph-violet': '#675CE5',
        '--graph-aquamarine': '#5CE593',
        '--graph-yellow': '#FFCF33',
        '--graph-red-crayola': '#FF524D',
        '--graph-jet':  '#333333',
        '--graph-dim-gray': '#666666',
        '--graph-silver': '#BFBFBF',
        '--graph-green-silver': '#D0D7D4',
        '--graph-blue-silver': '#D0DEE1',
        '--graph-purple-silver': '#ACADB4',
        '--graph-light-gray': '#E6E6E6',
        '--graph-grey': '#F2F2F2',
        '--graph-cultured': '#FAFAFA',
        '--graph-ivory': '#F7F5F3',
    };
    public accountsDataLoadingPromise: Promise<any>;
    public data: TCompoundReturn;
    public nd1CalculatorData: TND1Calculator;
    public noAssetAlertIsOpened: boolean;
    public nd1NumbersPromise: Promise<any>;
    public earnedIncomePromise: Promise<any>;
    public freedomNumberPromise: Promise<any>;
    public freedomNumber: number;
    public lifestyleNumber: number;
    public customGoals: any[] = [];
    public lifestyleNumberPromise: Promise<any>;
    public goalsPromise: Promise<any>;
    public currentEarnedIncome: number;
    public calculatedOutputs: any;
    public window: any = window;
    public compoundReturnPromise: Promise<any>;
    public freedomAndLifestyleText: any;
    public freedomMonth: number;
    public lifestyleMonth: number;
    public customGoalsResult: any[] = [];
    public everyAssetHasInvestmentType: boolean;
    public nonExcludedAlertIsOpened: boolean;
    public excludeFromFurtherMoacInvestmentAlertIsOpened: boolean;
    public noInvestmentTypeAlertIsOpened: boolean;
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
    public assets: TAccountList;
    public nonExcludedAssets: TAccountList;
    public typeSelectedAccounts: TAccountList;
    public withdrawalExcludedAlertIsOpened: boolean;
    public calculatedUnearnedIncomeValueOfAccounts: number;
    public accountsWithReinvestIntoOtherAssets: TAccountList;
    public onlyZvaAlertIsOpened: boolean;
    public onlyReinvestAlertIsOpened: boolean;
    public currentItem: any = null;
    public mappingData: any = {};
    public lastDataPassedInCompoundReturn;
    public subscriptions: Subscription[] = [];
    public toggleIconAccount:boolean = false;
    public toggleIcon:boolean = false;
    public compoundReturnBurnUpChartData: any;
    posY: number = 0;
    legendData: any;
    private getLegendCallback = (function(self) {
        function handle(chart) {
            return chart.legend.legendItems;
        }
        return function(chart) {
            return handle(chart);
        };
    })(this);
    public compoundReturnDefaultDataset = [
        {label:'Freedom Number',data:[],fill: false,pointStyle:'circle',
        pointBorderColor: this.graphColors['--graph-aero'], borderColor: this.graphColors['--graph-aero'], pointRadius: 2,
        backgroundColor: this.graphColors['--graph-aero'],
        pointBackgroundColor: this.graphColors['--graph-aero'],
        pointBorderWidth: 2,yAxisID: "id1"},
        {label:'Lifestyle Number',data:[],fill: false,pointStyle:'circle',
        pointBorderColor: this.graphColors['--graph-violet'],borderColor: this.graphColors['--graph-violet'], pointRadius: 2,
        backgroundColor: this.graphColors['--graph-violet'],
        pointBackgroundColor: this.graphColors['--graph-violet'],
        pointBorderWidth: 2,yAxisID: "id1"},
        {label:'Unearned Income',data:[],fill: false,pointStyle:'circle',
        pointBorderColor: this.graphColors['--graph-aquamarine'],borderColor: this.graphColors['--graph-aquamarine'], pointRadius: 2,
        backgroundColor: this.graphColors['--graph-aquamarine'],
        pointBackgroundColor: this.graphColors['--graph-aquamarine'],
        pointBorderWidth: 2,yAxisID: "id1"},
        {label:'Balance',data:[],fill: false,pointStyle:'circle',
        pointBorderColor: this.graphColors['--graph-yellow'],borderColor: this.graphColors['--graph-yellow'], pointRadius: 2,
        backgroundColor: this.graphColors['--graph-yellow'],
        pointBackgroundColor: this.graphColors['--graph-yellow'],
        pointBorderWidth: 2,yAxisID: "id2"},
    ];
    public compoundReturnChartMeta = {
        dataSets: [],
        labels:[],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend:{
                display: false
            },
            legendCallback: this.getLegendCallback,
            cutoutPercentage: 80,
            tooltips:{enabled: false,
                custom: (tooltipModel)=> {
                    // Tooltip Element
                    var tooltipEl = document.getElementById('chartjs-tooltip');
    
                    // Create element on first render
                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';
                        tooltipEl.innerHTML = '<table style="font-family:&quot;neue haas&quot;, sans-serif"></table>';
                        document.body.appendChild(tooltipEl);
                    }
    
                    // Hide if no tooltip
                    if (tooltipModel.opacity === 0) {
                        tooltipEl.style.opacity = '0';
                        return;
                    }
    
                    // Set caret Position
                    tooltipEl.classList.remove('above', 'below', 'no-transform');
                    if (tooltipModel.yAlign) {
                        tooltipEl.classList.add(tooltipModel.yAlign);
                    } else {
                        tooltipEl.classList.add('no-transform');
                    }
    
                    function getBody(bodyItem) {
                        return bodyItem.lines;
                    }
    
                    // Set Text
                    if (tooltipModel.body) {
                        var titleLines = tooltipModel.title || [];
                        var bodyLines = tooltipModel.body.map(getBody);
    
                        var innerHtml = '<thead>';
    
                        // titleLines.forEach(function(title) {
                        //     innerHtml += '<tr><th>' + title + '</th></tr>';
                        // });
                        var style = 'background:#FFFFFF';
                        style += '; border-color:#E6E6E6';
                        style += '; border-width: 2px';
                        innerHtml += '</thead><tbody style="' + style + '">';
    
                        bodyLines.forEach((body, i)=> {
                            const datapoint = this.compoundReturnBurnUpChartData.yearlySnapshots[tooltipModel.dataPoints[0].index];
                            const date = new Date(this.compoundReturnBurnUpChartData.yearlySnapshots[tooltipModel.dataPoints[0].index]?.year, this.compoundReturnBurnUpChartData.yearlySnapshots[tooltipModel.dataPoints[0].index]?.month ? this.compoundReturnBurnUpChartData.yearlySnapshots[tooltipModel.dataPoints[0].index]?.month : 0, 1);
            let dateString = `<p> ${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}</p>`;
                dateString +=
                '<p>Monthly Income: $' + new Intl.NumberFormat().format(this.data.showMonthly ? datapoint?.yearlyIncome : datapoint?.income) + '</p>' +
                '<p>Yield: ' + this.compoundReturnBurnUpChartData.yearlySnapshots[tooltipModel.dataPoints[0].index]?.yield + '%</p>' +
                '<p>Yield on Cost: ' + this.compoundReturnBurnUpChartData.yearlySnapshots[tooltipModel.dataPoints[0].index]?.yieldOnCost + '%</p>' +
                '<p>Balance: $' + new Intl.NumberFormat().format(this.compoundReturnBurnUpChartData.yearlySnapshots[tooltipModel.dataPoints[0].index]?.balance) + '</p>',
                this.lifestyleNumber,
                dateString +
                `<p>Lifestyle Number: $${new Intl.NumberFormat().format(this.lifestyleNumber)}</p>`,
                this.freedomNumber,
                dateString +
                `<p>Freedom Number: $${new Intl.NumberFormat().format(this.freedomNumber)}</p>`;
                            // var span = '<span style="' + style + '"></span>';
                            innerHtml += '<tr><td style="padding:10px;">' + dateString + '</td></tr>';
                        });
                        innerHtml += '</tbody>';
    
                        var tableRoot = tooltipEl.querySelector('table');
                        tableRoot.innerHTML = innerHtml;
                    }
    
                    // `this` will be the overall tooltip
                    var position = this.canvasRef.nativeElement.getBoundingClientRect();
    
                    // Display, position, and set styles for font
                    tooltipEl.style.opacity = '1';
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                    tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                    tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                    tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                    tooltipEl.style.pointerEvents = 'none';
                }
            },
            scales: {
                xAxes: [
                    {
                        display: true,
                        gridLines:{
                            display: false
                        },
                        ticks:{
                            maxTicksLimit:10
                        }
                    }
                ],
                yAxes: [
                    {
                        display: true,
                        position: 'left',
                        type: "linear",
                        id: "id1",
                        ticks:{
                            suggestedMin:0,
                            maxTicksLimit:6,
                            callback: function(value, index, values) {
                                if(value==0)
                                    return 0;
                                else
                                    return typeof(value)=='number'?"$"+((value/1000))+"K":value;
                            }
                        }
                    },
                    {
                        display: true,
                        position: 'right',
                        type: "linear",
                        id: "id2",
                        gridLines: {
                            display: false
                        },
                        ticks:{
                            suggestedMin:0,
                            maxTicksLimit:6,
                            callback: function(value, index, values) {
                                if(value==0)
                                    return 0;
                                else
                                    return typeof(value)=='number'?"$"+((value/1000))+"K":value;
                            }
                        }
                    }
                ]
            },
            plugins: [],
          }
    }
      public chartColors: any[] = [
        { backgroundColor:["green", "blue", "purple", "#66C6FF", "#FF524D", "#FCD2D2", "#333333"]}
    ];
    @ViewChild('j_513', {
        static: true
    }) public j_513;
    constructor(public userSvc: userService, public navCtrl: NavController, public accountsService: AccountsService, 
        public router: Router, public route: ActivatedRoute, public alertController: AlertController, public popCtrl: PopoverController,
        public nd1Service: ND1Service, public compoundReturnService: CompoundReturnService, private menu: MenuController,
        public userProfileService: UserProfileService, public balanceSheetService: BalanceSheetService,
        public modalCtrl: ModalController, public animationCtrl: AnimationController,public platform: Platform) {
        this.data = {
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
            showMonthly: null,
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
        this.freedomMonth = null;
        this.lifestyleMonth = null;
        this.freedomNumber = 0;
        this.lifestyleNumber = 0;
        this.currentEarnedIncome = 0;
        this.nd1CalculatorData = {
            wealth: null,
        };

        this.setUserData().then(()=>{
            this.setBalanceSheetData();
            this.setBalanceSheetDashboardData();

            // need to calculate if Unearned income is present from non DRIP accounts
            this.calculateUnearnedIncomeValueOfAccounts();
            let toggleSubscribe = this.userSvc.toggleBalance.subscribe((res)=>{
                this.balanceSheetChange();
            })
            if(toggleSubscribe) {
                this.subscriptions.push(toggleSubscribe);
            }
        });
    }

    async balanceSheetChange(){
        await this.setUserData();
        this.setBalanceSheetData(null, true);
        this.setBalanceSheetDashboardData();

        // need to calculate if Unearned income is present from non DRIP accounts
        this.calculateUnearnedIncomeValueOfAccounts();

        this.pageIonViewDidEnter__j_504(false);
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
                    // yearsInvested,
                    yearlySnapshotsCompoundReturn
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
                if(yearlySnapshotsCompoundReturn?.length==0){
                    return this.updateCompoundReturnCalculator(true)?.then(()=>{
                        this.setBalanceSheetDashboardData();
                    })
                }
            }
            if(fromPageLoad){
                this.setBalanceSheetDashboardData();
                this.updateCompoundReturnCalculator(fromPageLoad)?.then(async(data) => {
                });
            }
        })
        if(balanceSubscription){
            this.subscriptions.push(balanceSubscription);
        }
    }

    async setUserData() {
        const getUser = await this.userSvc.getUserOnce().toPromise();
        if (getUser.data && getUser.data.user) {
            const { user } = getUser.data;

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

            this.freedomNumber = user.resultFreedom;
            this.lifestyleNumber = user.resultLifestyle;
            this.currentEarnedIncome = user.currentEarnedIncome || 0;
            this.nd1CalculatorData.giving = user.giving;
            this.nd1CalculatorData.wealth = user.wealth;
            this.nd1CalculatorData.debt = user.debt;
            this.nd1CalculatorData.living = user.living;
            this.nd1CalculatorData.customAccounts = user.customAccounts;
            this.customGoals = user.customGoals || [];

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
                yearsInvested,
                showMonthly
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
                yearsInvested: yearsInvested || 20,
                showMonthly
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
        }

        // if(getUserSubscription) {
        //     this.subscriptions.push(getUserSubscription);
        // }
    }

    goBack() {
        this.navCtrl.back();
    }
    async openNoAssetsAlert() {
        /*
         *   REGRESSION SCENARIO
         *   when a user has no accounts that are assets
         *   Or no assets that do not have "exclude" unchecked
         *   this alert will open
         */
        let noAssetsAlert = await this.alertController.create({
            message: `You must add at least one non-excluded Asset to continue.`,
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
            // message: `Add at least one Asset account that does not have “Exclude From Compound Return (MOAC)” checked.`,
            message: `To see MOAC results, you must have at least one Asset account in your active Balance Sheet that does NOT have "Exclude From Compound Return (MOAC)" checked.`,
            buttons: [{
                text: 'Ok',
                handler: () => {
                    this.nonExcludedAlertIsOpened = false;
                }
            }]
        });
        nonExcludedAssetsAlert.present();
    }
    async openExcludedFromFurtherMoacAlert() {
        /*
         *   REGRESSION SCENARIO
         *   when a user has no assets where the "exclude from further MOAC investment" is unchecked
         *   this info text will open.
         * 
         * SEPT 2022 We decided to allow the user to check "Exclude from further MOAC investments" for EVERY asset
         *   The MOAC will still run but will show an informational modal
         */
        let nonExcludedAssetsAlert = await this.alertController.create({
            message: `"Exclude from further MOAC investments" is currently checked for all assets, so amounts from earned or unearned income (in MOAC global settings) will not be applied.`,
            buttons: [{
                text: 'Ok',
                handler: () => {
                    this.excludeFromFurtherMoacInvestmentAlertIsOpened = false;
                }
            }]
        });
        nonExcludedAssetsAlert.present();
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
            message: `No Investment Type has been selected for the following accounts. Please return to each Account and select an Investment Type in order to continue. ${assetList}`,
            buttons: [{
                text: 'Ok',
                handler: () => {
                    this.noInvestmentTypeAlertIsOpened = false;
                }
            }]
        });
        noInvestmentTypeAlert.present();
    }
    async openAllAssetsWithdrawalExcludeAlert() {
        /*
         *   When a user enters a Withdrawal amaount but has no assets where the "Exclude from withdrawal" is unchecked
         *   this alert will open
         */
        let withdrawalExcludedAssetsAlert = await this.alertController.create({
            message: `You have entered an Annual Withdrawal amount but every Asset in your Accounts list has the "Exclude from Annual Withdrawal" checkbox checked. At least one Asset must be non-excluded in order to continue.`,
            buttons: [{
                text: 'Ok',
                handler: () => {
                    this.nonExcludedAlertIsOpened = false;
                }
            }]
        });
        withdrawalExcludedAssetsAlert.present();
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
            this.data.monthlyEarnedIncome = this.nd1CalculatorData.wealth / 100 * this.currentEarnedIncome;
        }
        // only submit if all accounts have an investment type
        // this also implies that there are assets and that they are NOT excluded
        // see code in the DESIGN tab, Events drawer, Page component to see how everyAssetHasInvestmentType is defined
        const assets = this.accountList.filter(a => a.accountType === 'Asset');
        assets.map((a) => {
            if (a.parentHoldingId && a.accountType === 'Asset') {
                a.parent = this.accountsService.getAccount(a.parentHoldingId);
            }
            return a;
        })
        const nonParentHoldingAssets = assets.filter(a => !a.parentHolding);
        const nonExcludedAssets = nonParentHoldingAssets.filter(a => !a.excludeFromCompoundReturnCalc);
        nonExcludedAssets.sort((a, b) => {
            if (a.name?.toLowerCase() > b.name?.toLowerCase()) return 1;
            if (a.name?.toLowerCase() < b.name?.toLowerCase()) return -1;
            return 0;
        });
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
                this.setBalanceSheetData(null, fromPageLoad);

            } else {
                // if no years invested set default to 20
                if (!this.data.yearsInvested) {
                    this.data.yearsInvested = 20;
                }
                this.updateCompoundReturnCalculator(fromPageLoad)?.then(async (data) => {
                    if(data) {
                        this.setBalanceSheetDashboardData();
                    }
                });
            }
        } else {
            // display modal about every asset needs an investment type
            this.openAssetWithNoInvestmentTypeAlert(assetsWithNoInvestmentType);
        }
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
            // this.userSvc.presentLoader();
            return this.compoundReturnService.calculateCompoundReturn(this.data).toPromise().then(async (res: any) => {
                // this.userSvc.dismissLoader();
                if (res && res.data) {
                    return new Promise((resolve, reject) => {
                        const results = res['data']['calculateCompoundReturn'];
                        const multipleAssets = !!results.weightedResults;
                        const resultsForTable = (multipleAssets && results.weightedResults.length >= 1) ? results.weightedResults : results.results;
                        this.calculatedOutputs = results.calculatedOutputs;
                        this.freedomAndLifestyleText.freedomText = results.freedomText;
                        this.freedomAndLifestyleText.lifestyleText = results.lifestyleText;
                        this.freedomMonth = results.freedomAndLifestyleNumbers?.freedomMonth;
                        this.lifestyleMonth = results.freedomAndLifestyleNumbers?.lifestyleMonth;
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
                        // DISPLAY TABLE
                        try {
                            this.displayTable(resultsForTable, multipleAssets);
                            resolve(true);
                        } catch (e) {
                            throwError(e);
                            reject(false)
                        }
                    })
                    
                }
            },
                async (err: any) => {
                    // this.userSvc.dismissLoader();
                    console.error(err);
                    this.userSvc.toast((err.error && err.error.message) || err.message ? (err?.error?.message || err?.message) : "Data save error updating compound return calculator");
                },
            );
        }
    }
    createNewAccount() {
        const navigationExtras: NavigationExtras = {
            state: Object.assign({}, {
                "origin": "compoundReturn"
            })
        };
        this.navCtrl.navigateForward("accountDetails/new", navigationExtras);
    }
    changeEarnedIncome() {
        if (this.data.useND1WealthValue === false) {
            this.data.monthlyEarnedIncome = null;
        }
        else{
            this.data.monthlyEarnedIncome = this.nd1CalculatorData.wealth / 100 * this.currentEarnedIncome;
        }
    }
    changeUnearnedIncome() {
        if (this.data.useUnearnedIncomeValues === false) {
            this.data.monthlyUnearnedIncome = null;
        } else {
            this.calculateUnearnedIncomeValueOfAccounts();
        }
    }
    displayTable(results, multipleAssets) {
        this.destroyExistingTable();
        const tableHeaders = document.querySelector("#tableHeaders");
        const tableHeadersNodes = tableHeaders.childNodes;
        const tableHeads = document.querySelector(".table-heads");
        const tableBody = document.getElementById("tbodyTarget");
        // Filter by the year end flag to take every 12th month
        const resultsCopy = multipleAssets ? (results || []) : [...(results || [])].filter(month => {
            return month.endOfYearCycle
        });
        const taxPaidVisible = resultsCopy.some(year => year.taxPaid > 0);
        const withdrawalVisible = resultsCopy.some(year => year.annualWithdrawal > 0);
        // if stock or unit AND not ZVA AND not multiple assets
        if (!resultsCopy[0]?.isPortfolio && !resultsCopy[0]?.isZVA && !multipleAssets) {
            let masterNode = '';
            // remove old table headers in case of clicking the Update button more than once
            if (tableHeadersNodes.length > 0 && tableHeads) {
                tableHeaders.removeChild(tableHeaders.childNodes[0]);
            }
            // add the table headers first
            if (resultsCopy[0]?.investmentType === 'stock') { // stock specific
                this.addStockTableHeaders(taxPaidVisible, withdrawalVisible);
            } else { // unit specific
                this.addUnitsTableHeaders(taxPaidVisible, withdrawalVisible);
            }
            resultsCopy.forEach((element) => {
                const {
                    year,
                    assetsOwned,
                    lastMonthsYield,
                    dividendInAbsoluteDollars,
                    income,
                    lastMonthsAssetPrice,
                    basis,
                    riskAdjustedBasis,
                    yieldOnCost,
                    balance,
                    taxPaid,
                    perAnnumContributed,
                    annualWithdrawal,
                    investmentType,
                    taxRate,
                } = element;
                // if units, show two decimals in the Units Owned column
                // if stocks, don't show decimals
                const isUnits = investmentType === 'units';
                // The number of stocks are rounded here per Hans' preference. See ticket or email.
                const assetsOwnedSpecific = isUnits ? roundToTwoDecimals(assetsOwned) : numberToStringWithCommasNoDecimals(assetsOwned);
                const taxPaidMarkup = (taxRate && taxPaidVisible) ? `<td role="cell"  ="table-column table-tax-col">$${numberToStringWithCommasNoDecimals(taxPaid || 0)}</td>` : '';
                const annualWithdrawalMarkup = withdrawalVisible ? `<td role="cell" class="table-column table-annual-withdrawal-col">$${numberToStringWithCommasNoDecimals(annualWithdrawal || 0)}</td>` : '';
                let node = `<tr role="row">
                        <td role="cell" class="table-column table-year-col">${year}</td>
                        <td role="cell" class="table-column table-assets-owned-col">${assetsOwnedSpecific}</td>
                        <td role="cell" class="table-column table-income-per-unit-col">$${numberWithCommasFourDecimals(dividendInAbsoluteDollars)}</td>
                        <td role="cell" class="table-column table-income-col">$${roundToTwoDecimals(income)}</td>
                        <td role="cell" class="table-column table-yields-col">${roundToTwoDecimals(lastMonthsYield * 100).toFixed(2)}%</td>
                        ${taxPaidMarkup}
                        ${annualWithdrawalMarkup}
                        <td role="cell" class="table-column table-total-contributed-col">$${numberToStringWithCommasNoDecimals(perAnnumContributed)}</td>
                        <td role="cell" class="table-column table-asset-price-col">$${numberWithCommasTwoDecimals(lastMonthsAssetPrice)}</td>
                        <td role="cell" class="table-column table-basis-col">$${numberToStringWithCommasNoDecimals(roundToTwoDecimals(basis))}</td>
                        <td role="cell" class="table-column table-risk-adjusted-basis-col">$${numberToStringWithCommasNoDecimals(roundToTwoDecimals((riskAdjustedBasis < 0 ? 0 : riskAdjustedBasis)))}</td>
                        <td role="cell" class="table-column table-yield-on-cost-col">${roundToTwoDecimals(yieldOnCost * 100).toFixed(2)}%</td>
                        <td role="cell" class="table-column table-balance-col">$${numberToStringWithCommasNoDecimals(roundToTwoDecimals(balance))}</td>
                    </tr>`;
                masterNode += node;
            });
            tableBody.innerHTML = masterNode;
        } else { // portfolio or multiple assets
            // remove old table headers in case of clicking the Update button more than once
            if (tableHeadersNodes.length > 0 && tableHeads) {
                tableHeaders.removeChild(tableHeaders.childNodes[0]);
            }
            // add the table head first
            this.addPortfolioTableHeaders(taxPaidVisible, withdrawalVisible);
            let masterNode = '';
            resultsCopy.forEach((element) => {
                const {
                    year,
                    lastMonthsYield,
                    income,
                    basis,
                    riskAdjustedBasis,
                    yieldOnCost,
                    balance,
                    taxPaid,
                    perAnnumContributed,
                    annualWithdrawal
                } = element;
                const taxPaidMarkup = taxPaidVisible ? `<td role="cell" class="col-sm-1 table-column table-tax-col">$${numberToStringWithCommasNoDecimals(taxPaid || 0)}</td>` : '';
                const annualWithdrawalMarkup = withdrawalVisible ? `<td role="cell" class="col-sm-1 table-column table-annual-withdrawal-col">$${numberToStringWithCommasNoDecimals(annualWithdrawal || 0)}</td>` : '';
                let node = `<tr role="row">
                        <td role="cell" class="col-sm-1 table-column table-year-col">${year}</td>
                        <td role="cell" class="col-sm-1 table-column table-yields-col">${roundToTwoDecimals((lastMonthsYield) * 100).toFixed(2)}%</td>
                        <td role="cell" class="col-sm-2 table-column table-income-col">$${numberToStringWithCommasNoDecimals(income)}</td>
                        ${taxPaidMarkup}
                        ${annualWithdrawalMarkup}
                        <td role="cell" class="col-sm-1 table-column table-total-contributed-col">$${numberToStringWithCommasNoDecimals(perAnnumContributed)}</td>
                        <td role="cell" class="col-sm-1 table-column table-basis-col">$${numberToStringWithCommasNoDecimals(roundToTwoDecimals(basis))}</td>
                        <td role="cell" class="col-sm-1 table-column table-risk-adjusted-basis-col">$${numberToStringWithCommasNoDecimals(roundToTwoDecimals((riskAdjustedBasis < 0 ? 0 : riskAdjustedBasis)))}</td>
                        <td role="cell" class="col-sm-2 table-column table-yield-on-cost-col">${roundToTwoDecimals(yieldOnCost * 100).toFixed(2)}%</td>
                        <td role="cell" class="col-sm-2 table-column table-balance-col">$${numberToStringWithCommasNoDecimals(roundToTwoDecimals(balance))}</td>
                    </tr>`;
                masterNode += node;
            });
            tableBody.innerHTML = masterNode;
        }
        // This is the command that executes the Tablesaw plugin
        this.window.Tablesaw.init();
        /**
         * UTILITIES
         */
        function roundToTwoDecimals(num) {
            return Math.round(num * 100) / 100;
        }

        function numberWithCommasTwoDecimals(num) {
            return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        function numberWithCommasFourDecimals(num) {
            const parts = num.toFixed(4).split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join('.');
        }

        function numberToStringWithCommasNoDecimals(num) {
            return num.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }
    destroyExistingTable() {
        // This is needed for mobile view when the Calculate button is clicked more than once.
        // In order for Tablesaw to work correctly, the existing table must be destroyed before another is initialized.
        const $ = this.window.Tablesaw.$;
        const mainTable = $('.main-table');
        if (mainTable.data('tablesaw')) {
            mainTable.data('tablesaw').destroy();
        }
    }
    addPortfolioTableHeaders(addTaxRateColumnFlag, addAnnualWithdrawalColumnFlag) {
        const tableHeaders = document.getElementById("tableHeaders");
        const taxPaidHeaderMarkup = addTaxRateColumnFlag ? '<th role="columnheader">Tax</th>' : '';
        const annualWithdrawalHeaderMarkup = addAnnualWithdrawalColumnFlag ? '<th role="columnheader">Withdrawal</th>' : '';
        const node = `<tr class="table-heads" role="row">
                <th role="columnheader">${this.data.showMonthly ? 'Month' : 'Year'}</th>
                <th role="columnheader">Yield</th>
                <th role="columnheader">Total Income</th>
                ${taxPaidHeaderMarkup}
                ${annualWithdrawalHeaderMarkup}
                <th role="columnheader">Contributions</th>
                <th role="columnheader">Basis</th>
                <th role="columnheader" id="riskAdjBasis">Risk Adj Basis
                    <ion-icon name="help-circle-outline" helpText="Risk Adjusted Basis is the adjusted entry price of the asset when income is factored in. Meaning, it shows the impact of reinvested income (dividends, rents, interest, etc) on original capital investment. As income is reinvested the original capital at risk is lowered."
                    color="main-theme" class="ion-icon-small" src="assets/icon/info.svg">
                    </ion-icon>
                </th>
                <th role="columnheader">Yield on Cost</th>
                <th role="columnheader">New Balance</th>
            </tr>`;
        tableHeaders.innerHTML = node;
        const infoNodes = document.querySelectorAll('[name="help-circle-outline"]')
        const infoNodesArr = Array.from(infoNodes);
        for(let node of infoNodesArr){
            let infoNode = new ElementRef(node);
            let showHelpMessageDirective = new ShowHelpMessageDirective(this.alertController, infoNode,this.popCtrl)
            node.addEventListener('click',(e)=>{showHelpMessageDirective.showHelpMessage(e);})
        }
    }
    addStockTableHeaders(addTaxRateColumnFlag, addAnnualWithdrawalColumnFlag) {
        const tableHeaders = document.getElementById("tableHeaders");
        const taxPaidHeaderMarkup = addTaxRateColumnFlag ? '<th role="columnheader" class="col-sm-1">Tax</th>' : '';
        const annualWithdrawalHeaderMarkup = addAnnualWithdrawalColumnFlag ? '<th role="columnheader" class="col-sm-1">Withdrawal</th>' : '';
        const node = `<tr class="table-heads" role="row">
                    <th role="columnheader" class="col-sm-1">${this.data.showMonthly ? 'Month' : 'Year'}</th>
                    <th role="columnheader" class="col-sm-1" id="sharesOwnedTableLabel">Shares Owned</th>
                    <div role="columnheader" class="col-sm-1">
                        <th class="col-sm-1" id="yieldPerShareTableLabel">Dividend per Share</th>
                        <th class="col-sm-1" id="totalDividendsTableLabel">Total Dividends</th>
                    </div>
                    <th role="columnheader" class="col-sm-1">Yield</th>
                    ${taxPaidHeaderMarkup}
                    ${annualWithdrawalHeaderMarkup}
                    <th role="columnheader" class="col-sm-1">Contributions</th>
                    <th role="columnheader" class="col-sm-1">${this.data.showMonthly ? 'Month End Price' : 'Year End Price'}</th>
                    <th role="columnheader" class="col-sm-1">Basis</th>
                    <th role="columnheader" id="riskAdjBasis">Risk Adj Basis
                        <ion-icon name="help-circle-outline" helpText="Risk Adjusted Basis is the adjusted entry price of the asset when income is factored in. Meaning, it shows the impact of reinvested income (dividends, rents, interest, etc) on original capital investment. As income is reinvested the original capital at risk is lowered."
                        color="main-theme" class="ion-icon-small" src="assets/icon/info.svg">
                        </ion-icon>
                    </th>
                    <th role="columnheader" class="col-sm-1">Yield on Cost</th>
                    <th role="columnheader" class="col-sm-1">New Balance</th>
                </tr>`;
        tableHeaders.innerHTML = node;
    }
    addUnitsTableHeaders(addTaxRateColumnFlag, addAnnualWithdrawalColumnFlag) {
        const tableHeaders = document.getElementById("tableHeaders");
        const taxPaidHeaderMarkup = addTaxRateColumnFlag ? '<th role="columnheader">Tax</th>' : '';
        const annualWithdrawalHeaderMarkup = addAnnualWithdrawalColumnFlag ? '<th role="columnheader">Withdrawal</th>' : '';
        const node = `<tr class="table-heads" role="row">
                    <th role="columnheader">${this.data.showMonthly ? 'Month' : 'Year'}</th>
                    <th role="columnheader" id="sharesOwnedTableLabel">Units Owned</th>
                    <th role="columnheader" id="yieldPerShareTableLabel">Income per Unit</th>
                    <th role="columnheader" id="totalDividendsTableLabel">Total Income</th>
                    <th role="columnheader">Yield</th>
                    ${taxPaidHeaderMarkup}
                    ${annualWithdrawalHeaderMarkup}
                    <th role="columnheader">Contributions</th>
                    <th role="columnheader">${this.data.showMonthly ? 'Month End Price' : 'Year End Price'}</th>
                    <th role="columnheader">Basis</th>
                    <th role="columnheader" id="riskAdjBasis">Risk Adj Basis
                        <ion-icon name="help-circle-outline" helpText="Risk Adjusted Basis is the adjusted entry price of the asset when income is factored in. Meaning, it shows the impact of reinvested income (dividends, rents, interest, etc) on original capital investment. As income is reinvested the original capital at risk is lowered."
                        color="main-theme" class="ion-icon-small" src="assets/icon/info.svg">
                        </ion-icon>
                    </th>
                    <th role="columnheader">Yield on Cost</th>
                    <th role="columnheader">New Balance</th>
                </tr>`;
        tableHeaders.innerHTML = node;
    }
    openCompoundReturnCalc() {
        this.navCtrl.navigateForward("compoundreturncalc");
    }

    async openTutorial(){
        const modal = await this.modalCtrl.create({
            component: CompoundTutorialComponent,
            enterAnimation: this.platform.width()>640?this.enterAnimation:undefined,
            leaveAnimation: this.platform.width()>640?this.leaveAnimation:undefined,
            backdropDismiss: true,
            cssClass: 'side-menu2'
        });
        modal.onWillDismiss().then(async (data)=>{
        })
        modal.present();
    }
    
    ionViewWillEnter() {
        // this.getProfile();
    }
    openGRMCalc() {
        this.navCtrl.navigateForward("grmcalc");
    }
    openPositionSizeCalc() {
        this.navCtrl.navigateForward("positionsizecalc");
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
    calculateUnearnedIncomeValueOfAccounts() {
        // ensure that getAccounts is pulling FRESH data, NOT cached data
        const getAccountsSubscription = this.accountsService.getAccounts(true).subscribe(res => {
            if(this.accountsService.accounts.length > 0) {
                if (this.accountsService.accounts[0].balanceSheetId !== this.userSvc.activeBalanceSheet) {
                    return;
                }
            }
            this.accountList = this.accountsService.accounts;
            this.assets = this.accountList.filter(a => a.accountType === 'Asset');
            this.assets.map((a) => {
                if (a.parentHoldingId && a.accountType === 'Asset') {
                    a.parent = this.accountsService.getAccount(a.parentHoldingId);
                }
                return a;
            })
            this.nonExcludedAssets = this.assets.filter(a => !a.excludeFromCompoundReturnCalc);
            this.nonExcludedAssets.sort((a, b) => {
                if (a.name?.toLowerCase() > b.name?.toLowerCase()) return 1;
                if (a.name?.toLowerCase() < b.name?.toLowerCase()) return -1;
                return 0;
            });
            this.typeSelectedAccounts = this.nonExcludedAssets.filter(a => a.assetType && a.investmentType);
            if (this.data.useUnearnedIncomeValues) { // also need else statement??
                if (this.nonExcludedAssets) {
                    this.accountsWithReinvestIntoOtherAssets = this.nonExcludedAssets.filter(a => a.estimatedYearlyIncome && a.reinvestIntoOtherAssets);
                    const calculatedYearlyUnearnedIncomeValueOfAccounts = this.accountsWithReinvestIntoOtherAssets.reduce((accumulator, account) => {
                        return accumulator + account.estimatedYearlyIncome
                    }, 0);
                    this.calculatedUnearnedIncomeValueOfAccounts = this.roundToTwoDecimals(calculatedYearlyUnearnedIncomeValueOfAccounts / 12);
                    // need to divide by 12 to get the monthly amount and round to the nearest dollar
                    this.data.monthlyUnearnedIncome = this.calculatedUnearnedIncomeValueOfAccounts;
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

    async openOnlyPlaidAlert(accounts: TAccountList) {
        /*
         *   When a user only has not selected type for Plaid Accounts
         *   this alert will open
         */
        let i = 0;
        const accountsName = accounts.reduce((accountName, account) => {
            const endCharacter = (i==(accounts.length-1))?'':', ';
            if(account.parentHoldingId) {
                const parentName = this.accountsService.getAccount(account.parentHoldingId).name;
                accountName += '\n' + parentName + ":" + account.name + endCharacter;
            }
            else {
                accountName += account.name + endCharacter;
            }
            i++;
            return accountName;
        }, '');
        const existingAlert = await this.alertController.getTop();
        if (!existingAlert) {
            let onlyPlaidAlert = await this.alertController.create({
                message: "Please review the following accounts in your active Balance Sheet and select their Asset Type as soon as possible! \n" + accountsName,
                buttons: [{
                    text: 'Ok',
                    handler: () => {
                        // this.navCtrl.navigateForward("balancesheet");
                    }
                }],
                cssClass: 'reviewAccount',
            });
            onlyPlaidAlert.present();
        }
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
    ionViewDidEnter() {
        this.pageIonViewDidEnter__j_504(true);
    }
    async pageIonViewDidEnter__j_504(update?,event?, currentItem?) {
        let __aio_tmp_val__: any;
        /* Run TypeScript */
        /* Run TypeScript */
        // ensure that getAccounts is pulling FRESH data, NOT cached data
        const getAccountsSubscription = this.accountsService.getAccounts(true).subscribe((res) => {
            if(this.accountsService.accounts.length > 0) {
                if (this.accountsService.accounts[0].balanceSheetId !== this.userSvc.activeBalanceSheet) {
                    return;
                }
            }
            this.accountList = this.accountsService.accounts;
            this.assets = this.accountList.filter(a => a.accountType === 'Asset');
            const nonParentHoldingAssets = this.assets.filter((account) => !account.parentHolding);
            this.nonExcludedAssets = nonParentHoldingAssets.filter(a => !a.excludeFromCompoundReturnCalc);
            this.nonExcludedAssets.sort((a, b) => {
                if (a.name?.toLowerCase() > b.name?.toLowerCase()) return 1;
                if (a.name?.toLowerCase() < b.name?.toLowerCase()) return -1;
                return 0;
            });
            const assetsWithNoInvestmentType = this.nonExcludedAssets.filter(a => !a.investmentType);
            this.everyAssetHasInvestmentType = assetsWithNoInvestmentType.length === 0;
            const assetsWithoutWithdrawalExcluded = this.nonExcludedAssets.filter(a => !a.excludeFromWithdrawal);
            const zeroValueAssets = this.nonExcludedAssets.filter(a => a.investmentType === 'zeroValue');
            const onlyZeroValueAssets = this.nonExcludedAssets.length === zeroValueAssets.length;
            const everyAssetHasReinvestIntoOtherAssetsChecked = this.nonExcludedAssets.every(a => a.reinvestIntoOtherAssets);
            const everyAssetIsExcludedFromFurtherMoacInvestment = this.nonExcludedAssets.every(a => a.excludeFromFurtherInvestment);
            const typeNotSelectedAccounts = this.nonExcludedAssets.filter(a => !a.assetType || !a.investmentType);
            this.typeSelectedAccounts = this.nonExcludedAssets.filter(a => a.assetType && a.investmentType);
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
            }
            // else if(typeNotSelectedAccounts.length > 0) {
            //     this.openOnlyPlaidAlert(typeNotSelectedAccounts);
            //     return;
            // }
             else {
                // if(typeNotSelectedAccounts.length > 0) {
                //     this.openOnlyPlaidAlert(typeNotSelectedAccounts);
                // }
                // show info message but do not block MOAC calculation from occurring if every asset has excludedFromFurtherMoacInvestment set as true
                if (everyAssetIsExcludedFromFurtherMoacInvestment) {
                    this.openExcludedFromFurtherMoacAlert();
                }
                // this is to populate the unearned income field if "Use income from non DRIP accounts is checked"
                if (this.data.useUnearnedIncomeValues) {
                    if (this.nonExcludedAssets) {
                        this.accountsWithReinvestIntoOtherAssets = this.nonExcludedAssets.filter(a => a.estimatedYearlyIncome && a.reinvestIntoOtherAssets);
                        const calculatedYearlyUnearnedIncomeValueOfAccounts = this.accountsWithReinvestIntoOtherAssets.reduce((accumulator, account) => {
                            return accumulator + account.estimatedYearlyIncome
                        }, 0);
                        this.calculatedUnearnedIncomeValueOfAccounts = roundToTwoDecimals(calculatedYearlyUnearnedIncomeValueOfAccounts / 12);
                        // need to divide by 12 to get the monthly amount and round to the nearest dollar
                        this.data.monthlyUnearnedIncome = this.calculatedUnearnedIncomeValueOfAccounts;
                        this.update(update);
                        // this.setBalanceSheetDashboardData();
                    }
                } else {
                    // this.data.monthlyUnearnedIncome = 0;
                    this.update(update);
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
    async freedomnumberClick__j_514(event?, currentItem?) {
        let __aio_tmp_val__: any;
        /* Navigate to Page */
        this.router.navigate(['freedomnumberdetails']);
    }
    async lifestylenumberClick__j_515(event?, currentItem?) {
        let __aio_tmp_val__: any;
        /* Navigate to Page */
        this.router.navigate(['lifestylenumberdetails']);
    }
    async earnedincomeinput2Click__j_521(event?, currentItem?) {
        let __aio_tmp_val__: any;
        /* Navigate to Page */
        this.router.navigate(['nd1details']);
    }

    ionViewWillLeave() {
        this.subscriptions.forEach(sub => {
            sub.unsubscribe();
        })
        this.subscriptions = [];
    }
    async openAssetForm(){
        const modal = await this.modalCtrl.create({
            component: CompoundReturnComponent,
            backdropDismiss: false,
            enterAnimation: this.platform.width()>640?this.enterAnimation:undefined,
            leaveAnimation: this.platform.width()>640?this.leaveAnimation:undefined,
            cssClass: 'side-menu',
        });
        let subscriptionBalance;
        modal.onWillDismiss().then(async (data)=>{
            subscriptionBalance = this.balanceSheetService.getBalanceSheets(true).pipe(take(1)).subscribe(sheet=>{
                if(data.data){
                    if(data.data?.data){
                        this.lastDataPassedInCompoundReturn = _.cloneDeep(data.data.data);
                        this.data = _.cloneDeep(data.data.data) as TCompoundReturn;
                        this.calculatedOutputs = data.data.calculatedOutputs;
                        if (data.data.noUpdate !== true) {
                            this.freedomAndLifestyleText = data.data.freedomAndLifestyleText;
                            this.freedomMonth = data.data.freedomMonth;
                            this.lifestyleMonth = data.data.lifestyleMonth;
                            this.customGoalsResult = data.data.customGoalsResult
                        }
                        if(data.data.resultsForTable){
                            try{
                                this.displayTable(data.data.resultsForTable, data.data.multipleAssets);
                            } catch (e) {
                                throwError(e);
                            }
                        }
                    }
                    this.pageIonViewDidEnter__j_504(false);
                    this.setBalanceSheetDashboardData();
                }
            });
        })
        modal.present();
    }

    setBalanceSheetDashboardData() {

        const balanceSubscription = this.balanceSheetService.getActiveV2(true).subscribe((res: any) => {
            if (res && res.data) {
                // Deep copy response object to avoid mutating the cache object
                const responseCopy = _.cloneDeep(res.data.balanceSheet);
                const {
                    yearlySnapshotsCompoundReturn
                } = responseCopy;
                // this.getCompoundReturnChartData();
                this.compoundReturnBurnUpChartData = { yearlySnapshots: yearlySnapshotsCompoundReturn };

                if (this.compoundReturnBurnUpChartData.yearlySnapshots) {
                    const updatedYear = new Date().getFullYear();
                    const updatedMonth = new Date().getMonth();

                    this.compoundReturnBurnUpChartData.yearlySnapshots.forEach(item => {
                        if (!this.data.showMonthly) {
                            if (!item.last) {
                                item.year = updatedYear + item.year;
                            }
                            if (!item.month) {
                                item.month = updatedMonth;
                            }
                        } else {
                            if (!item.last) {
                                const snapYear = moment().add(item.year, 'months');
                                item.year = snapYear.year();
                                item.month = snapYear.month();
                            }
                        }
                    });
                }
                    this.compoundReturnDrawChart()
            }
        })
        if(balanceSubscription)
            this.subscriptions.push(balanceSubscription);
        
    }

    compoundReturnDrawChart(){
        if (this.compoundReturnBurnUpChartData?.yearlySnapshots && this.compoundReturnBurnUpChartData.yearlySnapshots.length > 0) {
            let yearlabels = [];
            let freedomNumberdata = [];
            let lifestyleNumberData = [];
            let unearnedIncomeData = [];
            let balanceData = [];
            let minimum = 0;
            if(this.freedomNumber<this.lifestyleNumber){
                if(this.freedomNumber < this.compoundReturnBurnUpChartData.yearlySnapshots[0].income)
                    minimum = this.freedomNumber
                else
                    minimum = this.compoundReturnBurnUpChartData.yearlySnapshots[0].income
            }
            else{
                if(this.lifestyleNumber < this.compoundReturnBurnUpChartData.yearlySnapshots[0].income)
                    minimum = this.lifestyleNumber
                else
                    minimum = this.compoundReturnBurnUpChartData.yearlySnapshots[0].income
            }
            this.compoundReturnChartMeta.options.scales.yAxes[0].ticks.suggestedMin = minimum;
            for(let snap of this.compoundReturnBurnUpChartData.yearlySnapshots){
                yearlabels.push(this.data.showMonthly ? `${(snap.month + 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}-${snap.year}` : snap.year);
                freedomNumberdata.push(this.freedomNumber);
                lifestyleNumberData.push(this.lifestyleNumber);
                unearnedIncomeData.push( snap.income);
                balanceData.push(snap.balance);
            };
            this.compoundReturnChartMeta.labels = yearlabels;
            let customDataSet = [];
            for (let goals of this.customGoals) {
                let customNumberData = [];
                for(let snap of this.compoundReturnBurnUpChartData.yearlySnapshots){
                    customNumberData.push(goals.value);
                }
                customDataSet.push({label:goals.label,data:customNumberData,fill: false,pointStyle:'circle', pointRadius: 2,
                    pointBorderColor: [], 
                    // borderColor: this.graphColors['--graph-aero'], 
                    // backgroundColor: this.graphColors['--graph-aero'],
                    pointBackgroundColor: [],
                    pointBorderWidth: 2,yAxisID: "id1"})
            }
            this.compoundReturnChartMeta.dataSets = [...this.compoundReturnDefaultDataset, ...customDataSet];
            this.compoundReturnChartMeta.dataSets[0].data = freedomNumberdata;
            this.compoundReturnChartMeta.dataSets[1].data = lifestyleNumberData;
            this.compoundReturnChartMeta.dataSets[2].data = unearnedIncomeData;
            this.compoundReturnChartMeta.dataSets[3].data = balanceData;
            
            setTimeout(() => {
                this.legendData = this.chartComponent?.chart?.generateLegend();
            }, 1000);
        } else {
            this.compoundReturnChartMeta.labels = [];
            this.compoundReturnChartMeta.dataSets = this.compoundReturnDefaultDataset;
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

    async editAccount(id: string, type: string) {
        const modal = await this.modalCtrl.create({
            component: AccountDetails,
            enterAnimation: this.platform.width()>640?this.enterAnimation:undefined,
            leaveAnimation: this.platform.width()>640?this.leaveAnimation:undefined,
            backdropDismiss: false,
            cssClass: 'side-menu2',
            componentProps:{
                id,
                type
            }
        });
        // let subscriptionBalance;
        modal.onWillDismiss().then(async (data)=>{
            await this.userSvc.dismissLoader();
            // subscriptionBalance = this.balanceSheetService.getBalanceSheets(true).subscribe(sheet=>{
            //     if(data.data){
            //         if(data.data?.data){
            //             this.data = _.cloneDeep(data.data.data) as TCompoundReturn;
            //             this.calculatedOutputs = data.data.calculatedOutputs;
            //             this.freedomAndLifestyleText = data.data.freedomAndLifestyleText;
            //             this.freedomMonth = data.data.freedomMonth;
            //             this.lifestyleMonth = data.data.lifestyleMonth;
            //             if(data.data.resultsForTable){
            //                 try{
            //                     this.displayTable(data.data.resultsForTable, data.data.multipleAssets);
            //                 } catch (e) {
            //                     throwError(e);
            //                 }
            //             }
            //         }
            //         this.pageIonViewDidEnter__j_504(false);
            //     }
            //     let balanceUnsubscribe=_.debounce(()=>{
            //         subscriptionBalance.unsubscribe();
            //     },1000,{'trailing': true});
            //     balanceUnsubscribe();
            // });
        })
        modal.onDidDismiss().then(async (data) => {
        })
        modal.present();
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

    checkCustomGoalReaminingMonth() {
        for(let results of this.customGoalsResult) {
            if (results.customMonth > 0) {
                return true;
            }
        }
        return false;
    }
}