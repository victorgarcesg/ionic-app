import { ConfigData } from 'src/app/services/config';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MediaService } from 'src/app/services/media.service';
import { PostService } from 'src/app/services/post.service';
import { NavigationExtras } from '@angular/router';
import { NavController, Events } from '@ionic/angular';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-notification-history',
  templateUrl: './notification-history.component.html',
  styleUrls: ['./notification-history.component.scss']
})
export class NotificationHistoryComponent implements OnInit {

  notifications: any[] = [];
  emptyState = {
    'title': 'Uups, no hay datos!',
    'subtitle': 'No tienes generadas notificaciones aún'
  };

  constructor(
    private postService: PostService,
    private mediaService: MediaService,
    private events: Events,
    private notificationService: NotificationService,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.getNotifications();

    this.events.subscribe('check-notifications', () => {
      this.getNotifications();
    });
  }

  private getNotifications() {
    const notifications = localStorage.getItem(ConfigData.notificationReceivedKey);
    this.notifications = JSON.parse(notifications);
    if (this.notifications) {
      this.notifications = this.sortByDate(this.notifications);
    }
  }

  getDateFrom(date) {
    return moment(date).lang('es').fromNow();
  }

  sortByDate(notifications) {
    return notifications.sort(function (a, b) {
      if (moment(a.additionalData.date).isAfter(b.order)) { return -1; }
      if (moment(a.additionalData.date).isBefore(b.order)) { return 1; }
      return 0;
    });
  }

  cleanNotifications() {
    localStorage.setItem(ConfigData.notificationReceivedKey, '[]');
    this.events.publish('check-notifications');
  }

  openNotification(notificationPostId) {
    this.postService.getPostByIdWithFilter(notificationPostId).toPromise().then( (item: any) => {
      this.mediaService.getItemById(item.mediaId).subscribe(media => {
          if (media['id'] === item['mediaId']) {
            item.image = media['source_url'];
          }

          this.notifications.filter(not => not.postId === notificationPostId).forEach( (notif) => {
            notif.read = true;
          });

          this.notifications = [...this.notifications];
          this.notificationService.emitCheck();
          const navigationExtras: NavigationExtras = {
            queryParams: { item: JSON.stringify(item) }
          };
          this.navController.navigateForward(['/single-page'], navigationExtras);
      });
    });
  }

}
