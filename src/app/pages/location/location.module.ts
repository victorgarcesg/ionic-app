import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from './../../components/shared.module';
import { HealthConditionService } from './../../services/health-condition.service';
import { LocationComponent } from './location.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: LocationComponent
      }
    ]),
  ],
  declarations: [LocationComponent],
  providers: [Geolocation, HealthConditionService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LocationModule { }
