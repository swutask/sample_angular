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
  Router
} from '@angular/router';
import {
  ModalController
} from '@ionic/angular';
import { IonIntlTelInputValidators } from 'ion-intl-tel-input';
import {
  EditProfileConfirmationCodeModal
} from '../EditProfileConfirmationCodeModal/EditProfileConfirmationCodeModal';
import {
  ExportedClass as userService
} from '../scripts/custom/userService';

@Component({
  selector: 'app-page2',
  templateUrl: './page2.page.html',
  styleUrls: ['./page2.page.scss'],
})

export class Page2Page {
  public fm: UntypedFormGroup;
  public phone: string;
  public preferredCountries = ["us"];

  constructor(
    public formBuilder: UntypedFormBuilder,
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
      if(data && data.isValid) {
        this.userSvc.toast(`${type} has been updated successfully.`)
        this.router.navigate(['']);
      }
    });

    return await modal.present();
  }

  errorMessage() {
    var message = "Error";
    if (!this.fm.controls.phoneNumber.valid) {
      message = "Phone number can only consist of numbers.";
    }

    this.userSvc.toast(message);
  }
}
