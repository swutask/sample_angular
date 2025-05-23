import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import _ from 'lodash';


@Component({
  selector: 'app-lifestyle-tutorial',
  templateUrl: './lifestyle-tutorial.component.html',
  styleUrls: ['./lifestyle-tutorial.component.scss'],
})
export class LifestyleTutorialComponent implements OnInit {


  constructor(public modalCtrl: ModalController) {
   }

  ngOnInit() {}

  goBack(){
    this.modalCtrl.dismiss();
  }

}
