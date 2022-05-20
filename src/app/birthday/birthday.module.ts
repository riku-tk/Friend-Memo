import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { IonicModule } from '@ionic/angular';
import { BirthdayPageRoutingModule } from './birthday-routing.module';
import { BirthdayPage } from './birthday.page';

import localeJa from '@angular/common/locales/ja';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';

registerLocaleData(localeJa);

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BirthdayPageRoutingModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'ja-JP' }],
  declarations: [BirthdayPage],
})
export class BirthdayPageModule {}
