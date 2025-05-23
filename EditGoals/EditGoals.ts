import {
    AfterViewInit,
    Component, ViewChild
} from '@angular/core';
import {
    ActionSheetController, AnimationController, IonButton, IonContent, IonInput, MenuController, ModalController, Platform
} from '@ionic/angular';
import {
    NavController
} from '@ionic/angular';
import {
    ExportedClass as userService
} from '../scripts/custom/userService';
import {
    ExportedClass as goalConstants
} from '../scripts/custom/goalConstants';
import {
    ExportedClass as PlansService
} from '../scripts/custom/PlansService';
import {
    ExportedClass as UserGoalsService
} from '../scripts/custom/UserGoalsService';
import {
    ExportedClass as DebtPayoffService
} from '../scripts/custom/DebtPayoffService';
import {
    UntypedFormBuilder
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { updatedDiff } from 'deep-object-diff';
import { GoalsTutorialComponent } from '../components/goals-tutorial/goals-tutorial.component';
import { ActivatedRoute, Router } from '@angular/router';
import _ from 'lodash';
import { NgxMaskService } from 'ngx-mask';
import { take } from 'rxjs/operators';

@Component({
    templateUrl: 'EditGoals.html',
    selector: 'page-edit-goals',
    styleUrls: ['EditGoals.scss']
})
export class EditGoals implements AfterViewInit{
    @ViewChild('contentgoals') 
    public contentgoals:IonContent;
    @ViewChild('savebtn', { static:false }) savebtn: IonButton;
    @ViewChild('goalLabelInput') goalLabelInput: IonInput;
    public bioForm: any;
    public message: string = '';
    public goals = [];
    public customGoals = [];
    public customGoalsLimit: number = 10;
    public currentGoal: any;
    public goalConstants: any = goalConstants;
    public goalsAlertOptions: any = {
        cssClass: 'goals-alert',
        alignment: "center",
        showBackdrop: true,
        reference: "event"
    };
    public currentItem: any = null;
    public mappingData: any = {};
    public freedomNumber;
    public lifestyleNumber;
    public subscriptions: Subscription[] = [];
    public toggleIcon = false;
    public userAvatar: string;
    getSignedUrlSubscription: Subscription;

    public actionSheetOptions:any = {
        cssClass:'goals-alert'
    }
    

    public popoverSheetOptions: any = {
        side: 'bottom',
        size: 'cover',
        cssClass:'full-width-option'

    };
    goalLabel = '';
    goalValue = 0;
    openCustom = false;


    constructor(public fb: UntypedFormBuilder, public userSvc: userService, public route:ActivatedRoute,
        public actionSheetController: ActionSheetController, public plansService: PlansService, 
        public navCtrl: NavController, public userGoalsService: UserGoalsService, public router: Router,
        public debtPayoffService: DebtPayoffService, public menuController: MenuController,public modalCtrl:ModalController, 
        public platform:Platform, public animationCtrl:AnimationController, private maskService: NgxMaskService,) { }
    
    ngAfterViewInit(): void {
        this.route.queryParams.subscribe((params) => {  
            let navParams = this.router.getCurrentNavigation().extras.state;
            if(navParams?.legacy){
                let scroll = _.debounce(()=>{
                    this.contentgoals.scrollToBottom(300);
                },450);
                scroll();
            }
        });
    }

    // Copied from userGoalsService
    private transformGoals(goalsEntities) {
        return goalConstants.goals.map(goal => {
            return (goal.type === 'select') ? {
                name: goal.name,
                label: goal.label,
                type: goal.type,
                value: ((goalsEntities && goalsEntities[goal.name]) ? goalsEntities[goal.name] : null),
                text: ((goalsEntities && goalsEntities[goal.name]) ? goalConstants[goal.name].find(x => x.id === goalsEntities[goal.name]).label : null)
            } : (goal.type === 'number') ? {
                name: goal.name,
                label: goal.label,
                type: goal.type,
                value: (goalsEntities && goalsEntities[goal.name]) ? this.maskService.applyMask(goalsEntities[goal.name].toString(), 'separator.2') : null,
                text: (goalsEntities && goalsEntities[goal.name]) ? this.maskService.applyMask(goalsEntities[goal.name].toString(), 'separator.2') : null
            } : {
                name: goal.name,
                label: goal.label,
                type: goal.type,
                value: (goalsEntities && goalsEntities[goal.name]) ? goalsEntities[goal.name] : null,
                text: (goalsEntities && goalsEntities[goal.name]) ? goalsEntities[goal.name] : null
            }
        });
    }

    filterFromEmptyFields(obj) {
        //leaves only not empty fields
        return Object.keys(obj)
            .filter(key => (obj[key] !== undefined && obj[key] !== null))
            .reduce((acc, key) => (acc[key] = obj[key], acc), {});
    }
    updateBio(formValues) {
        let newGoals = this.filterFromEmptyFields(formValues.goals);
        newGoals = Object.keys(newGoals).reduce((acc, key) => {
            acc[key] = newGoals[key]
            return acc;
        }, {});

        const getUserSubscription = this.userSvc.getUser().pipe(take(1)).subscribe(async ({ data: { user } }) => {
            if(typeof((newGoals as any).currentEarnedIncome) == 'string')
            {
                if((newGoals as any).currentEarnedIncome != null || (newGoals as any).currentEarnedIncome != '')
                    (newGoals as any).currentEarnedIncome = parseFloat(((newGoals as any).currentEarnedIncome as String).replace(/,/g, ''));
                else
                    (newGoals as any).currentEarnedIncome = 0;
            }
            if(typeof((newGoals as any).earnedIncomeGoal) == 'string')
            {
                if((newGoals as any).earnedIncomeGoal != null || (newGoals as any).earnedIncomeGoal != '')
                    (newGoals as any).earnedIncomeGoal = parseFloat(((newGoals as any).earnedIncomeGoal as String).replace(/,/g, ''));
                else
                    (newGoals as any).earnedIncomeGoal = 0;
            }
            for(let goal of this.customGoals){
                if(typeof(goal.value) == 'string')
                {
                    if(goal.value != null || goal.value != '')
                        goal.value = parseFloat((goal.value as String).replace(/,/g, ''));
                    else
                        goal.value = 0;
                }
            }
           const userUpdatedProperties = updatedDiff(user, newGoals);
           const customGoalsChanged = !(_.isEqual(user.customGoals, this.customGoals));
           console.log(user.customGoals, this.customGoals);
           if(customGoalsChanged) {
            userUpdatedProperties['customGoals'] = this.customGoals;
           }
           if(userUpdatedProperties && Object.keys(userUpdatedProperties).length) {
                await this.userSvc.updateUser(userUpdatedProperties);
                this.goBack();
           } else {
                this.goBack();
           }
        })

        if(getUserSubscription) {
            this.subscriptions.push(getUserSubscription);
        }
    }
    createGoalsControls() {
        return this.fb.group(this.goals.reduce((acc, curr) => ({ ...acc,
            [curr.name]: [curr.value]
        }), {}));
    }
    openFreedomCalculator() {
        this.navCtrl.navigateForward("freedomnumberdetails");
    }
    openLifestyleCalculator() {
        this.navCtrl.navigateForward("lifestylenumberdetails");
    }
    goBack() {
        this.navCtrl.back();
    }
    createNewAccount() {
        this.navCtrl.navigateForward("accountDetails/new");
    }

    ionViewWillEnter() {
        this.maskService.thousandSeparator = ",";
        this.getUserData();
        setTimeout(() => {
            this.getUserData(true);
        }, 2000);
    }

    getUserData(forceUpdate?: boolean) {
        const getUserSubscription = this.userSvc.getUser(forceUpdate).subscribe(({ data: { user } }) => {
            if (user && user.avatar) {
                this.getSignedUrlSubscription = this.userSvc.getSignedUrl(user.avatar).subscribe((res: any) => {
                    if (res) {
                        this.userAvatar = res.data.getSignedUrl.signedUrl;
                    }
                })
            }
            const {
                immediatePersonalGoal,
                legacyStatement,
                earnedIncomeOptimizationPlan,
                primaryWealthStrategy,
                secondaryWealthStrategy,
                activePassivePreference,
                temperament,
                riskPreference,
                biggestChallenge,
                currentEarnedIncome,
                earnedIncomeGoal,
                resultFreedom,
                resultLifestyle,
                financialEducation,
                primaryGoal,
                legacyModel,
                customGoals
            } = user;

            this.freedomNumber = resultFreedom;
            this.lifestyleNumber = resultLifestyle;
            this.customGoals = customGoals ? _.cloneDeep(customGoals) : [];

            const obj = {
                immediatePersonalGoal,
                legacyStatement,
                earnedIncomeOptimizationPlan,
                primaryWealthStrategy,
                secondaryWealthStrategy,
                activePassivePreference,
                temperament,
                riskPreference,
                biggestChallenge,
                currentEarnedIncome,
                earnedIncomeGoal,
                resultFreedom,
                resultLifestyle,
                financialEducation,
                primaryGoal,
                legacyModel,
            }
            this.goals = this.transformGoals(obj);

            if(!this.bioForm){
                this.bioForm = this.fb.group({
                    goals: this.createGoalsControls()
                });
            }

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

    openMenu(){
        this.menuController.open();
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
            component: GoalsTutorialComponent,
            enterAnimation: this.platform.width()>640?this.enterAnimation:undefined,
            leaveAnimation: this.platform.width()>640?this.leaveAnimation:undefined,
            backdropDismiss: true,
            cssClass: 'side-menu2'
        });
        modal.onWillDismiss().then(async ()=>{
        })
        modal.present();
    }

    bluractive(){
        this.openCustom = true;
        var activeElement = document.activeElement as HTMLElement;
        activeElement.blur();
        let setFocus = _.debounce(()=>{
            this.goalLabelInput.setFocus();
        },1000,{'trailing': true});
        setFocus();
    }

    editGoal(goal: any){
        this.currentGoal = goal;
        this.goalLabel = this.currentGoal.label;
        this.goalValue = this.currentGoal.value;
        this.openCustom = true;
        var activeElement = document.activeElement as HTMLElement;
        activeElement.blur();
        let setFocus = _.debounce(()=>{
            this.goalLabelInput.setFocus();
        },1000,{'trailing': true});
        setFocus();
    }

    customChnage(){
        let goalValue = typeof(this.goalValue)=="string" ? parseFloat(this.goalValue) : this.goalValue;
        if(goalValue>0 && this.goalLabel.length > 0){
            this.savebtn.disabled = false;
        }
        else
            this.savebtn.disabled = true;
    }

    async addCustomGoal() {
        if(this.goalValue != null || ((this.goalValue as any) as String) != '')
            this.goalValue = parseFloat(((this.goalValue as any) as String).replace(/,/g, ''));
        else
            this.goalValue = 0;
        if (!this.currentGoal) {
            let customGoals={value: Number(this.goalValue),label:this.goalLabel,__typename:"CustomAccountType"};
            this.customGoals.push(customGoals);
        } else {
            this.currentGoal.label = this.goalLabel;
            this.currentGoal.value = this.goalValue;
        }
        this.goalLabel=''
        this.goalValue=0;
        this.currentGoal = null;
        this.modalDismiss();
    }

    removeCustomGoal(label, event) {
        event.stopPropagation();
        this.customGoals.splice(this.customGoals.findIndex(i => i.label === label), 1);
    }

    modalDismiss(){
        this.openCustom = false;
        this.goalLabel='';
        this.goalValue=0;
    }
}