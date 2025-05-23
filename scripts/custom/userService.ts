import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ExportedClass as CmsResource } from './CmsResource';
import { ExportedClass as CmsContent } from './CmsContent';
import { from, observable, Observable, of, Subject } from 'rxjs';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ModalController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { ExportedClass as UserGraphQLService } from './GraphQLServices/UserGraphQLService';
import { switchMap, take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { OldModal } from 'src/app/OldModal/OldModal';

@Injectable()
class UserService {

    public readonly defaultAvatar = 'assets/images/no_avatar.png';
    private readonly PDF_VIEWER_URL = 'https://docs.google.com/viewer?url=';

    public userId: string;
    public sessionToken: string;
    public access: string;
    public accessTags: string[];
    public avatar;
    public firstName: string;
    public username: string;
    public showWelcomeMessage = false;
    public signUpAt: Date;
    public activeBalanceSheet: string = null;
    public defaultBalanceSheet: string = null;
    public hasCompletedOnboarding: boolean = false;
    private toastsQueue: any = [];
    public articles = [];
    public resources = [];
    public loaderPresent: boolean = false;

    /** Article ID for deeplinking */
    public article: string;

    /** Image for media poster */
    public resourceImage: string;

    public resource: CmsResource;

    public contentSource = new Subject<CmsContent>();

    public openPlanning = new Subject<any>();

    public toggleBalance = new Subject<any>();

    public resourceTab = new Subject<string>();

    public content$ = this.contentSource.asObservable();

    constructor(private userGraphqQLService: UserGraphQLService, private alertController: AlertController, private router: Router, private toastCtrl: ToastController, private iab: InAppBrowser, public modalCtrl: ModalController, private platform: Platform, private loadingCtrl: LoadingController) {
    }

    isUserHasFreeAccess(): boolean {
        return this.access != null && this.access.toLowerCase() === 'free';
    }

    async pushTopErrorToast(msg: string,) {
        this._pushTopToast(msg, 'danger');
    }

    async pushTopToast(msg: string) {
        this._pushTopToast(msg, 'success');
    }

    private async _pushTopToast(msg: string, color: string) {
        const toastInst = await this.toastCtrl.create({
            message: msg,
            color,
            duration: 5000,
            position: 'top'
        });
        toastInst.onDidDismiss().then(() => {
            this.toastsQueue.shift();
            if (this.toastsQueue.length > 0) {
                this.toastsQueue[0].present();
            }
        });
        this.toastsQueue.push(toastInst);
        if (this.toastsQueue.length === 1) {
            this.toastsQueue[0].present();
        }
    }

    async toast(msg: string, duration: number = 5000) {
        const toastInst = await this.toastCtrl.create({
            message: msg,
            duration,
            position: 'bottom',
            mode: 'md'
        });
        await toastInst.present();
    }

    async presentModal(title, content) {
        const modal = await this.modalCtrl.create({
            component: OldModal,
            componentProps: {
                title: title,
                content: content
            }
        });
        return await modal.present();
    }

    browser(url: string, target = '_blank') {
        this.iab.create(url, target, {
            location: 'no',
            hideurlbar: 'yes',
            toolbarposition: 'bottom'
        });
    }

    openWebview(url: string, toolbar: boolean) {
        this.iab.create(url, '_blank', {
            location: 'no',
            toolbar: toolbar ? 'yes' : 'no',
            hideurlbar: 'yes',
            disallowoverscroll: 'yes',
            toolbarposition: 'bottom'
        });
    }

    openPDFViewer(url: string) {
         let viewerUrl = url;
        // This code causes an issue when a jpg file is viewed on an Android device.
        if (this.platform.is('android')) {
            // 108 Human Biases PDF was creating issue that's why i need to open this directly on chrome.
            const ignoreURL = 'https://media.graphassets.com/ESG0r2wxSkyqo81lHtLS';
            if (url !== ignoreURL) {
               viewerUrl = this.PDF_VIEWER_URL + url;
            }
       }
         this.browser(viewerUrl);
    }

    setUserData(userData: any) {
        this.username = userData.username;
        this.firstName = userData.firstName;
        this.avatar = userData.avatar;
        this.access = userData.access;
        this.accessTags = userData.accessTags;
        this.userId = userData.userId;
        this.sessionToken = userData.sessionToken;
        this.signUpAt = new Date(userData.signUpAt * 1000);
        this.activeBalanceSheet = userData.activeBalanceSheet;
        this.defaultBalanceSheet = userData.defaultBalanceSheet;
        this.hasCompletedOnboarding = userData.hasCompletedOnboarding;
    }

    clearUserData() {
        this.username = null;
        this.firstName = null;
        this.avatar = null;
        this.access = null;
        this.accessTags = null;
        this.userId = null;
        this.sessionToken = null;
        this.signUpAt = null;
    }

    async updateUser(updateUserInput) {
        const { data: { user } } = await this.getUser().toPromise();
        return from(this.userGraphqQLService.updateUser(updateUserInput, user));
    }

    getUser(forceUpdate = false): Observable<any> {
        /*
        forceUpdate = false it means we only get data from cache
        forceUpdate = true it means we first get data from cache and also make network request.
        */
        return from(this.userGraphqQLService.getUser(forceUpdate))
            .pipe(
                switchMap(observable => {
                    return observable
                }),
                tap((result: any) => {
                }),
                take(forceUpdate ? 2 : 1)
            )
    }

    getUserOnce(): Observable<any> {
        return from(this.userGraphqQLService.getUserOnce())
            .pipe(
                switchMap(observable => {
                    return observable
                }),
                tap((result: any) => {
                }),
                take(1)

            )
    }

    verifyEmail(email: string) {
        return from(this.userGraphqQLService.verifyEmail(email));
    }

    verifyPhone(phone: string) {
        return from(this.userGraphqQLService.verifyPhone(phone));
    }

    updateEmail(email: string, otp: string) {
        return from(this.userGraphqQLService.updateEmail(email, otp));
    }

    updatePhone(phone: string, otp: string) {
        return from(this.userGraphqQLService.updatePhone(phone, otp));
    }

    getSignedUrl(fileName: string, forceUpdate: boolean = false) {
        return from(this.userGraphqQLService.getSignedUrl(fileName, forceUpdate)).pipe(
            switchMap(observable => observable)
        )
    }

    putSignedUrl(fileName: string, fileType: string) {
        return this.userGraphqQLService.putSignedUrl(fileName, fileType);
    }

    createFile(file) {
        return from(this.userGraphqQLService.createFile(file));
    }

    configurations(forceUpdate?: boolean) {
        return from(this.userGraphqQLService.configurations(forceUpdate));
    }

    deleteUser() {
        return from(this.userGraphqQLService.deleteUser());
     }

    createPortal() {
        return from(this.userGraphqQLService.createPortal());
    }

    bitrixToWbSync() {
        return from(this.userGraphqQLService.bitrixToWbSync());
    }

    getArticles(forceUpdate: boolean = false) {
        return from(this.userGraphqQLService.getArticles(forceUpdate)).pipe(
            switchMap(observable => {
                return observable
            })
            ,
            tap((result: any) => {
                if (result && result.data && result.data.articles) {
                    this.articles = result.data.articles || [];
                }
            })
        )
    }

    getArticle(id) {
        return of(this.articles.find((article) => article.id === id));
    }

    getResources(forceUpdate: boolean = false) {
        return from(this.userGraphqQLService.getResources(forceUpdate)).pipe(
            switchMap(observable => {
                return observable
            })
            ,
            tap((result: any) => {
                if (result && result.data && result.data.resources) {
                    this.resources = result.data.resources || [];
                }
            })
        )
    }

    getResource(id) {
        return of(this.resources.find((resource) => resource.id === id));
    }

    getResourceFromNetwork(id: string, forceUpdate: boolean = false) {
        return from(this.userGraphqQLService.getResource(id, forceUpdate)).pipe(
            switchMap(observable => {
                return observable
            })
        )
    }

    async presentLoader(text?:string) {
        if (this.loaderPresent) {
            await this.dismissLoader();
        }

        this.loaderPresent = true;
        if (text) {
            console.trace("Message Recieved:------------------",text);
        }
        const loading = await this.loadingCtrl.create({
            message: 'Loading...',
            cssClass: 'wb-loading'
        });

        return await loading.present();
    }

    async dismissLoader() {
        try {
            this.loaderPresent = false;
            return await this.loadingCtrl.dismiss();
        } catch (error) {}
    }
}

export {
    UserService as ExportedClass
};
