import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CoreComponent } from './core.component';
import { HeaderComponent } from './header/header.component';
import { LeftMenuComponent } from './left-menu/left-menu.component';

@NgModule({
  declarations: [
    CoreComponent,
    HeaderComponent,
    LeftMenuComponent,
  ],
  exports: [
    CoreComponent,
    HeaderComponent,
    LeftMenuComponent,
  ],
  imports: [
    CommonModule,
    InlineSVGModule.forRoot(),
    FlexLayoutModule,
    HttpClientModule
  ]
})
export class CoreModule { }
