import { Component, OnInit } from '@angular/core';
import { AnimationController, ModalController, NavController, Platform } from '@ionic/angular';
import {
  ExportedClass as AppSideMenuService
} from '../scripts/custom/AppSideMenuService';
import _ from 'lodash';
import { NavigationOptions } from '@ionic/angular/providers/nav-controller';
import { slidecustomAnimation } from '../animations/slideDownAnimation';
import { AccountDetails } from '../AccountDetails/AccountDetails';
import { AccountDetailsType } from '../AccountDetailsType/AccountDetailsType';

@Component({
  selector: 'app-intro-finish2[start-page]',
  templateUrl: './intro-finish2.page.html',
  styleUrls: ['./intro-finish2.page.scss'],
})
export class IntroFinish2Page implements OnInit {

  constructor(public navCtrl:NavController, public appSideMenuService: AppSideMenuService,
    public animationCtrl: AnimationController, public modalCtrl: ModalController, public platform: Platform) { }

  ngOnInit() {
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
    this.navCtrl.navigateForward('intro-congrats',options);
  }

  goToIntroCongrats(){
    let options:NavigationOptions={
      animation: slidecustomAnimation
    }
    this.navCtrl.navigateForward('intro-congrats',options);
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
            type:'Liability',
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
