import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ExportedClass as userService
} from '../scripts/custom/userService';
import {
  ExportedClass as AuthService
} from '../scripts/custom/AuthService';
import { Subscription } from 'rxjs';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'email-login-redirect',
  templateUrl: './EmailLoginRedirect.html',
  styleUrls: ['./EmailLoginRedirect.scss'],
})
export class EmailLoginRedirectPage {
  private subscription: Subscription

  constructor(
    public route: ActivatedRoute,
    public userSvc: userService,
    public authService: AuthService,
    public router: Router,
    private recaptchaV3Service: ReCaptchaV3Service
  ) {
    this.userSvc.presentLoader()
  }

  ionViewDidEnter() {
    let otp = this.route.snapshot.paramMap.get('otp')

    /*
     TODO add setTimeout because of this issue
     https://github.com/awslabs/aws-mobile-appsync-sdk-js/issues/102
    */
    setTimeout(() => {
      this.confirmCode(null, otp);
    }, 2000)
  }

  confirmCode(email, otp) {
    this.subscription = this.recaptchaV3Service.execute('emailLoginRedirect')
      .subscribe((token) => {
        this.authService.loginOTP(email, otp, true, token)
          .then((res: any) => {
            this.userSvc.dismissLoader();
          }, () => {
            this.userSvc.dismissLoader();
          })
      }, (error) => {
        console.error(`Recaptcha v3 error:`, error);
      })
  }

  ionViewWillLeave() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}