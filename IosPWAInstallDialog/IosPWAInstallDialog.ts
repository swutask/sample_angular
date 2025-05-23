import {
    Component
} from '@angular/core';
@Component({
    templateUrl: 'IosPWAInstallDialog.html',
    selector: 'page-ios-p-w-a-install-dialog',
    styleUrls: ['IosPWAInstallDialog.scss']
})
export class IosPWAInstallDialog {
    public currentItem: any = null;
    public mappingData: any = {};
    constructor() { }
}