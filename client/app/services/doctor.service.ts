import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DoctorService {

  constructor(private http: HttpClient) { }

  getDoctors(): Observable<any> {
    return this.http.get<any>('/api/doctors');
  }

}
