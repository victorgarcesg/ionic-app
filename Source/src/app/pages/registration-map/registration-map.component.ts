import { Component, ElementRef, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ModalController } from '@ionic/angular';
import leaflet from 'leaflet';


@Component({
  selector: 'app-registration-map',
  templateUrl: './registration-map.component.html',
  styleUrls: ['./registration-map.component.scss']
})
export class RegistrationMapComponent {

  @ViewChild('map') mapContainer: ElementRef;
  currentPosition: {latitude: number, longitude: number} = {latitude: 0, longitude: 0};
  selectedPosition: {latitude: number, longitude: number} = {latitude: 0, longitude: 0};
  selectedMarked: any;
  map: any;
  savingPoint: boolean;
  constructor(
    private viewCtrl: ModalController,
    private geolocation: Geolocation
  ) { }

  ionViewDidEnter() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.currentPosition.latitude = resp.coords.latitude;
      this.currentPosition.longitude = resp.coords.longitude;
      this.loadmap();
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  loadmap() {
    this.map = leaflet.map('map').fitWorld();
    leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attributions: 'Map data &copy; OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(this.map);
    this.setCurrentPosition();
    this.map.locate({
      setView: true,
      latitude: this.currentPosition.latitude,
      longitude: this.currentPosition.longitude,
      maxZoom: 16
    }).on('click', (e) => {
      if (this.savingPoint) {
        return;
      }
      const layersGroup = leaflet.layerGroup();
      layersGroup.clearLayers();
      const marker: any = leaflet.marker([e.latlng.lat, e.latlng.lng]).addTo(this.map);
      if (this.selectedMarked) {
        this.map.removeLayer(this.selectedMarked);
      }
      this.selectedMarked = marker;
      this.selectedPosition = { latitude: e.latlng.lat, longitude: e.latlng.lng};
    }).on('locationerror', (err) => {
      alert(err.message);
    });
  }

  private setCurrentPosition() {
    const marker: any = leaflet.marker([this.currentPosition.latitude, this.currentPosition.longitude]).addTo(this.map);
    if (this.selectedMarked) {
      this.map.removeLayer(this.selectedMarked);
    }
    this.selectedMarked = marker;
    this.selectedPosition = this.currentPosition;
  }

  putOnMyLocation() {
    this.setCurrentPosition();
  }

  savePoint() {
    this.savingPoint = true;
      this.viewCtrl.dismiss(this.selectedPosition).catch(() => console.log('Some bug going on..'));
    this.savingPoint = false;
  }

}
