import {Injectable} from '@angular/core';
import {ExportedClass as UserService} from '../custom/userService';
import {Observable, of} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import { ExportedClass as AuthService} from '../custom/AuthService';

/*
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


@Injectable()
class UserProfileService {
    public outdated = true;
    private profile: any;

    constructor(private userSvc: UserService, private authService: AuthService) {
        this.authService.off(AuthService.LOGOUT_EVENT, this.invalidate.bind(this)).on(AuthService.LOGOUT_EVENT, this.invalidate.bind(this));
    }

    invalidate() {
        this.outdated = true;
        this.profile = undefined;
    }
}

/*
    Service class should be exported as ExportedClass
*/
export { UserProfileService as ExportedClass };