import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';
import { AuthenticationService } from './../../services/authentication.service';
import { ConfigData } from './../../services/config';

const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoggedIn = false;
  backgroundImage = './assets/imgs/bg1.jpg';
  users = { id: '', name: '', email: '', picture: { data: { url: '' } } };
  loginForm: FormGroup;
  constructor(
    private navController: NavController,
    private fb: FormBuilder,
    private loginService: LoginService,
    private authenticationService: AuthenticationService
    ) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
    });

    const authData = this.authenticationService.getCurrentUserLocal();
    if (authData && authData !== null) {
      this.goToHome();
    }
  }

  authUser() {
    const authRequest = this.loginForm.getRawValue();
    this.authenticationService.loginUser(authRequest.email, authRequest.password).then( () => {
      this.authenticationService.getCurrentUser().toPromise().then( (data) => {
        const userString = JSON.stringify(data.data());
        localStorage.setItem(ConfigData.authDataKey, userString);
        this.loginService.emitLogged();
        this.goToHome();
      });
    }).catch( (error) => {
      console.log(error);
    });
  }

  goToHome() {
    this.navController.navigateRoot('home', {});
  }

  goToRegister() {
    this.navController.navigateForward('register', {});
  }

  getCurrentDate() {
    return new Date();
  }

  getUserDetail(userid: any) {
  }
}
