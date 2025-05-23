import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ExportedClass as TND1Calculator } from './TND1Calculator';
import { ExportedClass as UserService } from '../custom/userService';
import { ExportedClass as UserGoalsService } from '../custom/UserGoalsService';
import {tap} from 'rxjs/operators';
import { ExportedClass as AuthService} from '../custom/AuthService';

@Injectable()
class ND1Service {

    public outdated = true;
    private nd1Numbers: any;

    constructor(
        private userSvc: UserService,
        private userGoalsService: UserGoalsService,
        private authService: AuthService,
    ) {
        this.authService.off(AuthService.LOGOUT_EVENT, this.invalidate.bind(this)).on(AuthService.LOGOUT_EVENT, this.invalidate.bind(this));
    }

    invalidate() {
        this.outdated = true;
        this.nd1Numbers = true;
    }

}

export { ND1Service as ExportedClass };