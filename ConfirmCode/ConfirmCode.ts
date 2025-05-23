import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  ExportedClass as AuthService
} from '../scripts/custom/AuthService';
import {
  ExportedClass as userService
} from '../scripts/custom/userService';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Subscription } from 'rxjs';

@Component({
  selector: 'confirm-code',
  templateUrl: './ConfirmCode.html',
  styleUrls: ['./ConfirmCode.scss'],
})

export class ConfirmCode {
  public fm: UntypedFormGroup;
  public code: string;
  public username: string;
  private confirmCodeSubscription: Subscription;
  private sendOtpSubscription: Subscription;
  constructor(
    public formBuilder: UntypedFormBuilder,
    public authService: AuthService,
    public route: ActivatedRoute,
    public userSvc: userService,
    public router: Router,
    private recaptchaV3Service: ReCaptchaV3Service
  ) {
    this.username = this.route.snapshot.paramMap.get('username');

    this.fm = this.formBuilder.group({
      "code": [this.code, Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6)
      ])]
    })
  }

  confirmCode() {
    if (!this.fm.valid) {
      this.errorMessage();
      return;
    }

    this.code = this.fm.value.code;

    this.userSvc.presentLoader();
    this.confirmCodeSubscription = this.recaptchaV3Service.execute('confirmCode')
      .subscribe((token) => {
    this.authService.loginOTP(this.username, this.code, false, token)
      .then(res => {
        this.userSvc.dismissLoader();
      }, () => {
        this.userSvc.dismissLoader();
      })
    }, (error) => {

    })
  }

  sendOTP() {
    this.userSvc.presentLoader();
    this.sendOtpSubscription = this.recaptchaV3Service.execute('sendOTP')
      .subscribe((token) => {
        this.authService.sendOTP(this.username, token).then(res => {
          this.userSvc.dismissLoader();
          if (res) this.userSvc.toast("One time password has been sent to you")
        }, () => {
          this.userSvc.dismissLoader();
        })
      }, (error) => {

      })
  }

  errorMessage() {
    var message = "Error";
    if (!this.fm.controls.code.valid) {
      message = "Please enter a valid code.";
    }
    this.userSvc.toast(message);
  }
  
  ionViewWillLeave() {
    if (this.confirmCodeSubscription) {
      this.confirmCodeSubscription.unsubscribe();
    }

    if (this.sendOtpSubscription) {
      this.sendOtpSubscription.unsubscribe();
    }
  }
}
