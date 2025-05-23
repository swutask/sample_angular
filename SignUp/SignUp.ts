import {
    Component
} from '@angular/core';
import {
    NavController
} from '@ionic/angular';
import {
    ExportedClass as userService
} from '../scripts/custom/userService';
import {
    UntypedFormControl,
    UntypedFormGroup
} from '@angular/forms';
import {
    UntypedFormBuilder
} from '@angular/forms';
import {
    Validators
} from '@angular/forms';
import {
    Router
} from '@angular/router';
import {
    ExportedClass as AuthService
} from '../scripts/custom/AuthService';
import { IonIntlTelInputValidators } from 'ion-intl-tel-input';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Subscription } from 'rxjs';
import { NavigationOptions } from '@ionic/angular/providers/nav-controller';
import { slidecustomAnimation } from '../animations/slideDownAnimation';

@Component({
    templateUrl: 'SignUp.html',
    selector: 'page-sign-up[start-page]',
    styleUrls: ['SignUp.scss']
})
export class SignUp {
    public fm: UntypedFormGroup;
    public currentItem: any = null;
    public mappingData: any = {};
    public preferredCountries = ["us"];
    public showPhoneCode = false;
    phoneCodeValidator: any = [];
    public code: string;
    private signUpSubscription: Subscription;
    private sendOtpSubscription: Subscription;
    private loginSubscription: Subscription;



    signup() {
        if (!this.fm.valid) {
            this.errorMessage();
            return;
        }
        const phone = `+${this.phoneNumber.value.internationalNumber.replace(/\D+/g, '')}`;
        const countryCode = this.phoneNumber.value.dialCode;

        this.userSvc.presentLoader();
        this.signUpSubscription = this.recaptchaV3Service.execute('signUp')
            .subscribe((token) => {
                this.authService.signUp(countryCode, phone, token).then((res: any) => {
                    if (res.data.signUp) {
                        this.userSvc.toast("User successfully registered, sending OTP to your phone");
                        this.sendOtpSubscription = this.recaptchaV3Service.execute('sendOtp')
                            .subscribe((otpToken) => {
                                this.authService.sendOTP(phone, otpToken).then(res => {
                                    this.userSvc.dismissLoader();
                                    if (res.data.sendOTP) {
                                        this.userSvc.toast("OTP was sent to your phone.");
                                        this.showPhoneCode = true;
                                        this.phoneCodeValidator = Validators.compose([Validators.minLength(6),
                                        Validators.maxLength(6)]);
                                        this.phoneCode.setValidators(this.phoneCodeValidator);
                                        this.phoneCode.updateValueAndValidity();
                                        this.fm.updateValueAndValidity()
                                        // this.router.navigate(['confirmCode', phone]);
                                    }
                                }, () => {
                                    this.userSvc.dismissLoader();
                                })
                            })
                    }
                }, () => {
                    this.userSvc.dismissLoader();
                })
            }, (error) => {
                this.userSvc.dismissLoader();

            })
    }
    constructor(private userSvc: userService, private formBuilder: UntypedFormBuilder, private navCtrl: NavController, public router: Router, public authService: AuthService, private recaptchaV3Service: ReCaptchaV3Service) {
        this.fm = this.formBuilder.group({
            "phoneNumber": new UntypedFormControl(null, [
                Validators.required,
                IonIntlTelInputValidators.phone
            ]),
            "phoneCode": [this.code, this.phoneCodeValidator]
        });
    }

    get phoneNumber() { return this.fm.get('phoneNumber'); }

    get phoneCode() { return this.fm.get('phoneCode'); }

    errorMessage() {
        var message = "Error";
        if (!this.fm.controls.phoneNumber.valid) {
            message = "Phone should be a valid phone number.";
        }
        this.userSvc.toast(message);
    }
    navigateTo(page) {
        this.router.navigate([page]);
    }

    confirmCode() {
        if (!this.fm.valid) {
            this.errorMessage();
            return;
        }
        this.code = this.fm.value.phoneCode;
        let username = `+${this.phoneNumber.value.internationalNumber.replace(/\D+/g, '')}`
        this.userSvc.presentLoader();
        this.loginSubscription = this.recaptchaV3Service.execute('loginOtp')
            .subscribe((token) => {
                this.authService.loginOTP(username, this.code, false, token)
                    .then(res => {
                        this.userSvc.dismissLoader();
                        let options:NavigationOptions={
                            animation: slidecustomAnimation
                        }
                        this.navCtrl.navigateBack('intro-finish',options);
                    }, () => {
                        this.userSvc.dismissLoader();
                    })
            })
    }

    sendOTP() {
        this.userSvc.presentLoader();
        let username = `+${this.phoneNumber.value.internationalNumber.replace(/\D+/g, '')}`
        this.sendOtpSubscription = this.recaptchaV3Service.execute('sendOtp')
            .subscribe((otpToken) => {
                this.authService.sendOTP(username, otpToken).then(res => {
                    this.userSvc.dismissLoader();
                    if (res) this.userSvc.toast("One time password has been sent to you")
                }, () => {
                    this.userSvc.dismissLoader();
                })
            })
    }

    ionViewWillLeave() {
        if (this.signUpSubscription) {
            this.signUpSubscription.unsubscribe();
        }
        if (this.sendOtpSubscription) {
            this.sendOtpSubscription.unsubscribe();
        }
        if(this.loginSubscription) {
            this.loginSubscription.unsubscribe();
        }
    }

    back(){
        let options:NavigationOptions={
            animation: slidecustomAnimation
        }
        this.navCtrl.navigateBack('intro-lifestyle',options);
    }
}