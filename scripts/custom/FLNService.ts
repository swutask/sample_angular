import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ExportedClass as UserService } from '../custom/userService';
import { ExportedClass as AuthService } from '../custom/AuthService';

@Injectable()
class FLNService {

    public outdated = true;
    private flNumbers: any;

    constructor(
        private userSvc: UserService,
        private authService: AuthService,
    ) {
        this.authService.off(AuthService.LOGOUT_EVENT, this.invalidate.bind(this)).on(AuthService.LOGOUT_EVENT, this.invalidate.bind(this));
    }

    invalidate() {
        this.outdated = true;
        this.flNumbers = true;
    }
}

export { FLNService as ExportedClass };
