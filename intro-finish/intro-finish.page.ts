import { Component, OnInit } from '@angular/core';
import { AnimationController, ModalController, NavController, Platform } from '@ionic/angular';
import {
  ExportedClass as AppSideMenuService
} from '../scripts/custom/AppSideMenuService';
import _ from 'lodash';
import { AccountDetails } from '../AccountDetails/AccountDetails';
import { NavigationOptions } from '@ionic/angular/providers/nav-controller';
import { slidecustomAnimation } from '../animations/slideDownAnimation';
import { Subscription } from 'rxjs';
import {
  ExportedClass as userService
} from '../scripts/custom/userService';
import { updatedDiff } from 'deep-object-diff';
import { AccountDetailsType } from '../AccountDetailsType/AccountDetailsType';

@Component({
  selector: 'app-intro-finish[start-page]',
  templateUrl: './intro-finish.page.html',
  styleUrls: ['./intro-finish.page.scss'],
})
export class IntroFinishPage implements OnInit {

  public subscriptions: Subscription[] = [];

  constructor(public appSideMenuService: AppSideMenuService, public navCtrl:NavController, public userSvc:userService,
    public modalCtrl: ModalController, public platform: Platform, public animationCtrl: AnimationController) { }

  ngOnInit() {
    const completeOnboarding = {
      hasCompletedOnboarding:true
    };
    const getUserSubscription = this.userSvc.getUser().subscribe(({ data: { user } }) => {
      const userUpdatedProperties = updatedDiff(user, completeOnboarding);
      if(userUpdatedProperties && Object.keys(userUpdatedProperties).length) {
            this.userSvc.updateUser(userUpdatedProperties).then(res => {
            })
      }
    })
     if(getUserSubscription) {
         this.subscriptions.push(getUserSubscription);
     }
  }

  ionViewWillEnter(){
    let enable = _.debounce(()=>{
      this.appSideMenuService.disableSideMenu();
    },450);
    enable();
  }

  go(){
    let options:NavigationOptions={
      animation: slidecustomAnimation
    }
    this.navCtrl.navigateForward('intro-finish2',options);
  }

  goToIntroFinish2(){
    let options:NavigationOptions={
      animation: slidecustomAnimation
    }
    this.navCtrl.navigateForward('intro-finish2',options);
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

  async createNewAccount() {
    const modal = await this.modalCtrl.create({
        component: AccountDetails,//AccountDetailsType,
        enterAnimation: this.platform.width()>640?this.enterAnimation:undefined,
        leaveAnimation: this.platform.width()>640?this.leaveAnimation:undefined,
        cssClass: 'side-menu2',
        backdropDismiss: false,
        componentProps:{
            id:'new',
            type:'Asset',
            onboarding:true
        }
    });
    modal.onDidDismiss().then(async (data)=>{
      // keep this until we add back the AccountDetailsType page
      this.go();
    })
    modal.present();
  }

}
