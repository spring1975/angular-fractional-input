import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MaterialExampleModule} from '../material.module';
import {InputOverviewExample} from './input-overview-example';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {HttpClientModule} from '@angular/common/http';
import {FormattedFractionalInputModule} from './formatted-fractional-input/formatted-fractional-input.module';
@NgModule({
  declarations: [InputOverviewExample],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    FormattedFractionalInputModule,
    HttpClientModule,
    MatNativeDateModule,
    MaterialExampleModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [InputOverviewExample],
})
export class AppModule {}
