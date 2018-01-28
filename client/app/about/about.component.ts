import { Component } from '@angular/core';
import { DoctorService } from '../services/doctor.service';
import { GeolocationService } from '../services/geolocation.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  doctors: any;
  lat: number = 49.2827;
  lng: number = -123.1207;

  currentLocation: any;

  constructor(private doctorService: DoctorService,
              private geolocationService: GeolocationService) { }

  ngOnInit () {
    this.doctorService.getDoctors().subscribe(
      data => this.doctors = data,
      err => console.log(err),
      () => {
        console.log(this.doctors);
      }
    )
  }

  hoverInfo (index) {
    console.log(this.doctors[index]);
  }
}
