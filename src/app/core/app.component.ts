import { AuthenticationService } from './../services/authentication.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { AlertController, NavController, Platform, ToastController, LoadingController, Events, MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs/Subscription';
import { ConfigData } from 'src/app/services/config';
import { LoginService as LoginService } from '../services/login.service';
import { MediaService } from '../services/media.service';
import { PostService } from './../services/post.service';
import { NotificationService } from '../services/notification.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { HealthConditionService } from '../services/health-condition.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public appPages = [];
  headerMenuItem = {};
  socialLink: any = {};

  rootPage: any = 'LoginComponent';
  pages: Array<{ title: string, component: any, image: string, url: string }>;
  isLoggedIn = false;
  username = '';
  onLoggedEvent: Subscription;
  onNotificationCheckEvent: Subscription;
  userData: any;
  unreadNotificationsCount = 0;
  loader: HTMLIonLoadingElement;
  authenticationSubcription: Subscription;

  constructor(
    private oneSignal: OneSignal,
    private navController: NavController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private mediaService: MediaService,
    private loadingCtrl: LoadingController,
    public platform: Platform,
    private menuCtrl: MenuController,
    private authenticationService: AuthenticationService,
    private firebaseAuthentication: AngularFireAuth,
    private screenOrientation: ScreenOrientation,
    private postService: PostService,
    private loginService: LoginService,
    private events: Events,
    private notificationService: NotificationService,
    private healthConditionService: HealthConditionService,
    public statusBar: StatusBar,
    private geolocation: Geolocation,
    public splashScreen: SplashScreen) {

    this.initializeApp();
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    this.authenticationSubcription = this.firebaseAuthentication.authState.subscribe( (user) => {
      if (user) {
        this.lockSideBar(true);
        this.navController.navigateRoot(['home'], {});
        this.authenticationService.getCurrentUser().toPromise().then( (data) => {
          this.userData = data.data();
          let username = this.userData.fullName;
          if (username.split(' ').length > 1) {
            username = username.split(' ')[0];
          }
          this.username = username;
          this.isLoggedIn = true;
        });
      } else {
        this.isLoggedIn = false;
        this.navController.navigateRoot(['login'], {});
      }
    });

    this.pages = [
      { title: 'Inicio', component: 'HomePage', image: '../../assets/icon/menu-home.png', url: 'home'},
      { title: 'Categoria', component: 'CategoryPage', image: '../../assets/icon/menu-category.png', url: 'category' },
      { title: 'Guardados', component: 'BookmarkPage', image: '../../assets/icon/menu-bookmark.png', url: 'bookmark' },
      { title: 'Notificaciones', component: 'NotificationHistoryComponent',
      image: '../../assets/icon/menu-category.png', url: 'notifications' },
      { title: 'Estado de salud', component: 'HealthConditionComponent',
      image: '../../assets/icon/menu-bookmark.png', url: 'health-condition' },
      { title: 'Mapa de infectados', component: 'LocationComponent', image: '../../assets/icon/menu-home.png', url: 'infecteds' },
      { title: 'Acerca de', component: 'AboutPage', image: '../../assets/icon/menu-about.png', url: 'about' },
      { title: 'Iniciar sesión', component: 'LoginComponent', image: '../../assets/icon/menu-about.png', url: 'login' }
    ];
  }

  async ngOnInit() {
    const userData = this.authenticationService.getCurrentUser();

    this.updateNotificationsUnreadData();

    if (userData) {
      this.userData = userData;
      this.username = this.userData.fullName;
      this.isLoggedIn = true;
    }

    const healthStatus = await this.healthConditionService.getHealthStatus().toPromise();

    if (healthStatus) {
      this.geolocation.watchPosition().subscribe( (point) => {
        const position = {
          latitude: point.coords.latitude,
          longitude: point.coords.longitude
        };
        this.healthConditionService.putPositionn(position);
      });
    }

    this.events.subscribe('check-notifications', () => {
      this.updateNotificationsUnreadData();
    });
    this.events.subscribe('enable-sidebar', () => {
      this.lockSideBar(true);
    });
  }

  ngOnDestroy() {
    this.onLoggedEvent.unsubscribe();
    this.onNotificationCheckEvent.unsubscribe();
  }

  updateNotificationsUnreadData() {
    const notificationsStringData = localStorage.getItem(ConfigData.notificationReceivedKey);
    const notifications = JSON.parse(notificationsStringData);

    this.unreadNotificationsCount = notifications && notifications !== null ? notifications
    .filter(data => !data.additionalData.read).length : 0 ;
  }

  initializeApp() {
    const self = this;
    self.socialLink = ConfigData.socialLink;
    self.platform.ready().then(() => {
      self.loadFromConfig();
      self.defaultLoad();
    });

    self.onLoggedEvent = self.loginService.logged().subscribe(() => {
      self.isLoggedIn = true;
      this.navController.navigateRoot(['home'], {});
      const userStringValue = localStorage.getItem(ConfigData.authDataKey);
      const userData = JSON.parse(userStringValue);
      this.userData = userData;
      this.username = this.userData.fullName;
    });

    self.onNotificationCheckEvent = self.notificationService.checkNotifications().subscribe(() => {
      self.updateNotificationsUnreadData();
    });
  }

  async showLoading() {
    this.loader = await this.loadingCtrl.create({
      message: 'Cargando ...'
    });
    this.loader.present();
  }

  hideLoading() {
    this.loader.remove();
  }

  logout() {
    localStorage.removeItem(ConfigData.authDataKey);
    this.firebaseAuthentication.auth.signOut()
      .then( async res => {
        this.isLoggedIn = false;
        const alert = await this.toastCtrl.create({
          message: 'La sesión fue cerrada',
          duration: 3000
        });
        alert.present();
      })
      .catch(e => console.log('Error logout from Facebook', e));
  }

  loadFromConfig() {
    const isLoadedFromConfig = localStorage.getItem('isLoadedFromConfig');
    if (!isLoadedFromConfig) {
      const isRTLEnabled = localStorage.getItem('isRTLEnabled');
      const isLightColorSelected = localStorage.getItem('isLightColorSelected');
      const isPushNotificationEnabled = localStorage.getItem('isPushNotificationEnabled');
      if (!isRTLEnabled) {
        localStorage.setItem('isRTLEnabled', ConfigData.defualtValueForRTL + '');
      }
      if (!isLightColorSelected) {
        localStorage.setItem('isLightColorSelected', ConfigData.isLightColorSelected + '');
      }
      if (!isPushNotificationEnabled) {
        localStorage.setItem('isPushNotificationEnabled', ConfigData.defaultValueForPushNotification + '');
      }
      localStorage.setItem('isLoadedFromConfig', 'true');
    }
  }

  defaultLoad() {
    if (localStorage.getItem('isRTLEnabled') === 'true') {
      document.getElementsByTagName('ion-menu')[0].setAttribute('side', 'end');
      document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');
    }
    if (localStorage.getItem('isLightColorSelected')) {
      const isLightColorSelected = localStorage.getItem('isLightColorSelected') === 'true';
      const theme = isLightColorSelected ? 'light-themes' : 'dark-themes';
      document.getElementsByTagName('body')[0].setAttribute('class', theme);
    }
    if (this.statusBar) {
      this.statusBar.styleBlackOpaque();
    }
    if (this.splashScreen) {
      this.splashScreen.hide();
    }
    if (ConfigData.oneSignal && ConfigData.oneSignal.appID && ConfigData.oneSignal.googleProjectId) {
      this.oneSignal.startInit(ConfigData.oneSignal.appID, ConfigData.oneSignal.googleProjectId);
      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
      this.oneSignal.enableSound(true);
      this.oneSignal.enableVibrate(true);

      this.oneSignal.handleNotificationReceived().subscribe((jsonData) => {
        const notification = jsonData.payload;

        const notificationsString = localStorage.getItem(ConfigData.notificationReceivedKey);
        let notifications: any[] = JSON.parse(notificationsString);
        if (!notifications || notifications === null) {
          notifications = [];
        }

        notification.additionalData.read = false;
        notifications.push(notification);
        const stringData = JSON.stringify(notifications);
        localStorage.setItem(ConfigData.notificationReceivedKey, stringData);
        this.unreadNotificationsCount = notifications && notifications !== null ? notifications
        .filter(data => !data.additionalData.read).length : 0 ;
      });
      this.oneSignal.handleNotificationOpened().subscribe(async (jsonData) => {
        const notification = jsonData.notification.payload;
        if (jsonData.notification.isAppInFocus) {
          await this.presentNotificationAlert(`NUEVO ARTICULO: ${notification.body}`, notification.additionalData.postId);
        } else {
          this.openNotification(notification.additionalData.postId);
        }
      });
      this.oneSignal.endInit();
    }
    this.oneSignal.setSubscription(localStorage.getItem('isPushNotificationEnabled') === 'true');
  }

  async presentNotificationAlert(notificationMessage: string, notificationId) {
    const alert = await this.alertCtrl.create({
      header: 'Notificación',
      message: notificationMessage,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Abrir',
          handler: () => {
            this.openNotification(notificationId);
          }
        }
      ]
    });

    await alert.present();
  }

  async openNotification(notificationPostId) {
    await this.showLoading();
    this.postService.getPostByIdWithFilter(notificationPostId).toPromise().then( (item: any) => {
      this.mediaService.getItemById(item.mediaId).subscribe(media => {
          if (media['id'] === item['mediaId']) {
            item.image = media['source_url'];
          }

          const navigationExtras: NavigationExtras = {
            queryParams: { item: JSON.stringify(item) }
          };
          this.hideLoading();
          this.navController.navigateForward(['/single-page'], navigationExtras);
      });
    });
  }

  lockSideBar(active) {
    this.menuCtrl.enable(active, 'sideBar');
  }

  async openPage(page) {
    if (page.component === 'LoginComponent' && this.isLoggedIn) {
      this.logout();
      this.lockSideBar(false);
      this.navController.navigateRoot([page.url], {});
      return;
    } else if (page.component === 'LoginComponent') {
      localStorage.removeItem(ConfigData.notAuthUserData);
      this.lockSideBar(false);
      this.navController.navigateRoot([page.url], {});
      return;
    }

    this.navController.navigateForward([page.url], {});
  }

  onLogOut() {
    this.logout();
    this.lockSideBar(false);
    this.navController.navigateRoot(['login'], {});
  }
}
