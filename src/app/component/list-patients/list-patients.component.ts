import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map, mergeMap, toArray } from 'rxjs/operators';

import * as moment from 'moment';

@Component({
  selector: 'app-list-patients',
  templateUrl: './list-patients.component.html',
  styleUrls: ['./list-patients.component.scss']
})
export class ListPatientsComponent implements AfterViewInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'registeredDate', 'doctor', 'phones', 'emails', 'other'];
  dataSource: any;

  @ViewChild(MatPaginator, {static: true}) paginator: any;

  constructor(private appService: AppService) { }

  ngAfterViewInit() {
    this.appService.getJSONPatients()
      .pipe(
        mergeMap((val: Patient[]) => val),
        map((val: Patient) => {
          const date: any = moment(val['registeredDate']).format('YYYY-MM-DD');;
          val['registeredDate'] = date;
          val['addresses'].forEach((el, index) => {
            if (index === 0) {
              val['phones'] = `${el.phone}`;
              val['emails'] = `${el.email}`;
              val['other'] = `${el.street},${el.city},${el.country},${el.zipcode}`;
            } else {
              val['phones'] += `,${el.phone}`;
              val['emails'] += `,${el.email}`;
              val['other'] += `,${el.street},${el.city},${el.country},${el.zipcode}`;
            }
          })

          return val;
        }),
        toArray()
      )
      .subscribe((patients: any) => {
        this.dataSource = new MatTableDataSource<Patient>(patients)
        this.dataSource.paginator = this.paginator;
      })
  }

}

export interface Patient {
  id: number,
  registeredDate: Date,
  firstName: string,
  lastName: string,
  doctor: number,
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