import {
    Component
} from '@angular/core';
import { NavController } from '@ionic/angular';
import {
    ExportedClass as userService
  } from '../scripts/custom/userService';

@Component({
    templateUrl: 'MyProfile.html',
    selector: 'my-profile',
    styleUrls: ['MyProfile.scss']
})
export class MyProfile {
    public supportLink: string;
    public access: string = 'Free';

    constructor(public userSvc: userService, public navCtrl: NavController) {
        this.userSvc.configurations().toPromise().then(res => {
            const { data: {configurations} } = res;
            this.supportLink = configurations.find(x => x.key === "supportLink").value;
        })
    }  
    openProfile(){ 
        this.navCtrl.navigateForward('profile')
    }
    openSupport() {
        this.userSvc.browser(this.supportLink);
      }
      getProfile(forceUpdate ? ) {
        return new Promise((resolve) => {
            this.userSvc.getUser(forceUpdate).subscribe(({ data }) => {
                if (data && data.user) {
                    const { user } = data;
                    // this.profile = {
                    //     firstName: user.firstName,
                    //     lastName: user.lastName,
                    //     avatar: user.avatar,
                    //     bio: user.bio,
                    //     location: user.location,
                    //     phone: user.phone,
                    //     email: user.email,
                    //     website: user.website,
                    //     birthday: user.birthday,
                    //     sex: user.sex
                    // }
                    this.access = user.access;
    
                    // if(user.avatar) {
                    //     this.userSvc.getSignedUrl(user.avatar).subscribe((res: any) => {
                    //         if(res && res.data) {
                    //             this.profile.avatar = res.data.getSignedUrl.signedUrl;
                    //             resolve(true);
                    //         }
                    //     })
                    // }
                }
            })
        })
      }
}
