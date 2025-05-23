import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NavigationOptions } from '@ionic/angular/providers/nav-controller';
import { slidecustomAnimation } from '../animations/slideDownAnimation';
import {
  ExportedClass as AppSideMenuService
} from '../scripts/custom/AppSideMenuService';
import _ from 'lodash';
import {
  ExportedClass as UserService
} from '../scripts/custom/userService';
import { customAnimation } from '../animations/customAnimation';

@Component({
  selector: 'app-intro[start-page]',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {

  constructor(public appSideMenuService: AppSideMenuService, public navCtrl:NavController,
    public userSvc: UserService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    let enable = _.debounce(()=>{
      this.appSideMenuService.disableSideMenu();
    },700);
    let enabletwo = _.debounce(()=>{
      this.appSideMenuService.disableSideMenu();
    },900);
    enable();
    enabletwo();
  }

  login(){
    this.navCtrl.navigateForward('login');
  }

  go(){
    let options:NavigationOptions={
      animation: slidecustomAnimation
  }
    this.navCtrl.navigateForward('intro-goals',options);
  }

  back(){
    let options:NavigationOptions={
      animation: customAnimation
    }
    let enable = _.debounce(()=>{
      this.appSideMenuService.enableSideMenu();
    },450);
    enable();
    this.navCtrl.navigateBack('dashboard',options);
  }

}
