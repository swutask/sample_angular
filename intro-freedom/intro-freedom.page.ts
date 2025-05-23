import { Component, OnInit } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { NavigationOptions } from '@ionic/angular/providers/nav-controller';
import { updatedDiff } from 'deep-object-diff';
import { Subscription } from 'rxjs';
import { slidecustomAnimation } from '../animations/slideDownAnimation';
import {
  ExportedClass as TFreedomCalculator
} from '../scripts/custom/TFreedomCalculator';
import {
  ExportedClass as userService
} from '../scripts/custom/userService';

@Component({
  selector: 'app-intro-freedom[start-page]',
  templateUrl: './intro-freedom.page.html',
  styleUrls: ['./intro-freedom.page.scss'],
})
export class IntroFreedomPage implements OnInit {

  public split = false;
  public overall = 0;
  public data: TFreedomCalculator = {
    housing: 0, 
    food: 0, 
    utilities: 0, 
    transportation: 0, 
    other: 0, 
    result: 0
  };
  public overallData: TFreedomCalculator = {
    housing: 0, 
    food: 0, 
    utilities: 0, 
    transportation: 0, 
    other: 0, 
    result: 0
  };
  public subscriptions: Subscription[] = [];

  constructor(public navCtrl:NavController, public platform: Platform, public userSvc: userService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    const getUserSubscription = this.userSvc.getUser().subscribe(({ data: { user } }) => {
        const { housing, food, utilities, transportation, otherFreedom, resultFreedom } = user;
        this.data = Object.assign({}, { housing, food, utilities, transportation, other: otherFreedom, result: resultFreedom });
        this.calculate()
        if(!this.data.housing && !this.data.food && !this.data.utilities && !this.data.transportation && !this.data.other){
          this.split = false;
        }
        else{
          this.split = true;
        }
    })

    if(getUserSubscription) {
        this.subscriptions.push(getUserSubscription);
    }
  }


  calculate() {
    if(this.split){
      let { housing, food, utilities, transportation, other } = this.data;
      if(typeof(housing) == 'string')
      {
          if(housing != null || housing != '')
              housing = parseFloat((housing as String).replace(/,/g, ''));
          else
              housing = 0;
      }
      if(typeof(food) == 'string')
      {
          if(food != null || food != '')
              food = parseFloat((food as String).replace(/,/g, ''));
          else
              food = 0;
      }
      if(typeof(transportation) == 'string')
      {
          if(transportation != null || transportation != '')
              transportation = parseFloat((transportation as String).replace(/,/g, ''));
          else
              transportation = 0;
      }
      if(typeof(utilities) == 'string')
      {
          if(utilities != null || utilities != '')
              utilities = parseFloat((utilities as String).replace(/,/g, ''));
          else
              utilities = 0;
      }
      if(typeof(other) == 'string')
      {
          if(other != null || other != '')
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
        this.overall = result;
    }
    else{
      if(typeof(this.overall) == 'string')
      {
          if(this.overall != null || this.overall != '')
            this.overall = parseFloat((this.overall as String).replace(/,/g, ''));
          else
            this.overall = 0;
      }
      this.overallData.housing = Math.abs(this.overall ? this.overall/4 : 0);
      this.overallData.food = Math.abs(this.overall ? this.overall/4 : 0);
      this.overallData.utilities = Math.abs(this.overall ? this.overall/4 : 0);
      this.overallData.transportation = Math.abs(this.overall ? this.overall/4 : 0);
      this.overallData.other = 0;
      this.overallData.result = this.overall;
    }
  }

  saveToAccount() {
    const getUserSubscription = this.userSvc.getUser().subscribe(({ data: { user } }) => {
        const { housing, food, utilities, transportation, otherFreedom, resultFreedom } = user;
        const userProperties = { housing, food, utilities, transportation, other: otherFreedom, result: resultFreedom };
        let updatedUserProperties;
        if(this.split){
          if(typeof(this.data.housing) == 'string')
          {
              if(this.data.housing != null || this.data.housing != '')
                  this.data.housing = parseFloat((this.data.housing as String).replace(/,/g, ''));
              else
                  this.data.housing = 0;
          }
          if(typeof(this.data.food) == 'string')
          {
              if(this.data.food != null || this.data.food != '')
                  this.data.food = parseFloat((this.data.food as String).replace(/,/g, ''));
              else
                  this.data.food = 0;
          }
          if(typeof(this.data.transportation) == 'string')
          {
              if(this.data.transportation != null || this.data.transportation != '')
                  this.data.transportation = parseFloat((this.data.transportation as String).replace(/,/g, ''));
              else
                  this.data.transportation = 0;
          }
          if(typeof(this.data.utilities) == 'string')
          {
              if(this.data.utilities != null || this.data.utilities != '')
                  this.data.utilities = parseFloat((this.data.utilities as String).replace(/,/g, ''));
              else
                  this.data.utilities = 0;
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
          if(typeof(this.overallData.housing) == 'string')
          {
              if(this.overallData.housing != null || this.overallData.housing != '')
                  this.overallData.housing = parseFloat((this.overallData.housing as String).replace(/,/g, ''));
              else
                  this.overallData.housing = 0;
          }
          if(typeof(this.overallData.food) == 'string')
          {
              if(this.overallData.food != null || this.overallData.food != '')
                  this.overallData.food = parseFloat((this.overallData.food as String).replace(/,/g, ''));
              else
                  this.overallData.food = 0;
          }
          if(typeof(this.overallData.transportation) == 'string')
          {
              if(this.overallData.transportation != null || this.overallData.transportation != '')
                  this.overallData.transportation = parseFloat((this.overallData.transportation as String).replace(/,/g, ''));
              else
                  this.overallData.transportation = 0;
          }
          if(typeof(this.overallData.utilities) == 'string')
          {
              if(this.overallData.utilities != null || this.overallData.utilities != '')
                  this.overallData.utilities = parseFloat((this.overallData.utilities as String).replace(/,/g, ''));
              else
                  this.overallData.utilities = 0;
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
        
        if(updatedUserProperties['other'] || updatedUserProperties['other']==0) {
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
                    this.go();
                }, 1);
            }, err => {
                console.error(err);
                this.userSvc.toast("Error: Could not update Freedom Number Details");
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
    this.navCtrl.navigateBack('intro-budgeting',options);
  }

  login(){
    this.navCtrl.navigateForward('login');
  }

  go(){
    let options:NavigationOptions={
      animation: slidecustomAnimation
    }
    this.navCtrl.navigateForward('intro-lifestyle',options);
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
