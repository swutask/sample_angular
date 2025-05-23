import { Injectable } from '@angular/core';
import { UrlTree, CanDeactivate } from '@angular/router';
import { Observable } from "rxjs/Observable";
import {
    ExportedClass as userService
} from './userService';
import { Page1Page } from 'src/app/page1/page1.page';

@Injectable()

class Page1DeActivateGuard implements CanDeactivate<Page1Page> {
    constructor(private userSvc: userService) { }

    canDeactivate(component: Page1Page): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.userSvc.getUserOnce().toPromise().then(res => {
            return !res.data.user.migratedUser;
        })

    }
}

export { Page1DeActivateGuard as ExportedClass };
