import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map, mergeMap, toArray, switchMap } from 'rxjs/operators';

import * as moment from 'moment';
import { zip, Observable } from 'rxjs';

@Component({
  selector: 'app-list-patients',
  templateUrl: './list-patients.component.html',
  styleUrls: ['./list-patients.component.scss']
})
export class ListPatientsComponent implements AfterViewInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'registeredDate', 'doctorName', 'phones', 'emails', 'other'];
  dataSource: any;

  @ViewChild(MatPaginator, {static: true}) paginator: any;

  constructor(private appService: AppService) { }

  ngAfterViewInit() {

    this.getDoctors()
      .pipe(
        switchMap(doctors => this.getPatients(doctors))
      )
      .subscribe((patients: Patient[]) => {
        this.dataSource = new MatTableDataSource<Patient>(patients);
        this.dataSource.paginator = this.paginator;
      });
  }

  getPatients(doctors: any): Observable<any> {
    return this.appService.getJSONPatients()
      .pipe(
        mergeMap((patients: Patient[]) => patients),
        map((patient: Patient) => {
          const date: any = moment(patient['registeredDate']).format('YYYY-MM-DD');;
          patient['registeredDate'] = date;
          patient['doctorName'] = doctors[patient.doctor];
          patient['addresses'].forEach((el, index) => {
            if (index === 0) {
              patient['phones'] = `${el.phone}`;
              patient['emails'] = `${el.email}`;
              patient['other'] = `${el.street},${el.city},${el.country},${el.zipcode}`;
            } else {
              patient['phones'] += `,${el.phone}`;
              patient['emails'] += `,${el.email}`;
              patient['other'] += `,${el.street},${el.city},${el.country},${el.zipcode}`;
            }
          })

          return patient;
        }),
        toArray()
      )
  }

  getDoctors(): Observable<any> {
    let objectDoctors: any = {};
    return this.appService.getJSONDoctors()
      .pipe(
        mergeMap((doctors: Doctor[]) => doctors),
        map((doctor: Doctor) => {
          const {id, firstName, lastName} = doctor;
          objectDoctors[id] = `${firstName} ${lastName}`;
        }),
        toArray(),
        map(() => objectDoctors)
      )

  }

}

export interface Patient {
  id: number,
  registeredDate: Date,
  firstName: string,
  lastName: string,
  doctor: number,
  doctorName: string;
  addresses: Array<Addresses>
  phones?: string;
  emails?: string;
  other?: string;
}

export interface Addresses {
  type: string,
  email: string,
  phone: string,
  street: string,
  city: string,
  zipcode: number,
  country: string
}

export interface Doctor {
  id: number,
  firstName: string,
  lastName: string,
  title: string
}