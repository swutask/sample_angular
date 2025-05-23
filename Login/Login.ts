import { Component, ViewChild } from '@angular/core';
import { ExportedClass as userService } from '../scripts/custom/userService';
import { ExportedClass as RouterOutletService } from '../scripts/custom/RouterOutletService';
import { ExportedClass as AuthService } from '../scripts/custom/AuthService';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { UntypedFormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonIntlTelInputValidators } from 'ion-intl-tel-input';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Subscription } from 'rxjs';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { IonInput, Platform } from '@ionic/angular';

@Component({
  templateUrl: 'Login.html',
  selector: 'page-login[start-page]',
  styleUrls: ['Login.scss'],
})
export class Login {
  public fm: UntypedFormGroup;
  public currentItem: any = null;
  public mappingData: any = {};
  public preferredCountries = ['us'];
  public userName: string;
  public phoneValidator = [
    Validators.required,
    IonIntlTelInputValidators.phone,
  ];
  public emailValidator = [Validators.email];
  public type: string;
  public code: string;
  public showPhoneCode = false;
  public showEmailCode = false;
  phoneCodeValidator: any = [];
  emailCodeValidator: any = [];
  public frontEndAppVersion: string;
  public lowestAllowedAppVersion: string;
  public isVersionAllowedToContinue: Boolean;
  private loginOtpSubscription: Subscription;
  private sendOtpSubscription: Subscription;
  private loginSubscription: Subscription;
  public registrationLink: string;
  @ViewChild('codeemail') codeemail:IonInput;
  @ViewChild('codephone') codephone:IonInput;

  constructor(
    public formBuilder: UntypedFormBuilder,
    public userSvc: userService,
    public router: Router,
    public routerOutletService: RouterOutletService,
    public authService: AuthService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private iab: InAppBrowser,
    private platform: Platform
  ) {
    // the isVersionAllowedToContinue variable must be assigned to true first otherwise the modal
    // will flash as it waits for the backend response
    this.isVersionAllowedToContinue = true;
    this.frontEndAppVersion = this.authService.getAppVersion();
    this.type = 'phone';
    this.fm = this.formBuilder.group({
      phoneNumber: new UntypedFormControl(null, this.phoneValidator),
      username: [this.userName, this.emailValidator],
      phoneCode: [this.code, this.phoneCodeValidator],
      emailCode: [this.code, this.emailCodeValidator],
    });
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

  get phoneNumber() {
    return this.fm.get('phoneNumber');
  }
  get username() {
    return this.fm.get('username');
  }
  get phoneCode() {
    return this.fm.get('phoneCode');
  }
  get emailCode() {
    return this.fm.get('emailCode');
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
      if (!this.fm.valid) {
        this.errorMessage();
        return;
      }
      if (this.type == 'phone') {
        this.userSvc.toast('Sending OTP to your phone...');
        const phone = `+${this.phoneNumber.value.internationalNumber.replace(
          /\D+/g,
          ''
        )}`;

        this.userSvc.presentLoader();
        this.loginSubscription = this.recaptchaV3Service
          .execute('login')
          .subscribe(
            (token) => {
              this.authService.sendOTP(phone, token).then(
                (res) => {
                  this.userSvc.dismissLoader();
                  if (res.data.sendOTP) {
                    this.userSvc.toast(
                      'OTP sent to your phone. Use email if phone OTP not received within 1 minute',
                      6000
                    );
                    this.showPhoneCode = true;
                    this.phoneCodeValidator = Validators.compose([
                      Validators.minLength(6),
                      Validators.maxLength(6),
                    ]);
                    this.emailCodeValidator = [];
                    this.phoneCode.setValidators(this.phoneCodeValidator);
                    this.emailCode.setValidators(this.emailCodeValidator);
                    this.phoneCode.updateValueAndValidity();
                    this.emailCode.updateValueAndValidity();
                    this.fm.updateValueAndValidity();
                    this.codephone.setFocus();
                    // this.router.navigate(['confirmCode', phone]);
                  } else if (res.errors) {
                    this.userSvc.dismissLoader();
                  } else {
                    this.userSvc.toast(
                      'There was a problem. Please try again.'
                    );
                    this.userSvc.dismissLoader();
                  }
                },
                () => {
                  this.userSvc.dismissLoader();
                }
              );
            },
            (error) => {
              console.error(`Recaptcha v3 error:`, error);
            }
          );
      } else {
        this.userSvc.toast('Sending OTP to your email...');
        this.userName = this.fm.value.username;

        this.userSvc.presentLoader();
        this.loginSubscription = this.recaptchaV3Service
          .execute('login')
          .subscribe((token) => {
            this.authService.sendOTP(this.userName, token).then(
              (res) => {
                if (res.data.sendOTP) {
                  this.userSvc.toast('OTP sent to your email.');
                  this.userSvc.dismissLoader();
                  // this.router.navigate(['confirmCode', this.username]);
                  this.showEmailCode = true;
                  this.emailCodeValidator = Validators.compose([
                    Validators.minLength(6),
                    Validators.maxLength(6),
                  ]);
                  this.phoneCodeValidator = [];
                  this.phoneCode.setValidators(this.phoneCodeValidator);
                  this.emailCode.setValidators(this.emailCodeValidator);
                  this.phoneCode.updateValueAndValidity();
                  this.emailCode.updateValueAndValidity();
                  this.codeemail.setFocus();
                  this.fm.updateValueAndValidity();
                } else {
                  this.userSvc.toast('There was a problem. Please try again.');
                  this.userSvc.dismissLoader();
                }
              },
              () => {
                this.userSvc.dismissLoader();
              }
            );
          });
      }
    }
  }
  errorMessage() {
    var message = 'Error';
    if (!this.fm.controls.phoneNumber.valid) {
      message = 'Please enter your mobile phone number.';
    }
    if (!this.fm.controls.username.valid) {
      message = 'Please enter your email.';
    }
    this.userSvc.toast(message);
  }
  navigateTo(page) {
    this.router.navigate([page]);
  }
  segmentChanged(event: any) {
    this.type = event.detail.value;
    if (this.type == 'phone') {
      this.phoneValidator = [
        Validators.required,
        IonIntlTelInputValidators.phone,
      ];
      this.emailValidator = [];
    } else {
      this.phoneValidator = [];
      this.emailValidator = [Validators.required, Validators.email];
    }
    this.fm.updateValueAndValidity();
    this.phoneNumber.setValidators(this.phoneValidator);
    this.username.setValidators(this.emailValidator);
    this.phoneNumber.updateValueAndValidity();
    this.username.updateValueAndValidity();
    this.fm.updateValueAndValidity();
  }

  confirmCode() {
    if (!this.fm.valid) {
      this.errorMessage();
      return;
    }
    this.code =
      this.type === 'phone' ? this.fm.value.phoneCode : this.fm.value.emailCode;
    let username;
    if (this.type === 'phone')
      username = `+${this.phoneNumber.value.internationalNumber.replace(
        /\D+/g,
        ''
      )}`;
    else username = this.fm.value.username;
    this.userSvc.presentLoader();
    this.loginOtpSubscription = this.recaptchaV3Service
      .execute('loginOtp')
      .subscribe(
        (token) => {
          this.authService.loginOTP(username, this.code, false, token).then(
            (res) => {
              localStorage.removeItem('msgShown');
              this.userSvc.dismissLoader();
              if (res) {
                this.fm.patchValue({
                  phoneNumber: {
                    dialCode: '+1',
                    internationalNumber: '+1',
                    isoCode: 'us',
                    nationalNumber: '',
                  },
                  username: '',
                  phoneCode: '',
                  emailCode: '',
                });
                this.fm.markAsUntouched();
                this.showEmailCode = false;
                this.showPhoneCode = false;
              }
            },
            () => {
              this.userSvc.dismissLoader();
            }
          );
        },
        (error) => {
          console.error(`Recaptcha v3 error:`, error);
        }
      );
  }

  sendOTP() {
    this.userSvc.presentLoader();
    let username;
    if (this.type === 'phone')
      username = `+${this.phoneNumber.value.internationalNumber.replace(
        /\D+/g,
        ''
      )}`;
    else username = this.fm.value.username;

    this.sendOtpSubscription = this.recaptchaV3Service
      .execute('sendOtp')
      .subscribe((otpToken) => {
        this.authService.sendOTP(username, otpToken).then(
          (res) => {
            this.userSvc.dismissLoader();
            if (res)
              this.userSvc.toast('One time password has been sent to you');
          },
          () => {
            this.userSvc.dismissLoader();
          }
        );
      });
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
