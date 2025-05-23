import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import {
    ExportedClass as AuthGraphQLService
} from './GraphQLServices/AuthGraphQLService';
import {
    ExportedClass as UserService
} from './userService';
import { Router } from '@angular/router';
import parsePhoneNumberFromString from 'libphonenumber-js';
import {
    ExportedClass as GraphQLClientService
} from '../../scripts/custom/GraphQLServices/GraphQLClientService';

/*
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
class AuthService {
    private static readonly SESSION_TOKEN_STORAGE_KEY = 'WB_AUTH_USER_DATA_V4';
    public static readonly LOGIN_EVENT = 'login';
    public static readonly LOGOUT_EVENT = 'logout';
    public static readonly COGNITO_CLIENT_EVENT = 'cognito_client_event';
    private readonly APP_VERSION = '5.7.4';
    private callbacks = {
        [AuthService.LOGIN_EVENT]: [],
        [AuthService.LOGOUT_EVENT]: [],
        [AuthService.COGNITO_CLIENT_EVENT]: []
    }
    private token: string = null;
    private readyPromise: Promise<any>;

    constructor(private storage: Storage, private router: Router, private userSvc: UserService, private authGraphQLService: AuthGraphQLService, private graphqlClientService: GraphQLClientService) {

        // Create API CLIENT
        // this.appSyncService.createUnprotectedClient();

        this.readyPromise = this.storage.ready().then(() => {
            return this.storage.get(AuthService.SESSION_TOKEN_STORAGE_KEY).then(token => {
                
                if (token) {
                    // Create COGNITO CLIENT
                    // this.appSyncService.createProtectedClient(token);
                    this._execCallbacks(AuthService.COGNITO_CLIENT_EVENT, token);

                    return this.userSvc.getUserOnce().toPromise().then(({ data }) => {
                        if (data && data.user) {
                            this.proccessUserLoginResponse(data.user, token, false);
                        }
                    })
                }
            })
        })
    }

    public getAppVersion() {
        return this.APP_VERSION;
    }

    private completeUserDataBeforeLogin(user) {
        try {
            if (user['migratedUser']) {
                const isPhoneValid = parsePhoneNumberFromString(user['phone']).isValid();

                if (user['phone'] && isPhoneValid) {
                    this.router.navigate(['page1', user['phone']]);
                } else if (!user['phone'] || !isPhoneValid) {
                    this.router.navigate(['page2']);
                }
            } else {
                if (!user['firstName'] || !user['email']) {
                    this.router.navigate(['profile']);
                } else {
                    this.router.navigate(['']);
                }
            }
        } catch (error) {
            // phone number is null or invalid, so
            this.router.navigate(['page2']);
            console.error(error);
        }
    }

    private _execCallbacks(eventName: string, ...args) {
        const callbacks = this.callbacks[eventName];
        callbacks && callbacks.length && callbacks.forEach && callbacks.forEach(cb => cb.apply(null, args));
    }

    on(eventName, callback): AuthService {
        if (this.callbacks[eventName]) {
            this.callbacks[eventName].push(callback);
        }
        return this;
    }

    off(eventName, callback?): AuthService {
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

    private saveSessionToken() {
        if (this.token) {
            this.readyPromise.then(() => this.storage.set(AuthService.SESSION_TOKEN_STORAGE_KEY, this.token));
        }
    }

    public setSessionToken(data: any, persist: boolean = true) {
        if (!data) {
            throw new Error('Token cannot be empty');
        }
        this.token = data;
        if (persist) {
            this.saveSessionToken();
        }
    }

    public isUserLoggedIn(): Promise<any> {
        return this.readyPromise.then(() => {
            return this.token !== null;
        });
    }

    public sendOTP(username: string, recaptchaToken: string, isWordpress?: boolean, wplicensetoken?: string) {
        if (isWordpress) {
            return this.authGraphQLService.sendOTPWordpress(username, recaptchaToken, wplicensetoken);
        } else {
            return this.authGraphQLService.sendOTP(username, recaptchaToken)
        }
    }

    async loginOTP(username: string, otp: string, redirectedFromEmail: boolean = false, recaptchaToken: string, isWordpress?: boolean, wplicensetoken?:string) {
        try {
            const { data: { loginOTP: { id, idToken } } } = isWordpress ? 
            await this.authGraphQLService.loginOTPWordpress(username, otp, recaptchaToken, wplicensetoken) : await this.authGraphQLService.loginOTP(username, otp, recaptchaToken);
            this._execCallbacks(AuthService.COGNITO_CLIENT_EVENT, idToken);
            this.userSvc.getUserOnce().toPromise().then(({ data: { user } }) => {
                this.proccessUserLoginResponse({ ...user, id }, idToken, false);
            })
            return idToken;

        } catch (error) {
            console.error(error)

            if (redirectedFromEmail) {
                this.router.navigate(['']);
            }
        }
    }

    public signUp(countryCode: string, phone: string, recaptchaToken: string) {
        return this.authGraphQLService.signUp(countryCode, phone, recaptchaToken)
    }

    private proccessUserLoginResponse(res: any, token: string, persistToken: boolean) {
        const authUserData = {
            username: res.username,
            firstName: res.firstName,
            avatar: res.avatar,
            access: res.access,
            accessTags: res.accessTags,
            userId: res.id,
            signUpAt: res.signUpAt || res.createdAt,
            sessionToken: token,
            activeBalanceSheet: res.activeBalanceSheet || res.defaultBalanceSheet,
            defaultBalanceSheet: res.defaultBalanceSheet,
            hasCompletedOnboarding: res.hasCompletedOnboarding
        };
        this.setSessionToken(authUserData.sessionToken);
        this.userSvc.setUserData(authUserData);
        this.completeUserDataBeforeLogin(res);
        if(!res.hasCompletedOnboarding)
            this.router.navigate(['intro']);
        this._execCallbacks(AuthService.LOGIN_EVENT, authUserData);
    }

    public async logout(invalidateUserToken: boolean = true): Promise<any> {
        this.readyPromise = this.storage.remove(AuthService.SESSION_TOKEN_STORAGE_KEY).then(async () => {
            this.token = null;
            this.userSvc.clearUserData();
            this._execCallbacks(AuthService.LOGOUT_EVENT);
            await this.storage.clear();
            window.localStorage.clear();
            // window.location.reload();
            const client: any = await this.graphqlClientService.getCognitoClient();
            if(client) {
                client.cache.data.data = {};
            }
            this.router.navigate(['login']);
        });
        return this.readyPromise;
    }
}
/*
    Service class should be exported as ExportedClass
*/
export { AuthService as ExportedClass };
