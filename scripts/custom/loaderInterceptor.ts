import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {LoadingController} from '@ionic/angular';
import {LoadingOptions} from '@ionic/core';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/internal/operators';


const loadingController = new LoadingController();

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

    config: LoadingOptions;
    // number of requests in progress
    queue = 0;
    // delay before loading screen will be displayed
    delay = 500;
    // delay before hiding loading screen for preventing two existing loading screens
    wait = 700;
    // is loading screen visible or not
    inProgress = false;
    // loading screen controller
    loader: Promise<HTMLIonLoadingElement>;

    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const handler = next.handle(req.clone());

        this.config = {
            message: 'Loading...',
            cssClass: 'wb-loading'
        };

        setTimeout(async () => {
            if (this.inProgress === false && this.queue) {
                this.inProgress = true;
                this.loader = this.presentLoading();
                (await this.loader).present();
            }
        }, this.delay);

        this.queue++;


        return handler.pipe(finalize(() => {
            // dec request count on request finalization
            this.queue--;
            // no need to start timer if queue not empty
            if (this.queue <= 0) {
                this.queue = 0;
                setTimeout(async () => {
                    const queue = this.queue;
                    if (this.inProgress && queue === 0) {
                        (await this.loader).dismiss();
                        this.inProgress = false;
                    }
                }, this.wait);
            }
        }));
    }

    async presentLoading() {
        return await loadingController.create(this.config);
    }
}