import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListPatientsRoutingModule } from './list-patients-routing.module';
import { ListPatientsComponent } from './list-patients.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ListPatientsComponent],
  imports: [
    CommonModule,
    ListPatientsRoutingModule,
    MatPaginatorModule,
    MatTableModule,
    SharedModule
  ]
})
export class ListPatientsModule { }
