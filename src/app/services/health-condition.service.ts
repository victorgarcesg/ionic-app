import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

@Injectable({
    providedIn: 'root'
})
export class HealthConditionService {
  private infectedRef = this.firebaseContext.collection('infected');

  constructor(
      private firebaseContext: AngularFirestore,
      private authenticationService: AuthenticationService
      ) {
  }
  getInfecteds(): Observable<any> {
    return this.infectedRef.get()
    .map(
      disease => {
        const data = disease.docs.map(item => ({
          key: item.id, ... item.data()
        }));
        return data;
      }
    );
  }

  getHealthStatus() {
    const uid = this.authenticationService.authState.uid;
    return this.infectedRef.doc(uid).get().map(
        disease => {
          const data = { key: disease.id, ... disease.data()};
          return data;
        }
      );
  }

  putHealthStatus(healthly: boolean) {
    const uid = this.authenticationService.authState.uid;
    return this.infectedRef.doc(uid).set({
        recuperated: healthly
    });
  }

  putPositionn(position) {
    const uid = this.authenticationService.authState.uid;
    return this.infectedRef.doc(uid).set({
        latitude: position.latitude,
        longitude: position.longitude
    });
  }

  setAsInfected(position, shareCondition = false) {
    const uid = this.authenticationService.authState.uid;
    return this.infectedRef.doc(uid).set({
        latitude: position.latitude,
        longitude: position.longitude,
        share: shareCondition,
        recuperated: false
    });
  }
}
