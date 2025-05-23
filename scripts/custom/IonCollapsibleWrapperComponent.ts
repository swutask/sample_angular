import {Component, Input} from '@angular/core';

/**
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

@Component({
  selector: 'ion-collapsible-wrapper',
  template: `
      <ion-item lines="none" (click)="toggle()" class="{{wrapperItemClass}}" [class.collapsed]="!isMenuOpen">        
         <p class="ion-no-margin {{headerTitleClass}}">{{this.title}}</p>        
         <ion-icon name="arrow-dropright" class="collapsible-icon ion-no-margin" slot="start">
         </ion-icon>
      </ion-item>
      <div [class.collapsed]="!isMenuOpen" class='expand-wrapper'>
          <ng-content></ng-content>
      </div>  `,
  styles: [`
  .collapsible-icon{
    font-size: 24px;
  }
  ion-item {
    --padding-start: 10px;
  }
  .expand-wrapper {
    transition: max-height 0.4s ease-out;
    overflow: hidden;
    height: auto;
    max-height: 800px;
  }
  .collapsible-icon {
    transform: rotate3d(0, 0, 1, 90deg);    
    -webkit-transition: 0.4s ease-out;
    -moz-transition:    0.4s ease-out;
    -o-transition:      0.4s ease-out;
    -ms-transition:     0.4s ease-out;
    transition:         0.4s ease-out;
  }
  .collapsed.expand-wrapper{
    max-height: 0!important;
  }
  .collapsed .collapsible-icon {
    transform: unset!important;
  }  
  `]
})
class IonCollapsibleWrapperComponent {

  @Input() title: string;
  @Input() headerTitleClass: string;
  @Input() wrapperItemClass: string;

 /* changed to public bec Android wouldn't build as pivate - HTJ
  private isMenuOpen = false;
  */

  public isMenuOpen = false;

  constructor() {
  }

  toggle() {
      this.isMenuOpen = !this.isMenuOpen;
  }

}

/*
    Component class should be exported as ExportedClass
*/
export { IonCollapsibleWrapperComponent as ExportedClass };