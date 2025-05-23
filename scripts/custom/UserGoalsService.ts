import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {ExportedClass as UserService} from './userService';
import {ExportedClass as goalConstants} from './goalConstants';
import { ExportedClass as AuthService} from '../custom/AuthService';

/*
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


@Injectable()
class UserGoalsService {
    public outdated = true;
    private goals: any;
    private rawResponse: any;

    constructor(private userSvc: UserService, private authService: AuthService) {
        this.authService.off(AuthService.LOGOUT_EVENT, this.invalidate.bind(this)).on(AuthService.LOGOUT_EVENT, this.invalidate.bind(this));
    }

    invalidate() {
        this.outdated = true;
        this.goals = undefined;
        this.rawResponse = undefined;
    }
}

/*
    Service class should be exported as ExportedClass
*/
export { UserGoalsService as ExportedClass };