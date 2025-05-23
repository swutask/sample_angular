import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import {
  ExportedClass as AppSideMenuService
} from '../scripts/custom/AppSideMenuService';
import _ from 'lodash';
import { NavigationOptions } from '@ionic/angular/providers/nav-controller';
import { customAnimation } from '../animations/customAnimation';

@Component({
  selector: 'app-intro-congrats[start-page]',
  templateUrl: './intro-congrats.page.html',
  styleUrls: ['./intro-congrats.page.scss'],
})
export class IntroCongratsPage implements OnInit {

  constructor(public navCtrl:NavController, public appSideMenuService: AppSideMenuService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    let enable = _.debounce(()=>{
      this.appSideMenuService.disableSideMenu();
    },450);
    enable();
  }

  goToDashboard(){
    let options:NavigationOptions={
      animation: customAnimation
    }
    this.navCtrl.navigateForward('/dashboard', options);
  }

}
