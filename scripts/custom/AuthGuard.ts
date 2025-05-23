import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from "rxjs/Observable";
import { ExportedClass as AuthService } from './AuthService';

/*
  See https://angular.io/guide/router for more info on guards.
*/


@Injectable()
class AuthGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthService) {

    }
    canActivate(next: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.authService.isUserLoggedIn().then(result => {
            if (!result) {
                this.router.navigate(['login']);
                return false;
            }
            return true;
        });
        
    }
}

/*
    Guard class should be exported as ExportedClass
*/
export { AuthGuard as ExportedClass };
