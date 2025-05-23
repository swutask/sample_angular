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
  selector: 'app-intro[start-page]',
  templateUrl: './intro-goals.page.html',
  styleUrls: ['./intro-goals.page.scss'],
})
export class IntroGoalsPage implements OnInit {

  public goalConstants: any = goalConstants;
  public subscriptions: Subscription[] = [];

  constructor(public navCtrl:NavController, public platform: Platform, public userSvc:userService) { }

  primaryGoal:any;

  ngOnInit() {
    const getUserSubscription = this.userSvc.getUser().subscribe(({ data: { user } }) => {
      const {
          primaryGoal
      } = user;

      this.primaryGoal = primaryGoal
    })

    if(getUserSubscription) {
        this.subscriptions.push(getUserSubscription);
    }
  }

  back(){
    let options:NavigationOptions={
      animation: slidecustomAnimation
    }
    this.navCtrl.navigateBack('intro',options);
  }

  login(){
    this.navCtrl.navigateForward('login');
  }

  go(value: string){
    this.primaryGoal = value
    if(this.platform.width()>640){
      this.updateGoals();
    }
  }

  updateGoals(){
    const newGoals = {
      primaryGoal:this.primaryGoal
    };
    const getUserSubscription = this.userSvc.getUser().subscribe(({ data: { user } }) => {
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
    this.navCtrl.navigateForward('intro-education',options);
  }

  ionViewWillLeave() {
    this.subscriptions.forEach(sub => {
        sub.unsubscribe();
    })
  }

}
