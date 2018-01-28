import { ElementRef, NgZone, OnInit, ViewChild, Component } from '@angular/core';
import { DoctorService } from '../services/doctor.service';
import { environment } from '../../environments/environment';
import { FormControl } from '@angular/forms';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import { NgxSmartModalService } from 'ngx-smart-modal';


import { ToastComponent } from '../shared/toast/toast.component';

import * as _ from 'lodash';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  doctors: any;
  lat: number = 49.2827;
  lng: number = -123.1207;
  currentPage: number = 1;

  maxSize = 5;

  displayedDoctor: any;
  displayPerPage = 5;
  displayIndex: any;

  postalcode: string;

  inputPlaceholderText: 'Enter Address';

  @ViewChild("search")
  public searchElementRef: ElementRef;

  zoom=8;

  selectedDoctor: any;
  name:any;
  tel:any;


  constructor(private doctorService: DoctorService,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              public toast: ToastComponent,
              public ngxSmartModalService: NgxSmartModalService) { }

  ngOnInit () {
    this.doctorService.getDoctors().subscribe(
      data => this.doctors = data,
      err => console.log(err),
      () => {
        let currPage = this.currentPage;
        var stuff = _.slice(this.doctors, (currPage-1) * this.displayPerPage, currPage * this.displayPerPage)
        this.displayedDoctor = stuff;
      }
    );

    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
  }

  hoverInfo(index) {
    this.currentPage = Math.floor(index / this.displayPerPage) + 1;
    this.displayIndex = index % this.displayPerPage;
  }

  limitPostalCode() {
    console.log(this.postalcode);
  }

  pageChanged(event) {
    let currPage = event.page;
    var stuff = _.slice(this.doctors, (currPage-1) * this.displayPerPage, currPage * this.displayPerPage)
    this.displayedDoctor = stuff;
  }

  draggedMarker(event) {
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
  }

  openContactModal(index) {
    let doctorIndex = index + (this.currentPage-1) * this.displayPerPage;
    this.selectedDoctor = this.doctors[doctorIndex];
    this.ngxSmartModalService.getModal('Appointment').open()
  }

  onCloseModal() {
    if (!!!this.name) {
      this.toast.setMessage("Please Enter Your Name!", 'danger');
    }

    if (!!!this.tel) {
      this.toast.setMessage("Please Enter Your Phone Number!", 'danger');
    }
    //
    if (this.name && this.tel) {
      let line = "The doctor will call " + this.name + " at " + this.tel + ".";
      this.toast.setMessage(line, "success");
      this.name = null
      this.tel = null
    }
  }

}
