import { ChangeDetectorRef, Component } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  ModalController,
} from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { File, FileEntry } from '@awesome-cordova-plugins/file/ngx';
import { ExportedClass as userService } from '../scripts/custom/userService';
import { ExportedClass as TProfile } from '../scripts/custom/TProfile';
import { ExportedClass as UserProfileService } from '../scripts/custom/UserProfileService';
import { FormBuilder, FormControl } from '@angular/forms';
import { from, Subscription } from 'rxjs';
import { FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';
import { WebView } from '@awesome-cordova-plugins/ionic-webview/ngx';
import { of } from 'rxjs';
import { flatMap, tap } from 'rxjs/operators';
import { updatedDiff } from 'deep-object-diff';
import { EditProfileInputChangeModal } from '../EditProfileInputChangeModal/EditProfileInputChangeModal';
import { EditProfileConfirmationCodeModal } from '../EditProfileConfirmationCodeModal/EditProfileConfirmationCodeModal';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { format, parseISO } from 'date-fns';
import * as data from '../utility/data';
import { Validators } from '@angular/forms';
import { IonIntlTelInputValidators } from 'ion-intl-tel-input';
import { ExportedClass as AuthService } from '../scripts/custom/AuthService';
import { ExportedClass as PlaidService } from '../scripts/custom/PlaidService';
import moment from 'moment';
import { CommonProvider } from '../utility/common';
import * as momentTimezone from 'moment-timezone';
interface TimezoneOption {
  value: string;
  display: string;
}
@Component({
  templateUrl: 'EditProfile.html',
  selector: 'page-edit-profile',
  styleUrls: ['EditProfile.scss'],
})
export class EditProfile {
  public profile: TProfile = {
    firstName: '',
    lastName: '',
    avatar: '',
    bio: '',
    location: '',
    phone: '',
    website: '',
    birthday: '',
    sex: '',
    email: '',
    timeZone: '',
  };
  // public config: SelectConfig = {
  //   hideSelected: false,
  //   dropdownPosition: 'auto',
  //   appearance: 'outline',
  //   clearOnBackspace: true,
  //   closeOnSelect: true,
  //   appendTo: null,
  // };
  timezones: TimezoneOption[];
  public phoneValidator = [
    Validators.required,
    IonIntlTelInputValidators.phone,
  ];
  public preferredCountries = ['us'];
  public disableEmailEdit = true;
  public bioForm: any;
  public message: string = '';
  public imageData: any;
  public gender: string = 'male';
  public months: string[] = [...data.months];
  public days: number[] = [...data.days];
  public years: number[] = [...this.common.GenerateYearsArray()];
  public day: any = '';
  public month: any = '';
  public year: any = '';
  public joinDate: any = '';
  @ViewChild('imageuploader') public uploader: any;
  public currentItem: any = null;
  public mappingData: any = {};
  public nameOrEmailEmpty: boolean = false;
  public avatarUrl: string;
  public avatarChanged: boolean;
  public subscriptions: Subscription[] = [];
  public access: string = 'Free';
  showBirthdayPicker = false;
  public isDeletePopOpen = false;
  public isDeleteModalOpen = false;
  public deleteText = '';

  public actionSheetOptions: any = {
    cssClass: 'goals-alert',
  };

  public popoverSheetOptions: any = {
    side: 'bottom',
    size: 'cover',
    cssClass: 'full-width-option select-pop-options',
    alignment: 'center',
  };
  constructor(
    public fb: FormBuilder,
    public userSvc: userService,
    public camera: Camera,
    public actionSheetController: ActionSheetController,
    public transfer: FileTransfer,
    public file: File,
    public webview: WebView,
    public userProfileService: UserProfileService,
    public navCtrl: NavController,
    public router: Router,
    public platform: Platform,
    public modalController: ModalController,
    public http: HttpClient,
    public common: CommonProvider,
    public alertController: AlertController,
    public authService: AuthService,
    public plaidService: PlaidService
  ) {
    this.bioForm = this.fb.group({
      profile: this.fb.group({
        firstName: [''],
        lastName: [''],
        avatar: [''],
        bio: [''],
        location: [''],
        phone: new FormControl(
          { value: null, disabled: true },
          this.phoneValidator
        ),
        email: [{ value: '', disabled: false }],
        website: [''],
        birthday: [''],
        sex: [''],
        timeZone: [''],
      }),
    });
    this.day = '';
    this.month = '';
    this.year = '';
    this.disableEmailEdit = true;
    this.timezones = momentTimezone.tz.names().map((name) => {
      return {
        value: name,
        display: moment().tz(name).format('Z z') + `(${name})`,
      };
    });
  }
  ionViewWillEnter() {
    let getUserSubscription: Subscription,
      getSignedUrlSubscription: Subscription;

    getUserSubscription = this.userSvc
      .getUser()
      .subscribe(({ data: { user } }) => {
        if (user) {
          this.access = user.access;
          if (user['birthday']) {
            // Convert form UNIX Timestamp (seconds) to ISO String
            const birthday = new Date(user['birthday'] * 1000).toISOString();
            this.profile = { ...user, birthday };

            //
            // arr of year month day
            let temp: any = birthday.split('T')[0].split('-');
            this.day = temp[2];
            this.month = temp[1];
            this.year = temp[0];
            //
          } else {
            this.profile = { ...user, birthday: null };
          }
          console.log(this.profile);

          this.bioForm.patchValue({
            profile: {
              firstName: this.profile.firstName,
              lastName: this.profile.lastName,
              avatar: this.profile.avatar,
              bio: this.profile.bio,
              location: this.profile.location,
              timeZone: this.profile.timeZone,
              phone: {
                dialCode: this.profile.countryCode,
                internationalNumber: this.profile.phone,
                isoCode: 'us',
                nationalNumber: this.profile.phone.replace(
                  this.profile.countryCode,
                  ''
                ),
              },
              email: this.profile.email,
              website: this.profile.website,
              birthday: this.profile.birthday,
              sex: this.profile.sex,
            },
          });

          this.gender = this.profile.sex;
          this.joinDate = moment(this.profile.createdAt * 1000).format(
            'MMMM YYYY'
          );

          if (user.avatar) {
            getSignedUrlSubscription = this.userSvc
              .getSignedUrl(user.avatar)
              .subscribe((res: any) => {
                if (res && res.data) {
                  this.avatarUrl = res.data.getSignedUrl.signedUrl;
                }
              });
          }

          this.nameOrEmailEmpty = !(
            this.bioForm.getRawValue().profile.firstName &&
            this.bioForm.getRawValue().profile.email
          );
          if (this.nameOrEmailEmpty) {
            this.userSvc.toast(
              'Please note that First Name and Email are mandatory!'
            );
          }
        }
      });

    if (getUserSubscription) {
      this.subscriptions.push(getUserSubscription);
    }

    if (getSignedUrlSubscription) {
      this.subscriptions.push(getSignedUrlSubscription);
    }
  }
  async takePhoto(fromAlbum?: boolean) {
    try {
      let options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: 300,
        targetHeight: 300,
        correctOrientation: true,
      };
      if (fromAlbum) {
        options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
      } else {
        options.sourceType = this.camera.PictureSourceType.CAMERA;
      }
      const imageData = await this.camera.getPicture(options);
      this.imageData = imageData;
      this.avatarUrl = this.webview.convertFileSrc(imageData);
      this.imageData = imageData;
      this.startUpload().subscribe(() => {
        const userUpdatedPropertires = {};
        if (this.avatarChanged) {
          userUpdatedPropertires['avatar'] = this.profile.avatar;
        }
        if (Object.keys(userUpdatedPropertires).length) {
          this.userSvc.updateUser(userUpdatedPropertires).then(
            (res) => {
              if (userUpdatedPropertires['avatar']) {
                this.userSvc.dismissLoader();
              }
            },
            (err) => {
              if (userUpdatedPropertires['avatar']) {
                this.userSvc.dismissLoader();
              }
              console.error(err);
            }
          );
        } else {
          if (userUpdatedPropertires['avatar']) {
            this.userSvc.dismissLoader();
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  startUpload() {
    if (this.imageData) {
      this.userSvc.presentLoader();
      const uploadAction = this.isCordova()
        ? from(this.uploadPhoto())
        : from(this.uploadImageFile());
      return uploadAction.pipe(
        tap(() => {
          return {
            avatar: this.profile.avatar,
          };
        })
      );
    }
  }

  async uploadPhoto() {
    try {
      return this.getFileFromUri().then(async (res: any) => {
        const fileNameLocal = res.file.name;
        const fileType = res.file.type;
        const file = res.blob;

        const {
          data: {
            putSignedUrl: { signedUrl, fileName },
          },
        } = await this.userSvc.putSignedUrl(fileNameLocal, fileType);
        await this.http.put(signedUrl, file).toPromise();
        await this.userSvc.createFile({ name: fileName }).toPromise();
        this.profile.avatar = fileName;
        this.avatarChanged = true;
      });
    } catch (error) {
      this.userSvc.dismissLoader();
      console.error(error);
    }
  }

  getFileFromUri() {
    return new Promise(async (resolve, reject) => {
      try {
        const entry = await this.file.resolveLocalFilesystemUrl(this.imageData);
        (entry as FileEntry).file(async (file) => {
          const reader = getFileReader();
          reader.onload = () => {
            const imgBlob = new Blob([reader.result], {
              type: file.type,
            });
            resolve({ blob: imgBlob, file });
          };
          reader.readAsArrayBuffer(file);
        });
      } catch (error) {
        reject();
        console.error(error);
      }
    });
  }

  filterFromEmptyFields(obj) {
    //leaves only not empty fields
    return Object.keys(obj)
      .filter((key) => obj[key] !== undefined && obj[key] !== null)
      .reduce((acc, key) => ((acc[key] = obj[key]), acc), {});
  }

  HandleGender(gen: string) {
    this.gender = gen || 'male';
  }

  handleChange(evt, key) {
    let { value } = evt.detail;
    this[key] = value;
  }

  updateBio(formValues) {
    let _phone: any = '';
    let _timeZone: any = '';
    if (formValues.profile && formValues.profile.phone) {
      _phone = `+${formValues.profile.phone.internationalNumber.replace(
        /\D+/g,
        ''
      )}`;
    }
    if (formValues.profile && formValues.profile.timeZone) {
      _timeZone = `${formValues.profile?.timeZone}`;
    }
    //
    of({})
      .pipe(
        flatMap(() => {
          // if (this.imageData) {
          //     this.userSvc.presentLoader();
          //     const uploadAction = this.isCordova() ? from(this.uploadPhoto()) : from(this.uploadImageFile());
          //     return uploadAction.pipe(tap(() => {
          //         return {
          //             ...this.filterFromEmptyFields({...formValues.profile, phone: _phone, sex: this.gender}),
          //             avatar: this.profile.avatar,
          //         };
          //     }));
          // } else {
          return of({
            ...this.filterFromEmptyFields({
              ...formValues.profile,
              phone: _phone,
              sex: this.gender,
              timeZone: _timeZone,
            }),
          });
          // }
        })
      )
      .subscribe((newProfile) => {
        // Convert from ISO String to UNIX Timestmap (in seconds)
        let _dob: any = this.profile.birthday;
        if (this.day && this.month && this.year) {
          _dob = Math.round(
            new Date(
              `${this.year}-${this.month}-${this.day}T00:00:00.000Z`
            ).getTime() / 1000
          );
        }
        // Get only updated properties from object
        const userUpdatedPropertires = updatedDiff(
          { ...this.profile, timeZone: null },
          {
            ...this.bioForm.value.profile,
            phone: _phone,
            sex: this.gender,
            birthday: _dob,
            timeZone: _timeZone,
          }
        );
        if (this.avatarChanged) {
          userUpdatedPropertires['avatar'] = this.profile.avatar;
        }

        // Make sure object is not null (there are changes in the object)
        if (Object.keys(userUpdatedPropertires).length) {
          this.userSvc.updateUser(userUpdatedPropertires).then(
            (res) => {
              if (this.nameOrEmailEmpty) {
                return this.router.navigate(['dashboard']);
              }
              if (userUpdatedPropertires['avatar']) {
                this.userSvc.dismissLoader();
              }
              this.goBack();
            },
            (err) => {
              if (userUpdatedPropertires['avatar']) {
                this.userSvc.dismissLoader();
              }
              console.error(err);
            }
          );
        } else {
          if (this.nameOrEmailEmpty) {
            return this.router.navigate(['dashboard']);
          }
          if (userUpdatedPropertires['avatar']) {
            this.userSvc.dismissLoader();
          }
          this.goBack();
        }
      });
  }
  isCordova() {
    return this.platform.is('cordova');
  }
  chooseImageFile() {
    this.uploader.nativeElement.click();
  }
  onImageFileChange() {
    // upload selected file
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.imageData = event.target.result;
      this.avatarUrl = event.target.result;
      this.startUpload().subscribe(() => {
        const userUpdatedPropertires = {};
        if (this.avatarChanged) {
          userUpdatedPropertires['avatar'] = this.profile.avatar;
        }
        if (Object.keys(userUpdatedPropertires).length) {
          this.userSvc.updateUser(userUpdatedPropertires).then(
            (res) => {
              if (userUpdatedPropertires['avatar']) {
                this.userSvc.dismissLoader();
              }
            },
            (err) => {
              if (userUpdatedPropertires['avatar']) {
                this.userSvc.dismissLoader();
              }
              console.error(err);
            }
          );
        } else {
          if (userUpdatedPropertires['avatar']) {
            this.userSvc.dismissLoader();
          }
        }
      });
    });
    reader.readAsDataURL(this.uploader.nativeElement.files[0]);
  }
  async openAvatarActionSheetNative() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Avatar',
      buttons: [
        {
          text: 'Take photo',
          role: 'destructive',
          icon: 'camera',
          handler: () => {
            this.takePhoto();
          },
        },
        {
          text: 'Choose photo from Gallery',
          icon: 'images',
          handler: () => {
            this.takePhoto(true);
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }
  openAvatarActionSheet() {
    if (this.isCordova()) {
      this.openAvatarActionSheetNative();
    } else {
      this.chooseImageFile();
    }
  }
  async uploadImageFile() {
    try {
      const file = this.uploader.nativeElement.files[0];
      const fileNameLocal = file.name.replace(/ /g, '_');
      const {
        data: {
          putSignedUrl: { signedUrl, fileName },
        },
      } = await this.userSvc.putSignedUrl(fileNameLocal, file.type);
      await this.http.put(signedUrl, file).toPromise();
      await this.userSvc.createFile({ name: fileName }).toPromise();
      this.profile.avatar = fileName;
      this.avatarChanged = true;
    } catch (error) {
      this.userSvc.dismissLoader();
      console.error(error);
    }
  }

  goBack() {
    this.navCtrl.back();
  }
  createNewAccount() {
    this.navCtrl.navigateForward('accountDetails/new');
  }

  async openEditPhoneNumberModal() {
    const modal = await this.modalController.create({
      component: EditProfileInputChangeModal,
      cssClass: 'customaccount',
      mode: 'md',
      componentProps: {
        type: 'phone',
      },
    });

    modal.onDidDismiss().then(({ data }) => {
      if (data && data.otpSent) {
        this.openConfirmationCodeModal(data.input, 'phone');
      }
    });

    return await modal.present();
  }

  async openEditEmailModal() {
    const modal = await this.modalController.create({
      component: EditProfileInputChangeModal,
      cssClass: 'customaccount',
      componentProps: {
        type: 'email',
      },
    });

    modal.onDidDismiss().then(({ data }) => {
      if (data && data.otpSent) {
        this.openConfirmationCodeModal(data.input, 'email');
      }
    });

    return await modal.present();
  }

  async openConfirmationCodeModal(input, type) {
    const modal = await this.modalController.create({
      component: EditProfileConfirmationCodeModal,
      cssClass: 'customaccount',
      componentProps: {
        phoneOrEmail: input,
        type,
      },
    });

    modal.onDidDismiss().then(({ data }) => {
      if (data && data.isValid) {
        this.bioForm.patchValue({
          profile: {
            [type]: input,
          },
        });

        this.userSvc.toast(`${type} has been updated successfully.`);
      }
    });

    return await modal.present();
  }

  ionViewWillLeave() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  get birthdayValue() {
    return this.bioForm.controls.profile.controls.birthday.value;
  }

  get birthday() {
    const birthDay = this.bioForm.controls.profile.controls.birthday.value;
    if (birthDay) {
      return format(parseISO(birthDay), 'MM/dd/yyyy');
    }
    return '';
  }

  changeBirthdayDate(value: any) {
    this.bioForm.controls.profile.controls.birthday.setValue(value);
  }

  toggleEdit() {
    this.openEditEmailModal();
  }

  async openCodeConfirm(phoneOrEmail, type: string) {
    const options: any = {
      header: 'Code Confirmation',
      inputs: [
        {
          name: 'code',
          placeholder: 'Code',
          type: 'text',
          value: '',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Ok',
          handler: (data) => {
            const methodName = type === 'phone' ? 'updatePhone' : 'updateEmail';

            if (methodName) {
              this.userSvc.presentLoader();
              this.userSvc[methodName](phoneOrEmail, data.code).subscribe(
                (res) => {
                  this.userSvc.dismissLoader();
                  if (res && res['data'][methodName][type]) {
                    this.modalController.dismiss({
                      isValid: res['data'][methodName][type] == phoneOrEmail,
                      methodName,
                    });
                    //
                    this.bioForm.patchValue({
                      profile: {
                        [type]: phoneOrEmail,
                      },
                    });

                    this.userSvc.toast(
                      `${type} has been updated successfully.`
                    );
                    //
                  }
                },
                () => {
                  this.userSvc.dismissLoader();
                }
              );
            }
          },
        },
      ],
    };
    const createNewAlert = await this.alertController.create(options);
    return await createNewAlert.present();
  }

  async openEmailAlert() {
    const options: any = {
      header: 'Edit Email',
      inputs: [
        {
          name: 'email',
          placeholder: 'Email',
          type: 'email',
          value: '',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Ok',
          handler: (data) => {
            let methodName: string = 'verifyEmail';
            let input: string = data.email;

            if (methodName && input) {
              this.userSvc.presentLoader();
              this.userSvc[methodName](input).subscribe(
                (res) => {
                  this.userSvc.dismissLoader();
                  if (res) {
                    this.openCodeConfirm(data.email, 'email');
                  }
                },
                () => {
                  this.userSvc.dismissLoader();
                }
              );
            }
          },
        },
      ],
    };
    const createNewAlert = await this.alertController.create(options);
    return await createNewAlert.present();
  }
  hasAccessToAdmin() {
    return ['admin'].indexOf(this.access.toLowerCase()) !== -1;
  }

  openAdmin() {
    this.userSvc.browser('https://wb-admin.app.appery.io/');
  }

  deleteEvent: any;
  public deleteConfirmationMsg = '';

  public deleteConfirmationHeader = '';

  deleteConfirmation(event?) {
    this.deleteEvent = event;
    this.deleteConfirmationHeader = 'Delete my data';
    this.deleteConfirmationMsg = `Are you absolutely sure?
This action cannot be undone. This will permanently delete your entire Wealth Builder account from our servers including all data!
This will not change your billing plan. If you want to downgrade or cancel, you must contact support!
Please type DELETE to confirm.`;

    this.platform.width() > 640
      ? (this.isDeletePopOpen = !this.isDeletePopOpen)
      : (this.isDeleteModalOpen = !this.isDeleteModalOpen);
  }

  popDismiss() {
    this.isDeletePopOpen = false;

    this.isDeleteModalOpen = false;

    this.isDeletePlaidItemModalOpen = false;
    this.isDeletePlaidItemPopOpen = false;

    this.isReviewDeletedAccountModalOpen = false;
    this.isReviewDeletedAccountPopOpen = false;
  }

  async deleteConfirmed() {
    this.popDismiss();
    await this.userSvc.presentLoader();
    this.userSvc.deleteUser().subscribe(
      async () => {
        await this.authService.logout(true);
        await this.userSvc.dismissLoader();
        this.navCtrl.navigateRoot('login');
      },
      async (error) => {
        console.error(error);
        await this.userSvc.dismissLoader();
      }
    );
  }

  async goToPortal() {
    await this.userSvc.presentLoader();
    this.userSvc.createPortal().subscribe(
      async (data) => {
        if (data?.data?.createPortal?.url) {
          // window.open(data?.data?.createPortal?.url, "_blank");
          window.location.href = data?.data?.createPortal?.url;
        }
        await this.userSvc.dismissLoader();
      },
      async (error) => {
        await this.userSvc.dismissLoader();
      }
    );
  }

  async bitrixToWbSync() {
    await this.userSvc.presentLoader();
    this.userSvc.bitrixToWbSync().subscribe(
      async (data) => {
        await this.userSvc.dismissLoader();
      },
      async (error) => {
        await this.userSvc.dismissLoader();
      }
    );
  }

  public isDeletePlaidItemPopOpen = false;
  public isDeletePlaidItemModalOpen = false;
  public isReviewDeletedAccountPopOpen = false;
  public isReviewDeletedAccountModalOpen = false;
  public deletedAccounts = [];
  public plaidItem = '';

  showDeletePlaid() {
    this.platform.width() > 640
      ? (this.isDeletePlaidItemPopOpen = !this.isDeletePlaidItemPopOpen)
      : (this.isDeletePlaidItemModalOpen = !this.isDeletePlaidItemModalOpen);
  }

  async deletePlaidItemById() {
    this.deletedAccounts = [];
    this.userSvc.presentLoader().then(() => {
      this.plaidService.deleteAccountByPlaidItemId(this.plaidItem).subscribe(
        async (data: any) => {
          this.deletedAccounts = data.data.deleteAccountByPlaidItemId;
          await this.userSvc.dismissLoader();
          await this.popDismiss();
          if (this.deletedAccounts.length > 0) {
            this.platform.width() > 640
              ? (this.isReviewDeletedAccountPopOpen =
                  !this.isReviewDeletedAccountPopOpen)
              : (this.isReviewDeletedAccountModalOpen =
                  !this.isReviewDeletedAccountModalOpen);
          } else {
            await this.userSvc.toast(
              'No accounts found. Item deleted successfully'
            );
          }
          this.plaidItem = '';
        },
        async (error) => {
          await this.userSvc.dismissLoader();
          console.error(error);
          // await this.userSvc.toast("Error while deleting an Account.");
          await this.popDismiss();
        }
      );
    });
  }
}

export function getFileReader(): FileReader {
  const fileReader = new FileReader();
  const zoneOriginalInstance = (fileReader as any)[
    '__zone_symbol__originalInstance'
  ];
  return zoneOriginalInstance || fileReader;
}
