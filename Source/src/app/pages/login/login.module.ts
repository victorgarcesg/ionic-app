import { AuthenticationService } from './../../services/authentication.service';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { SharedModule } from './../../components/shared.module';
import { LoginComponent } from './login.component';
import { LoginService } from 'src/app/services/login.service';

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
        component: LoginComponent
      }
    ])
  ],
  providers: [LoginService, AuthenticationService],
  declarations: [LoginComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginPageModule { }
