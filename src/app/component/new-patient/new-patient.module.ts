import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { NewPatientRoutingModule } from './new-patient-routing.module';
import { NewPatientComponent } from './new-patient.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { FlexLayoutModule } from '@angular/flex-layout';
import { DialogInvalidComponent } from './dialog-invalid/dialog-invalid.component';

@NgModule({
  declarations: [NewPatientComponent, DialogInvalidComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NewPatientRoutingModule,
    FlexLayoutModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatRippleModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatDialogModule,
    MatListModule,
    MatSnackBarModule
  ]
})
export class NewPatientModule { }
