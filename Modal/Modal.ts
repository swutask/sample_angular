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
    templateUrl: 'Modal.html',
    selector: 'page-modal',
    styleUrls: ['Modal.scss']
})
export class Modal {
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