import { HealthConditionService } from 'src/app/services/health-condition.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import leaflet from 'leaflet';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent {

  @ViewChild('map') mapContainer: ElementRef;
  currentPosition: {latitude: number, longitude: number} = {latitude: 0, longitude: 0};
  map: any;
  selectedPosition: { latitude: number; longitude: number; };
  infecteds: any[] = [];
  constructor(
    private geolocation: Geolocation,
    private healthConditions: HealthConditionService
  ) { }

  ionViewDidEnter() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.currentPosition.latitude = resp.coords.latitude;
      this.currentPosition.longitude = resp.coords.longitude;
      this.loadmap();
     }).catch((error) => {
       console.log('Error getting location', error);
     });

     this.healthConditions.getInfecteds().toPromise().then( (data) => {
       this.infecteds = data;
       const greenIcon = new leaflet.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
       this.infecteds.filter(result => result.share && !result.recuperated).forEach( (point) => {
        leaflet.marker([point.latitude, point.longitude], {icon: greenIcon}).addTo(this.map);
       });
     });
  }

  getInfectedCount() {
    return this.infecteds.filter(data => !data.recuperated).length;
  }

  getRecuperatedCount() {
    return this.infecteds.filter(data => data.recuperated).length;
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
      color: '#CB2B3E',
      fillColor: '#CB2B3E',
      maxZoom: 16
    }).on('locationerror', (err) => {
      alert(err.message);
    });
  }

  private setCurrentPosition() {
    leaflet.marker([this.currentPosition.latitude, this.currentPosition.longitude]).addTo(this.map);
  }

  putOnMyLocation() {
    this.setCurrentPosition();
  }

}
