import { Component, Input } from '@angular/core';
import { ExportedClass as UserService } from './userService';

/**
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

@Component({
    selector: 'resource-details-tabs-content',
    template: `
    <ion-list>
        <ng-container *ngFor="let sect of resource?.sections">
            <ion-list-header class="ion-list-header">
                <h6>{{sect.title}}</h6>
            </ion-list-header>
            <div id="{{ct.id}}" class="ct" *ngFor="let ct of sect.contents" (click)="openVideo(ct, sect)">
                <ion-text>{{ct.title}}</ion-text>
                <ion-note class="note" slot="start">{{ct.mediaTypeLength}}</ion-note>
            </div>
        </ng-container>
    </ion-list>
  `,
    styles: [`
        :host {
            width: 100%;
        }
        .ct {
            padding: 5px 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            text-align: start;

        }
        .ct ion-text {
            font-size: 16px;
        }
        .ct ion-note {
            font-size: 12px
        }
        .ion-list-header {
            background-color: #F3F4F4;
        }
    `]
})
class ResourceDetailsTabsContent {
    @Input() resource: any;
    content: any;

    constructor(private userSvc: UserService) {
    }

    ngOnInit() {
    }

    openVideo(ct, sect) {
        ct.section = {
            id: sect.id,
            title: sect.title
        };
        this.content = ct;
        this.userSvc.contentSource.next(ct);
    }
}

/*
    Component class should be exported as ExportedClass
*/
export { ResourceDetailsTabsContent as ExportedClass };