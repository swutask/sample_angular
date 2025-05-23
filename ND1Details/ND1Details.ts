import {
    Component, ElementRef, ViewChild
} from '@angular/core';
import {
    AlertController,
    AnimationController,
    IonButton,
    IonInput,
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
    ExportedClass as TND1Calculator
} from '../scripts/custom/TND1Calculator';
import {
    ExportedClass as ND1Service
} from '../scripts/custom/ND1Service';
import {
    ExportedClass as DebtPayoffService
} from '../scripts/custom/DebtPayoffService';
import {
    ExportedClass as CompoundReturnService
} from '../scripts/custom/CompoundReturnService';
import {
    ExportedClass as TCompoundReturn
} from '../scripts/custom/TCompoundReturn';
import _ from 'lodash';
import {
    ExportedClass as BalanceSheetService
} from '../scripts/custom/BalanceSheetService';
import { updatedDiff } from 'deep-object-diff';
import { Subscription } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Nd1TutorialComponent } from '../components/nd1-tutorial/nd1-tutorial.component';
import { CommonProvider } from '../utility/common';

@Component({
    templateUrl: 'ND1Details.html',
    selector: 'page-n-d1-details',
    styleUrls: ['ND1Details.scss']
})
export class ND1Details {
    @ViewChild(BaseChartDirective) chartComponent: BaseChartDirective;
    @ViewChild('accountLabelInput') accountLabelInput: IonInput;
    @ViewChild('accountPercentInput', { read: ElementRef }) accountPercentInput: ElementRef;
    @ViewChild('savebtn', { static:false }) savebtn: IonButton;
    @ViewChild('legendsItems') legendsItems: ElementRef;
    @ViewChild('myCanvas') canvasRef: ElementRef;
    legendData: any;
    public data: TND1Calculator;
    public nd1NumbersPromise: Promise < any > ;
    public earnedIncomePromise: Promise < any > ;
    public access: string = 'Free';
    public compoundReturnData: TCompoundReturn;
    public compoundReturnPromise: Promise < any > ;
    public accountList: TAccountList;
    public accountsDataLoadingPromise: Promise < any > ;
    public customAccountsLimit: number = 10;
    public currentItem: any = null;
    public mappingData: any = {};
    public subscriptions: Subscription[] = [];
    public barChartType: ChartType = 'doughnut';
    public barChartLegend = true;
    public barChartValues = [];
    public sumPercent = 0; 
    public toggleIcon = false;
    public graphColors = {
        '--graph-aero': '#66C6FF',
        '--graph-yellow': '#FFCF33',
        '--graph-aquamarine': '#5CE593',
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
    private getLegendCallback = (function(self) {
        function handle(chart) {
            return chart.legend.legendItems;
        }
        return function(chart) {
            return handle(chart);
        };
    })(this);
    public nd1ChartMeta = {
        datasets : [{
            data:[],
            backgroundColor: [
              this.graphColors['--graph-aero'], this.graphColors['--graph-yellow'], this.graphColors['--graph-aquamarine'], this.graphColors['--graph-red-crayola'], this.graphColors['--graph-jet'], this.graphColors['--graph-dim-gray'], this.graphColors['--graph-purple-silver'], this.graphColors['--graph-silver'], this.graphColors['--graph-green-silver'], this.graphColors['--graph-blue-silver'], this.graphColors['--graph-light-gray'], this.graphColors['--graph-grey'], this.graphColors['--graph-cultured'], this.graphColors['--graph-ivory'],
            ],
            borderColor: [
                this.graphColors['--graph-aero'], this.graphColors['--graph-yellow'], this.graphColors['--graph-aquamarine'], this.graphColors['--graph-red-crayola'], this.graphColors['--graph-jet'], this.graphColors['--graph-dim-gray'], this.graphColors['--graph-purple-silver'], this.graphColors['--graph-silver'], this.graphColors['--graph-green-silver'], this.graphColors['--graph-blue-silver'], this.graphColors['--graph-light-gray'], this.graphColors['--graph-grey'], this.graphColors['--graph-cultured'], this.graphColors['--graph-ivory'],
            ],
            borderWidth: 1
        }],
        labels: ['Bills', 'Giving', 'Wealth', 'Debt Accelerator'],
        options: {
            cutoutPercentage: 80,
            legend: {
                position: 'right',
                display: false
            },
            legendCallback: this.getLegendCallback,
            responsive: true,
            maintainAspectRatio:false,
            tooltips:{
                enabled:true,
                bodyFontSize: 15,
                callbacks: {
                    label:(tooltipItem, data) => {
                        const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
                        return  [`${datasetLabel} ${data.labels[tooltipItem.index]}:`];        
                        },
                    afterLabel: (tooltipItem, data) => {          
                    const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
                    return  [` $ ${this.common.numberWithCommas(Math.round(this.earnedIncome * +data.datasets[0].data[tooltipItem.index] / 100))} (${data.datasets[0].data[tooltipItem.index]}%)`];        
                    }
                }
            
            },
            
        }
      }
      accountLabel=''
      accountPercent=0;
      
    constructor(public alertController: AlertController, public route: ActivatedRoute, 
        public router: Router, public navCtrl: NavController, public userSvc: userService, 
        public nd1Service: ND1Service, public debtPayoffService: DebtPayoffService, public common: CommonProvider,
        public compoundReturnService: CompoundReturnService, public accountsService: AccountsService, 
        public balanceSheetService: BalanceSheetService, public modalController: ModalController,
        public animationCtrl:AnimationController, public modalCtrl:ModalController, public platform:Platform) {
        this.data = {
            // _id: '',
            giving: 0,
            wealth: 0,
            debt: 0,
            living: 0,
            earnedIncome: 0,
            customAccounts: []
        };
        this.compoundReturnData = {
            // _id: null,
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
    }
    saveToAccount() {
        let sum = 0;
        sum += this.giving + this.wealth + this.debt + this.living + _.sumBy(this.customAccounts, 'value');
        if (sum !== 100) {
            alert('Please make sure the percentages add up to 100%');
        } else {
            const getUserSubscription = this.userSvc.getUser().subscribe(({ data: { user } }) => {
                if(typeof(this.data.living) == 'string')
                {
                    if(this.data.living != null || this.data.living != '')
                        this.data.living = parseFloat((this.data.living as String).replace(/,/g, ''));
                    else
                        this.data.living = 0;
                }
                if(typeof(this.data.giving) == 'string')
                {
                    if(this.data.giving != null || this.data.giving != '')
                        this.data.giving = parseFloat((this.data.giving as String).replace(/,/g, ''));
                    else
                        this.data.giving = 0;
                }
                if(typeof(this.data.wealth) == 'string')
                {
                    if(this.data.wealth != null || this.data.wealth != '')
                        this.data.wealth = parseFloat((this.data.wealth as String).replace(/,/g, ''));
                    else
                        this.data.wealth = 0;
                }
                if(typeof(this.data.debt) == 'string')
                {
                    if(this.data.debt != null || this.data.debt != '')
                        this.data.debt = parseFloat((this.data.debt as String).replace(/,/g, ''));
                    else
                        this.data.debt = 0;
                }
                for(let account of this.data.customAccounts){
                    if(typeof(account.value) == 'string')
                    {
                        if(account.value != null || account.value != '')
                            account.value = parseFloat((account.value as String).replace(/,/g, ''));
                        else
                            account.value = 0;
                    }
                }
                const userUpdatedProperties = updatedDiff(user, this.data);
                const customAccountsChanged = !(_.isEqual(user.customAccounts, this.data.customAccounts));
                if(customAccountsChanged) {
                    userUpdatedProperties['customAccounts'] = this.data.customAccounts;
                }

                if(userUpdatedProperties) {
                    this.userSvc.updateUser(userUpdatedProperties).then(res => {
                        if (this.compoundReturnData.useND1WealthValue && this.earnedIncome && this.data.wealth) {
                            this.compoundReturnData.monthlyEarnedIncome = this.earnedIncome * this.data.wealth / 100;
                        }
    
                        const assets = this.accountList.filter(a => a.accountType === 'Asset');
                        const nonExcludedAssets = assets.filter(a => !a.excludeFromCompoundReturnCalc);
                        const assetsWithNoInvestmentType = nonExcludedAssets.filter(a => !a.investmentType);
                        const everyAssetHasInvestmentType = assetsWithNoInvestmentType.length === 0;
    
                        this.balanceSheetService.getActive().subscribe(res => {
                            if (everyAssetHasInvestmentType) {
                                let balanceSheetUpdatedProperties = updatedDiff(res, this.compoundReturnData);
                                if(balanceSheetUpdatedProperties && Object.keys(balanceSheetUpdatedProperties).length) {
                                    this.balanceSheetService.updateBalanceSheet(balanceSheetUpdatedProperties, {...res, ...balanceSheetUpdatedProperties}).subscribe(res => {

                                    }, (err: any) => {
                                        console.error(err);
                                        this.userSvc.toast(err.error && err.error.message ? err.error.message : "Error while updating compound return chart");
                                    })
                                }
                            }
                        });
                },
                (err: any) => {
                    console.error(err);
                    this.userSvc.toast(err.error && err.error.message ? err.error.message : "Data save error");
                })}
            })
            
            if(getUserSubscription) {
                this.subscriptions.push(getUserSubscription);
            }
            
            this.navCtrl.back();
        }
    }
    wealth: any; giving: any; debt: any; living: any; customAccounts: any; earnedIncome: any;
    async calculate(prop?:any) {
        let { wealth, giving, debt, living, customAccounts } = this.data;
        if(typeof(living) == 'string')
        {
            if(living != null || living != '')
                living = parseFloat((living as String).replace(/,/g, ''));
            else
                living = 0;
        }
        if(typeof(giving) == 'string')
        {
            if(giving != null || giving != '')
                giving = parseFloat((giving as String).replace(/,/g, ''));
            else
                giving = 0;
        }
        if(typeof(wealth) == 'string')
        {
            if(wealth != null || wealth != '')
                wealth = parseFloat((wealth as String).replace(/,/g, ''));
            else
                wealth = 0;
        }
        if(typeof(debt) == 'string')
        {
            if(debt != null || debt != '')
                debt = parseFloat((debt as String).replace(/,/g, ''));
            else
                debt = 0;
        }
        for(let account of customAccounts){
            if(typeof(account.value) == 'string')
            {
                if(account.value != null || account.value != '')
                    account.value = parseFloat((account.value as String).replace(/,/g, ''));
                else
                    account.value = 0;
            }
        }
        this.wealth = wealth; this.giving = giving; this.debt = debt; this.living = living;
        this.customAccounts = customAccounts;
        let sumOfPercents = 0;
        sumOfPercents += wealth || 0;
        sumOfPercents += giving || 0;
        sumOfPercents += debt || 0;
        sumOfPercents += living ||  0;
        this.nd1ChartMeta.labels = ['Bills', 'Giving', 'Wealth', 'Debt Accelerator'];
        this.nd1ChartMeta.datasets[0].data = [living  || 0, giving || 0, wealth  || 0, debt || 0];
        this.barChartValues = [living  || 0, giving || 0, wealth  || 0, debt || 0]; 
        for(let custom of customAccounts){
            this.nd1ChartMeta.labels.push(custom.label);
            this.nd1ChartMeta.datasets[0].data.push(custom.value);
            this.barChartValues.push(custom.value);
            sumOfPercents += custom.value || 0;
        }
        this.sumPercent = sumOfPercents;

        let generateLegends=_.debounce(()=>{
            this.legendData = this.chartComponent.chart.generateLegend();
            let setChartHeight=_.debounce(()=>{
                this.canvasRef.nativeElement.style.height= this.legendsItems.nativeElement.offsetHeight + 'px';
            },500,{'trailing': true});
            setChartHeight();
        },500,{'trailing': true});
        generateLegends();
    }
    async addCustomAccount() {
        let customAccount={value: Number(this.accountPercent),label:this.accountLabel,__typename:"CustomAccountType"};
        this.data.customAccounts.push(customAccount);
        this.accountLabel=''
        this.accountPercent=0;
        await this.modalDismiss();
        this.calculate();
    }
    removeCustomAccount(label) {
        this.data.customAccounts.splice(this.data.customAccounts.findIndex(i => i.label === label), 1);
        this.calculate();
    }
    openGoals() {
        this.navCtrl.navigateForward("goals");
    }
    goBack() {
        this.navCtrl.back();
    }
    createNewAccount() {
        this.navCtrl.navigateForward("accountDetails/new");
    }
    ionViewWillEnter() {
        const getUserSubscription = this.userSvc.getUser().subscribe(({ data: { user } }) => {
            this.data.earnedIncome = user.currentEarnedIncome || 0;
            this.earnedIncome = user.currentEarnedIncome || 0;
            if(!user.giving && !user.wealth && !user.debt && !user.living) {
                this.data.giving = 10;
                this.data.wealth = 10;
                this.data.debt = 10;
                this.data.living = 70;
            } else {
                this.data.giving = user.giving || 0;
                this.data.wealth = user.wealth || 0;
                this.data.debt = user.debt || 0;
                this.data.living = user.living || 0;
            }
            
            this.data.customAccounts = user.customAccounts && user.customAccounts.length ? _.cloneDeep(user.customAccounts) : [];
        })

        const getBalanceSheetsSubscription = this.balanceSheetService.getBalanceSheets().subscribe(() => {
            this.balanceSheetService.getActive().subscribe(res => {
                if(res) {
                    const { 
                        monthlyEarnedIncome, 
                        monthlyUnearnedIncome,
                        annualContribution,
                        annualIncreaseContribution,
                        annualWithdrawal,
                        withdrawalStartingYear,
                        volatilityDrawdown,
                        everyNumberYears,
                        yearsInvested,
                        useND1WealthValue,
                        useUnearnedIncomeValues
                    } = res;
                    
                    this.compoundReturnData = {
                        monthlyEarnedIncome, 
                        monthlyUnearnedIncome,
                        annualContribution,
                        annualIncreaseContribution,
                        annualWithdrawal,
                        withdrawalStartingYear,
                        volatilityDrawdown,
                        everyNumberYears,
                        yearsInvested,
                        useND1WealthValue,
                        useUnearnedIncomeValues
                    };
                }
            })
        })

        const getAccountsSubscription = this.accountsService.getAccounts().subscribe(res => {
                this.accountList = this.accountsService.accounts;
            },
            (err: any) => {
                console.error(err);
            }
        );

        if(getBalanceSheetsSubscription) {
            this.subscriptions.push(getBalanceSheetsSubscription);
        }

        if(getAccountsSubscription) {
            this.subscriptions.push(getBalanceSheetsSubscription);
        }

        if(getUserSubscription) {
            this.subscriptions.push(getUserSubscription);
        }
    }
    ionViewWillLeave() {
        this.subscriptions.forEach(sub => {
            sub.unsubscribe();
        })
    }
    async modalDismiss(){
        try{
        await this.modalController.dismiss();
        await this.modalController.dismiss();
        }catch(e){
            console.error(e);
        }finally{
            this.accountLabel='';
            this.accountPercent=0;
        }
    }

    customChnage(){
        if(this.accountPercent>0&&this.accountLabel.length>0){
            this.savebtn.disabled = false;
        }
        else
            this.savebtn.disabled = true;
    }

    bluractive(){
        var activeElement = document.activeElement as HTMLElement;
        activeElement.blur();
        let setFocus = _.debounce(()=>{
            this.accountLabelInput.setFocus();
        },1000,{'trailing': true});
        setFocus();
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
            component: Nd1TutorialComponent,
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
}