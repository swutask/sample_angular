import { Component, OnInit } from '@angular/core';
import { Platform, NavController} from '@ionic/angular';
import { NavigationOptions} from '@ionic/angular/providers/nav-controller';
import { updatedDiff } from 'deep-object-diff';
import { Subscription } from 'rxjs';
import { slidecustomAnimation } from '../animations/slideDownAnimation';
import {
  ExportedClass as TFreedomCalculator
} from '../scripts/custom/TFreedomCalculator';
import {
  ExportedClass as TLifestyleCalculator
} from '../scripts/custom/TLifestyleCalculator';
import {
  ExportedClass as userService
} from '../scripts/custom/userService';

@Component({
  selector: 'app-intro-lifestyle[start-page]',
  templateUrl: './intro-lifestyle.page.html',
  styleUrls: ['./intro-lifestyle.page.scss'],
})
export class IntroLifestylePage implements OnInit {

  public split = false;
  public overall = 0;
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
  public subscriptions: Subscription[] = [];
  public overallData: TLifestyleCalculator = {
    travel: 0,
    shopping: 0,
    entertainment: 0,
    other: 0,
    result: 0
  }

  constructor(public navCtrl:NavController, public platform: Platform, public userSvc: userService) { }

  ngOnInit() {
  }


  calculate() {
    if(this.split){
      let freedomResult = this.freedomNumberData.result || 0;
      if(typeof(freedomResult) == 'string')
      {
          if(freedomResult != null || freedomResult != '')
              freedomResult = parseFloat((freedomResult as String).replace(/,/g, ''));
          else
              freedomResult = 0;
      }
      this.freedomNumberRounded = Math.round(freedomResult);
      let { travel, shopping, entertainment, other } = this.data;
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
      this.overall = result;
    }
    else{
      this.freedomNumberData.result = Math.abs(this.freedomNumberData? this.freedomNumberData.result : 0);
      const freedomResult = this.freedomNumberData.result || 0;
      this.freedomNumberRounded = Math.round(freedomResult);
      if(typeof(this.overall) == 'string')
      {
          if(this.overall != null || this.overall != '')
            this.overall = parseFloat((this.overall as String).replace(/,/g, ''));
          else
            this.overall = 0;
      }
      this.overallData.travel = Math.abs(this.overall ? this.overall/4 : 0);
      this.overallData.shopping = Math.abs(this.overall ? this.overall/4 : 0);
      this.overallData.entertainment = Math.abs(this.overall ? this.overall/4 : 0);
      this.overallData.other = Math.abs(this.overall ? this.overall/4 : 0);
      this.overallData.result = this.overall + freedomResult;
    }
  }

  ionViewWillEnter() {
    const getUserSubscription = this.userSvc.getUser().subscribe(({ data: { user } }) => {
        const { travel, shopping, entertainment, otherLifestyle, resultLifestyle, housing, food, utilities, transportation, otherFreedom, resultFreedom  } = user;
        this.data = Object.assign({}, { travel, shopping, entertainment, other: otherLifestyle, result: resultLifestyle });
        this.freedomNumberData = Object.assign({}, { housing, food, utilities, transportation, other: otherFreedom, result: resultFreedom });
        if(!this.data.travel && !this.data.shopping && !this.data.entertainment && !this.data.other){
          this.split = false;
        }
        else{
          this.split = true;
        }
    })
    this.calculate();

    if(getUserSubscription) {
        this.subscriptions.push(getUserSubscription);
    }
  }

  saveToAccount() {
    const getUserSubscription = this.userSvc.getUser().subscribe(({ data: { user } }) => {
        const { travel, shopping, entertainment, otherLifestyle, resultLifestyle } = user;
        const userProperties = { travel, shopping, entertainment, other: otherLifestyle, result: resultLifestyle };
        let updatedUserProperties;

        if(this.split){
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
          updatedUserProperties = updatedDiff(userProperties, this.data);
        }
        else{
          if(typeof(this.overallData.travel) == 'string')
          {
              if(this.overallData.travel != null || this.overallData.travel != '')
                  this.overallData.travel = parseFloat((this.overallData.travel as String).replace(/,/g, ''));
              else
                  this.overallData.travel = 0;
          }
          if(typeof(this.overallData.entertainment) == 'string')
          {
              if(this.overallData.entertainment != null || this.overallData.entertainment != '')
                  this.overallData.entertainment = parseFloat((this.overallData.entertainment as String).replace(/,/g, ''));
              else
                  this.overallData.entertainment = 0;
          }
          if(typeof(this.overallData.shopping) == 'string')
          {
              if(this.overallData.shopping != null || this.overallData.shopping != '')
                  this.overallData.shopping = parseFloat((this.overallData.shopping as String).replace(/,/g, ''));
              else
                  this.overallData.shopping = 0;
          }
          if(typeof(this.overallData.other) == 'string')
          {
              if(this.overallData.other != null || this.overallData.other != '')
                  this.overallData.other = parseFloat((this.overallData.other as String).replace(/,/g, ''));
              else
                  this.overallData.other = 0;
          }
          updatedUserProperties = updatedDiff(userProperties, this.overallData);
        }

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
            // TODO change to remove setTimeout
            this.userSvc.updateUser(updatedUserProperties).then(() => {
                setTimeout(() => {
                    this.go();
                }, 1);
            }, err => {
                console.error(err);
                this.userSvc.toast("Error: Could not update Lifestyle Number Details");
            })
        } else {
            this.go();
        }
    })

    if(getUserSubscription) {
        this.subscriptions.push(getUserSubscription);
    }
}

  back(){
    let options:NavigationOptions={
      animation: slidecustomAnimation
    }
    this.navCtrl.navigateBack('intro-freedom',options);
  }

  login(){
    this.navCtrl.navigateForward('login');
  }

  go(){
    let options:NavigationOptions={
      animation: slidecustomAnimation
    }
    this.navCtrl.navigateForward('intro-finish',options);
  }

  segmentChanged(event: any){
    this.split = event.detail.value=="true"?true:false;
  }

  ionViewWillLeave() {
    this.subscriptions.forEach(sub => {
        sub.unsubscribe();
    })
  }

}
