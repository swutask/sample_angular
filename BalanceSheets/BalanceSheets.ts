import {
    Component
} from '@angular/core';
import {
    AlertController
} from '@ionic/angular';
import {
    LoadingController
} from '@ionic/angular';
import {
    NavController
} from '@ionic/angular';
import {
    Platform
} from '@ionic/angular';
import {
    ViewChild
} from '@angular/core';
import {
    Router
} from '@angular/router';
import {
    ExportedClass as userService
} from '../scripts/custom/userService';
import {
    ExportedClass as RouterOutletService
} from '../scripts/custom/RouterOutletService';
import {
    ExportedClass as BalanceSheetService
} from '../scripts/custom/BalanceSheetService';
import {
    ExportedClass as TBalanceSheetList
} from '../scripts/custom/TBalanceSheetList';
import _ from 'lodash';
import {
    IonList
} from '@ionic/angular';
import { 
    updatedDiff 
} from 'deep-object-diff';

@Component({
    templateUrl: 'BalanceSheets.html',
    selector: 'page-balance-sheets',
    styleUrls: ['BalanceSheets.scss']
})
export class BalanceSheets {
    public balanceSheetsList: TBalanceSheetList;
    @ViewChild('bsList') public bsList: IonList;
    public currentItem: any = null;
    public mappingData: any = {};
    public flag: boolean = false;
    constructor(public userSvc: userService, public navCtrl: NavController, public loadingCtrl: LoadingController, public alertController: AlertController, public platform: Platform, public router: Router, public routerOutletService: RouterOutletService, public balanceSheetService: BalanceSheetService) {
        this.balanceSheetService.getBalanceSheets().subscribe((res: any) => {
            this.balanceSheetsList = res.data.balanceSheets;
        }, (err: any) => {
            this.errorHandler(err);
        });
    }
    
    ionViewDidEnter() {
        this.HandleRedirectAction()
    }

    ionViewDidLeave(){
        this.flag=false
    }
    
    HandleRedirectAction(){
        let {action, id} = window.history.state
        if(action&&!this.flag){
            if(action === 'add'){
                this.createNew()
            } else if (action === 'clone'){
                if(id){
                    this.openCloneAlert(id)
                }
            }
            this.flag=true
        }else{
            // do nothing
        }
    }

    doRefresh(event ? ) {
        this.balanceSheetService.getBalanceSheets()
            .subscribe((res: any) => {
                this.balanceSheetsList = res.data.balanceSheets;
                if (event) {
                    event.target.complete();
                }
            }, (err: any) => {
                this.errorHandler(err);
            });
    }
    async createNew() {
        const options: any = {
            header: 'New balance sheet',
            inputs: [{
                name: 'name',
                placeholder: 'Name',
                type: 'text'
            }, {
                name: 'description',
                placeholder: 'Description',
                type: 'text'
            }],
            buttons: [{
                text: 'Cancel',
                role: 'cancel'
            }, {
                text: 'Ok',
                handler: (data) => {
                    if (data.name) {
                        this.balanceSheetService.createBalanceSheet(data).subscribe(() => this.doRefresh(), (err: any) => {
                            this.errorHandler(err);
                        });
                    } else {
                        this.userSvc.pushTopErrorToast('Name is required');
                        return false;
                    }
                }
            }]
        };
        const createNewAlert = await this.alertController.create(options);
        return await createNewAlert.present();
    }
    async openDeleteAlert(id) {
        this.bsList.closeSlidingItems();
        this.balanceSheetService.getBalanceSheet(id).subscribe(async (bs) => {
            if (!bs.default) {
                const deleteAlert = await this.alertController.create({
                    header: 'Delete balance sheet',
                    message: `Are you sure you want to delete '${bs.name}' balance sheet ? All associated accounts will also be deleted. This action cannot be undone.`,
                    buttons: [{
                            text: 'Cancel',
                            handler: () => {
                                deleteAlert.dismiss();
                            },
                        },
                        {
                            text: 'Delete',
                            handler: () => {
                                this.balanceSheetService.deleteBalanceSheet(id).subscribe((res: any) => this.doRefresh(), (err: any) => {
                                    this.errorHandler(err);
                                });
                            },
                        }
                    ]
                });
                deleteAlert.present();
            }
        });
    }
    async openEditAlert(id) {        
        this.bsList.closeSlidingItems();
        this.balanceSheetService.getBalanceSheet(id).subscribe(async (bs) => {
            const options: any = {
                header: 'Edit balance sheet',
                inputs: [{
                        name: 'name',
                        placeholder: 'Name',
                        type: 'text',
                        value: bs.name
                    },
                    {
                        name: 'description',
                        placeholder: 'Description',
                        type: 'text',
                        value: bs.description
                    }
                ],
                buttons: [{
                    text: 'Cancel',
                    role: 'cancel'
                }, {
                    text: 'Ok',
                    handler: async (data) => {
                        // Get only updated properties from object
                        let balanceSheetUpdatedProperties = updatedDiff(bs, data);

                        // If no changes in object, navigate back
                        if(!Object.keys(balanceSheetUpdatedProperties).length) {
                            return await dismissAlert;
                        }

                        if (data.name) {
                            this.balanceSheetService.updateBalanceSheet(balanceSheetUpdatedProperties, {
                                id: bs.id,
                                ...data
                            }).subscribe(() => {
                            }, (err: any) => {
                                this.errorHandler(err);
                            });
                        } else {
                            this.userSvc.pushTopErrorToast('Name  is required');
                            return false;
                        }
                    }
                }]
            };
            const createNewAlert = await this.alertController.create(options);
            const dismissAlert = createNewAlert.dismiss();
            return await createNewAlert.present();
        });
    }
    select(id) {
        this.userSvc.updateUser({
            activeBalanceSheet: id
        }).then(res => {
            this.userSvc.activeBalanceSheet = id;
            this.goBack();
        }, err => {
            this.errorHandler(err);
            console.error(err)
        });
    }
    errorHandler(e) {
        this.bsList.closeSlidingItems();
        let errorMessage = 'An error occurred. Please try again later';
        try {
            errorMessage = e.error.message;
        } catch (e) {}
        this.userSvc.pushTopErrorToast(errorMessage);
    }
    goBack() {
        this.navCtrl.back();
    }
    async openCloneAlert(id) {
        this.bsList.closeSlidingItems();
        this.balanceSheetService.getBalanceSheet(id).subscribe(async (bs) => {
            const options: any = {
                header: 'Clone balance sheet',
                inputs: [{
                        name: 'name',
                        placeholder: 'Name',
                        type: 'text',
                        value: bs.name + '_Copy'
                    },
                    {
                        name: 'description',
                        placeholder: 'Description',
                        type: 'text',
                        value: bs.description
                    }
                ],
                buttons: [{
                    text: 'Cancel',
                    role: 'cancel'
                }, {
                    text: 'Ok',
                    handler: (data) => {
                        if (data.name) {
                            this.balanceSheetService.clone(bs.id, data).subscribe(() => {
                            }, (err: any) => {
                                this.errorHandler(err);
                            });
                        } else {
                            this.userSvc.pushTopErrorToast('Name  is required');
                            return false;
                        }
                    }
                }]
            };
            const createNewAlert = await this.alertController.create(options);
            return await createNewAlert.present();
        });
    }
}
