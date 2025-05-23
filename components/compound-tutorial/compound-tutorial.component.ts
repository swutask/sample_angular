import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import _ from 'lodash';


@Component({
  selector: 'app-compound-tutorial',
  templateUrl: './compound-tutorial.component.html',
  styleUrls: ['./compound-tutorial.component.scss'],
})
export class CompoundTutorialComponent implements OnInit {


  constructor(public modalCtrl: ModalController) {
   }

  ngOnInit() {}

  goBack(){
    this.modalCtrl.dismiss();
  }

}
