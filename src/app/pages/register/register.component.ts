import { Diseases } from './../../models/diseases';
import { SystemInformationService } from './../../services/system-info.service';
import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { RegistrationMapComponent } from '../registration-map/registration-map.component';

const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
const NUMBERS_REGEXP = /^\d+$/;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isModal: boolean;
  diseases: Diseases[] = [];
  location: any;

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private modalCtrl: ModalController,
    private systemInformationService: SystemInformationService,
    public navCtrl: NavController
  ) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])],
      fullName: ['', Validators.compose([Validators.minLength(2), Validators.required])],
      phone: ['', Validators.compose([Validators.minLength(6), Validators.required, Validators.pattern(NUMBERS_REGEXP)])],
      identification: ['', Validators.compose([Validators.minLength(11),
        Validators.maxLength(11), Validators.required, Validators.pattern(NUMBERS_REGEXP)])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      confirmedPassword: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      location: [{}, Validators.compose([Validators.required])],
      diseases: [[], Validators.compose([Validators.required])],
      bornDate: ['', Validators.compose([Validators.required])]
    });

    this.systemInformationService.getDiseases().toPromise().then( (dataResult) => {
      this.diseases = dataResult;
    });
  }

  getValidConfirmedPassword(value) {
    return this.registerForm.controls['password'].value === value;
  }

  registerUser() {
    const userRequest = this.registerForm.getRawValue();
    const noneDisease = this.diseases.find( (disease) => disease.description === 'Ninguna');
    if (userRequest.diseases.some( (value) => noneDisease && noneDisease.key === value) && userRequest.diseases.length > 1) {
      alert('Elección de enfermedades invalidas, revise por favor');
      return;
    }

    this.authenticationService.registerUser(userRequest).then( (registerResult) => {
      this.navCtrl.navigateRoot(['/home'], {});
    }).catch( (error) => {
      console.log(error);
    });
  }

  async presentMapModal() {
    const self = this;
    const modal = await this.modalCtrl.create(
      { component: RegistrationMapComponent}
      );
      modal.onDidDismiss().then( (data: any) => {
        if (data) {
          self.location = data.data;
          self.registerForm.controls['location'].setValue(self.location);
        } else {
          self.location = { latitude: 0, longitude: 0 };
        }
      });
    return await modal.present();
  }
}
