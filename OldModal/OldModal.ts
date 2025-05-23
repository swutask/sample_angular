import {
    Component
} from '@angular/core';
import {
    ModalController
} from '@ionic/angular';
import {
    ActivatedRoute
} from '@angular/router';
import {
    Input
} from '@angular/core';
@Component({
    templateUrl: 'OldModal.html',
    selector: 'page-old-modal',
    styleUrls: ['OldModal.scss']
})
export class OldModal {
    @Input() public title: string;
    @Input() public content: string;
    public currentItem: any = null;
    public mappingData: any = {};
    dismiss() {
        this.modalController.dismiss();
    }
    constructor(public modalController: ModalController, public route: ActivatedRoute) {
        
    }
}