import { AngularFireModule } from '@angular/fire';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { File } from '@ionic-native/file/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { LoginPageModule } from '../pages/login/login.module';
import { LoginService } from '../services/login.service';
import { NotificationService } from '../services/notification.service';
import { PostService } from '../services/post.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import * as firebase from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestoreModule, AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Geolocation } from '@ionic-native/geolocation/ngx';

const firebaseConfig = {
  apiKey: 'AIzaSyDo-FNXt3pLtX_K0FJK8cjQn_LHTUZctZU',
  authDomain: 'vamosjuntosrd-51b5a.firebaseapp.com',
  databaseURL: 'https://vamosjuntosrd-51b5a.firebaseio.com',
  projectId: 'vamosjuntosrd-51b5a',
  storageBucket: 'vamosjuntosrd-51b5a.appspot.com',
  messagingSenderId: '725018613340',
  appId: '1:725018613340:web:77a53518aa8764d929b899',
  measurementId: 'G-Y4Y1CWKLW7'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, HttpModule, HttpClientModule,
    LoginPageModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig, 'VamosJuntosRD'),
    IonicModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    StatusBar, SplashScreen, File, SocialSharing, OneSignal, AngularFireAuth,
    AngularFireDatabase, AngularFirestoreModule, AngularFirestore,
    Geolocation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    LoginService, PostService, NotificationService, ScreenOrientation
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
