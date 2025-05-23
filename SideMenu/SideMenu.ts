import {
    Component
} from '@angular/core';
import {
    ActionSheetController, ModalController
} from '@ionic/angular';
import {
    MenuController
} from '@ionic/angular';
import {
    NavController
} from '@ionic/angular';
import {
    Platform
} from '@ionic/angular';
import {
    ActivatedRoute, NavigationExtras
} from '@angular/router';
import {
    ExportedClass as userService
} from '../scripts/custom/userService';
import {
    ExportedClass as PlansService
} from '../scripts/custom/PlansService';
import {
    ExportedClass as AuthService
} from '../scripts/custom/AuthService';
import {
    ExportedClass as AppRateService
} from '../scripts/custom/AppRateService';
import {
    ExportedClass as UserProfileService
} from '../scripts/custom/UserProfileService';
import {
    ExportedClass as BalanceSheetService
  } from '../scripts/custom/BalanceSheetService';
  import {
    ExportedClass as AccountsService
  } from '../scripts/custom/AccountsService';
  import _ from 'lodash';
import {
    WebView
} from '@awesome-cordova-plugins/ionic-webview/ngx';
import { ExportedClass as SafePipe } from 'src/app/scripts/custom/SafePipe';
import { NavigationOptions } from '@ionic/angular/providers/nav-controller';
import { customAnimation } from '../animations/customAnimation';
import { Subscription } from 'rxjs';
import { Browser } from '@capacitor/browser';
@Component({
    templateUrl: 'SideMenu.html',
    selector: 'page-side-menu',
    styleUrls: ['SideMenu.scss'],
    providers: [SafePipe]
})
export class SideMenu {
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
    public view: string;
    public webview: WebView;
    public access: string = 'Free';
    public goals: any = [];
    public currentItem: any = null;
    public mappingData: any = {};
    public supportLink: string;
    public upgradeLink: string;
    public docsLink: string;
    public learnLink: string;
    public planningActive: boolean = false;
    public learningActive: boolean = false;
    public connectLink: string;
    public subscriptions: Subscription[] = [];
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
    constructor(public actionSheetController: ActionSheetController, public userSvc: userService, 
        public authService: AuthService, public platform: Platform, public appRateService: AppRateService, 
        public plansService: PlansService, public navCtrl: NavController, public route: ActivatedRoute, 
        public userProfileService: UserProfileService, public menuController: MenuController, 
        public modalCtrl: ModalController, public safePipe: SafePipe, public balanceSheetService: BalanceSheetService,
        public accountsService: AccountsService) {
        this.authService.isUserLoggedIn().then(result => {
            this.authService.off(AuthService.LOGIN_EVENT, this.refresh.bind(this)).on(AuthService.LOGIN_EVENT, this.refresh.bind(this));
            this.initilaize();
        });
        this.userSvc.configurations().toPromise().then(res => {
            const { data: {configurations} } = res;
            this.supportLink = configurations.find(x => x.key === "supportLink").value;
            this.supportLink = this.safePipe.transform(this.supportLink);
            this.connectLink = configurations.find(x => x.key === "connectLink").value;
            this.upgradeLink = configurations.find(x => x.key === "upgradeLink").value;
            this.upgradeLink = this.safePipe.transform(this.upgradeLink);
            this.docsLink =  configurations.find(x => x.key === "DOCS_LINK").value;
            this.learnLink = configurations.find(x => x.key === "learnLink").value;
        })
        this.userSvc.openPlanning.subscribe(()=>{
            this.planningActive = true;
        })
    }
    initilaize() {
        let getBalanceSheetsSubscription:Subscription, getDefaultAccountsSubscription: Subscription, getDefaultBalanceSheet: Subscription;
        getBalanceSheetsSubscription = this.balanceSheetService.getBalanceSheets(true).subscribe((res:any) => {
            getDefaultBalanceSheet = this.balanceSheetService.getDefaultBalanceSheet().subscribe(res =>{
                if (res) {
                // Deep copy response object to avoid mutating the cache object
                const responseCopy = _.cloneDeep(res);
                const {
                        name,
                        yearlySnapshotsDebtPayoff,
                        yearlySnapshotsCompoundReturn
                } = responseCopy;
                if(!name)
                    return;
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
        });
        getDefaultAccountsSubscription = this.accountsService.getDefaultAccounts().subscribe(() => {
            let defaultAccountList = this.accountsService.defaultAccounts;
            let defaultAssetList = defaultAccountList.filter(a => a.accountType === 'Asset');
            let defaultLiabilityList = defaultAccountList.filter(a => a.accountType === 'Liability');
            if(defaultAssetList.length > 0)
                this.isAssetDone = true
            else
                this.isAssetDone = false
            if(defaultLiabilityList.length > 0)
                this.isLiabilityDone = true
            else
                this.isLiabilityDone = false
        });
        if (getBalanceSheetsSubscription) {
            this.subscriptions.push(getBalanceSheetsSubscription);
        }
        if (getDefaultBalanceSheet) {
        this.subscriptions.push(getDefaultBalanceSheet);
        }
        if (getDefaultAccountsSubscription) {
            this.subscriptions.push(getDefaultAccountsSubscription);
        }
    }
    doRefresh(event) {
        this.refresh().then(() => event.target.complete());
    }
    openWebsite() {
        const website = this.profile.website.startsWith('http') ? this.profile.website : `https://${this.profile.website}`;
        this.userSvc.browser(website);
    }
    openSupport() {
        // this.userSvc.browser(this.supportLink);
        (document.getElementsByClassName('b24-widget-button-popup')[0] as HTMLDivElement)?.click();
    }
    async openDocs() {
        //window.open(this.docsLink, "_blank");
        await Browser.open({ url: this.docsLink, windowName:"_blank" });
    }
    openOnboarding(){
        let options:NavigationOptions={
            animation: customAnimation
        }
        this.navCtrl.navigateForward("intro", options);
    }
    logout($event) {
        $event.stopPropagation();
        this.leaveScreen().then(() => {
            this.authService.logout(true);
        }).then(() => {
            return this.navCtrl.navigateRoot('login');
        });
    }
    rate() {
        this.appRateService.run();
    }
    goBack() {
        this.navCtrl.back();
    }
    ionViewWillEnter() {
        this.getProfile();
    }
    getProfile(forceUpdate ? ) {
        return new Promise((resolve) => {
            this.userSvc.getUser(forceUpdate).subscribe(({ data }) => {
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
                    this.access = user.access;

                    if(user.avatar) {
                        this.userSvc.getSignedUrl(user.avatar).subscribe((res: any) => {
                            if(res && res.data) {
                                this.profile.avatar = res.data.getSignedUrl.signedUrl;
                                resolve(true);
                            }
                        })
                    }
                    this.profile.avatar = "assets/images/no_avatar.png"

                    const { t1Target, t2Target, t3Target, isDebtFree } = user;
                    this.isDebtFree = isDebtFree;
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
                        //   if(progress?.incomeOptimization)
                        //     this.isIncomeDone = true
                        //   else
                        //     this.isIncomeDone = false
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
        })
    }
    leaveScreen() {
        return this.menuController.close();
    }
    hasAccessToAdmin() {
        return ["admin"].indexOf(this.access.toLowerCase()) !== -1;
    }
    hasAccessTo() {
        return ["comppro", "pro", "admin"].indexOf(this.userSvc.access?.toLowerCase()) !== -1;
      }
    refresh() {
        this.access = this.userSvc.access || this.access;
        return Promise.all([this.getProfile(true)]);
    }
    openEditProfile() {
        this.navCtrl.navigateForward("profile");
    }
    openGoals() {
        this.navCtrl.navigateForward("goals");
    }
    openDashboard() {
        this.navCtrl.navigateForward("dashboard");
    }
    openAccounts() {
        this.navCtrl.navigateForward("balancesheet");
    }
    openLearning() {
        this.userSvc.browser(`${this.learnLink}`);
        // this.planningActive = false;
        // this.learningActive=!this.learningActive;
    }
    openLearningLink(type: any){
        let navigationExtras: NavigationExtras = {
          state: {
            type
          } 
        };
        this.navCtrl.navigateForward("resources", navigationExtras);
        this.userSvc.resourceTab.next(type);
    }
    openPlannning(){
        this.learningActive = false;
        this.planningActive = !this.planningActive;
    }
    openFreedom(){
    this.navCtrl.navigateForward("freedomnumberdetails");
    }
    openLifestyle(){
    this.navCtrl.navigateForward("lifestylenumberdetails");
    }
    openBudgeting(){
    this.navCtrl.navigateForward("nd1details");
    }
    openCapital(){
    this.navCtrl.navigateForward("nd2details");
    }
    openDebt(){
    this.navCtrl.navigateForward("debtpayoff");
    }
    openCompound(){
    this.navCtrl.navigateForward("compoundreturn");
    }
    openConnect() {
        this.userSvc.browser(`${this.connectLink}`);
    }
    openProgress(){
        let options:NavigationOptions={
            animation:customAnimation
        }
        this.navCtrl.navigateForward(`/progress`,options);
    }
    async modalDismiss(){
        const modal = await this.modalCtrl.getTop();
        modal.dismiss();
    }

    getCompPercentage(isProfileDone, isGoalsDone, isFreedomDone, isLifestyleDone, isLegacyDone, 
        isAssetDone, isLiabilityDone, isBudgetingDone, isCapitalDone, isCompoundDone, isIncomeDone,
        isPorfolioDone, isRiskDone, isTaxDone, isAssetPDone, isDebtDone, isDebtFree){
            console.log(isProfileDone, isGoalsDone, isFreedomDone, isLifestyleDone, isLegacyDone, 
                isAssetDone, isLiabilityDone, isBudgetingDone, isCapitalDone, isCompoundDone, isIncomeDone,
                isPorfolioDone, isRiskDone, isTaxDone, isAssetPDone, isDebtDone, isDebtFree);
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

    async goToPortal(){
        await this.userSvc.presentLoader();
        this.userSvc.createPortal().subscribe( async (data) => {
            if (data?.data?.createPortal?.url) {
                // window.open(data?.data?.createPortal?.url, "_blank");
                window.location.href = data?.data?.createPortal?.url;
            }
            await this.userSvc.dismissLoader();
        }, async (error) => {
            await this.userSvc.dismissLoader();
        })
      }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => {
            sub.unsubscribe();
        })
    }
}
