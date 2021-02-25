import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';

import * as moment from 'moment';
import { AppService } from 'src/app/app.service';
import { Observable, from } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogInvalidComponent } from './dialog-invalid/dialog-invalid.component';

export enum DropdownValuesStatus {
  SECOND_HOME = 'SECOND_HOME',
  WORK = 'WORK',
  HOLIDAY_PLACE = 'HOLIDAY_PLACE',
  CLOSE_RELATIVES = 'CLOSE_RELATIVES'
}

export interface DropdownValuesInterface {
  SECOND_HOME: string,
  WORK: string,
  HOLIDAY_PLACE: string,
  CLOSE_RELATIVES: string
}

export const DropdownValuesStatusLabels: any = {
  SECOND_HOME: 'Second Home',
  WORK: 'Work',
  HOLIDAY_PLACE: 'Holiday place',
  CLOSE_RELATIVES: 'Close relative'
};

export enum InvalidStatus {
  firstName = 'firstName',
  lastName = 'lastName',
  date = 'date',
  codeVAT = 'codeVAT',
  email = 'email',
  doctorName = 'doctorName',
  addresses = 'addresses'
}

export const InvalidLabels: any = {
  firstName: 'First Name',
  lastName: 'Last Name',
  date: 'Date',
  codeVAT: 'VAT code',
  email: "Email",
  doctorName: 'Name Doctor',
  addresses: 'Addresses'
};

class Invalid {
  key: any;
  label: any;

  constructor(key: any, label: string) {
    this.key = key;
    this.label = label;
  }
}

@Component({
  selector: 'app-new-patient',
  templateUrl: './new-patient.component.html',
  styleUrls: ['./new-patient.component.scss']
})
export class NewPatientComponent implements OnInit {

  patientForm: any = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    date: ['', Validators.required],
    codeVAT: ['', Validators.required],
    email: ['', [Validators.email, Validators.required]],
    doctorName: ['', Validators.required],
    addresses: this.formBuilder.array([])
  });

  filteredOptions: Observable<any[]> = from([]);
  dropdownValues: Array<{key: string, label: string}> = [];
  doctors: any;
  submitted = false;

  constructor(
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private appService: AppService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {

    const dropdownValues = () =>
      (Object.keys(DropdownValuesStatus).map((key: string) =>
        new Invalid(key, DropdownValuesStatusLabels[key])
      ));

    this.dropdownValues = dropdownValues();
    this.addresses.push(this.newAddressObject());

    this.appService.getJSONDoctors()
      .subscribe(doctors => {
        this.doctors = doctors;
        this.filteredOptions = this.patientForm.controls.doctorName.valueChanges
          .pipe(
            startWith(''),
            map((value: any) => typeof value === 'string' ? value : value.firstName),
            map((name: any) => name ? this._filter(name) : this.doctors.slice())
          );
    });

    this.patientForm.controls.date.valueChanges.subscribe((date: any) => {
      const momentFormat = moment(date).format('YYYY-MM-DD');
      const age = moment().diff(momentFormat, 'years', false);

      this.patientForm.controls.codeVAT.clearValidators();
      if (age >= 18) {
        this.patientForm.controls.codeVAT.setValidators([Validators.required]);
      }
      this.patientForm.controls.codeVAT.updateValueAndValidity();
    });
  }

  addNewAddress(extend: string) {
    this.addresses.push(this.newAddressObject(extend));
  }

  newAddressObject(extend?: string): FormGroup {
    const baseObj = {
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s]+$/)]],
      street: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['', Validators.required]
    }
    const otherProps = {
      state: ['', Validators.required],
      name: [null,  Validators.required]
    }

    let address
    extend ? address = {...baseObj, ...otherProps} : address = baseObj;

    return this.formBuilder.group(address);
  }

  displayFn(user: any): string {
    return user && user.firstName ? user.firstName : '';
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.doctors.filter((option: any) => option.firstName.toLowerCase().indexOf(filterValue) === 0);
  }

  get ptForm(): any { return this.patientForm.controls; }

  get addresses() : FormArray {
    return this.patientForm.get('addresses') as FormArray;
  }

  save(): void {
    this.submitted = true;

    if (this.patientForm.invalid) {
      const invalidProps = this.foundInvalidField(this.patientForm.controls);

      const invalidData = () =>
      (Object.keys(invalidProps).map((key: any) => {

        return new Invalid(invalidProps[key], InvalidLabels[key]);
      }));

      const dialogRef = this.dialog.open(DialogInvalidComponent, {
        width: '250px',
        data: invalidData()
      });

      return;
    }

    this.patientForm.value.addresses.forEach((el: any) => {
      el.phoneNumber = el.phoneNumber.replace(/\s/g, '');
    });

    this.appService.savePatient(this.patientForm.value)
      .subscribe(data => {
        this._snackBar.open('successfully', 'Close', {
          duration: 2000,
        });
      })
  }

  foundInvalidField(controls: any) {

    const invalid: any = {};
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid[name] = controls[name].invalid;
      }
    }
    return invalid;
  }

  removeAddress(index: number) {
    this.addresses.removeAt(index);
  }

  change(state: any, index: number) {
    const { WORK, CLOSE_RELATIVES } = DropdownValuesStatus;
    const address: any = this.addresses.at(index);
    const { name } = address['controls'];

    name.setValue('');
    if (state ==  WORK || state === CLOSE_RELATIVES) {
      name.setValidators([Validators.required]);
    } else {
      name.clearValidators();
    }

    name.updateValueAndValidity();
  }

  onBlurMethod(index: number) {
    const address: any = this.addresses.at(index);
    const { phoneNumber } = address['controls'];
    const { value } = phoneNumber;

    if (String(value)[0] !== '+') {
      phoneNumber.setValue(`+39${value}`);
    }
  }
}

