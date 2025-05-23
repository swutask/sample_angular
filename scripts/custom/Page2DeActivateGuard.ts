import { Injectable } from '@angular/core';
import { UrlTree, CanDeactivate } from '@angular/router';
import { Observable } from "rxjs/Observable";
import { Page2Page } from 'src/app/page2/page2.page';
import {
    ExportedClass as userService
} from '../../scripts/custom/userService';
import parsePhoneNumberFromString from 'libphonenumber-js';

@Injectable()

class Page2DeActivateGuard implements CanDeactivate<Page2Page> {
    constructor(private userSvc: userService) { }

    canDeactivate(component: Page2Page): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.userSvc.getUserOnce().toPromise().then(res => {
            try {
                return parsePhoneNumberFromString(res.data.user.phone).isValid();
            } catch (error) {
                return false;
            }
        })

    }
}

export { Page2DeActivateGuard as ExportedClass };
