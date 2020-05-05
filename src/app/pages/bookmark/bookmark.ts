import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BookmarkService } from '../../services/bookmark.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'page-bookmark',
  templateUrl: 'bookmark.html',
  styleUrls: ['bookmark.scss'],
  providers: [BookmarkService]
})
export class BookmarkPage {
  posts: any = [];
  title: any = "Bookmark";

  constructor(
    public navCtrl: NavController,
    private postService: PostService,
    private bookmarkService: BookmarkService) {
    this.loadBookmarks();
  }

  loadBookmarks() {
    let bookmarks = this.bookmarkService.getAllBookmark();
    this.posts = [];
    for (let item in bookmarks) {
      const post = bookmarks[item];
      this.postService.getPostByIdWithFilter(post.id).toPromise().then( (item: any) => {
        if (item && item !== null) {
          this.posts.push(post);
        }
      });
    }
  }

  clearAll() {
    this.bookmarkService.clearAll();
    this.loadBookmarks();
  }
  
  ionViewWillEnter() {
    this.loadBookmarks();
  }

  onBookmark(item) {
      this.bookmarkService.delete(item);
      this.loadBookmarks();
  }
}
