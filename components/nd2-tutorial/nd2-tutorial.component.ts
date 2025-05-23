import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import _ from 'lodash';


@Component({
  selector: 'app-nd2-tutorial',
  templateUrl: './nd2-tutorial.component.html',
  styleUrls: ['./nd2-tutorial.component.scss'],
})
export class Nd2TutorialComponent implements OnInit {


  constructor(public modalCtrl: ModalController) {
   }

  ngOnInit() {}

  goBack(){
    this.modalCtrl.dismiss();
  }

}
