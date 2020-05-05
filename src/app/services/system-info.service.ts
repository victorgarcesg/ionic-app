import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Diseases } from '../models/diseases';

@Injectable({
    providedIn: 'root'
})
export class SystemInformationService {
  private diseasesRef = this.firebaseContext.collection<Diseases>('diseases');

  constructor(
      private firebaseContext: AngularFirestore) {
  }
  getDiseases(): Observable<any> {
    return this.diseasesRef.get()
    .map(
      disease => {
        const data = disease.docs.map(item => ({
          key: item.id, ... item.data()
        }));
        return data;
      }
    );
  }
}
