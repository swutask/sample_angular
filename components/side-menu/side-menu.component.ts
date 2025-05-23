import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ExportedClass as userService
} from '../../scripts/custom/userService';
import {
  ExportedClass as AuthService
} from '../../scripts/custom/AuthService';
import {
  ExportedClass as AccountsService
} from '../../scripts/custom/AccountsService';
import {
  ExportedClass as BalanceSheetService
} from '../../scripts/custom/BalanceSheetService';
import {
  ExportedClass as TAccountList
} from '../../scripts/custom/TAccountList';
import { Subscription } from 'rxjs';
import { ModalController, NavController } from '@ionic/angular';
import { NavigationEnd, NavigationExtras, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ExportedClass as SafePipe } from 'src/app/scripts/custom/SafePipe';
import {
  ExportedClass as AppSideMenuService
} from '../../scripts/custom/AppSideMenuService';
import _ from 'lodash';
import { NavigationOptions } from '@ionic/angular/providers/nav-controller';
import { customAnimation } from 'src/app/animations/customAnimation';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  providers: [SafePipe]
})
export class SideMenuComponent implements OnInit, AfterViewInit, OnDestroy {

  public subscriptions: Subscription[] = [];
  getUserSubscription: Subscription;
  getSignedUrlSubscription: Subscription
  public userAvatar: string;
  open: boolean;
  subMenu: boolean = false;
  dashboardActive: boolean = false;
  accountActive: boolean = false;
  profileActive: boolean = false;
  learnActive: boolean = false;
  goalsActive: boolean = false;
  plannningActive: boolean = false;
  plannningActiveLink: boolean = false;
  learningActive: boolean = false;
  freedomActive: boolean = false;
  lifestyleActive: boolean = false;
  nd1Active: boolean = false;
  debtActive: boolean = false;
  nd2Active: boolean = false;
  compoundActive: boolean = false;
  onboardActive: boolean = false;
  progressActive: boolean = false;
  coursesActive: boolean = false;
  coachingActive: boolean = false;
  articlesActive: boolean = false;
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
  public access: string = 'Free';
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
  public supportLink: string;
  public upgradeLink: string;
  public connectLink: string;
  public learnLink: string;
  public accountList: TAccountList = [];

  constructor(public userSvc: userService, public authService: AuthService, public modalCtrl: ModalController,
    public navCtrl: NavController, public router: Router, public accountsService: AccountsService,
    public safePipe: SafePipe, public appSideMenuService: AppSideMenuService, public balanceSheetService: BalanceSheetService) {
    this.open = false;
    document.body.classList.remove('showMenu');
    this.toggle();
    this.userSvc.configurations().toPromise().then(res => {
      const { data: { configurations } } = res;
      this.supportLink = configurations.find(x => x.key === "supportLink").value;
      this.supportLink = this.safePipe.transform(this.supportLink);
      this.upgradeLink = configurations.find(x => x.key === "upgradeLink").value;
      this.upgradeLink = this.safePipe.transform(this.upgradeLink);
      this.connectLink = configurations.find(x => x.key === "connectLink").value;
      this.learnLink = configurations.find(x => x.key === "learnLink").value;
    })
  }

  ngOnInit() {
    this.highlightMenu();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(res => {
      this.highlightMenu();
    });
    let resourceSubscription: Subscription;
    resourceSubscription = this.userSvc.resourceTab.subscribe(type => {
      if (type == 'courses') {
        this.coursesActive = true;
        this.coachingActive = false;
        this.articlesActive = false;
      }
      else if (type == 'coaching') {
        this.coursesActive = false;
        this.coachingActive = true;
        this.articlesActive = false;
      }
      else if (type == 'articles') {
        this.coursesActive = false;
        this.coachingActive = false;
        this.articlesActive = true;
      }
    });
  }

  async modalDismiss() {
    await this.modalCtrl.dismiss();
  }

  highlightMenu() {
    switch (this.router.url) {
      case '/dashboard':
        this.dashboardActive = true; this.accountActive = false; this.learnActive = false, this.goalsActive = false; this.profileActive = false; this.plannningActiveLink = false;
        this.freedomActive = false; this.lifestyleActive = false; this.nd1Active = false; this.nd2Active = false; this.debtActive = false; this.compoundActive = false; this.coursesActive = false; this.coachingActive = false; this.articlesActive = false; break;
      case '/balancesheets':
      case '/balancesheet':
      case '/addaccount':
        this.enableSideMenu();
        this.dashboardActive = false; this.accountActive = true; this.learnActive = false, this.goalsActive = false; this.profileActive = false; this.plannningActiveLink = false;
        this.freedomActive = false; this.lifestyleActive = false; this.nd1Active = false; this.nd2Active = false; this.debtActive = false; this.compoundActive = false; this.coursesActive = false; this.coachingActive = false; this.articlesActive = false; break;
      case '/resources':
      case '/articles':
        this.dashboardActive = false; this.accountActive = false; this.learnActive = true, this.goalsActive = false; this.profileActive = false; this.plannningActiveLink = false;
        this.freedomActive = false; this.lifestyleActive = false; this.nd1Active = false; this.nd2Active = false; this.debtActive = false; this.compoundActive = false; break;
      case '/freedomnumberdetails':
        this.plannningActiveLink = true; this.dashboardActive = false; this.accountActive = false; this.learnActive = false, this.goalsActive = false; this.profileActive = false;
        this.freedomActive = true; this.lifestyleActive = false; this.nd1Active = false; this.nd2Active = false; this.debtActive = false; this.compoundActive = false; this.coursesActive = false; this.coachingActive = false; this.articlesActive = false; break;
      case '/lifestylenumberdetails':
        this.plannningActiveLink = true; this.dashboardActive = false; this.accountActive = false; this.learnActive = false, this.goalsActive = false; this.profileActive = false;
        this.freedomActive = false; this.lifestyleActive = true; this.nd1Active = false; this.nd2Active = false; this.debtActive = false; this.compoundActive = false; this.coursesActive = false; this.coachingActive = false; this.articlesActive = false; break;
      case '/goals':
        this.plannningActiveLink = true; this.dashboardActive = false; this.accountActive = false; this.learnActive = false, this.goalsActive = true; this.profileActive = false;
        this.freedomActive = false; this.lifestyleActive = false; this.nd1Active = false; this.nd2Active = false; this.debtActive = false; this.compoundActive = false; this.coursesActive = false; this.coachingActive = false; this.articlesActive = false; break;
      case '/nd1details':
        this.plannningActiveLink = true; this.dashboardActive = false; this.accountActive = false; this.learnActive = false, this.goalsActive = false; this.profileActive = false;
        this.freedomActive = false; this.lifestyleActive = false; this.nd1Active = true; this.nd2Active = false; this.debtActive = false; this.compoundActive = false; this.coursesActive = false; this.coachingActive = false; this.articlesActive = false; break;
      case '/nd2details':
        this.plannningActiveLink = true; this.dashboardActive = false; this.accountActive = false; this.learnActive = false, this.goalsActive = false; this.profileActive = false;
        this.freedomActive = false; this.lifestyleActive = false; this.nd1Active = false; this.nd2Active = true; this.debtActive = false; this.compoundActive = false; this.coursesActive = false; this.coachingActive = false; this.articlesActive = false; break;
      case '/debtpayoff':
        this.plannningActiveLink = true; this.dashboardActive = false; this.accountActive = false; this.learnActive = false, this.goalsActive = false; this.profileActive = false;
        this.freedomActive = false; this.lifestyleActive = false; this.nd1Active = false; this.nd2Active = false; this.debtActive = true; this.compoundActive = false; this.coursesActive = false; this.coachingActive = false; this.articlesActive = false; break;
      case '/compoundreturn':
        this.plannningActiveLink = true; this.dashboardActive = false; this.accountActive = false; this.learnActive = false, this.goalsActive = false; this.profileActive = false;
        this.freedomActive = false; this.lifestyleActive = false; this.nd1Active = false; this.nd2Active = false; this.debtActive = false; this.compoundActive = true; this.coursesActive = false; this.coachingActive = false; this.articlesActive = false; break;
      case '/my-profile':
        this.dashboardActive = false; this.accountActive = false; this.learnActive = false, this.goalsActive = false; this.profileActive = true; this.plannningActiveLink = false;
        this.freedomActive = false; this.lifestyleActive = false; this.nd1Active = false; this.nd2Active = false; this.debtActive = false; this.compoundActive = false; this.coursesActive = false; this.coachingActive = false; this.articlesActive = false; break;
      default:
        this.dashboardActive = false; this.accountActive = false; this.learnActive = false, this.goalsActive = false; this.profileActive = false; this.plannningActiveLink = false;
        this.freedomActive = false; this.lifestyleActive = false; this.nd1Active = false; this.nd2Active = false; this.debtActive = false; this.compoundActive = false; this.coursesActive = false; this.coachingActive = false; this.articlesActive = false; break;
    }
  }

  enableSideMenu() {
    let enable = _.debounce(() => {
      this.appSideMenuService.enableSideMenu();
    }, 450);
    enable();
  }

  ngAfterViewInit() {
    let getDefaultBalanceSheet: Subscription;
    const getBalanceSheetsSubscription = this.balanceSheetService.getBalanceSheets(true).subscribe((res:any) => {
      try{
          if(res.data){
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
          }
      }catch(error){
          console.error('error', error)
      }
    });
    const getDefaultAccountsSubscription = this.accountsService.getDefaultAccounts().subscribe(() => {
      const defaultAccountList = this.accountsService.defaultAccounts;
      const defaultAssetList = defaultAccountList.filter(a => a.accountType === 'Asset');
      const defaultLiabilityList = defaultAccountList.filter(a => a.accountType === 'Liability');
      if(defaultAssetList.length > 0)
        this.isAssetDone = true
      else
        this.isAssetDone = false
      if(defaultLiabilityList.length > 0)
        this.isLiabilityDone = true
      else
        this.isLiabilityDone = false
    });
    this.getUserSubscription = this.userSvc.getUser().subscribe(({ data: { user } }) => {
      if (user && user.avatar) {
        this.getSignedUrlSubscription = this.userSvc.getSignedUrl(user.avatar).subscribe((res: any) => {
          if (res) {
            this.userAvatar = res.data.getSignedUrl.signedUrl;
          }
        })
      }
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
    })
    this.getProfile();
    if(getDefaultAccountsSubscription) {
      this.subscriptions.push(getDefaultAccountsSubscription);
    }
    if(this.getUserSubscription) {
      this.subscriptions.push(this.getUserSubscription);
    }
    if(getBalanceSheetsSubscription) {
      this.subscriptions.push(getBalanceSheetsSubscription);
      if(getDefaultBalanceSheet) {
        this.subscriptions.push(getDefaultBalanceSheet);
      }
    }
  }

  toggle(sub?: any) {
    document.body.classList.toggle('showMenu');
    this.open = !this.open;
    if (this.open) {
      this.subMenu = true;
    }
    else {
      this.subMenu = false;
    }
  }


  toggleSubMenu() {
    this.subMenu = !this.subMenu;
  }

  getProfile(forceUpdate?) {
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

          if (user.avatar) {
            this.userSvc.getSignedUrl(user.avatar).subscribe((res: any) => {
              if (res && res.data) {
                this.profile.avatar = res.data.getSignedUrl.signedUrl;
                resolve(true);
              }
            })
          }
        }
      })
    })
  }

  openSupport() {
    // this.userSvc.browser(this.supportLink);
    (document.getElementsByClassName('b24-widget-button-popup')[0] as HTMLDivElement)?.click();
  }
  async logout($event) {
    $event.stopPropagation();
    await this.authService.logout(true);
    this.navCtrl.navigateRoot('login');
  }
  refresh() {
    this.access = this.userSvc.access || this.access;
    return Promise.all([this.getProfile(true)]);
  }
  openDashboard() {
    this.navCtrl.navigateForward("dashboard");
  }
  openAccounts() {
    this.navCtrl.navigateForward("balancesheet");
  }
  openLearning() {
    this.userSvc.browser(`${this.learnLink}`);
    // if (!this.open) {
    //   this.toggle();
    //   this.learningActive = true;
    //   this.plannningActive = false;
    //   return;
    // }
    // this.plannningActive = false;
    // this.learningActive = !this.learningActive;
  }
  openLearningLink(type: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        type
      }
    };
    this.navCtrl.navigateForward("resources", navigationExtras);
    this.userSvc.resourceTab.next(type);
  }
  openEditProfile() {
    this.navCtrl.navigateForward("profile");
  }
  openGoals() {
    this.navCtrl.navigateForward("goals");
  }
  openMyProfile() {
    this.navCtrl.navigateForward("my-profile");
  }
  openPlanning() {
    if (!this.open) {
      this.toggle();
      this.plannningActive = true;
      this.learningActive = false;
      return;
    }
    this.learningActive = false;
    this.plannningActive = !this.plannningActive;//this.dashboardActive=false;this.accountActive=false;this.learnActive=false,this.goalsActive=false;this.profileActive=false;
  }
  openFreedom() {
    this.navCtrl.navigateForward("freedomnumberdetails");
  }
  openLifestyle() {
    this.navCtrl.navigateForward("lifestylenumberdetails");
  }
  openBudgeting() {
    this.navCtrl.navigateForward("nd1details");
  }
  openCapital() {
    this.navCtrl.navigateForward("nd2details");
  }
  openDebt() {
    this.navCtrl.navigateForward("debtpayoff");
  }
  openCompound() {
    this.navCtrl.navigateForward("compoundreturn");
  }
  openOnboarding() {
    let options: NavigationOptions = {
      animation: customAnimation
    }
    this.navCtrl.navigateForward("intro", options);
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
  getCompPercentage(isProfileDone, isGoalsDone, isFreedomDone, isLifestyleDone, isLegacyDone, 
    isAssetDone, isLiabilityDone, isBudgetingDone, isCapitalDone, isCompoundDone, isIncomeDone,
    isPorfolioDone, isRiskDone, isTaxDone, isAssetPDone, isDebtDone, isDebtFree){
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
  hasAccessTo() {
    return ["comppro", "pro", "admin"].indexOf(this.userSvc.access?.toLowerCase()) !== -1;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    })
  }
}
