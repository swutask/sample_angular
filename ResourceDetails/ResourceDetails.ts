import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { ExportedClass as userService } from '../scripts/custom/userService';
import { ExportedClass as CmsResource } from '../scripts/custom/CmsResource';
import { ExportedClass as CmsContent } from '../scripts/custom/CmsContent';
import { IonContent } from '@ionic/angular';
import { IonBackButtonDelegate } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  templateUrl: 'ResourceDetails.html',
  selector: 'page-resource-details',
  styleUrls: ['ResourceDetails.scss'],
})
export class ResourceDetails {
  public resource: CmsResource;
  public slideNames: any = ['content', 'more'];
  @ViewChild('slider') public slider: any;
  public view: string = 'content';
  public content: CmsContent;
  public videoUrl: string;
  public content$: any;
  public mediaSlot: string = 'fixed';
  public fixedMode: boolean = true;
  @ViewChild(IonContent) public ionContent: IonContent;
  public viewReadyPromise: Promise<any>;
  public viewReadyPromiseResolver: Function;
  @ViewChild(IonBackButtonDelegate) public backButton: any;
  public currentItem: any = null;
  public mappingData: any = {};
  constructor(
    public route: ActivatedRoute,
    public userSvc: userService,
    public statusBar: StatusBar,
    public router: Router,
    public platform: Platform,
    public navCtrl: NavController
  ) {
    this.viewReadyPromise = new Promise<any>((resolve) => {
      this.viewReadyPromiseResolver = resolve;
    });
    // this.initializeViewSettings();
    // this.platform.resize.subscribe(async () => {
    //     this.initializeViewSettings();
    // });
    const id = this.route.snapshot.paramMap.get('id');
    const sectionId = this.route.snapshot.paramMap.get('sectionId');
    let resourceQuery = 'getResourceFromNetwork';

    if (this.userSvc.resources && this.userSvc.resources.length) {
      resourceQuery = 'getResource';
    }
    this.userSvc[resourceQuery](id).subscribe(
      (res) => {
        const resource =
          resourceQuery == 'getResource' ? res : res.data.resource;
        this.resource = resource;
        this.userSvc.resource = resource;
        this.content$ = this.userSvc.content$.subscribe(
          (ct) => {
            this.content = ct;
            this.videoUrl = this.content.video ? this.content.video.url : '';
          },
          (err: any) => {
            console.error('resource content error', err);
          }
        );
        this.content = this.findFirstContent();
        this.videoUrl = this.content.video ? this.content.video.url : '';
        if (sectionId) {
          setTimeout(() => {
            this.navigateToSection(sectionId);
          }, 0);
        }
      },
      (err: any) => {
        console.error('resource error', err);
      }
    );
  }
  slideDidChange() {
    this.slider.getActiveIndex().then((view) => {
      this.view = this.slideNames[view];
    });
  }
  slideTo(view) {
    this.slider.slideTo(
      this.slideNames.findIndex((slideName) => slideName === view)
    );
  }
  segmentChanged(event: any) {
    if (this.view === event.detail.value) {
      return false;
    }
    this.slideTo(event.detail.value);
  }
  findFirstContent() {
    for (var i = 0; i < this.resource.sections.length; i++) {
      var sect: any = this.resource.sections[i];
      for (var j = 0; j < sect.contents.length; j++) {
        var ct = sect.contents[j];
        ct.section = {
          id: sect.id,
          title: sect.title,
        };
        return ct;
      }
    }
    return null;
  }
  openDocument(event) {
    if (event.target.id === 'open-document') {
      if (
        this.content.document &&
        this.content.document.url &&
        this.content.mediaTypeLength !== 'Data'
      ) {
        //pdf
        this.userSvc.openPDFViewer(this.content.document.url);
      } else if (this.content.refUrlOrImbed) {
        // link
        this.userSvc.browser(this.content.refUrlOrImbed);
      } else if (this.content.content) {
        this.userSvc.presentModal(this.content.title, this.content.content);
      }
    }
  }
  ionViewWillLeave() {
    this.content$.unsubscribe();
  }
  // initializeViewSettings() {
  //     if (this.platform.width() > this.platform.height()) {
  //         this.mediaSlot = "";
  //         this.fixedMode = false;
  //     } else {
  //         this.mediaSlot = "fixed";
  //         this.fixedMode = true;
  //     }
  // }
  ionViewDidEnter() {
    this.viewReadyPromiseResolver();
    this.overrideIonicBackButtonDefaultAction();
  }
  navigateToSection(sectionId) {
    this.viewReadyPromise.then(() => {
      const sectionElToScroll = document.getElementById(sectionId);
      if (sectionElToScroll) {
        sectionElToScroll.click();
        this.ionContent.scrollToPoint(0, sectionElToScroll.offsetTop, 1000);
      }
    });
  }
  overrideIonicBackButtonDefaultAction() {
    this.backButton.onClick = () => {
      this.navCtrl.back();
    };
  }
}
