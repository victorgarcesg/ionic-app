import { ConfigData } from './config';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
  authState: any;
  currentUser: any;
  private usersRef = this.firebase.collection('users');

  constructor(
      private firebaseAuthentication: AngularFireAuth,
      private firebase: AngularFirestore) {
    this.firebaseAuthentication.authState.subscribe((auth) => {
      this.authState = auth;
      if (this.authState) {
        this.usersRef.doc(this.authState.uid).valueChanges().toPromise().then( (data) => {
          const userString = JSON.stringify(data);
          localStorage.setItem(ConfigData.authDataKey, userString);
          this.currentUser = data;
        });
      }
    });
  }

  registerUser(userRequest: any): Promise<any> {
    return this.firebaseAuthentication.auth.createUserWithEmailAndPassword(userRequest.email, userRequest.password).then((newUser) => {
      const user = {
        email: userRequest.email,
        fullName: userRequest.fullName,
        identificationNumber: userRequest.identification,
        phone: userRequest.phone,
        bornDate: userRequest.bornDate,
        location: userRequest.location,
        diseases: userRequest.diseases,
      };
      const userString = JSON.stringify(user);
      localStorage.setItem(ConfigData.authDataKey, userString);
      this.firebase.collection('/users').doc(newUser.user.uid).set(user);
    });
  }

  loginUser(newEmail: string, newPassword: string): Promise<any> {
    return this.firebaseAuthentication.auth.signInWithEmailAndPassword(newEmail, newPassword);
  }

  logoutUser(): Promise<any> {
    return this.firebaseAuthentication.auth.signOut();
  }

  getCurrentUser() {
    return this.usersRef.doc(this.authState.uid).get();
  }

  getCurrentUserLocal() {
    const userDataString = localStorage.getItem(ConfigData.authDataKey);
    const userData = JSON.parse(userDataString);
    return userData;
  }
}
