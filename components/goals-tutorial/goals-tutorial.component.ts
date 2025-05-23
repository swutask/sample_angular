import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import _ from 'lodash';


@Component({
  selector: 'app-goals-tutorial',
  templateUrl: './goals-tutorial.component.html',
  styleUrls: ['./goals-tutorial.component.scss'],
})
export class GoalsTutorialComponent implements OnInit {


  constructor(public modalCtrl: ModalController) {
   }

  ngOnInit() {}

  goBack(){
    this.modalCtrl.dismiss();
  }

}
