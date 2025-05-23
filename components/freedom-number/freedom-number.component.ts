import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import {
  ExportedClass as TFreedomCalculator
} from '../../scripts/custom/TFreedomCalculator';
import {
  ExportedClass as userService
} from '../../scripts/custom/userService';
import {
  ExportedClass as PlansService
} from '../../scripts/custom/PlansService';
import { updatedDiff } from 'deep-object-diff';

@Component({
  selector: 'app-freedom-number',
  templateUrl: './freedom-number.component.html',
  styleUrls: ['./freedom-number.component.scss'],
})
export class FreedomNumberComponent implements OnInit {

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

  constructor(public plansService: PlansService, public modalCtrl: ModalController, public userSvc: userService) { }

  calculate() {
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
    }

    saveToAccount() {
      const getUserSubscription = this.userSvc.getUser().subscribe(({ data: { user } }) => {
          const { housing, food, utilities, transportation, otherFreedom, resultFreedom } = user;
          const userProperties = { housing, food, utilities, transportation, other: otherFreedom, result: resultFreedom };
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
          const updatedUserProperties = updatedDiff(userProperties, this.data);
          
          if(updatedUserProperties['other']) {
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
                  this.modalCtrl.dismiss();
              }, err => {
                  console.error(err);
                  this.userSvc.toast("Error: Could not update Freedom Number Details");
              })
          } else {
            this.modalCtrl.dismiss();
          }
      })

      if(getUserSubscription) {
          this.subscriptions.push(getUserSubscription);
      }
  }

  ngOnInit() {}

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

  goBack(){
    this.modalCtrl.dismiss();
  }

}
