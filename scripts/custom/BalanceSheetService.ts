import { Injectable } from '@angular/core';
import { ExportedClass as TBalanceSheet } from '../custom/TBalanceSheet';
import { ExportedClass as AuthService } from './AuthService';
import { Observable, from, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ExportedClass as UserService } from './userService';
import {
    ExportedClass as BalanceSheetGraphQLService
} from '../custom/GraphQLServices/BalanceSheetGraphQLService';
/*
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


@Injectable()
class BalanceSheetService {

    public static readonly BS_CHANGE_EVENT = 'BS_CHANGE_EVENT';
    private callbacks = {
        [BalanceSheetService.BS_CHANGE_EVENT]: []
    }
    outdated = true;
    balanceSheets: TBalanceSheet[] = [];

    constructor(private userSvc: UserService,
        private authService: AuthService,
        private balanceSheetGraphQLService: BalanceSheetGraphQLService) {
        this.authService.off(AuthService.LOGOUT_EVENT, this.invalidate.bind(this)).on(AuthService.LOGOUT_EVENT, this.invalidate.bind(this));
    }

    private _execCallbacks(eventName: string, ...args) {
        const callbacks = this.callbacks[eventName];
        callbacks && callbacks.length && callbacks.forEach && callbacks.forEach(cb => cb.apply(null, args));
    }

    on(eventName, callback): BalanceSheetService {
        if (this.callbacks[eventName]) {
            this.callbacks[eventName].push(callback);
        }
        return this;
    }

    off(eventName, callback?): BalanceSheetService {
        if (this.callbacks[eventName]) {
            if (callback === undefined) {
                this.callbacks[eventName] = [];
                return this;
            }
            const index = this.callbacks[eventName].indexOf(callback);
            if (index !== -1) {
                this.callbacks[eventName].splice(index, 1);
            }
        }
        return this;
    }

    invalidate() {
        this.outdated = true;
        this.balanceSheets = [];
    }

    getBalanceSheets(forceUpdate = false): Observable<TBalanceSheet[]> {
        /*
        forceUpdate = false it means we only get data from cache
        forceUpdate = true it means we first get data from cache and also make network request.
        */
        return from(this.balanceSheetGraphQLService.getBalanceSheetsFromGraphQL(forceUpdate))
            .pipe(
                switchMap(observable => {
                    return observable
                })
                ,
                tap((result: any) => {
                    // Following line is temporary. Added default property because its currently missing from API.
                    if (result && result.data && result.data.balanceSheets && result.data.balanceSheets.length) {
                        result.data.balanceSheets.forEach(item => item.default = (item.id === this.userSvc.defaultBalanceSheet));
                        this.balanceSheets = result.data.balanceSheets || [];
                    }
                })
            )
    }

    getBalanceSheet(id): Observable<TBalanceSheet> {
        return of(this.balanceSheets.find((balanceSheet: TBalanceSheet) => balanceSheet.id === id))
    }

    getBalanceSheetById(id, forceUpdate: boolean): Observable<TBalanceSheet> {
        return from(this.balanceSheetGraphQLService.getBalanceSheetByIdFromGraphQL(id,forceUpdate)).pipe(
            switchMap(observable => {
                return observable
            })
            ,
            tap((result: any) => {
               return result
            })
        )
    }

    getDefaultBalanceSheet(): Observable<TBalanceSheet> {
        return of(this.getDefaultBalanceSheetSync());
    }

    private getDefaultBalanceSheetSync(): TBalanceSheet {
        return this.balanceSheets.find(balanceSheet => balanceSheet.default);
    }

    createBalanceSheet(balanceSheet) {
        return from(this.balanceSheetGraphQLService.createBalanceSheetFromGraphQL(balanceSheet));
    }

    updateBalanceSheet(balanceSheetUpdatedProperties, balanceSheet) {
        return from(this.balanceSheetGraphQLService.updateBalanceSheetFromGraphQL(balanceSheetUpdatedProperties, balanceSheet));
    }

    deleteBalanceSheet(id) {
        return from(this.balanceSheetGraphQLService.deleteBalanceSheetFromGraphQL(id));
    }

    isDefaultActivated(): Observable<boolean> {
        if (this.userSvc.activeBalanceSheet === null || this.userSvc.activeBalanceSheet === this.userSvc.defaultBalanceSheet) {
            return of(true);
        } else {
            //    return this.getBalanceSheet(this.userSvc.activeBalanceSheet).pipe(map((bs: TBalanceSheet) => {
            //        return bs ? bs.default : false
            //    }));
            return of(false);
        }
    }

    isBsExperimentActivated(): Observable<boolean> {
        return this.isDefaultActivated().pipe(map((x) => {
            return !x
        }));
    }

    getActive(): Observable<TBalanceSheet> {
        return this.userSvc.activeBalanceSheet !== null ? this.getBalanceSheet(this.userSvc.activeBalanceSheet) : of(null);
    }

    getActiveV2(forceUpdate: boolean = false): Observable<TBalanceSheet> {
        return this.userSvc.activeBalanceSheet !== null ? this.getBalanceSheetById(this.userSvc.activeBalanceSheet, forceUpdate) : of(null);
    }

    clone(id, data) {
        return from(this.balanceSheetGraphQLService.cloneBalanceSheetFromGraphQL({ id, ...data }))
    }

}

/*
    Service class should be exported as ExportedClass
*/
export { BalanceSheetService as ExportedClass };