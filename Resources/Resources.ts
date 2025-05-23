import {
    Component
} from '@angular/core';
import {
    LoadingController, MenuController
} from '@ionic/angular';
import {
    NavController
} from '@ionic/angular';
import {
    ActivatedRoute,
    Router
} from '@angular/router';
import {
    ExportedClass as userService
} from '../scripts/custom/userService';
import {
    ExportedClass as CmsResourceList
} from '../scripts/custom/CmsResourceList';
import {
    ExportedClass as CmsPostList
} from '../scripts/custom/CmsPostList';
import { Subscription } from 'rxjs';
@Component({
    templateUrl: 'Resources.html',
    selector: 'page-resources',
    styleUrls: ['Resources.scss']
})
export class Resources {
    public resourceList: CmsResourceList;
    public activeTab: string = "courses";
    public currentItem: any = null;
    public mappingData: any = {};
    public userAvatar: string;
    public subscriptions: Subscription[] = [];
    public articleList: CmsPostList;
    doRefresh(refresher) {
        let getResourcesSubscription: Subscription, getArticlesSubscription: Subscription, getUserSubscription: Subscription, getAvatarSubscription: Subscription;
        getResourcesSubscription = this.userSvc.getResources(refresher).subscribe(({ data: { resources } }) => {
            this.resourceList = resources.map(x => ({ ...x,
                    page: this.getPage(x)
                }));
                refresher && refresher.target.complete();
        },
        (err: any) => {
            console.error(err);
            refresher && refresher.complete();
        })

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

        if(getResourcesSubscription) {
            this.subscriptions.push(getResourcesSubscription);
        }

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
    constructor(public menuController: MenuController, public navCtrl: NavController, public userSvc: userService, public loadingCtrl: LoadingController, public router: Router,  public route:ActivatedRoute) {
        this.doRefresh(null);
        this.route.queryParams.subscribe((params) => {  
            let navParams = this.router.getCurrentNavigation().extras.state;
            if(navParams?.type == 'courses'){
                this.activeTab = 'courses';
            }
            else if(navParams?.type == 'coaching'){
                this.openWorkgroup();
            }
            else if(navParams?.type == 'articles'){
                this.activeTab = 'articles';
             }
         });
         let resourceSubscription: Subscription;
         resourceSubscription = this.userSvc.resourceTab.subscribe(type => {
            if(type == "coaching") {
                this.openWorkgroup();
                return;
            }
            this.activeTab = type;
         });
         if (resourceSubscription) {
            this.subscriptions.push(resourceSubscription);
         }
    }
    openArticle(a) {
        this.navCtrl.navigateForward(`/articleDetails/${a}`);
    }
    openResource(id) {
        this.navCtrl.navigateForward(`/resourceDetails/${id}`);
    }
    segmentChanged(event) {
        if(event.detail.value == "coaching") {
            this.openWorkgroup();
            return;
        }
        this.activeTab = event.detail.value;
        this.userSvc.resourceTab.next(this.activeTab);
    }
    openWorkgroup() {
        window.open("https://calltofreedom.bitrix24.com/workgroups/group/41/", "_blank");
    }
    getPage(resource) {
        /*
//returns the tab in which this resource is visible 

//if it's pro
if(resource.userAccess === "Pro") {
    return "coaching";
}

//if it's free
if(resource.userAccess === "Free" || !resource.userAccess) {
    return "courses";
}

//if has access
if(this.userSvc.access === resource.userAccess) {
    return "courses";
}

// if has tag
if(this.userSvc.accessTags.some(x => x === resource.accessTag)) {
    return "courses"
}

//if it's premium
if(resource.userAccess === "Free" || !resource.userAccess) {
    return "courses";
}

return null; 

*/
        return (resource.userAccess === "Pro") ? "coaching" : "courses";
    }
    navigateToProfile() {
        this.menuController.open();
    }
    createNewAccount() {
        this.navCtrl.navigateForward("accountDetails/new");
    }
    hasAccessTo() {
        return ["comppro", "pro", "admin"].indexOf(this.userSvc.access?.toLowerCase()) !== -1;
    }
    ionViewWillLeave() {
        this.subscriptions.forEach(sub => {
            sub.unsubscribe();
        })
    }
}