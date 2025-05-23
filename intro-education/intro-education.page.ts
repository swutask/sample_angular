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
  selector: 'app-intro-education[start-page]',
  templateUrl: './intro-education.page.html',
  styleUrls: ['./intro-education.page.scss'],
})
export class IntroEducationPage implements OnInit {

  public goalConstants: any = goalConstants;
  public subscriptions: Subscription[] = [];
  financialEducation:any;

  constructor(public navCtrl:NavController, public platform: Platform, public userSvc:userService) { }

  ngOnInit() {
    const getUserSubscription = this.userSvc.getUser().subscribe(({ data: { user } }) => {
      const {
        financialEducation
      } = user;

      this.financialEducation = financialEducation
    })

    if(getUserSubscription) {
        this.subscriptions.push(getUserSubscription);
    }
  }

  back(){
    let options:NavigationOptions={
      animation: slidecustomAnimation
    }
    this.navCtrl.navigateBack('intro-goals',options);
  }

  login(){
    this.navCtrl.navigateForward('login');
  }

  go(value: any){
    this.financialEducation = value;
    if(this.platform.width()>640){
      this.updateEducation();
    }
  }

  updateEducation(){
    const newGoals = {
      financialEducation:this.financialEducation
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
    this.navCtrl.navigateForward('intro-income',options);
  }

  ionViewWillLeave() {
    this.subscriptions.forEach(sub => {
        sub.unsubscribe();
    })
  }

}
