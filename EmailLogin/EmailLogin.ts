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
    UntypedFormGroup
} from '@angular/forms';
import {
    UntypedFormBuilder
} from '@angular/forms';
import {
    Validators
} from '@angular/forms';
import {
    ExportedClass as AuthService
} from '../scripts/custom/AuthService';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
    templateUrl: 'EmailLogin.html',
    selector: 'email-login',
    styleUrls: ['EmailLogin.scss']
})
export class EmailLogin {
    public fm: UntypedFormGroup;
    public username: string;
    public currentItem: any = null;
    public mappingData: any = {};
    private subscription: Subscription;
    constructor(public authService: AuthService, public userSvc: userService, public formBuilder: UntypedFormBuilder, public navCtrl: NavController, public router: Router, private recaptchaV3Service: ReCaptchaV3Service) {
        this.fm = this.formBuilder.group({
            "username": [this.username, Validators.email]
        });
    }
    sendLink() {
        if (!this.fm.valid) {
            this.errorMessage();
            return;
        }
        this.userSvc.toast("Sending OTP to your email...");
        this.username = this.fm.value.username;

        this.userSvc.presentLoader();
        this.subscription = this.recaptchaV3Service.execute('emailLogin')
            .subscribe((token) => {
                this.authService.sendOTP(this.username, token).then(res => {
                    if (res.data.sendOTP) {
                        this.userSvc.toast("OTP sent to your email.");
                        this.userSvc.dismissLoader();
                        this.router.navigate(['confirmCode', this.username]);
                    } else {
                        this.userSvc.toast("There was a problem. Please try again.");
                        this.userSvc.dismissLoader();
                    }
                }, () => {
                    this.userSvc.dismissLoader();
                })
            }, (error) => {
                console.error(`Recaptcha v3 error:`, error);
            })
    }
    errorMessage() {
        var message = "Error";
        if (!this.fm.controls.username.valid) {
            message = "Login should be a valid email address.";
        }
        this.userSvc.toast(message);
        this.userSvc.dismissLoader();
    }
    ionViewWillLeave() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}