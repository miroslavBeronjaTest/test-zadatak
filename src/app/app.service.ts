import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private jsonDoctors = 'assets/json/doctor.json';
  private jsonPatients = 'assets/json/patients.json';

  constructor(private http: HttpClient) { }

  public getJSONDoctors(): Observable<any> {
    return this.http.get(this.jsonDoctors);
  }

  public getJSONPatients(): Observable<any> {
    return this.http.get(this.jsonPatients);
  }

  public savePatient(data: any): Observable<any>{
    return of('successfully');
  }

}
