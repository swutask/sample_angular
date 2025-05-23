import { Component, OnInit } from '@angular/core';
import { AlertController, AnimationController, ModalController, Platform } from '@ionic/angular';
import _ from 'lodash';


@Component({
  selector: 'app-debt-tutorial',
  templateUrl: './debt-tutorial.component.html',
  styleUrls: ['./debt-tutorial.component.scss'],
})
export class DebtTutorialComponent implements OnInit {


  constructor(public modalCtrl: ModalController) {
   }

  ngOnInit() {}

  goBack(){
    this.modalCtrl.dismiss();
  }

}
