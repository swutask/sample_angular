import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import {
    ExportedClass as AuthService
} from './AuthService';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router, private authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                catchError((err, caught: Observable<HttpEvent<any>>) => {
                    // if (err instanceof HttpErrorResponse && (err.status === 403 || (err.status === 400 && err.error && err.error.code === 'SCSX022'))) {
                    //     this.authService.logout(false);
                    //     this.router.navigate(['login']);
                    //     return of(err as any);
                    // }
                    throw err;
                })
            );
    }
}