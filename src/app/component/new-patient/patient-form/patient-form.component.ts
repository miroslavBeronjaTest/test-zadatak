import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormArray,
  FormGroup,
  AbstractControl,
} from '@angular/forms';
import * as moment from 'moment';
import { Observable, from } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogInvalidComponent } from '../dialog-invalid/dialog-invalid.component';
import { Addresses, Doctors } from '../new-patient.model';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss']
})
export class PatientFormComponent implements OnInit {

  doctors: Doctors[] = [];
  @Input() set listDoctors(val: Doctors[]) {
    this.doctors = val;
  }
  @Output() readonly savePatiens = new EventEmitter<any>();

  patientForm: FormGroup = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    date: ['', Validators.required],
    codeVAT: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    doctorName: ['', Validators.required],
    addresses: this.formBuilder.array([])
  });

  filteredOptions: Observable<any[]> = from([]);
  dropdownValues: Array<{key: string, label: string}> = [];
  submitted = false;
  vatCodeRequired = true;
  isDisabledSaveButton = false;

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {

    const dropdownValues = () =>
      (Object.keys(DropdownValuesStatus).map((key: string) =>
        new Invalid(key, DropdownValuesStatusLabels[key])
      ));

    this.dropdownValues = dropdownValues();
    this.addresses.push(this.newAddressObject());

    this.filteredOptions = this.patientForm.controls.doctorName.valueChanges
      .pipe(
        startWith(''),
        map((value: any) => typeof value === 'string' ? value : value.firstName),
        map((name: any) => name ? this._filter(name) : this.doctors.slice())
      );

    this.patientForm.controls.date.valueChanges.subscribe((date: Date) => {
      const momentFormat = moment(date).format('YYYY-MM-DD');
      const age = moment().diff(momentFormat, 'years', false);

      this.patientForm.controls.codeVAT.clearValidators();
      if (age >= 18) {
        this.patientForm.controls.codeVAT.setValidators([Validators.required]);
        this.vatCodeRequired = true;
      } else {
        this.vatCodeRequired = false;
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
      name: [null]
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

  get ptForm(): {[key: string]: any} | null { return this.patientForm.controls; }

  get addresses() : FormArray { return this.patientForm.get('addresses') as FormArray; }

  save(): void {
    this.submitted = true;

    if (this.patientForm.invalid) {

      const invalidProps = this.foundInvalidField(this.patientForm.controls);
      const dialogRef = this.dialog.open(DialogInvalidComponent, {
        width: '650px',
        data: invalidProps,
      });

      return;
    }

    this.patientForm.value.addresses.forEach((el: Addresses) => {
      el.phoneNumber = el.phoneNumber.replace(/\s/g, '');
    });

    this.addresses.controls.forEach((el: AbstractControl) => {
      let phoneNumber: AbstractControl | null = el.get('phoneNumber');

      phoneNumber!.setValue(phoneNumber!.value.replace(/\s/g, ''));
    });

    this.savePatiens.emit(this.patientForm.value);
  }

  foundInvalidField(controls: any) {

    let listError: any = [];
    Object.keys(controls).forEach((prop: any, propIndex: number) => {
      const { errors } = controls[prop];

      if (prop === 'addresses') {
        const address = controls[prop];
        address.controls.forEach((address: any, index: number) => {
          let errorMessageAddress = `Address${index} - `;
          if (Object.keys(address.controls).length) {
            let counter = 0;
            Object.keys(address.controls).forEach((propAddress: any) => {
              const { errors: errorAddress } = address.controls[propAddress];
              if (errorAddress) {
                errorMessageAddress += this.getErrorMessage(errorAddress, counter, InvalidLabelsAddresses[propAddress]);
                counter++;
              }
            });
            if (address.status === 'INVALID') {
              listError.push({label: errorMessageAddress});
            }

          }

        });
      } else {
        if (errors) {
          listError.push({label: this.getErrorMessage(errors, 0, InvalidLabels[prop])});
        }
      }
    });
    return listError;
  }

  getErrorMessage(errors: string, propIndex: number, nameOfprops: string) {
    let errorMessage = '';

    if (errors) {
      const errorsExist  = (Object.keys(errors))[0];
      if (errorsExist === 'pattern') {
        !propIndex ?
          errorMessage += `Number is not correct` :
          errorMessage += `, Number is not correct`;
      } else if (errorsExist === 'required') {
        !propIndex ?
          errorMessage += `${nameOfprops} is required` :
          errorMessage += `, ${nameOfprops} is required`;
      } else if (errorsExist === 'email') {
        !propIndex ?
          errorMessage += `Please enter a valid email address` :
          errorMessage += `, Please enter a valid email address`;
      }
    }

    return errorMessage;
  }

  removeAddress(index: number) {
    this.addresses.removeAt(index);
  }

  change(state: string, index: number) {
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

export const InvalidLabelsAddresses: any = {
  phoneNumber: 'Phone number',
  street: 'Street',
  city: 'City',
  zipCode: 'ZipCode',
  country: 'Country',
  state: 'State',
  name: 'Name',
};

class Invalid {
  key: string;
  label: string;

  constructor(key: string, label: string) {
    this.key = key;
    this.label = label;
  }
}
