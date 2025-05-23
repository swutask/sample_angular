import {
    Directive,
    ElementRef,
    AfterViewInit,
    Renderer2,
    Input
} from '@angular/core';

import * as marked from 'marked';

/**
 * Convert the contents of the decorated element from Markdown into HTML.
 * 
 * See https://www.jamiecockrill.com/2018-04-30-marked-directive/.
 * See https://angular.io/api/core/Directive for more info on Angular Directives
 */
@Directive({
    selector: '[appMarked]'
})

export default class MarkedDirective implements AfterViewInit {

    @Input() md: string;

    private defaultRendered: any;
    
    constructor(private elementRef: ElementRef, private renderer: Renderer2) {}
    
    ngAfterViewInit() {
        // deliberate use of innerHTML because we might have HTML and markdown
        // mixed together
        this.defaultRendered = new marked.Renderer();
        const renderer = new marked.Renderer();
        renderer.link = (href, title, text) => {
           let val = this.defaultRendered.link(href, title, text);
           if(text.toLocaleLowerCase().includes("pdf")){
               val = val.replace("<a", "<a link-resource-type=\"pdf\"");
           }
           if(href.toLocaleLowerCase().includes('media.graphassets.com') && !val.toLocaleLowerCase().includes('link-resource-type')){
                val = val.replace("<a", "<a link-resource-type=\"pdf\"");
           }
           return val;
        };
        const markText = this.md || this.elementRef.nativeElement.innerHTML;
        if (markText && markText.length > 0) {
            const markdownHtml = marked(markText.trim(), { renderer });
            this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', markdownHtml);
        }
    }
}

/*
    Directive class should be exported as ExportedClass
*/
export {
    MarkedDirective as ExportedClass
};