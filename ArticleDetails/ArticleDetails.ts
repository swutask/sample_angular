import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { ExportedClass as userService } from '../scripts/custom/userService';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { ActivatedRoute } from '@angular/router';
@Component({
  templateUrl: 'ArticleDetails.html',
  selector: 'page-article-details',
  styleUrls: ['ArticleDetails.scss'],
})
export class ArticleDetails {
  public article: any = {};
  public twitterMessage: string;
  public shareUrl: string;
  public canShareTwitter: boolean;
  public canShareFacebook: boolean;
  public currentItem: any = null;
  public mappingData: any = {};
  constructor(
    public route: ActivatedRoute,
    public userSvc: userService,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    public socialSharing: SocialSharing
  ) {
    let id = this.route.snapshot.paramMap.get('id');

    this.userSvc.getArticle(id).subscribe((res) => {
      this.article = res;
      //this.article = res; //.data.post;
      // TODO - TODD check this shareUrl
      this.shareUrl =
        'https://wealthbuilder.app.appery.io?article=' + this.article.id;
      this.twitterMessage = this.article.title.substring(
        0,
        140 - this.shareUrl.length
      );
      this.socialSharing
        .canShareVia('twitter', this.twitterMessage, null, null, this.shareUrl)
        .then(() => {
          this.canShareTwitter = true;
        })
        .catch(() => {
          this.canShareTwitter = false;
        });
      this.socialSharing
        .canShareVia('facebook', this.article.title, null, null, this.shareUrl)
        .then(() => {
          this.canShareFacebook = true;
        })
        .catch(() => {
          this.canShareFacebook = false;
        });
    });
  }
  imgError(e) {
    console.error(e);
  }
  learnMore() {
    this.userSvc.browser(this.article.footerCta.learnMoreLink);
  }
  canShare() {
    return (
      (this.platform.is('android') || this.platform.is('ios')) &&
      (this.canShareTwitter || this.canShareFacebook)
    );
  }
  async presentActionSheet() {
    let buttons = [];
    if (this.canShareFacebook) {
      buttons.push({
        text: 'Facebook',
        handler: () => {
          this.socialSharing.shareViaFacebook(
            this.article.title,
            null,
            this.shareUrl
          );
        },
      });
    }
    if (this.canShareTwitter) {
      buttons.push({
        text: 'Twitter',
        handler: () => {
          this.socialSharing.shareViaTwitter(
            this.twitterMessage,
            null,
            this.shareUrl
          );
        },
      });
    }
    buttons.push({
      text: 'Cancel',
      role: 'cancel',
      handler: () => {},
    });
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Share',
      buttons: buttons,
    });
    await actionSheet.present();
  }
}
