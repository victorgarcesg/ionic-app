import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertController, ToastController } from '@ionic/angular';
import { HealthConditionService } from 'src/app/services/health-condition.service';

@Component({
  selector: 'app-health-condition',
  templateUrl: './health-condition.component.html',
  styleUrls: ['./health-condition.component.scss']
})
export class HealthConditionComponent implements OnInit {

  healthStatus = false;
  currentPosition: {latitude: number, longitude: number} = {latitude: 0, longitude: 0};
  constructor(
    private healthConditions: HealthConditionService,
    private toastCtrl: ToastController,
    private geolocation: Geolocation,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.healthConditions.getHealthStatus().toPromise().then( (result) => {
      this.healthStatus = result !== undefined && result !== null;
    });

    this.geolocation.getCurrentPosition().then((resp) => {
      this.currentPosition.latitude = resp.coords.latitude;
      this.currentPosition.longitude = resp.coords.longitude;
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  async healthStatusChange(status) {
    if (status) {
      const alert = await this.alertController.create( {
        header: 'Alertar',
        message: 'Permite que otros usuarios sean alertados de su estado ?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              this.putHealtStatus(false);
            },
            cssClass: 'secondary'
          }, {
            text: 'Si',
            handler: () => {
              this.putHealtStatus(true);
            }
          }
        ]
      });
      alert.present();
    } else {
      this.updateHealtStatus();
    }
  }

  putHealtStatus(shared) {
    console.log(this.currentPosition);
    this.healthConditions.setAsInfected(this.currentPosition, shared).then( async () => {
      await this.showHealthStatusUpdated();
    });
  }

  updateHealtStatus() {
    this.healthConditions.putHealthStatus(true).then( async() => {
      await this.showHealthStatusUpdated();
    });
  }


  private async showHealthStatusUpdated() {
    const alert = await this.toastCtrl.create({
      message: 'Estado de salud actualizado',
      duration: 3000
    });
    alert.present();
  }
}
