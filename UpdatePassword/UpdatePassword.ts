import {
    Component
} from '@angular/core';
import {
    Router
} from '@angular/router';
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
@Component({
    templateUrl: 'UpdatePassword.html',
    selector: 'page-update-password',
    styleUrls: ['UpdatePassword.scss']
})
export class UpdatePassword {
    public password: string;
    public password2: string;
    public fm: UntypedFormGroup;
    public currentItem: any = null;
    public mappingData: any = {};
    constructor(private formBuilder: UntypedFormBuilder, private userSvc: userService, public router: Router) {
        this.fm = this.formBuilder.group({
            "password": [this.password],
            "password2": [this.password]
        });
        this.fm = this.formBuilder.group({
            "password": [this.password, Validators.compose([
                Validators.required,
                Validators.minLength(8)
            ])],
            "password2": [this.password, Validators.compose([
                Validators.required,
                Validators.minLength(8)
            ])]
        });
    }
    updatePwd() {
        if (!this.fm.valid) {
            this.errorMessage();
            return;
        }
        this.password = this.fm.value.password;
        this.password2 = this.fm.value.password2;
        if (this.password !== this.password2) {
            this.userSvc.toast("Passwords do not match");
            return;
        }
    }
    errorMessage() {
        var message = "Error";
        if (!this.fm.controls.password.valid) {
            message = "Password should be at least 8 characters long.";
        }
        this.userSvc.toast(message);
    }
}