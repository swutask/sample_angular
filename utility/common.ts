import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";

@Injectable()
export class CommonProvider {
  constructor(private toastCtrl: ToastController){

  }
  GenerateYearsArray(offset = 100) {
    var max = new Date().getFullYear();
    var min = max - offset;
    var years = [];

    for (var i = max; i >= min; i--) {
      years.push(i);
    }

    return years;
  }
  generateRandomInteger(max) {
    return Math.floor(Math.random() * max) + 1;
  }

  async toast(message:string, position:'top' | 'bottom' = 'bottom') {
    let _t = await this.toastCtrl.create({
      message,
      duration: 3000,
      position,
      mode:'md'
    });
    _t.present();
  }

  numberWithCommas(x:number | string='') {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

   delay = ms => new Promise(resolve => setTimeout(resolve, ms));

}
