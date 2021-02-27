import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Patient, Doctors } from './new-patient.model';


@Component({
  selector: 'app-new-patient',
  templateUrl: './new-patient.component.html',
})
export class NewPatientComponent implements OnInit {

  doctors: Doctors[] = [];

  constructor(
    private appService: AppService,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.appService.getJSONDoctors()
      .subscribe((doctors: Doctors[]) => {
        this.doctors = doctors;
    });
  }

  savePatiens(event: Patient[]) {
    this.appService.savePatient(event)
      .subscribe(() => {
        this._snackBar.open('successfully', 'Close', {
          duration: 2000,
        });
      })
  }
}

