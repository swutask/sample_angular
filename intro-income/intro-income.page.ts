import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { NavigationOptions } from '@ionic/angular/providers/nav-controller';
import { updatedDiff } from 'deep-object-diff';
import { Subscription } from 'rxjs';
import { slidecustomAnimation } from '../animations/slideDownAnimation';
import {
  ExportedClass as goalConstants
} from '../scripts/custom/goalConstants';
import {
  ExportedClass as userService
} from '../scripts/custom/userService';

@Component({
  selector: 'app-intro-income[start-page]',
  templateUrl: './intro-income.page.html',
  styleUrls: ['./intro-income.page.scss'],
})
export class IntroIncomePage implements OnInit {

  public actionSheetOptions:any = {
    cssClass:'goals-alert'
  }
  public popoverSheetOptions: any = {
      side: 'bottom',
      size: 'cover',
      cssClass:'full-width-option'
  };

  public goalConstants: any = goalConstants;
  public subscriptions: Subscription[] = [];
  currentEarnedIncome: any;
  earnedIncomeGoal: any;
  preferredCurrency: any;

  constructor(public navCtrl:NavController, public platform: Platform, public userSvc:userService) { }

  ngOnInit() {
    const getUserSubscription = this.userSvc.getUser().subscribe(({ data: { user } }) => {
      const {
        currentEarnedIncome,
        earnedIncomeGoal,
        preferredCurrency
      } = user;

      this.currentEarnedIncome = currentEarnedIncome;
      this.earnedIncomeGoal = earnedIncomeGoal;
      this.preferredCurrency = preferredCurrency || 'USD';
    })

    if(getUserSubscription) {
        this.subscriptions.push(getUserSubscription);
    }
  }

  back(){
    let options:NavigationOptions={
      animation: slidecustomAnimation
    }
    this.navCtrl.navigateBack('intro-education',options);
  }

  login(){
    this.navCtrl.navigateForward('login');
  }

  updateIncome(){
    const newGoals = {
      currentEarnedIncome: this.currentEarnedIncome,
      earnedIncomeGoal: this.earnedIncomeGoal,
      preferredCurrency: this.preferredCurrency
    };
    const getUserSubscription = this.userSvc.getUser().subscribe(({ data: { user } }) => {
      if(typeof(newGoals.currentEarnedIncome) == 'string')
      {
          if(newGoals.currentEarnedIncome != null || newGoals.currentEarnedIncome != '')
            newGoals.currentEarnedIncome = parseFloat((newGoals.currentEarnedIncome as String).replace(/,/g, ''));
          else
            newGoals.currentEarnedIncome = 0;
      }
      if(typeof(newGoals.earnedIncomeGoal) == 'string')
      {
          if(newGoals.earnedIncomeGoal != null || newGoals.earnedIncomeGoal != '')
            newGoals.earnedIncomeGoal = parseFloat((newGoals.earnedIncomeGoal as String).replace(/,/g, ''));
          else
            newGoals.earnedIncomeGoal = 0;
      }
      const userUpdatedProperties = updatedDiff(user, newGoals);
      if(userUpdatedProperties && Object.keys(userUpdatedProperties).length) {
            this.userSvc.updateUser(userUpdatedProperties).then(res => {
                this.goForward();
            })
      } else {
            this.goForward();
      }
    })

     if(getUserSubscription) {
         this.subscriptions.push(getUserSubscription);
     }
  }

  goForward(){
    let options:NavigationOptions={
      animation: slidecustomAnimation
    }
    this.navCtrl.navigateForward('intro-budgeting',options);
  }

  ionViewWillLeave() {
    this.subscriptions.forEach(sub => {
        sub.unsubscribe();
    })
  }

}
