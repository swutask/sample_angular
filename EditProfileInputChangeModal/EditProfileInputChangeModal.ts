import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {
  ModalController
} from '@ionic/angular';
import { IonIntlTelInputValidators } from 'ion-intl-tel-input';
import {
  ExportedClass as userService
} from '../scripts/custom/userService';

@Component({
  selector: 'edit-profile-input-change-modal',
  templateUrl: './EditProfileInputChangeModal.html',
  styleUrls: ['./EditProfileInputChangeModal.scss'],
})

export class EditProfileInputChangeModal implements OnInit {
  @Input() type: string;

  public fm: UntypedFormGroup;
  public email: string;
  public preferredCountries = ["us"];

  constructor(
    public formBuilder: UntypedFormBuilder,
    public modalCtrl: ModalController,
    public userSvc: userService
  ) { }

  ngOnInit() {
    this.type === 'phone' ?
      this.initalizePhoneForm() :
      this.initializeEmailForm()
  }

  initalizePhoneForm() {
    this.fm = this.formBuilder.group({
      "phoneNumber": new UntypedFormControl(null, [
        Validators.required,
        IonIntlTelInputValidators.phone
      ]),
    })
  }

  initializeEmailForm() {
    this.fm = this.formBuilder.group({
      "email": [this.email, Validators.compose([
        Validators.required,
        Validators.email
      ])]
    })
  }

  get phoneNumber() { return this.fm.get('phoneNumber'); }

  verify() {
    if (!this.fm.valid) {
      this.errorMessage();
      return;
    }

    let methodName: string;
    let input: string;

    if (this.type === 'phone') {
      methodName = 'verifyPhone';
      input = `+${this.phoneNumber.value.internationalNumber.replace(/\D+/g, '')}`;
    } else if (this.type === 'email') {
      methodName = 'verifyEmail';
      input = this.fm.value.email;
    }

    if (methodName && input) {
      this.userSvc.presentLoader();
      this.userSvc[methodName](input).subscribe(res => {
        this.userSvc.dismissLoader();
        if (res) {
          this.modalCtrl.dismiss({ otpSent: true, input });
        }
      }, () => {
        this.userSvc.dismissLoader();
      })
    }
  }

  errorMessage() {
    var message = "Error";
    if (this.type === 'phone') {
      if (!this.fm.controls.phoneNumber.valid) {
        message = "Please enter your mobile phone number.";
      }
    } else if (this.type === 'email') {
      if (!this.fm.controls.email.valid) {
        message = "Email should be valid.";
      }
    }
    this.userSvc.toast(message);
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
