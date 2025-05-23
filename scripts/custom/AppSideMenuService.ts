import { Injectable } from '@angular/core';
import {ExportedClass as AuthService} from './AuthService';
/*
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


@Injectable()
class AppSideMenuService {

    public sideMenuEnabled = false;

    constructor(public authService: AuthService) {}

    bindHandlers() {
        this.authService.off(AuthService.LOGIN_EVENT, this.enableSideMenu.bind(this)).on(AuthService.LOGIN_EVENT, this.enableSideMenu.bind(this));
        this.authService.off(AuthService.LOGOUT_EVENT, this.disableSideMenu.bind(this)).on(AuthService.LOGOUT_EVENT, this.disableSideMenu.bind(this));
    }

    enableSideMenu() {
        this.sideMenuEnabled = true;
    }

    disableSideMenu() {
        this.sideMenuEnabled = false;
    }

    setSideMenuEnabled(value: boolean) {
        this.sideMenuEnabled = value;
    }
}

/*
    Service class should be exported as ExportedClass
*/
export { AppSideMenuService as ExportedClass };