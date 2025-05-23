import {
    Directive,
    ElementRef,
    OnChanges,
    Renderer2,
    Input
} from '@angular/core';

import {
    ExportedClass as userService
} from './userService';

@Directive({
    selector: 'video-frame'
})

export default class VideoFrameDirective implements OnChanges {

    @Input('video') videoUrl: string;
    @Input('audio') audioUrl: string;
    @Input('image') image: string;
    @Input('resource') resource: any;
    vimeoUrl: string;

    constructor(private elementRef: ElementRef, private renderer: Renderer2, private userSvc: userService) {}

    ngOnChanges() {
        if (this.image) {
            var posterUrl = this.image;
        }
        let markup = '';
        if (this.videoUrl) {
                markup = `
                    <video src="${this.videoUrl}" autoplay controls controlsList="nodownload" playsinline="playsinline" class="video-frame video-content" poster="${posterUrl}">
                    </video>
                `;
        } else
        if (this.audioUrl) {
            markup = `
            <div class="audio-frame" style="background-image: url('${posterUrl}');">
              <div class="audio-frame-content" style="">
              <div class="document-wrapper">
                   <h2>${this.resource.section.title}</h2>
                   <h3>${this.resource.title}</h3>
                   <ion-text>${this.resource.summary ? this.resource.summary : ""}</ion-text>                                    
              </div>
              <audio controls controlsList="nodownload" autoplay>
                  <source src="${this.audioUrl}">
               </audio>              
            </div>
            </div>
            `;
        } else {
            if (this.resource.refUrlOrImbed && this.resource.refUrlOrImbed.startsWith('https://player.vimeo.com')) {
                this.vimeoUrl = this.addParameterToURL(this.resource.refUrlOrImbed, 'autoplay', 1 );
                markup = `
                    <div class="embed-container" style="background-image: url('${posterUrl}');">
                        <iframe src="${this.vimeoUrl }"; class="video-frame video-content" frameborder="0" allow="autoplay; fullscreen" webkitallowfullscreen mozallowfullscreen allowfullscreen>
                        </iframe>
                    </div>
                `;
            } else {
                markup = `
                <div class="audio-frame flex" style="background-image: url('${posterUrl}'">
                    <div class="document-wrapper">
                        <h2>${this.resource.section.title}</h2>
                        <h3>${this.resource.title}</h3>
                        <ion-text>${this.resource.summary ? this.resource.summary : ""}</ion-text>
                        <ion-button shape="round" id="open-document" color="dark">Open Document</ion-button>
                    </div>
                </div>
            `;
            }
        }
        this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', markup);
    }

    private addParameterToURL( url, key, value) {
        const param = key + '=' + escape(value);
        let sep = '&';
        if (url.indexOf('?') < 0) {
            sep = '?';
        } else {
            const lastChar = url.slice(-1);
            if (lastChar === '&') sep = '';
            if (lastChar === '?') sep = '';
        }
        url += sep + param;

        return url;
    }
}

export {
    VideoFrameDirective as ExportedClass
};