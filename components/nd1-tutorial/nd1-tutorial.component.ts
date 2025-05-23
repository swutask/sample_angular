import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import _ from 'lodash';


@Component({
  selector: 'app-nd1-tutorial',
  templateUrl: './nd1-tutorial.component.html',
  styleUrls: ['./nd1-tutorial.component.scss'],
})
export class Nd1TutorialComponent implements OnInit {


  constructor(public modalCtrl: ModalController) {
   }

  ngOnInit() {}

  goBack(){
    this.modalCtrl.dismiss();
  }

}
