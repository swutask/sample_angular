import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';
// import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { ExportedClass as userService } from './scripts/custom/userService';
import { ExportedClass as RouterOutletService } from './scripts/custom/RouterOutletService';
import { ExportedClass as AuthService } from './scripts/custom/AuthService';
import { ExportedClass as PWAInstallService } from './scripts/custom/PWAInstallService';
import { ExportedClass as AppSideMenuService } from './scripts/custom/AppSideMenuService';
import { IonRouterOutlet } from '@ionic/angular';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { AppSyncService } from './scripts/services/AppSyncService';
import { SplashScreen } from '@capacitor/splash-screen';
import _ from 'lodash';

@Component({
  templateUrl: 'app.html',
  selector: 'app-root',
  styleUrls: ['app.scss'],
})
export class app {
  public navCtrl: NavController;
  @ViewChild(IonRouterOutlet) public routerOutlet: IonRouterOutlet;
  public currentItem: any = null;
  public mappingData: any = {};
  public supportLink: string;
  constructor(
    public apppSyncService: AppSyncService,
    private $aio_changeDetector: ChangeDetectorRef,
    public platform: Platform,
    public statusBar: StatusBar,
    // public splashScreen: SplashScreen,
    private menuCtrl: MenuController,
    public router: Router,
    public userSvc: userService,
    public routerOutletService: RouterOutletService,
    public authService: AuthService,
    public pwaInstallService: PWAInstallService,
    public screenOrientation: ScreenOrientation,
    public appSideMenuService: AppSideMenuService
  ) {
    // do not remove this code unless you know what you do
    if (this.platform.is('android')) {
      SplashScreen.show();
      setTimeout(() => {
        SplashScreen.hide();
      }, 3000);
    }
    this.platform.ready().then(() => {
      setTimeout(() => {
        SplashScreen.hide();
      }, 3000);
      if (this.platform.is('cordova') && !this.platform.is('ios')) {
        this.screenOrientation.lock('portrait');
      }
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.overlaysWebView(false);
      this.statusBar.styleDefault();

      // iOS does not respect some of the splash screen plugins. Therefore we must use a setTimeout here

      //From the docs: https://ionic.io/docs/supported-plugins/statusbar

      this.statusBar.backgroundColorByHexString('#F3F4F4');
      this.statusBar.show();

      // this displays the PWA modal if user is viewing app on a mobile browser
      // setTimeout(() => {
      //     this.pwaInstallService.presentIosInstallModal();
      // }, 4000);
    });
    this.userSvc
      .configurations()
      .toPromise()
      .then((res) => {
        const {
          data: { configurations },
        } = res;
        this.supportLink = configurations.find(
          (x) => x.key === 'supportLink'
        ).value;
      });
  }
  openSupport() {
    this.userSvc.browser(this.supportLink);
  }
  ngAfterViewInit() {
    this.routerOutletService.init(this.routerOutlet);
    (function (w, d, u) {
      var s = d.createElement('script');
      s.async = true;
      s.src = u + '?' + ((Date.now() / 60000) | 0);
      var h =
        d.getElementsByTagName('script')[
          d.getElementsByTagName('script').length - 1
        ];
      h.parentNode.insertBefore(s, h.nextSibling);
    })(
      window,
      document,
      'https://cdn.bitrix24.com/b10745345/crm/site_button/loader_3_h1nzbj.js'
    );
  }
}
