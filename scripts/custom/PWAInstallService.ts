import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IosPWAInstallDialog } from '../../IosPWAInstallDialog/IosPWAInstallDialog';
import { Platform } from '@ionic/angular';
/*
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


@Injectable()
class PWAInstallService {
    constructor(private modalController: ModalController, private platform:Platform) {
    }
    
  private isIos(): boolean {
      return this.platform.is("ios");
  }    
  
  private isPWA(): boolean {
      return this.platform.is("pwa");
  }
  
  private isCordova(): boolean {
      return this.platform.is("cordova");
  }
  
//   async presentIosInstallModal(){
//       if (!this.isCordova() && !this.isPWA() && this.isIos()) {
//         const modal = await this.modalController.create({
//             component: IosPWAInstallDialog,
//             cssClass: "pwa-install-modal"
//         });
//         await modal.present(); 
//       }
//   }
}

/*
    Service class should be exported as ExportedClass
*/
export { PWAInstallService as ExportedClass };
