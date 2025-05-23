import parsePhoneNumberFromString from 'libphonenumber-js'
import {
  Component
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  ModalController
} from '@ionic/angular';
import {
  EditProfileConfirmationCodeModal
} from '../EditProfileConfirmationCodeModal/EditProfileConfirmationCodeModal';
import {
  ExportedClass as userService
} from '../scripts/custom/userService';
import { IonIntlTelInputValidators } from 'ion-intl-tel-input';

@Component({
  selector: 'app-page1',
  templateUrl: './page1.page.html',
  styleUrls: ['./page1.page.scss'],
})

export class Page1Page {
  public fm: UntypedFormGroup;
  public phone: string;
  public preferredCountries = ["us"];
  public onlyCountries = [];

  constructor(
    public formBuilder: UntypedFormBuilder,
    public route: ActivatedRoute,
    public router: Router,
    public modalController: ModalController,
    public userSvc: userService
  ) {
    this.fm = this.formBuilder.group({
      "phoneNumber": new UntypedFormControl(null, [
        Validators.required,
        IonIntlTelInputValidators.phone
      ]),
    });

    const phoneWithCountryCode = this.route.snapshot.paramMap.get('phone');
    const countryCode = `+${parsePhoneNumberFromString(phoneWithCountryCode).countryCallingCode}`;
    const country = parsePhoneNumberFromString(phoneWithCountryCode)?.country?.toLowerCase();
    const nationalNumber = parsePhoneNumberFromString(phoneWithCountryCode)?.nationalNumber;

    this.fm.patchValue({
      phoneNumber: {
        dialCode: countryCode,
        internationalNumber: phoneWithCountryCode,
        isoCode: country,
        nationalNumber
      }
    })

    this.onlyCountries.push(country?.toLowerCase())
  }

  get phoneNumber() { return this.fm.get('phoneNumber'); }

  submit() {
    if (!this.fm.valid) {
      this.errorMessage();
      return;
    }

    const phone = `+${this.phoneNumber.value.internationalNumber.replace(/\D+/g, '')}`;

    this.userSvc.presentLoader();
    this.userSvc.verifyPhone(phone).subscribe(res => {
      this.userSvc.dismissLoader();
      if (res) {
        this.openConfirmationCodeModal(phone, "phone");
      }
    }, () => {
      this.userSvc.dismissLoader();
    })
  }

  async openConfirmationCodeModal(input, type) {
    const modal = await this.modalController.create({
      component: EditProfileConfirmationCodeModal,
      cssClass: 'customaccount phoneNumberModal',
      componentProps: {
        phoneOrEmail: input,
        type
      }
    });

    modal.onDidDismiss().then(({ data }) => {
      if (data && data.isValid) {
        this.userSvc.toast(`${type} has been updated successfully.`)
        this.router.navigate(['']);
      }
    });

    return await modal.present();
  }

  errorMessage() {
    var message = "Error";
    if (!this.fm.controls.phoneNumber.valid) {
      message = "Please enter your mobile phone number.";
    }

    this.userSvc.toast(message);
  }
}
