import {
    Component, ElementRef
} from '@angular/core';
import {
    AnimationController,
    IonButton,
    IonContent,
    ModalController,
    NavController,
    Platform
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
    ExportedClass as TND2Calculator
} from '../scripts/custom/TND2Calculator';
import {
    ExportedClass as ND2Service
} from '../scripts/custom/ND2Service';
import {
    ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import _ from 'lodash';
import { CommonProvider } from '../utility/common';
import { Nd2TutorialComponent } from '../components/nd2-tutorial/nd2-tutorial.component';
import { AccountDetails } from '../AccountDetails/AccountDetails';
@Component({
    templateUrl: 'ND2Details.html',
    selector: 'page-n-d2-details',
    styleUrls: ['ND2Details.scss']
})
export class ND2Details {
    @ViewChild(BaseChartDirective) chartComponent: BaseChartDirective;
    @ViewChild('savebtn', { static:false }) savebtn: IonButton;
    @ViewChild('legendsItems') legendsItems: ElementRef;
    @ViewChild('myCanvas') canvasRef: ElementRef;
    @ViewChild('nd2content') cont: IonContent;
    legendData: any;
    public accountsDataLoadingPromise: Promise < any > ;
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
    public data: TND2Calculator;
    public nd2NumbersPromise: Promise < any > ;
    public access: string = 'Free';
    public t1AccountsList: TAccountList = [];
    public t2AccountsList: TAccountList = [];
    public t3AccountsList: TAccountList = [];
    public currentItem: any = null;
    public mappingData: any = {};
    public subscriptions: Subscription[] = [];
    public barChartType: ChartType = 'doughnut';
    public barChartLegend = true;
    public sumPercent = 0; 
    @ViewChild('j_808', {
        static: true
    }) public j_808;
    public toggleIcon = false;
    public toggleIconT1 = false;
    public toggleIconT2 = false;
    public toggleIconT3 = false;
    posY: number = 0;
    
    public graphColors = {
        '--graph-aero': '#66C6FF',
        '--graph-aquamarine': '#5CE593',
        '--graph-yellow': '#FFCF33',
    };
    private getLegendCallback = (function(self) {
        function handle(chart) {
            return chart.legend.legendItems;
        }
        return function(chart) {
            return handle(chart);
        };
    })(this);
    public nd2ChartMeta = {
        datasets : [{
            data:[],
            backgroundColor: [
                this.graphColors['--graph-aero'], this.graphColors['--graph-aquamarine'], this.graphColors['--graph-yellow']
            ],
            borderColor: [
                this.graphColors['--graph-aero'], this.graphColors['--graph-aquamarine'], this.graphColors['--graph-yellow']
            ],
            borderWidth: 1
        }],
        labels: ['T1 Liquidity', 'T2 Cash Flow Assets', 'T3 Speculations'],
        options: {
            cutoutPercentage: 80,
            legend: {
                position: 'right',
                display: false
            },
            responsive: true,
            maintainAspectRatio:false,
            legendCallback: this.getLegendCallback,
            tooltips:{
                enabled:true,
                bodyFontSize: this.platform.width()>640?15:10,
                callbacks: {
                    label:(tooltipItem, data) => {
                        const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
                        return  [`${datasetLabel} ${data.labels[tooltipItem.index]}:`];        
                        },
                    afterLabel: (tooltipItem, data) => {          
                    const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
                    return  [` $ ${this.common.numberWithCommas(Math.round(this.accountsSummary.totalWealthAccount * +data.datasets[0].data[tooltipItem.index] / 100))} (${data.datasets[0].data[tooltipItem.index].toFixed(1)}%)`];        
                    }
                }
                           
            },
            
        }
    }
    async calculate(prop?:any) {
        let { t1Target, t2Target, t3Target} = this.data;
        if(typeof(t1Target) == 'string')
        {
            if(t1Target != null || t1Target != '')
                t1Target = parseFloat((t1Target as String).replace(/,/g, ''));
            else
                t1Target = 0;
        }
        if(typeof(t2Target) == 'string')
        {
            if(t2Target != null || t2Target != '')
                t2Target = parseFloat((t2Target as String).replace(/,/g, ''));
            else
                t2Target = 0;
        }
        if(typeof(t3Target) == 'string')
        {
            if(t3Target != null || t3Target != '')
                t3Target = parseFloat((t3Target as String).replace(/,/g, ''));
            else
                t3Target = 0;
        }
        let sumOfPercents = 0;
        sumOfPercents += t1Target || 0;
        sumOfPercents += t2Target || 0;
        sumOfPercents += t3Target || 0;
        // this.barChartLabels = ['T1 Liquidity','T2 Cash Flow Assets','T3 Speculations'];
        // let data=[t1Target || 0, t2Target || 0, t3Target || 0]
        this.sumPercent = sumOfPercents;
        // this.barChartData = [{data}];
        // let generateLegends=_.debounce(()=>{
        //     this.legendData = this.chartComponent.chart.generateLegend();
        //     let setChartHeight=_.debounce(()=>{
        //         this.canvasRef.nativeElement.style.height= this.legendsItems.nativeElement.offsetHeight + 'px';
        //     },250,{'trailing': true});
        //     setChartHeight();
        // },250,{'trailing': true});
        // generateLegends();
    }
    saveToAccount() {
        let sum = 0;
        if(typeof(this.data.t1Target) == 'string')
        {
            if(this.data.t1Target != null || this.data.t1Target != '')
                this.data.t1Target = parseFloat((this.data.t1Target as String).replace(/,/g, ''));
            else
                this.data.t1Target = 0;
        }
        if(typeof(this.data.t2Target) == 'string')
        {
            if(this.data.t2Target != null || this.data.t2Target != '')
                this.data.t2Target = parseFloat((this.data.t2Target as String).replace(/,/g, ''));
            else
                this.data.t2Target = 0;
        }
        if(typeof(this.data.t3Target) == 'string')
        {
            if(this.data.t3Target != null || this.data.t3Target != '')
                this.data.t3Target = parseFloat((this.data.t3Target as String).replace(/,/g, ''));
            else
                this.data.t3Target = 0;
        }
        sum += this.data.t1Target + this.data.t2Target + this.data.t3Target;
        if (sum > 100 || sum < 100) {
            alert("Please make sure the target percentages add up to 100%");
        } else {
            this.userSvc.updateUser({ 
                t1Target: this.data.t1Target || 0, 
                t2Target: this.data.t2Target || 0, 
                t3Target: this.data.t3Target || 0 
            }).then(() => {
                this.navCtrl.navigateBack("/dashboard");
            })
        }
    }
    constructor(public route: ActivatedRoute, public router: Router, public navCtrl: NavController, public userSvc: userService, 
        public accountsService: AccountsService, public nd2Service: ND2Service, public common: CommonProvider,
        public platform: Platform, public modalCtrl: ModalController, public animationCtrl:AnimationController) {
        this.data = {
            // _id: '',
            t1Target: 0,
            t2Target: 0,
            t3Target: 0
        };
        let toggleSubscribe = this.userSvc.toggleBalance.subscribe((res)=>{
            this.balanceSheetChange();
        })
        if(toggleSubscribe) {
            this.subscriptions.push(toggleSubscribe);
        }
    }
    balanceSheetChange(){
        const getAccountsSubscription = this.accountsService.getAccounts(true).subscribe(res => {                
            this.accountList = this.accountsService.accounts;
            this.accountList.map((a) => {
                if (a.parentHoldingId && a.accountType === 'Asset') {
                    a.parent = this.accountsService.getAccount(a.parentHoldingId);
                }
                return a;
            })
                this.accountsSummary = this.accountsService.accountsSummary;
                this.t1AccountsList = [];
                this.t2AccountsList = [];
                this.t3AccountsList = [];
                this.accountList.forEach(account => {
                    if (account.accountType === 'Asset') {
                        if ((account.assetType === 'C' || account.assetType === 'DA') && (account.liquidityChaosHedge)) {
                            this.t1AccountsList.push(account);
                        }
                        if (account.assetType === 'CFA') {
                            this.t2AccountsList.push(account);
                        }
                        if (account.assetType === 'AA') {
                            this.t3AccountsList.push(account);
                        }
                    }
                });
                let currentT1 = this.accountsSummary.totalWealthAccount ? +((100 * (this.accountsSummary.tier1 / this.accountsSummary.totalWealthAccount))): 0
                let currentT2 = this.accountsSummary.totalWealthAccount ? +((100 * (this.accountsSummary.tier2 / this.accountsSummary.totalWealthAccount))): 0
                let currentT3 = this.accountsSummary.totalWealthAccount ? +((100 * (this.accountsSummary.tier3 / this.accountsSummary.totalWealthAccount))): 0
                let data=[currentT1, currentT2, currentT3]
                this.nd2ChartMeta.datasets[0].data = data;
                let generateLegends=_.debounce(()=>{
                    this.legendData = this.chartComponent.chart.generateLegend();
                    let setChartHeight=_.debounce(()=>{
                        this.canvasRef.nativeElement.style.height= this.legendsItems.nativeElement.offsetHeight + 'px';
                    },250,{'trailing': true});
                    setChartHeight();
                },250,{'trailing': true});
                generateLegends();
            },
            (err: any) => {
                console.error(err);
            }
        );
        if(getAccountsSubscription) {
            this.subscriptions.push(getAccountsSubscription);
        }
    }
    ionViewWillEnter(){
        const getUserSubscription = this.userSvc.getUser().subscribe(({ data: { user } }) => {
            const { t1Target, t2Target, t3Target } = user;

            const targetValuesNotNullOrUndefined = !this.checkIsNullOrUndefined([t1Target, t2Target, t3Target]).length;

            if(targetValuesNotNullOrUndefined) {
                this.data.t1Target = t1Target;
                this.data.t2Target = t2Target;
                this.data.t3Target = t3Target;
            } else {
                this.data.t1Target = 10;
                this.data.t2Target = 70;
                this.data.t3Target = 20;
            }
            this.calculate();
        })

        const getAccountsSubscription = this.accountsService.getAccounts(true).subscribe(res => {                
            this.accountList = this.accountsService.accounts;
            this.accountList.map((a) => {
                if (a.parentHoldingId && a.accountType === 'Asset') {
                    a.parent = this.accountsService.getAccount(a.parentHoldingId);
                }
                return a;
            })
                this.accountsSummary = this.accountsService.accountsSummary;
                this.t1AccountsList = [];
                this.t2AccountsList = [];
                this.t3AccountsList = [];
                this.accountList.forEach(account => {
                    if (account.accountType === 'Asset') {
                        if ((account.assetType === 'C' || account.assetType === 'DA') && (account.liquidityChaosHedge)) {
                            this.t1AccountsList.push(account);
                        }
                        if (account.assetType === 'CFA') {
                            this.t2AccountsList.push(account);
                        }
                        if (account.assetType === 'AA') {
                            this.t3AccountsList.push(account);
                        }
                    }
                });
                let currentT1 = this.accountsSummary.totalWealthAccount ? +((100 * (this.accountsSummary.tier1 / this.accountsSummary.totalWealthAccount))): 0
                let currentT2 = this.accountsSummary.totalWealthAccount ? +((100 * (this.accountsSummary.tier2 / this.accountsSummary.totalWealthAccount))): 0
                let currentT3 = this.accountsSummary.totalWealthAccount ? +((100 * (this.accountsSummary.tier3 / this.accountsSummary.totalWealthAccount))): 0
                let data=[currentT1, currentT2, currentT3]
                this.nd2ChartMeta.datasets[0].data = data;
                let generateLegends=_.debounce(()=>{
                    this.legendData = this.chartComponent.chart.generateLegend();
                    let setChartHeight=_.debounce(()=>{
                        this.canvasRef.nativeElement.style.height= this.legendsItems.nativeElement.offsetHeight + 'px';
                    },250,{'trailing': true});
                    setChartHeight();
                },250,{'trailing': true});
                generateLegends();
            },
            (err: any) => {
                console.error(err);
            }
        );

        if(getUserSubscription) {
            this.subscriptions.push(getUserSubscription);
        }

        if(getAccountsSubscription) {
            this.subscriptions.push(getAccountsSubscription);
        }
    }
    goBack() {
        this.navCtrl.back();
    }
    createNewAccount() {
        this.navCtrl.navigateForward("accountDetails/new");
    }
    checkIsNullOrUndefined(values) {
        return values.filter(value => value == null || value == undefined);
    }
    ionViewWillLeave() {
        this.subscriptions.forEach(sub => {
            sub.unsubscribe();
        })
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
    async openTutorial(){
        const modal = await this.modalCtrl.create({
            component: Nd2TutorialComponent,
            enterAnimation: this.platform.width()>640?this.enterAnimation:undefined,
            leaveAnimation: this.platform.width()>640?this.leaveAnimation:undefined,
            backdropDismiss: true,
            cssClass: 'side-menu2'
        });
        let subscriptionBalance;
        modal.onWillDismiss().then(async (data)=>{
        })
        modal.present();
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
        modal.onDidDismiss().then(async (data) => {
        })
        modal.present();
    }

    async scrollEnd() {
        const el = await this.cont.getScrollElement();
		this.posY = el.scrollTop;
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

    toggleList(ionItem: any, toggleIcon: boolean) {
        toggleIcon=!toggleIcon;
        var content = ionItem.el.nextElementSibling;
        if (content.style.maxHeight){
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = '100%';
        }
    }
}