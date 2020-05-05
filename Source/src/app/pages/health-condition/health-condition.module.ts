import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from './../../components/shared.module';
import { HealthConditionService } from './../../services/health-condition.service';
import { HealthConditionComponent } from './health-condition.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: HealthConditionComponent
      }
    ]),
  ],
  declarations: [HealthConditionComponent],
  providers: [HealthConditionService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HealthConditionsModule { }
