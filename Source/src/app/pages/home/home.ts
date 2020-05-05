import { Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationExtras } from '@angular/router';
import { AdMobFreeBanner } from '@ionic-native/admob-free/ngx';
import { Events, IonInfiniteScroll, NavController } from '@ionic/angular';
import * as moment from 'moment';
import { LoginService } from 'src/app/services/login.service';
import { BookmarkService } from '../../services/bookmark.service';
import { CategoryService } from '../../services/categoty.service';
import { ConfigData } from '../../services/config';
import { MediaService } from '../../services/media.service';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  styleUrls: ['home.scss'],
  providers: [CategoryService, UserService,
    PostService, MediaService, BookmarkService, AdMobFreeBanner
  ]
})
export class HomePage {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  categories: any = [];
  posts: any = [];
  postsRecentNews: any = [];
  selectedCategory: any;
  selectedItem: any;
  postPageLoaded = 1;
  defaultCategorie = {
    id: 0,
    name: 'Novedades',
    description: 'Últimas novedades',
    _link: {
      post_type: `${ConfigData.rootUrl}$posts`
    }
  };
  loading = true;

  emptyState = {
    'title': 'Uups, no hay datos!',
    'subtitle': 'Lo sentimos no hay datos aquí'
  };
  bookmarks: any;

  constructor(
    private admobFree: AdMobFreeBanner,
    public navCtrl: NavController,
    private domSanitizer: DomSanitizer,
    private categoryService: CategoryService,
    private postService: PostService,
    private events: Events,
    private mediaService: MediaService,
    private bookmarkService: BookmarkService) {
      this.events.publish('enable-sidebar', true);

      this.showBannerAds();
      this.bookmarks = this.bookmarkService.getAllBookmark();
      this.categoryService.getCategories().subscribe((categories: any[]) => {
        this.categories.push(this.defaultCategorie);
        this.categories.push(...categories);

        if (this.categories) {
          this.refreshData(this.categories[0]);
        }
      });

      this.events.subscribe('check-bookmark', () => {
        this.bookmarks = this.bookmarkService.getAllBookmark();
        this.posts.forEach(element => {
          element.bookmark = this.bookmarks[element.id] ? true : false;
        });
        this.posts = [...this.posts];
      });
  }

  showBannerAds() {
    if (!ConfigData.bannerAds.enable) {
      return;
    }
    this.admobFree.config(ConfigData.bannerAds.config);
    this.admobFree.prepare();
    this.admobFree.show();
  }

  getHtmlTitle(title) {
    if (title) {
      return this.domSanitizer.bypassSecurityTrustHtml(title);
    }
  }

  loadData(categoryId, event) {
    if (ConfigData.isFeaturesPostsGetFromSticky) {
      this.loadDataStickyFeatured(categoryId, event);
      this.loadDataStickyRecent(categoryId, event);
    } else {
      this.loadPostsAll(categoryId, event);
    }
  }

  loadPostsAll(categoryId, event) {
    this.postService.getPostListWithFilter(categoryId === 0 ? null : categoryId, null, null, null, this.postPageLoaded++)
    .subscribe((data: Array<any>) => {
      data = data.filter(post => !this.postsRecentNews.some(news => news.id === post.id) &&
      !this.posts.some(news => news.id === post.id));
      if (this.posts && this.posts.length === 0) {
        this.posts = data.slice(0, ConfigData.numberOfItemForSlider);
        if (data.length > ConfigData.numberOfItemForSlider) {
            this.postsRecentNews = this.postsRecentNews.concat(data.slice(ConfigData.numberOfItemForSlider, data.length));
        }
      } else {
        this.postsRecentNews = this.postsRecentNews.concat(data);
      }

      this.posts.forEach(element => {
        element.bookmark = this.bookmarks[element.id] ? true : false;
        if (element.mediaId) {
          this.mediaService.getItemById(element.mediaId).subscribe(media => {
            this.posts.forEach(el => {
              if (media['id'] === el['mediaId']) {
                el.image = media['source_url'];
              }
            });
          });
        }
      });

      this.postsRecentNews.forEach(element => {
        element.bookmark = this.bookmarks[element.id] ? true : false;
        if (element.mediaId) {
          this.mediaService.getItemById(element.mediaId).subscribe(media => {
            this.postsRecentNews.forEach(el => {
              if (media['id'] === el['mediaId']) {
                el.image = media['source_url'];
              }
            });
          });
        }
      });
      this.loading = false;
      if (event) {
        event.target.complete();
      }
    });
  }

  getDateFrom(date) {
    return moment(date).lang('es').fromNow();
  }

  loadDataStickyRecent(categoryId, event) {
    this.postService.getPostListWithFilter(categoryId, null, false, null, this.postPageLoaded++).subscribe((data: Array<any>) => {
      this.postsRecentNews = this.postsRecentNews.concat(data);
      if (event) {
        event.target.complete();
      }
      this.postsRecentNews.forEach(element => {
        element.bookmark = this.bookmarks[element.id] ? true : false;
        if (element.mediaId) {
          this.mediaService.getItemById(element.mediaId).subscribe(media => {
            this.postsRecentNews.forEach(el => {
              if (media['id'] === el['mediaId']) {
                el.image = media['source_url'];
              }
            });
          });
        }
      });
      this.loading = false;
    });
  }

  loadDataStickyFeatured(categoryId, event) {
    this.postService.getPostListWithFilter(categoryId, null, true, null, this.postPageLoaded).subscribe((data: Array<any>) => {
      this.posts = this.posts.concat(data);
      if (event) {
        event.target.complete();
      }
      this.posts.forEach(element => {
        element.bookmark = this.bookmarks[element.id] ? true : false;
        if (element.mediaId) {
          this.mediaService.getItemById(element.mediaId).subscribe(media => {
            this.posts.forEach(el => {
              if (media['id'] === el['mediaId']) {
                el.image = media['source_url'];
              }
            });
          });
        }
      });
      this.loading = false;
    });
  }

  refreshData(category) {
    if (category) {
      this.loading = true;
      this.selectedItem = category.name;
      this.selectedCategory = category;
      this.postsRecentNews = [];
      this.posts = [];
      this.postPageLoaded = 1;
      this.loadData(category.id, null);
    }
  }

  doInfinite(event) {
    this.loadData(this.selectedCategory.id, event);
  }

  openSinglePost(item) {
    const navigationExtras: NavigationExtras = {
      queryParams: { item: JSON.stringify(item) }
    };
    this.navCtrl.navigateForward(['/single-page'], navigationExtras);
  }

  bookmark = (item, e) => {
    if (e) {
      e.stopPropagation();
    }
    if (item.bookmark) {
      item.bookmark = false;
      this.bookmarkService.delete(item);
    } else {
      item.bookmark = true;
      this.bookmarkService.save(item);
    }
  }

  isEmptyStateActive() {
    return !this.loading && this.posts.length === 0 && this.postsRecentNews.length === 0;
  }

  initialLoading() {
    return this.loading;
  }
}
