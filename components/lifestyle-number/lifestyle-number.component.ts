import { Component, OnInit } from '@angular/core';
import {
  ExportedClass as userService
} from '../../scripts/custom/userService';
import {
  ExportedClass as TFreedomCalculator
} from '../../scripts/custom/TFreedomCalculator';
import {
  ExportedClass as PlansService
} from '../../scripts/custom/PlansService';
import {
  ExportedClass as TLifestyleCalculator
} from '../../scripts/custom/TLifestyleCalculator';
import { Subscription } from 'rxjs';
import { AnimationController, ModalController, Platform } from '@ionic/angular';
import { updatedDiff } from 'deep-object-diff';
import { FreedomNumberComponent } from '../freedom-number/freedom-number.component';

@Component({
  selector: 'app-lifestyle-number',
  templateUrl: './lifestyle-number.component.html',
  styleUrls: ['./lifestyle-number.component.scss'],
})
export class LifestyleNumberComponent implements OnInit {

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
public access: string = 'Free';
public currentItem: any = null;
public mappingData: any = {};
public subscriptions: Subscription[] = [];

public enterAnimation = (baseEl: any) => {
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

public leaveAnimation = (baseEl: any) => {
  return this.enterAnimation(baseEl).direction('reverse');
}

  constructor(public plansService: PlansService, public modalCtrl: ModalController, 
    public userSvc: userService, public animationCtrl: AnimationController,public platform: Platform) { }

  ngOnInit() {}

  saveToAccount() {
    const getUserSubscription = this.userSvc.getUser().subscribe(({ data: { user } }) => {
        const { travel, shopping, entertainment, otherLifestyle, resultLifestyle } = user;
        const userProperties = { travel, shopping, entertainment, other: otherLifestyle, result: resultLifestyle };
        if(typeof(this.data.travel) == 'string')
        {
            if(this.data.travel != null || this.data.travel != '')
                this.data.travel = parseFloat((this.data.travel as String).replace(/,/g, ''));
            else
                this.data.travel = 0;
        }
        if(typeof(this.data.entertainment) == 'string')
        {
            if(this.data.entertainment != null || this.data.entertainment != '')
                this.data.entertainment = parseFloat((this.data.entertainment as String).replace(/,/g, ''));
            else
                this.data.entertainment = 0;
        }
        if(typeof(this.data.shopping) == 'string')
        {
            if(this.data.shopping != null || this.data.shopping != '')
                this.data.shopping = parseFloat((this.data.shopping as String).replace(/,/g, ''));
            else
                this.data.shopping = 0;
        }
        if(typeof(this.data.other) == 'string')
        {
            if(this.data.other != null || this.data.other != '')
                this.data.other = parseFloat((this.data.other as String).replace(/,/g, ''));
            else
                this.data.other = 0;
        }
        const updatedUserProperties = updatedDiff(userProperties, this.data);

        if(updatedUserProperties['other']) {
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
            this.userSvc.updateUser(updatedUserProperties).then(() => {
                this.goBack();
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

calculate() {
  let freedomResult = this.freedomNumberData.result || 0;
  let { travel, shopping, entertainment, other } = this.data;
  if(typeof(freedomResult) == 'string')
  {
      if(freedomResult != null || freedomResult != '')
        freedomResult = parseFloat((freedomResult as String).replace(/,/g, ''));
      else
        freedomResult = 0;
  }
  if(typeof(travel) == 'string')
  {
      if(travel != null || travel != '')
          travel = parseFloat((travel as String).replace(/,/g, ''));
      else
          travel = 0;
  }
  if(typeof(entertainment) == 'string')
  {
      if(entertainment != null || entertainment != '')
          entertainment = parseFloat((entertainment as String).replace(/,/g, ''));
      else
          entertainment = 0;
  }
  if(typeof(shopping) == 'string')
  {
      if(shopping != null || shopping != '')
          shopping = parseFloat((shopping as String).replace(/,/g, ''));
      else
          shopping = 0;
  }
  if(typeof(other) == 'string')
  {
      if(other != null || other != '')
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
}
ionViewWillEnter() {
  this.pageIonViewDidEnter();
}
public pageIonViewDidEnter(){
  const getUserSubscription = this.userSvc.getUser().subscribe(({ data: { user } }) => {
    const { travel, shopping, entertainment, otherLifestyle, resultLifestyle, housing, food, utilities, transportation, otherFreedom, resultFreedom  } = user;
    this.data = Object.assign({}, { travel, shopping, entertainment, other: otherLifestyle, result: resultLifestyle });
    this.freedomNumberData = Object.assign({}, { housing, food, utilities, transportation, other: otherFreedom, result: resultFreedom });
    this.calculate();
  })
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

goBack(){
  this.modalCtrl.dismiss();
}

async freedomnumberClick(event ? , currentItem ? ) {
  const modal = await this.modalCtrl.create({
    component: FreedomNumberComponent,
    enterAnimation: this.platform.width()>640?this.enterAnimation:undefined,
    leaveAnimation: this.platform.width()>640?this.leaveAnimation:undefined,
    cssClass: 'side-menu'
  });
  modal.onDidDismiss().then((data)=>{
      this.pageIonViewDidEnter();
  });
  modal.present();
}
ionViewWillLeave() {
  this.subscriptions.forEach(sub => {
      sub.unsubscribe();
  })
}

}
