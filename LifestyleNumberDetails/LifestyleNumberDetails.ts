import {
    AfterViewInit,
    Component, ViewChild
} from '@angular/core';
import {
    AnimationController,
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
    ExportedClass as userService
} from '../scripts/custom/userService';
import {
    ExportedClass as TFreedomCalculator
} from '../scripts/custom/TFreedomCalculator';
import {
    ExportedClass as PlansService
} from '../scripts/custom/PlansService';
import {
    ExportedClass as TLifestyleCalculator
} from '../scripts/custom/TLifestyleCalculator';
import { Subscription } from 'rxjs';
import { updatedDiff } from 'deep-object-diff';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { LifestyleTutorialComponent } from '../components/lifestyle-tutorial/lifestyle-tutorial.component';

@Component({
    templateUrl: 'LifestyleNumberDetails.html',
    selector: 'page-lifestyle-number-details',
    styleUrls: ['LifestyleNumberDetails.scss']
})
export class LifestyleNumberDetails implements AfterViewInit{
    @ViewChild(BaseChartDirective) chartComponent: BaseChartDirective;
    legendData: any;
    public data: TLifestyleCalculator = {
        travel: 0,
        shopping: 0,
        entertainment: 0,
        other: 0,
        result: 0
    }
    public freedomNumberData: TFreedomCalculator = {
        housing: 0, 
        food: 0, 
        utilities: 0, 
        transportation: 0, 
        other: 0, 
        result: 0
    };
    public freedomNumberRounded: number = 0;
    public access: string = 'Free';
    public currentItem: any = null;
    public mappingData: any = {};
    public subscriptions: Subscription[] = [];
    public barChartLabels: string[] = [''];
    public chartColors: any[] = [
        { backgroundColor:"#F2F2F2"},
        { backgroundColor:"#FCD2D2"},
        { backgroundColor:"#FFA31A"},
        { backgroundColor:"#4D69FF"},
        { backgroundColor:"#333333"}
    ];
    public barChartType: ChartType = 'horizontalBar';
    public barChartLegend = true;
    public barChartData: ChartDataSets[] = [];
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
        tooltips:{enabled:false},
        scales: {
            xAxes: [
                {
                    display: false
                }
            ],
            yAxes: [
                {
                    display: false
                }
            ]
        },
        plugins: [],
      };
    public toggleIcon = false;
    saveToAccount() {
        const getUserSubscription = this.userSvc.getUser().subscribe(({ data: { user } }) => {
            const { travel, shopping, entertainment, otherLifestyle, resultLifestyle } = user;
            const userProperties = { travel, shopping, entertainment, other: otherLifestyle, result: resultLifestyle };
            if(typeof(this.data.travel) == 'string')
            {
                if(this.data.travel != null && this.data.travel != '')
                    this.data.travel = parseFloat((this.data.travel as String).replace(/,/g, ''));
                else
                    this.data.travel = 0;
            }
            if(typeof(this.data.entertainment) == 'string')
            {
                if(this.data.entertainment != null && this.data.entertainment != '')
                    this.data.entertainment = parseFloat((this.data.entertainment as String).replace(/,/g, ''));
                else
                    this.data.entertainment = 0;
            }
            if(typeof(this.data.shopping) == 'string')
            {
                if(this.data.shopping != null && this.data.shopping != '')
                    this.data.shopping = parseFloat((this.data.shopping as String).replace(/,/g, ''));
                else
                    this.data.shopping = 0;
            }
            if(typeof(this.data.other) == 'string')
            {
                if(this.data.other != null && this.data.other != '')
                    this.data.other = parseFloat((this.data.other as String).replace(/,/g, ''));
                else
                    this.data.other = 0;
            }
            const updatedUserProperties = updatedDiff(userProperties, this.data);

            if(updatedUserProperties['other'] || updatedUserProperties['other'] === 0) {
                updatedUserProperties['otherLifestyle'] = updatedUserProperties['other'];
                delete updatedUserProperties['other'];
            }

            if(updatedUserProperties['result']) {
                updatedUserProperties['resultLifestyle'] = updatedUserProperties['result'];
                delete updatedUserProperties['result'];
            }

            if(updatedUserProperties && Object.keys(updatedUserProperties).length) {
                Object.keys(updatedUserProperties).forEach(item => {
                    if(!updatedUserProperties[item]) {
                        updatedUserProperties[item] = 0;
                    }
                })
                // TODO change to remove setTimeout
                this.userSvc.updateUser(updatedUserProperties).then(() => {
                    setTimeout(() => {
                        this.goBack();
                    }, 1);
                }, err => {
                    console.error(err);
                    this.userSvc.toast("Error: Could not update Lifestyle Number Details");
                })
            } else {
                this.goBack();
            }
        })

        if(getUserSubscription) {
            this.subscriptions.push(getUserSubscription);
        }
    }
    constructor(public plansService: PlansService, public route: ActivatedRoute, public router: Router, public navCtrl: NavController, 
        public userSvc: userService, public animationCtrl: AnimationController, public modalCtrl: ModalController, public platform:Platform) {}
    calculate() {
        let freedomResult = this.freedomNumberData.result || 0;
        if(typeof(freedomResult) == 'string')
        {
            if(freedomResult != null && freedomResult != '')
                freedomResult = parseFloat((freedomResult as String).replace(/,/g, ''));
            else
                freedomResult = 0;
        }
        this.freedomNumberRounded = Math.round(freedomResult);
        let { travel, shopping, entertainment, other } = this.data;
        if(typeof(travel) == 'string')
        {
            if(travel != null && travel != '')
                travel = parseFloat((travel as String).replace(/,/g, ''));
            else
                travel = 0;
        }
        if(typeof(entertainment) == 'string')
        {
            if(entertainment != null && entertainment != '')
                entertainment = parseFloat((entertainment as String).replace(/,/g, ''));
            else
                entertainment = 0;
        }
        if(typeof(shopping) == 'string')
        {
            if(shopping != null && shopping != '')
                shopping = parseFloat((shopping as String).replace(/,/g, ''));
            else
                shopping = 0;
        }
        if(typeof(other) == 'string')
        {
            if(other != null && other != '')
                other = parseFloat((other as String).replace(/,/g, ''));
            else
                other = 0;
        }
        let result = 0;
        result += freedomResult;
        result += travel || 0;
        result += shopping || 0
        result += entertainment || 0;
        result += other || 0;
        this.data.result = result;
        const data = [
            {data:[Math.floor(((freedomResult || 0)/(result || 1) * 10) * 100) / 10], label: 'Freedom Number', stack: 'a',barPercentage: 1.0,categoryPercentage: 1.0},
            {data:[Math.floor(((travel || 0)/(result || 1) * 10) * 100) / 10], label: 'Travel', stack: 'a',barPercentage: 1.0,categoryPercentage: 1.0},
            {data:[Math.floor(((shopping || 0)/(result || 1) * 10) * 100) / 10], label: 'Shopping', stack: 'a',barPercentage: 1.0,categoryPercentage: 1.0},
            {data:[Math.floor(((entertainment || 0)/(result || 1) * 10) * 100) / 10], label: 'Entertainment', stack: 'a',barPercentage: 1.0,categoryPercentage: 1.0},
            {data:[Math.floor(((other || 0)/(result || 1) * 10) * 100) / 10], label: 'Other', stack: 'a',barPercentage: 1.0,categoryPercentage: 1.0},
        ];
        this.barChartData = data;
        this.legendData = this.chartComponent.chart.generateLegend();
    }
    ionViewWillEnter() {
        const getUserSubscription = this.userSvc.getUser().subscribe(({ data: { user } }) => {
            const { travel, shopping, entertainment, otherLifestyle, resultLifestyle, housing, food, utilities, transportation, otherFreedom, resultFreedom  } = user;
            this.data = Object.assign({}, { travel, shopping, entertainment, other: otherLifestyle, result: resultLifestyle });
            this.freedomNumberData = Object.assign({}, { housing, food, utilities, transportation, other: otherFreedom, result: resultFreedom });
        })
        this.calculate();

        if(getUserSubscription) {
            this.subscriptions.push(getUserSubscription);
        }
    }
    ngAfterViewInit(): void {
        const getUserSubscription = this.userSvc.getUser().subscribe(({ data: { user } }) => {
            const { travel, shopping, entertainment, otherLifestyle, resultLifestyle, housing, food, utilities, transportation, otherFreedom, resultFreedom  } = user;
            this.data = Object.assign({}, { travel, shopping, entertainment, other: otherLifestyle, result: resultLifestyle });
            this.freedomNumberData = Object.assign({}, { housing, food, utilities, transportation, other: otherFreedom, result: resultFreedom });
        })
        this.calculate();

        if(getUserSubscription) {
            this.subscriptions.push(getUserSubscription);
        }
    }
    goBack() {
        this.navCtrl.back();
    }
    createNewAccount() {
        this.navCtrl.navigateForward("accountDetails/new");
    }
    async freedomnumberClick(event ? , currentItem ? ) {
        let __aio_tmp_val__: any;
        /* Navigate to Page */
        this.router.navigate(['freedomnumberdetails']);
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
            component: LifestyleTutorialComponent,
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