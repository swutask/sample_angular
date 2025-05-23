import { Injectable } from '@angular/core';
import { AppRate } from '@awesome-cordova-plugins/app-rate/ngx';

/*
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
class AppRateService {
  constructor(private appRate: AppRate) {}

  public run() {
    this.appRate.setPreferences({
      storeAppURL: {
        ios: '1166026593',
        android: 'market://details?id=com.goodbarber.wealthbuilder',
      },
    });

    this.appRate.promptForRating(true);
    // this.appRate.preferences.inAppReview = false;
    // this.appRate.preferences.simpleMode = true;
    // this.appRate.preferences.storeAppURL = {
    //   ios: '1166026593',
    //   android: 'market://details?id=com.goodbarber.wealthbuilder',
    // };
    // // @ts-ignore
    // window.AppRate.navigateToAppStore();
  }
}

/*
    Service class should be exported as ExportedClass
*/
export { AppRateService as ExportedClass };
