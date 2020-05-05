import { Component, NgZone, ViewChild } from '@angular/core';
import { NavController, IonContent, Events, ToastController } from '@ionic/angular';
import { CommentService } from '../../services/comment.service';
import { DomSanitizer } from '@angular/platform-browser';
import { BookmarkService } from '../../services/bookmark.service';
import { TagsService } from '../../services/tags.service'
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { ConfigData } from 'src/app/services/config';
import * as moment from 'moment';
import { AdMobFreeInterstitial } from '@ionic-native/admob-free/ngx';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'single-page',
  templateUrl: 'single-page.html',
  styleUrls: ['single-page.scss'],
  providers: [CommentService, TagsService, BookmarkService, AdMobFreeInterstitial]
})
export class SinglePage {
  active: boolean;
  numberOfComment: Number = 0;
  post: any;
  htmlContent: any;
  htmlTitle: any;
  messageWhatsapp = `Consulta está y otros artículos en la página de \n Facebook: ${ConfigData.socialLink.facebook}
  \n Y descarga nuestra app para \n Google Play ${ConfigData.googlePlayPath}`;
  @ViewChild(IonContent) content: IonContent;

  constructor(public navCtrl: NavController,
    private _ngZone: NgZone,
    private route: ActivatedRoute,
    private adMobFreeInterstitial: AdMobFreeInterstitial,
    private domSanitizer: DomSanitizer,
    private commentService: CommentService,
    private toastController: ToastController,
    private tagsService: TagsService,
    private events: Events,
    private socialSharing: SocialSharing,
    private bookmarkService: BookmarkService) {
    const self = this;
    this.events.publish('enable-sidebar');
    this.route.queryParams.subscribe(params => {
      self.post = JSON.parse(params['item']);
      self.post.tagsList = [];
      if (self.post) {

      }
      if ( self.post.content) {
        self.post.content = self.post.content.replace(/<p>/gi, '<p style="font-size: 17.3px">');
        self.htmlContent = self.domSanitizer.bypassSecurityTrustHtml(self.post.content);
      }
      if (self.post && self.post.title) {
        self.htmlTitle = self.domSanitizer.bypassSecurityTrustHtml(self.post.title);
      }
      if (self.post.tags) {
        self.post.tags.forEach(element => {
          self.tagsService.getItemById(element).subscribe(value => {
            self.post.tagsList.push(value);
          });
        });
      }
      self.markPostAsRead(self.post.id);
      const postsOnBookmark = self.bookmarkService.getAllBookmark();
      if (postsOnBookmark !== undefined && postsOnBookmark !== null &&
        postsOnBookmark[self.post.id] !== undefined) {
          self.post.bookmark = true;
      }
      self.commentService
        .getAllCommentsForPostById(self.post.id, 1)
        .subscribe((comments: Array<any>) => {
          self.numberOfComment = comments.length;
          self.post.comments = comments;
        });
    });
    this.incrementPostCounter();
    this.showAdsAfterXPosts();
  }

  markPostAsRead(postId) {
    const notificationsString = localStorage.getItem(ConfigData.notificationReceivedKey);
    const notifications = JSON.parse(notificationsString);
    if (!notifications) {
      return;
    }

    const notification = notifications.filter(data => data.additionalData.postId === postId);

    notification.forEach(not => not.additionalData.read = true);
    const notificationsValue = JSON.stringify(notifications);

    localStorage.setItem(ConfigData.notificationReceivedKey, notificationsValue);
  }

  goBack() {
    this.events.publish('check-bookmark');
  }

  ionViewWillLeave() {
    this.events.publish('check-bookmark');
  }

  getDateFrom(date) {
    return moment(date).lang('es').fromNow();
  }

  openHashtag(tag, event) {
    if (event) {
      event.stopPropagation();
    }
    const navigationExtras: NavigationExtras = {
      queryParams: { tagId: JSON.stringify(tag.id) }
    };
    this.navCtrl.navigateForward(['/recent-news'], navigationExtras);
  }

  incrementPostCounter() {
    let counter = 0;
    if (localStorage.getItem('post-counter')) {
      counter = parseInt(localStorage.getItem('post-counter'));
    }
    counter++;
    localStorage.setItem('post-counter', counter + '');
  }

  showAdsAfterXPosts() {
    let counter = 0;
    if (localStorage.getItem('post-counter')) {
      counter = parseInt(localStorage.getItem('post-counter'));
    }
    if (ConfigData.interstitialAds.showAdsAfterXPosts <= counter) {
      this.showInterstitialAds()
      localStorage.setItem('post-counter', '0');
    }
  }

  showInterstitialAds() {
    if (!ConfigData.interstitialAds.enable) {
      return;
    }
    this.adMobFreeInterstitial.config(ConfigData.interstitialAds.config);
    this.adMobFreeInterstitial.prepare();
    this.adMobFreeInterstitial.show();

  }

  openComment(item, event) {
    if (event) {
      event.stopPropagation();
    }
    const navigationExtras: NavigationExtras = {
      queryParams: { postId: JSON.stringify(this.post.id) }
    };
    this.navCtrl.navigateForward(['/form-page'], navigationExtras);
  }

  openCommentList(item, e) {
    if (e) {
      e.stopPropagation();
    }
    const navigationExtras: NavigationExtras = {
      queryParams: { item: JSON.stringify(item) }
    };
    this.navCtrl.navigateForward(['/comment-page'], navigationExtras);
  }

  isClassActive() {
    return this.active;
  }

  setClassActive(newValue) {
    if (this.active != newValue) {
      this._ngZone.run(() => {
        this.active = newValue;
      });
    }
  }

  share = (item, e) => {
    this.socialSharing.shareViaFacebook(item.title, '', item.link)
    .then(() => {

    }).catch(() => {

    });
  }

  shareWhatsapp = (item, e) => {
    this.socialSharing.shareViaWhatsApp(`ARTICULO TITULADO: ${item.title} \n${this.messageWhatsapp} \n URL POST: `, '', item.link)
    .then(() => {

    }).catch(() => {

    });
  }

  async bookmark(item, e) {
    if (e) {
      e.stopPropagation();
    }
    if (item.bookmark) {
      item.bookmark = false;
      this.bookmarkService.delete(item);
    } else {
      item.bookmark = true;
      this.bookmarkService.save(item);
      const alert = await this.toastController.create({
        message: 'Articulo guardado',
        duration: 3000
      });
      alert.present();
    }
  }

  onItemClick(item) {
    this.content.scrollToTop(200);
  }

  ionViewDidLeave() {
    Array
     .prototype.slice
     .call(document.getElementsByTagName('video'))
     .forEach(video => video.pause());
 }

 isCommentEnabled(post) {
  return post.comment_status == 'open'
 }

  subscribeToIonScroll() { }
}
