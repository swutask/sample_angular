import {
  Component,
  Input
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {
  ExportedClass as userService
} from '../scripts/custom/userService';
import {
  ModalController
} from '@ionic/angular';

@Component({
  selector: 'edit-profile-confirmation-code-modal',
  templateUrl: './EditProfileConfirmationCodeModal.html',
  styleUrls: ['./EditProfileConfirmationCodeModal.scss'],
})

export class EditProfileConfirmationCodeModal {
  @Input() phoneOrEmail: string;
  @Input() type: string;

  public fm: UntypedFormGroup;
  public code: string;

  constructor(
    public formBuilder: UntypedFormBuilder,
    public userSvc: userService,
    public modalController: ModalController
  ) {
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

    const methodName = this.type === 'phone' ? 'updatePhone' : 'updateEmail';

    if (methodName) {
      this.userSvc.presentLoader();
      this.userSvc[methodName](this.phoneOrEmail, this.code).subscribe(res => {
        this.userSvc.dismissLoader();
        if (res && res['data'][methodName][this.type]) {
          this.modalController.dismiss({ 
            isValid: res['data'][methodName][this.type] == this.phoneOrEmail, 
            methodName 
          });
        }
      }, () => {
        this.userSvc.dismissLoader();
      })
    }
  }

  sendOTP() {
    const methodName = this.type === 'phone' ? 'verifyPhone' : 'verifyEmail';

    this.userSvc.presentLoader();
    this.userSvc[methodName](this.phoneOrEmail).subscribe(res => {
      this.userSvc.dismissLoader();
      if (res) this.userSvc.toast(`OTP sent to your ${this.type}`)
    }, () => {
      this.userSvc.dismissLoader();
    })
  }

  errorMessage() {
    var message = "Error";
    if (!this.fm.controls.code.valid) {
      message = "Please enter a valid code.";
    }
    this.userSvc.toast(message);
  }


  close() {
    this.modalController.dismiss();
  }
}
