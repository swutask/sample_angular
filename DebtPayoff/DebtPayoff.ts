import {
    AfterViewInit,
    Component, ElementRef
} from '@angular/core';
import {
    AlertController, AnimationController, ModalController, Platform
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
    ExportedClass as TDebtPayoff
} from '../scripts/custom/TDebtPayoff';
import {
    ExportedClass as ND1Service
} from '../scripts/custom/ND1Service';
import {
    ExportedClass as DebtPayoffService
} from '../scripts/custom/DebtPayoffService';
import {
    NavigationExtras
} from '@angular/router';
import {
    ViewChild
} from '@angular/core';
import {
    ExportedClass as BalanceSheetService
} from '../scripts/custom/BalanceSheetService';
import {
    ExportedClass as UserProfileService
} from '../scripts/custom/UserProfileService';
import {
    ExportedClass as TDebtPayoffBurnDownChart
} from '../scripts/custom/TDebtPayoffBurnDownChart';
import _ from 'lodash';
import { Subscription } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { AccountDetails } from '../AccountDetails/AccountDetails';
import { DebtTutorialComponent } from '../components/debt-tutorial/debt-tutorial.component';
import { CommonProvider } from "../utility/common"

@Component({
    templateUrl: 'DebtPayoff.html',
    selector: 'page-debt-payoff',
    styleUrls: ['DebtPayoff.scss']
})
export class DebtPayoff implements AfterViewInit {
    @ViewChild(BaseChartDirective) chartComponent: BaseChartDirective;
    @ViewChild('myDebtCanvas') canvasRef: ElementRef;
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
    public data: TDebtPayoff;
    public debtPayoffResults: any;
    public nd1CalculatorData: TND1Calculator;
    public alertIsOpened: boolean;
    public accountList: TAccountList;
    public assets: TAccountList;
    public accountsWithReinvestIntoDebtPayOff: TAccountList;
    public calculatedUnearnedIncomeValueOfAccounts: number;
    public currentItem: any = null;
    public mappingData: any = {};
    public subscriptions: Subscription[] = [];
    public toggleIcon: boolean = false;
    public toggleIconAccount:boolean = false;
    public debtPayoffBurnDownChartData: TDebtPayoffBurnDownChart;
    public debtPayoffCalculatorData: TDebtPayoff;
    public balanceSheet: any;
    public balanceChangeSubscriptions: Subscription[] = [];
    public showChart: boolean = true;
    @ViewChild('j_1225', {
        static: true
    }) public j_1225;
    sortPayoffBy = [
        {
            description:'Fewest Payments Left First',
            value:'fewestPayments'
        },
        {
            description:'Lowest Balance First',
            value:'lowestBalance'
        },
        {
            description:'Highest Interest Rate First',
            value:'highestInterestRate'
        },
        {
            description:'Type of Debt (Worst Debt First)',
            value:'typeOfDebt'
        },
    ];
    sortPayoffByValue = 'fewestPayments';
    public graphColors = { 
        '--graph-red-crayola': '#FF524D',
        '--graph-orange': '#FFA31A',
    };
    public barChartLabels: string[] = [];
    public barChartType: ChartType = 'line';
    public barChartLegend = true;
    public barChartData: ChartDataSets[] = [];
    legendData: any;
    private getLegendCallback = (function(self) {
        function handle(chart) {
            return chart.legend.legendItems;
        }
        return function(chart) {
            return handle(chart);
        };
    })(this);
    public barChartOptions: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        legend:{
            display: false
        },
        legendCallback: this.getLegendCallback,
        cutoutPercentage: 80,
        tooltips:{enabled:false},
        scales: {
            xAxes: [
                {
                    display: true
                }
            ],
            yAxes: [
                {
                    display: true
                }
            ]
        },
        plugins: [],
      };
      public chartColors: any[] = [
        { backgroundColor:["#FF524D", "#FFCF33", "#66C6FF", "#FCD2D2", "#333333"]}
    ];
    constructor(public userSvc: userService, public navCtrl: NavController, public accountsService: AccountsService, 
        public router: Router, public route: ActivatedRoute, public alertController: AlertController, 
        public nd1Service: ND1Service, public debtPayoffService: DebtPayoffService, 
        public balanceSheetService: BalanceSheetService, public userProfileService: UserProfileService,
        public animationCtrl:AnimationController, public modalCtrl:ModalController,
        public platform:Platform,
        public commonProvider: CommonProvider
        ) {
        // even though the backend sets the sortPayOff value default if none is given
        // this is needed to pre-select fewestPayments from the UI
        this.data = {
            sortPayoffBy: "fewestPayments",
            useIncomeFromAssets: false,
            incomeFromAssets: null,
        };
        // Keep this. It is needed on the Design tab
        this.debtPayoffResults = {
            calculatedOutputs: {
                currentPayoffText: "",
                maximumInterestForAllDebtsText: "",
                acceleratorPayoffText: "",
                calculatedDebtAccelInterest: "",
                maximumInterestForAllDebts: 0
            }
        }
        this.nd1CalculatorData = {
            debt: 0,
            earnedIncome: 0
        };
        this.setUserData();
        let toggleSubscribe = this.userSvc.toggleBalance.subscribe((res)=>{
            this.balanceSheetChange();
        })
        this.subscriptions.push(toggleSubscribe);
    }
    ngAfterViewInit(): void {
    }

    async balanceSheetChange(){
        await this.balanceChangeSubscriptions.forEach(async(sub) => {
            await sub.unsubscribe();
        })
        const getBalanceSheetsSubscription = this.balanceSheetService
        .getActiveV2(true)
        .subscribe((res: any) => {
          if (res && res.data) {
            this.balanceSheet = res.data.balanceSheet;
            const { sortPayoffBy, useIncomeFromAssets } = this.balanceSheet;
            if (sortPayoffBy) {
              this.data.sortPayoffBy = sortPayoffBy;
              this.sortPayoffByValue = sortPayoffBy;
            }
            if(useIncomeFromAssets) {
                this.data.useIncomeFromAssets = useIncomeFromAssets;
            }
          }
        });

        const getAccountsSubscription = this.accountsService
        .getAccounts()
        .subscribe(
          async (res) => {
            await this.calculateDebtPayoffVariables(false);
            this.accountList = this.accountsService.accounts;
            const liabilities = this.accountList.filter(
              (a) => a.accountType === 'Liability'
            );
            const nonExcludedLiabilities = liabilities.filter(
              (l) => !l.excludeFromDebtPayoffCalc
            );
            if (nonExcludedLiabilities.length === 0) {
              this.openNoDebtsAlert();
            }
          },
          (err: any) => {
            console.error(err);
          }
        );

      if (getAccountsSubscription) {
        this.balanceChangeSubscriptions.push(getAccountsSubscription);
      }

      if (getBalanceSheetsSubscription) {
        this.balanceChangeSubscriptions.push(getBalanceSheetsSubscription);
      }
    }
    ionViewWillEnter() {
      // this is needed to pull the sortPayoffBy from the last time the user ran the calculator
      const getBalanceSheetsSubscription = this.balanceSheetService
        .getActiveV2(true)
        .subscribe((res: any) => {
          if (res && res.data) {
            this.balanceSheet = res.data.balanceSheet;
            const { sortPayoffBy, useIncomeFromAssets } = this.balanceSheet;
            if (sortPayoffBy) {
              this.data.sortPayoffBy = sortPayoffBy;
              this.sortPayoffByValue = sortPayoffBy;
            }
            if (useIncomeFromAssets) {
                this.data.useIncomeFromAssets = useIncomeFromAssets;
            }
          }
        });

      const getUserSubscription = this.userSvc
        .getUser()
        .subscribe(({ data }) => {
          if (data && data.user) {
            this.nd1CalculatorData.earnedIncome =
              data.user.currentEarnedIncome || 0;
            this.nd1CalculatorData.debt = data.user.debt;
          }
        });

      const getAccountsSubscription = this.accountsService
        .getAccounts()
        .subscribe(
          async (res) => {
            this.accountList = this.accountsService.accounts;
            
            this.assets = this.accountList.filter(a => a.accountType === 'Asset');
            if (this.data.useIncomeFromAssets) {
                if (this.assets) {
                    this.accountsWithReinvestIntoDebtPayOff = this.assets.filter(a => a.estimatedYearlyIncome && a.reinvestIntoDebtPayOff);
                    this.accountsWithReinvestIntoDebtPayOff.sort((a, b) => {
                        if (a.name?.toLowerCase() > b.name?.toLowerCase()) return 1;
                        if (a.name?.toLowerCase() < b.name?.toLowerCase()) return -1;
                        return 0;
                    });
                    const calculatedYearlyUnearnedIncomeValueOfAccounts = this.accountsWithReinvestIntoDebtPayOff.reduce((accumulator, account) => {
                        return accumulator + account.estimatedYearlyIncome
                    }, 0);
                    this.calculatedUnearnedIncomeValueOfAccounts = this.roundToTwoDecimals(calculatedYearlyUnearnedIncomeValueOfAccounts / 12);
                    // need to divide by 12 to get the monthly amount and round to the nearest dollar
                    this.data.incomeFromAssets = this.roundToTwoDecimals(this.calculatedUnearnedIncomeValueOfAccounts);
                }
            }
            await this.calculateDebtPayoffVariables(false);

            const liabilities = this.accountList.filter(
              (a) => a.accountType === 'Liability'
            );
            const nonExcludedLiabilities = liabilities.filter(
              (l) => !l.excludeFromDebtPayoffCalc
            );
            if (nonExcludedLiabilities.length === 0) {
              this.openNoDebtsAlert();
            }
          },
          (err: any) => {
            console.error(err);
          }
        );

      if (getAccountsSubscription) {
        this.subscriptions.push(getAccountsSubscription);
      }

      if (getUserSubscription) {
        this.subscriptions.push(getUserSubscription);
      }

      if (getBalanceSheetsSubscription) {
        this.subscriptions.push(getBalanceSheetsSubscription);
      }
    }
   async update(event: any) {
    this.data.sortPayoffBy = event;
        await this.userSvc.presentLoader();
        if(!this.balanceSheet){
            await this.userSvc.dismissLoader();
            return;
        }
        await this.updateSortPayoffBy();
        await this.calculateDebtPayoffVariables(false);
        await this.userSvc.dismissLoader();
    }
    updateSortPayoffBy() {
       return this.balanceSheetService.updateBalanceSheet({ sortPayoffBy: this.data.sortPayoffBy }, { sortPayoffBy: this.data.sortPayoffBy, id: this.userSvc.activeBalanceSheet }).toPromise()
    }

    updateUseIncomeFromAssets() {
        return this.balanceSheetService.updateBalanceSheet(
            { useIncomeFromAssets: this.data.useIncomeFromAssets, incomeFromReinvestIntoDebtPayoff: this.data.incomeFromAssets },
            { useIncomeFromAssets: this.data.useIncomeFromAssets, id: this.userSvc.activeBalanceSheet }
            ).toPromise()
     }

     roundToTwoDecimals(num) {
        return Math.round(num * 100) / 100;
      }

      async changeIncomeFromAssets() {
        if (this.data.useIncomeFromAssets === false) {
            this.data.incomeFromAssets = null;
            await this.updateUseIncomeFromAssets();
            await this.calculateDebtPayoffVariables(false);
        } else {
            await this.calculateIncomeFromAssets();
        }
    }

     calculateIncomeFromAssets() {
        // const getAccountsSubscription = this.accountsService.getAccounts().subscribe(async (res) => {
            this.accountList = this.accountsService.accounts;
            this.assets = this.accountList.filter(a => a.accountType === 'Asset');
            if (this.data.useIncomeFromAssets) {
                if (this.assets) {
                    this.accountsWithReinvestIntoDebtPayOff = this.assets.filter(a => a.estimatedYearlyIncome && a.reinvestIntoDebtPayOff);
                    this.accountsWithReinvestIntoDebtPayOff.sort((a, b) => {
                        if (a.name?.toLowerCase() > b.name?.toLowerCase()) return 1;
                        if (a.name?.toLowerCase() < b.name?.toLowerCase()) return -1;
                        return 0;
                    });
                    const calculatedYearlyUnearnedIncomeValueOfAccounts = this.accountsWithReinvestIntoDebtPayOff.reduce((accumulator, account) => {
                        return accumulator + account.estimatedYearlyIncome
                    }, 0);
                    this.calculatedUnearnedIncomeValueOfAccounts = this.roundToTwoDecimals(calculatedYearlyUnearnedIncomeValueOfAccounts / 12);
                    // need to divide by 12 to get the monthly amount and round to the nearest dollar
                    this.data.incomeFromAssets = this.roundToTwoDecimals(this.calculatedUnearnedIncomeValueOfAccounts);
                    this.updateUseIncomeFromAssets();
                    this.calculateDebtPayoffVariables(false);
                }
            }
        // },
        //     (err: any) => {
        //         console.error(err);
        //     }
        // );

        // if(getAccountsSubscription) {
        //     this.subscriptions.push(getAccountsSubscription);
        // }
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

    async calculateDebtPayoffVariables(withLoader = false) {
        if(withLoader) { 
            await this.userSvc.presentLoader();
        }

       const res = await this.debtPayoffService.calculateDebtPayoff(this.data.sortPayoffBy).toPromise();
       this.debtPayoffResults = res['data']['calculateDebtPayoff'];
       if (this.debtPayoffResults?.calculatedOutputs){
         this.debtPayoffResults.calculatedOutputs.currentPayoffText = (this.debtPayoffResults?.calculatedOutputs?.currentPayoffText.indexOf("200 years") > -1) ? "Will never get paid off" : this.debtPayoffResults?.calculatedOutputs?.currentPayoffText;
       }
       this.setBalanceSheetDashboardData()
       await this.userSvc.dismissLoader();
    }

    goBack() {
        this.navCtrl.back();
    }

    setBalanceSheetDashboardData() {
                this.balanceSheetService.getActiveV2(true).subscribe((res: any) => {
                  this.debtPayoffBurnDownChartData = null;
                  // Deep copy response object to avoid mutating the cache object
                  if (res && res.data.balanceSheet) {
                    const responseCopy = _.cloneDeep(res.data.balanceSheet);
                    const {
                      acceleratorAmount,
                      sortPayoffBy,
                      acceleratorPayoffText,
                      calculatedDebtAccelInterest,
                      maximumInterestForAllDebts,
                      currentPayoff,
                      currentTotalInterest,
                      debtAcceleratorPayoff,
                      debtAcceleratorInterest,
                      yearlySnapshotsDebtPayoff,
                    } = responseCopy;

                    if (
                      currentPayoff &&
                      currentTotalInterest &&
                      debtAcceleratorInterest &&
                      debtAcceleratorPayoff &&
                      yearlySnapshotsDebtPayoff
                    ) {
                      this.debtPayoffBurnDownChartData = {
                        currentPayoff,
                        currentTotalInterest,
                        debtAcceleratorPayoff,
                        debtAcceleratorInterest,
                        yearlySnapshots: yearlySnapshotsDebtPayoff,
                      };

                      if (this.debtPayoffBurnDownChartData.yearlySnapshots) {
                        const updatedYear = new Date().getFullYear();
                        const updatedMonth = new Date().getMonth();

                        this.debtPayoffBurnDownChartData.yearlySnapshots.forEach(
                          (item) => {
                            if (!item.last) {
                              item.year = updatedYear + item.year;
                            }
                            if (!item.month) {
                              item.month = updatedMonth;
                            }
                          }
                        );
                      }
                    }
                    this.debtPayoffDrawChart();
                  }
                });
    }
    debtPayoffDrawChart(){
        if (this.debtPayoffBurnDownChartData?.yearlySnapshots?.length > 0) {
            this.showChart = true;
            let yearlabels = [];
            let currentPayoff = [];
            let acceleratorPayoff = [];
            let minimum = 0;
            let previousBalanceOfAllDebtsWithAccel;
            for(let snap of this.debtPayoffBurnDownChartData.yearlySnapshots){
                let localBalanceOfAllDebtsWithAccel = snap.balanceOfAllDebtsWithAccel;
                yearlabels.push(snap.year);
                currentPayoff.push(!snap.balanceOfAllDebts?0+90:snap.balanceOfAllDebts);
                
                // if balanceOfAllDebtsWithAccel is 0 set as null so that there is no line along the bottom of the chart. Request from Hans.
                if (previousBalanceOfAllDebtsWithAccel === 0) {
                    acceleratorPayoff.push(null);
                } else {
                    acceleratorPayoff.push(localBalanceOfAllDebtsWithAccel);
                }                
                previousBalanceOfAllDebtsWithAccel = localBalanceOfAllDebtsWithAccel;
            };
            this.barChartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                legend:{
                    display: false
                },
                legendCallback: this.getLegendCallback,
                tooltips:{enabled: false,
                    mode:'single',
                    intersect: true,
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
                            var style = 'background:#FFFFFF';
                            style += '; border-color:#E6E6E6';
                            style += '; border-width: 2px';
                            innerHtml += '</thead><tbody style="' + style + '">';
        
                            bodyLines.forEach((body, i)=> {
                                const date = new Date(this.debtPayoffBurnDownChartData?.yearlySnapshots[tooltipModel.dataPoints[0].index]?.year, this.debtPayoffBurnDownChartData?.yearlySnapshots[tooltipModel.dataPoints[0].index]?.month ? this.debtPayoffBurnDownChartData.yearlySnapshots[tooltipModel.dataPoints[0].index]?.month : 0, 1);
                let dateString = `<p> ${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}</p>`;
                dateString +=
                    '<p>Balance of all debt: $' + new Intl.NumberFormat().format(this.debtPayoffBurnDownChartData?.yearlySnapshots[tooltipModel.dataPoints[0].index]?.balanceOfAllDebts) + '</p>' +
                    '<p>Balance of all debts with accelerator: $' + new Intl.NumberFormat().format(this.debtPayoffBurnDownChartData?.yearlySnapshots[tooltipModel.dataPoints[0]?.index].balanceOfAllDebtsWithAccel) + '</p>';
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
                            ticks:{
                                suggestedMin:minimum,
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
              };
            this.barChartLabels =yearlabels;
            this.barChartData = [
                {label:'Current payoff',data:currentPayoff,fill: false,pointStyle:'circle',
                pointBorderColor: this.graphColors['--graph-red-crayola'], borderColor: this.graphColors['--graph-red-crayola'],pointRadius: 2,
                backgroundColor: this.graphColors['--graph-red-crayola'],
                pointBackgroundColor: this.graphColors['--graph-red-crayola'],
                pointBorderWidth: 2,},
                {label:'Accelerator payoff',data:acceleratorPayoff,fill: false,pointStyle:'circle',
                pointBorderColor: this.graphColors['--graph-orange'],borderColor: this.graphColors['--graph-orange'],pointRadius: 2,
                backgroundColor: this.graphColors['--graph-orange'],
                pointBackgroundColor: this.graphColors['--graph-orange'],
                pointBorderWidth: 2,},
            ];
                let getLegend = _.debounce(()=>{
                    this.legendData = this.chartComponent?.chart?.generateLegend();
                },1000);
                getLegend();
        }
        // if no liability have been added
        else {
            // const compoundReturnChartEl = document.getElementById('compoundReturnChart');
            // if (compoundReturnChartEl) {
            //     compoundReturnChartEl.innerHTML = '<div><h2>Add at least one Liability account then edit Debt Payoff values to see this chart.</h2></div>';
            // }
            this.showChart = false;
        }
    }
    setUserData() {
        const getUserSubscription = this.userSvc.getUser().subscribe(({ data }) => {
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
                this.nd1CalculatorData.debt = user.debt;
            }
        })

        if(getUserSubscription) {
            this.subscriptions.push(getUserSubscription);
        }
    }
    async openNoDebtsAlert() {
        let noDebtsAlert = await this.alertController.create({
            message: "Please add a Liability Account to start using the Debt Payoff Calculator.",
            buttons: [{
                text: 'Ok',
                handler: () => {
                    this.alertIsOpened = false;
                }
            }]
        });
        noDebtsAlert.present();
    }
    createNewAccount() {
        const navigationExtras: NavigationExtras = {
            state: Object.assign({}, {
                "origin": "debtPayoff"
            })
        };
        this.navCtrl.navigateForward("accountDetails/new", navigationExtras);
    }
    openND1() {
        this.navCtrl.navigateForward("nd1details");
    }
    enterAnimation = (baseEl: any) => {
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
  
    leaveAnimation = (baseEl: any) => {
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
        modal.onWillDismiss().then(async (data)=>{
        })
        modal.present();
    }
    async openTutorial(){
        const modal = await this.modalCtrl.create({
            component: DebtTutorialComponent,
            enterAnimation: this.platform.width()>640?this.enterAnimation:undefined,
            leaveAnimation: this.platform.width()>640?this.leaveAnimation:undefined,
            backdropDismiss: true,
            cssClass: 'side-menu2'
        });
        modal.onWillDismiss().then(async (data)=>{
        })
        modal.present();
    }
    async ionViewDidEnter() {
        this.pageIonViewDidEnter();
    }
    accountDescription(id:any){
        let liability =  this.accountList?.filter((account)=>{return account.id==id});
        if (!liability) return '';
        return liability.length > 0 ? liability[0].description : '';
    }
    async pageIonViewDidEnter() {

    }
    ionViewWillLeave() {
        this.subscriptions.forEach(sub => {
            sub.unsubscribe();
        });
        this.balanceChangeSubscriptions.forEach(sub => {
            sub.unsubscribe();
        });
    }

    isMobileWidth() {
        return this.platform.width() < 576;
    }
}
