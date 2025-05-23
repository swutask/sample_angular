import {
    Component
} from '@angular/core';
import {
    MenuController
} from '@ionic/angular';
import {
    NavController
} from '@ionic/angular';
import {
    ExportedClass as userService
} from '../scripts/custom/userService';
import {
    ExportedClass as CmsPostList
} from '../scripts/custom/CmsPostList';
import { Subscription } from 'rxjs';
@Component({
    templateUrl: 'Articles.html',
    selector: 'page-articles',
    styleUrls: ['Articles.scss']
})
export class Articles {
    public articleList: CmsPostList;
    public currentItem: any = null;
    public mappingData: any = {};
    public userAvatar: string;
    public subscriptions: Subscription[] = [];
    doRefresh(refresher) {
        let getArticlesSubscription: Subscription, getUserSubscription: Subscription, getAvatarSubscription: Subscription;
        getArticlesSubscription = this.userSvc.getArticles(refresher).subscribe(({ data: { articles } }) => {
            this.articleList = articles; //.data.posts;
            // loading.dismiss();
            if (refresher) {
                refresher.target.complete();
            }
            if (this.userSvc.article) {
                let aid = this.userSvc.article;
                this.userSvc.article = null;
                let article = this.articleList.find((a) => {
                    return a.id == aid;
                });
                if (article) {
                    this.openArticle(article);
                }
            }
        },
        (err: any) => {
            console.error(err);
            refresher && refresher.complete();
        })

        getUserSubscription = this.userSvc.getUser().subscribe(({ data: { user } }) => {
            if (user && user.avatar) {
                getAvatarSubscription = this.userSvc.getSignedUrl(user.avatar).subscribe((res: any) => {
                    if (res) {
                    this.userAvatar = res.data.getSignedUrl.signedUrl;
                    }
                })
            }
        })
        
        if(getArticlesSubscription) {
            this.subscriptions.push(getArticlesSubscription);
        }  

        if(getUserSubscription) {
            this.subscriptions.push(getUserSubscription);
        }  

        if(getAvatarSubscription) {
            this.subscriptions.push(getAvatarSubscription);
        }  
    }
    openArticle(a) {
    }
    constructor(public menuController: MenuController, public navCtrl: NavController, public userSvc: userService) {
        this.doRefresh(null);
    }
    navigateToProfile() {
        this.menuController.open();
    }
    createNewAccount() {
        this.navCtrl.navigateForward("accountDetails/new");
    }
    ionViewWillLeave() {
        this.subscriptions.forEach(sub => {
            sub.unsubscribe();
        })
    }
}