import { Directive, HostListener, Input } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ExportedClass as UserService } from './userService';

/**
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[inAppBrowserLink]', // Attribute selector
})
export default class InAppBrowserLinkDirective {
  private readonly LINK_TYPE_ATTR_NAME = 'link-resource-type';

  @Input() href: string;

  constructor(private iab: InAppBrowser, private userService: UserService) {}

  @HostListener('click', ['$event']) onMouseEnter($event) {
    let url = $event.target.getAttribute('href');
    let linkResourceType = $event.target.getAttribute(this.LINK_TYPE_ATTR_NAME);
    let target = '_blank';
    if (
      !url &&
      $event.target.parentElement &&
      $event.target.parentElement.tagName === 'A'
    ) {
      url = $event.target.parentElement.getAttribute('href');
      linkResourceType = $event.target.parentElement.getAttribute(
        this.LINK_TYPE_ATTR_NAME
      );
    }
    if (url) {
      $event.stopPropagation();
      $event.preventDefault();
      if (linkResourceType && linkResourceType === 'pdf') {
        this.userService.openPDFViewer(url);
        return;
      }
      if (url.startsWith('sendto:') || url.startsWith('mailto:')) {
        url = url.replace('sendto:', 'mailto:');
        target = '_system';
      }
      this.userService.browser(url, target);
    }
  }
}

/*
    Directive class should be exported as ExportedClass
*/
export { InAppBrowserLinkDirective as ExportedClass };
