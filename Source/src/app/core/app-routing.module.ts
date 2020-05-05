import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: '../pages/login/login.module#LoginPageModule'
  },
  {
    path: 'home',
    loadChildren: '../pages/home/home.module#HomePageModule'
  },
  {
    path: 'category',
    loadChildren: '../pages/category/category.module#CategoryPageModule'
  },
  {
    path: 'bookmark',
    loadChildren: '../pages/bookmark/bookmark.module#BookmarkPageModule'
  },
  {
    path: 'about',
    loadChildren: '../pages/about/about.module#AboutPageModule'
  },
  {
    path: 'recent-news',
    loadChildren: '../pages/recent-news/recent-news.module#RecentNewsPageModule'
  },
  {
    path: 'single-page',
    loadChildren: '../pages/single-page/single-page.module#SinglePageModule'
  },
  {
    path: 'comment-page',
    loadChildren: '../pages/comments/comments.module#CommentsPageModule'
  },
  {
    path: 'notifications',
    loadChildren: '../pages/notification-history/notification-history.module#NotificationHistoryModule'
  },
  {
    path: 'register',
    loadChildren: '../pages/register/register.module#RegisterModule'
  },
  {
    path: 'infecteds',
    loadChildren: '../pages/location/location.module#LocationModule'
  },
  {
    path: 'health-condition',
    loadChildren: '../pages/health-condition/health-condition.module#HealthConditionsModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,  { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
