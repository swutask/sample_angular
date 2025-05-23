import {Component, Input} from '@angular/core';

/**
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

@Component({
  selector: 'ion-collapsible-card',
  template: `
        <ion-card>
            <ion-card-header style="padding-top: 8px; padding-bottom: 8px;">
              <ion-item lines="none" class="ion-no-padding header-item" >                
                <ion-card-title class="title ion-no-margin" slot="start">
                  {{this.cardTitle}}
                </ion-card-title>
                <ion-icon [name]="!this.isMenuOpen ? 'caret-down' : 'caret-up'" class="collapsible-icon ion-no-margin"  slot="end" (click)="execCard()">                
                </ion-icon>
              </ion-item>
            </ion-card-header>
            <ion-card-content [ngClass]="this.isMenuOpen ? '' : 'ion-hide'">
                <ion-card-title *ngIf="this.cardContentTitle">
                    {{this.cardContentTitle}}
                </ion-card-title>
               <ng-content></ng-content>
            </ion-card-content>
        </ion-card>
  `,
  styles: [`
  .collapsible-icon {
    font-size: 16px;
  }
  ion-card-header .header-item {
    --inner-padding-end: 0;  
  }  
  ion-card-title, ion-card-title {
    cursor: default;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }`]
})
class IonCollapsibleCardComponent {

  @Input() cardTitle: string;
  @Input() cardContentTitle: string;
    
 /* changed to public bec Android wouldn't build as pivate - HTJ
  private isMenuOpen = false;
  */
 
  public isMenuOpen = false;

  constructor() {
  }
  
  execCard() {
      this.isMenuOpen = !this.isMenuOpen;
  }

}

/*
    Component class should be exported as ExportedClass
*/
export { IonCollapsibleCardComponent as ExportedClass };