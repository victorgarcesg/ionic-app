import { SystemInformationService } from './../../services/system-info.service';
import { AuthenticationService } from './../../services/authentication.service';
import { RegisterComponent } from './register.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { SharedModule } from './../../components/shared.module';
import { RegistrationMapComponent } from '../registration-map/registration-map.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: RegisterComponent
      }
    ]),
  ],
  declarations: [RegisterComponent, RegistrationMapComponent],
  providers: [AuthenticationService, SystemInformationService],
  entryComponents: [RegistrationMapComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegisterModule { }
