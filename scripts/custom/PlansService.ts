import { Injectable } from '@angular/core';
import { ExportedClass as TFreedomCalculator} from './TFreedomCalculator';
import { ExportedClass as TLifestyleCalculator } from './TLifestyleCalculator';
import { ExportedClass as TUserPlans} from './TUserPlans';
import { ExportedClass as UserService } from '../custom/userService';
import {tap} from 'rxjs/operators';
import {of} from 'rxjs';
import { ExportedClass as AuthService} from '../custom/AuthService';


@Injectable()
class PlansService {
    public userPlans: TUserPlans;
    public outdated = true;

    constructor(private userSvc: UserService,
                private authService: AuthService) {
        this.authService.off(AuthService.LOGOUT_EVENT, this.invalidate.bind(this)).on(AuthService.LOGOUT_EVENT, this.invalidate.bind(this));
    }

    invalidate() {
        this.outdated = true;
        this.userPlans = undefined;
    }

    // Implementation removed from FreedomNumberDetails.ts, LifestyleNumberDetails.ts
    getFreedomCalculator(): TFreedomCalculator {
        return this.userPlans.freedomCalcs.length > 0 ? this.userPlans.freedomCalcs[0] : { result : 0};
    }
    
    getLifestyleCalculator(): TLifestyleCalculator {
        return this.userPlans.lifestyleCalcs.length > 0 ? this.userPlans.lifestyleCalcs[0] : { result : 0 };
    }
}

/*
    Service class should be exported as ExportedClass
*/
export { PlansService as ExportedClass };