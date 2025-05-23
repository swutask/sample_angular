import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';

/**
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

@Component({
  selector: 'info-modal',
  template: `
    <ion-header>
        <ion-toolbar color="primary">
            <ion-buttons slot="end">
                <ion-button (click)="dismiss()">
                    Close
                </ion-button>
            </ion-buttons>
            <ion-title>
                {{title || "About this course"}}
            </ion-title>
        </ion-toolbar>
    </ion-header>
    <ion-content>
        <p class="a-detail-content" appMarked="">
            {{content}}
        </p>
    </ion-content>
  `,
  styles: [`.a-detail-content {margin: 0 30px;}`]
})
class InfoModalComponent {
    @Input() title: string;
    @Input() content: string;

    constructor(
        public modalController: ModalController, 
        public route: ActivatedRoute) {
    }
    dismiss() {
        this.modalController.dismiss();
    };

}

/*
    Component class should be exported as ExportedClass
*/
export { InfoModalComponent as ExportedClass };
