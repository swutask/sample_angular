import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import _ from 'lodash';


@Component({
  selector: 'app-freedom-tutorial',
  templateUrl: './freedom-tutorial.component.html',
  styleUrls: ['./freedom-tutorial.component.scss'],
})
export class FreedomTutorialComponent implements OnInit {


  constructor(public modalCtrl: ModalController) {
   }

  ngOnInit() {}

  goBack(){
    this.modalCtrl.dismiss();
  }

}
