import { Component } from '@angular/core';
import { ExportedClass as userService } from '../scripts/custom/userService';
import { ExportedClass as RouterOutletService } from '../scripts/custom/RouterOutletService';
import { ExportedClass as AuthService } from '../scripts/custom/AuthService';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Subscription } from 'rxjs';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Platform } from '@ionic/angular';

@Component({
  templateUrl: 'AutoLogin.html',
  selector: 'page-auto-login[start-page]',
  styleUrls: ['AutoLogin.scss'],
})
export class AutoLogin {
  public currentItem: any = null;
  public mappingData: any = {};
  public preferredCountries = ['us'];
  public userName: string;
  public wplicensetoken: string;
  public frontEndAppVersion: string;
  public lowestAllowedAppVersion: string;
  public isVersionAllowedToContinue: Boolean;
  private loginOtpSubscription: Subscription;
  private sendOtpSubscription: Subscription;
  private loginSubscription: Subscription;
  public registrationLink: string;

  constructor(
    public formBuilder: UntypedFormBuilder,
    public userSvc: userService,
    public router: Router,
    public routerOutletService: RouterOutletService,
    public authService: AuthService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private activatedRoute: ActivatedRoute,
    private iab: InAppBrowser,
    private platform: Platform
  ) {
    // the isVersionAllowedToContinue variable must be assigned to true first otherwise the modal
    // will flash as it waits for the backend response
    this.activatedRoute.queryParams.subscribe(async (params) => {
      this.userName = params.email;
      this.wplicensetoken = params.siteToken;
      this.login();
    });
    this.isVersionAllowedToContinue = true;
    this.frontEndAppVersion = this.authService.getAppVersion();
    this.userSvc.article = window.location.search.split('article=')[1];
    this.userSvc
      .configurations()
      .toPromise()
      .then((res) => {
        const {
          data: { configurations },
        } = res;
        this.lowestAllowedAppVersion = configurations.find(
          (x) => x.key === 'lowestAllowedAppVersion'
        ).value;
        this.registrationLink = configurations.find(
          (x) => x.key === 'registrationLink'
        ).value;
        this.isVersionAllowedToContinue = this.verifyAppVersion(
          this.lowestAllowedAppVersion,
          this.frontEndAppVersion
        );
      });
  }

  verifyAppVersion(lowestAllowedAppVersion, frontEndAppVersion) {
    let returnVal = true;
    const lowestSplt = lowestAllowedAppVersion.split('.');
    const appSplt = frontEndAppVersion.split('.');

    const lowestAllowed = `${lowestSplt[0].padStart(
      3,
      '0'
    )}${lowestSplt[1].padStart(3, '0')}${lowestSplt[2].padStart(3, '0')}`;
    const appVersion = `${appSplt[0].padStart(3, '0')}${appSplt[1].padStart(
      3,
      '0'
    )}${appSplt[2].padStart(3, '0')}`;

    if (lowestAllowed > appVersion) {
      return false;
    }

    return returnVal;
  }

  login() {
    if (this.isVersionAllowedToContinue) {
      this.loginSubscription = this.recaptchaV3Service
        .execute('login')
        .subscribe(async (token) => {
          await this.userSvc.presentLoader();
          this.authService.sendOTP(this.userName, token, true, this.wplicensetoken).then(
            async (res) => {
              if (res.data.sendOTP) {
                await this.userSvc.dismissLoader();
                await this.confirmCode();
              } else {
                this.userSvc.toast('There was a problem. Please try again.');
                await this.userSvc.dismissLoader();
              }
            },
            async () => {
              await this.userSvc.dismissLoader();
              this.navigateTo('/login');
            }
          );
        }, (err) => {
          this.userSvc.dismissLoader();
        });
    }
  }
  
  navigateTo(page) {
    this.router.navigate([page]);
  }

  async confirmCode() {
    await this.userSvc.presentLoader();
    this.loginOtpSubscription = this.recaptchaV3Service
      .execute('loginOtp')
      .subscribe(
        (token) => {
          this.authService.loginOTP(this.userName, this.userName, false, token, true, this.wplicensetoken).then(
            async (res) => {
              await this.userSvc.dismissLoader();
              if (res) {
              }
            },
            async () => {
              await this.userSvc.dismissLoader();
              this.navigateTo('/login');
            }
          );
        },
        (error) => {
          console.error(`Recaptcha v3 error:`, error);
        }
      );
  }

  goToRegistration() {
    this.iab.create(`${this.registrationLink}`, '_system');
  }

  ionViewWillLeave() {
    if (this.loginOtpSubscription) {
      this.loginOtpSubscription.unsubscribe();
    }
    if (this.sendOtpSubscription) {
      this.sendOtpSubscription.unsubscribe();
    }
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

  update() {
    if (this.platform.is('ios'))
      this.iab.create(
        `https://apps.apple.com/us/app/wealth-builder/id1166026593`,
        '_system'
      );
    if (this.platform.is('android'))
      this.iab.create(
        `https://play.google.com/store/apps/details?id=com.goodbarber.wealthbuilder`,
        '_system'
      );
  }
}
