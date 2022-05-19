import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Platform } from '@ionic/angular';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { FirestoreService, IProfile } from '../shared/firestore.service';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { first } from 'rxjs/operators';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-tab3',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  profile: Observable<IProfile[]>;
  events$: Observable<CalendarEvent[]>;
  eventSubject: Subject<CalendarEvent[]>;
  isMobile: boolean;
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  activeDayIsOpen = true;
  eventProfileIdList: string[] = [];

  private events: CalendarEvent[] = [];

  constructor(
    private modal: NgbModal,
    private platform: Platform,
    public auth: AuthService,
    public firestore: FirestoreService,
  ) {
    this.isMobile = platform.is('mobile') && !platform.is('tablet');
    this.eventSubject = new Subject<CalendarEvent[]>();
    this.events$ = this.eventSubject.asObservable();
  }

  ngOnInit() {
    this.profile = this.firestore.profileInit(this.auth.getUserId());
    this.profile.subscribe((profiles) => {
      this.events = [];
      this.eventProfileIdList = [];
      this.updateEvent();
    });
  }

  closeOpenMonthViewDay() {
    //this.updateEvent();
    this.activeDayIsOpen = false;
  }

  getTitle(events: CalendarEvent[]) {
    const names: string[] = [];
    for (const e of events) {
      names.push(e.title);
    }
    return names.join(',') + 'の誕生日です。';
  }

  updateEvent() {
    this.profile.pipe(first()).forEach((profiles) => {
      for (const profileDate of profiles) {
        if (this.eventProfileIdList.includes(profileDate.id + this.viewDate.getFullYear())) {
          continue;
        }
        this.eventProfileIdList.push(profileDate.id + this.viewDate.getFullYear());
        const date: Date = new Date(`${this.viewDate.getFullYear()}-${profileDate.birthMonth}-${profileDate.birthDay}`);
        this.events = [
          ...this.events,
          {
            start: date,
            end: date,
            title: profileDate.name,
            profilePhotoDataUrl: profileDate.profilePhotoDataUrl,
            color: colors.red,
            allDay: true,
            draggable: true,
          },
        ];
      }
      this.eventSubject.next(this.events);
    });
  }
}
