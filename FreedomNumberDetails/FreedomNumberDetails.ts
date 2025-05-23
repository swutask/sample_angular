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
    Subscription 
} from 'rxjs';
import { 
    updatedDiff 
} from 'deep-object-diff';
import { 
    ChartDataSets, ChartOptions, ChartType 
} from 'chart.js';
import { 
    BaseChartDirective 
} from 'ng2-charts';
import { FreedomTutorialComponent } from '../components/freedom-tutorial/freedom-tutorial.component';

@Component({
    templateUrl: 'FreedomNumberDetails.html',
    selector: 'page-freedom-number-details',
    styleUrls: ['FreedomNumberDetails.scss']
})
export class FreedomNumberDetails implements AfterViewInit{
    @ViewChild(BaseChartDirective) chartComponent: BaseChartDirective;
    legendData: any;
    public data: TFreedomCalculator = {
        housing: 0, 
        food: 0, 
        utilities: 0, 
        transportation: 0, 
        other: 0, 
        result: 0
    };
    public access: string = 'Free';
    public currentItem: any = null;
    public mappingData: any = {};
    public subscriptions: Subscription[] = [];
    public barChartLabels: string[] = [''];
    public chartColors: any[] = [
        { backgroundColor:"#66C6FF"},
        { backgroundColor:"#5CE593"},
        { backgroundColor:"#FFCF33"},
        { backgroundColor:"#675CE5"},
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
    constructor(public plansService: PlansService, public route: ActivatedRoute, public router: Router, 
        public navCtrl: NavController, public userSvc: userService, public modalCtrl:ModalController, public platform:Platform,
        public animationCtrl:AnimationController) { }
    calculate() {
      let { housing, food, utilities, transportation, other } = this.data;
      if(typeof(housing) == 'string')
      {
          if(housing != null && housing != '')
              housing = parseFloat((housing as String).replace(/,/g, ''));
          else
              housing = 0;
      }
      if(typeof(food) == 'string')
      {
          if(food != null && food != '')
              food = parseFloat((food as String).replace(/,/g, ''));
          else
              food = 0;
      }
      if(typeof(transportation) == 'string')
      {
          if(transportation != null && transportation != '')
              transportation = parseFloat((transportation as String).replace(/,/g, ''));
          else
              transportation = 0;
      }
      if(typeof(utilities) == 'string')
      {
          if(utilities != null && utilities != '')
              utilities = parseFloat((utilities as String).replace(/,/g, ''));
          else
              utilities = 0;
      }
      if(typeof(other) == 'string')
      {
          if(other != null && other != '')
              other = parseFloat((other as String).replace(/,/g, ''));
          else
              other = 0;
      }
      let result = 0;
      result += housing || 0;
      result += food || 0;
      result += utilities || 0;
      result += transportation || 0;
      result += other || 0;
      this.data.result = result;
        const data = [
            {data:[Math.floor(((housing || 0)/(result || 1) * 10) * 100) / 10], label: 'Housing', stack: 'a',barPercentage: 1.0,categoryPercentage: 1.0},
            {data:[Math.floor(((food || 0)/(result || 1) * 10) * 100) / 10], label: 'Food', stack: 'a',barPercentage: 1.0,categoryPercentage: 1.0},
            {data:[Math.floor(((utilities || 0)/(result || 1) * 10) * 100) / 10], label: 'Utilities', stack: 'a',barPercentage: 1.0,categoryPercentage: 1.0},
            {data:[Math.floor(((transportation || 0)/(result || 1) * 10) * 100) / 10], label: 'Transportation', stack: 'a',barPercentage: 1.0,categoryPercentage: 1.0},
            {data:[Math.floor(((other || 0)/(result || 1) * 10) * 100) / 10], label: 'Other', stack: 'a',barPercentage: 1.0,categoryPercentage: 1.0},
        ];
        this.barChartData = data;
        this.legendData = this.chartComponent.chart.generateLegend();
    }
    saveToAccount() {
        const getUserSubscription = this.userSvc.getUser().subscribe(({ data: { user } }) => {
            const { housing, food, utilities, transportation, otherFreedom, resultFreedom } = user;
            const userProperties = { housing, food, utilities, transportation, other: otherFreedom, result: resultFreedom };
            if(typeof(this.data.housing) == 'string')
            {
                if(this.data.housing != null && this.data.housing != '')
                    this.data.housing = parseFloat((this.data.housing as String).replace(/,/g, ''));
                else
                    this.data.housing = 0;
            }
            if(typeof(this.data.food) == 'string')
            {
                if(this.data.food != null && this.data.food != '')
                    this.data.food = parseFloat((this.data.food as String).replace(/,/g, ''));
                else
                    this.data.food = 0;
            }
            if(typeof(this.data.transportation) == 'string')
            {
                if(this.data.transportation != null && this.data.transportation != '')
                    this.data.transportation = parseFloat((this.data.transportation as String).replace(/,/g, ''));
                else
                    this.data.transportation = 0;
            }
            if(typeof(this.data.utilities) == 'string')
            {
                if(this.data.utilities != null && this.data.utilities != '')
                    this.data.utilities = parseFloat((this.data.utilities as String).replace(/,/g, ''));
                else
                    this.data.utilities = 0;
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
                updatedUserProperties['otherFreedom'] = updatedUserProperties['other'];
                delete updatedUserProperties['other'];
            }

            if(updatedUserProperties['result']) {
                updatedUserProperties['resultFreedom'] = updatedUserProperties['result'];
                delete updatedUserProperties['result'];
            }
            
            if(updatedUserProperties && Object.keys(updatedUserProperties).length) {
                Object.keys(updatedUserProperties).forEach(item => {
                    if(!updatedUserProperties[item]) {
                        updatedUserProperties[item] = 0;
                    }
                })
                this.userSvc.updateUser(updatedUserProperties).then(() => {
                    // TODO change to remove setTimeout
                    setTimeout(() => {
                        this.goBack();
                    }, 1);
                }, err => {
                    console.error(err);
                    this.userSvc.toast("Error: Could not update Freedom Number Details");
                })
            } else {
                this.goBack();
            }
        })

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

    ionViewWillEnter() {
        const getUserSubscription = this.userSvc.getUser().subscribe(({ data: { user } }) => {
            const { housing, food, utilities, transportation, otherFreedom, resultFreedom } = user;
            this.data = Object.assign({}, { housing, food, utilities, transportation, other: otherFreedom, result: resultFreedom });
            this.calculate()
        })

        if(getUserSubscription) {
            this.subscriptions.push(getUserSubscription);
        }
    }

    ngAfterViewInit(): void {
        const getUserSubscription = this.userSvc.getUser().subscribe(({ data: { user } }) => {
            const { housing, food, utilities, transportation, otherFreedom, resultFreedom } = user;
            this.data = Object.assign({}, { housing, food, utilities, transportation, other: otherFreedom, result: resultFreedom });
            this.calculate()
        })

        if(getUserSubscription) {
            this.subscriptions.push(getUserSubscription);
        }
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
            component: FreedomTutorialComponent,
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