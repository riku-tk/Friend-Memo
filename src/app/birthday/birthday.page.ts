import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Platform, ModalController } from '@ionic/angular';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { FirestoreService, IProfile } from '../shared/firestore.service';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { first } from 'rxjs/operators';
import { ProfileDetailPage } from '../profile-detail/profile-detail.page';

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

interface CustomCalendarEvent extends CalendarEvent {
  profilePhotoDataUrl?: string;
}

@Component({
  selector: 'app-Birthday',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './Birthday.page.html',
  styleUrls: ['./Birthday.page.scss'],
})
export class BirthdayPage implements OnInit {
  profile: Observable<IProfile[]>;
  events$: Observable<CustomCalendarEvent[]>;
  eventSubject: Subject<CustomCalendarEvent[]>;
  isMobile: boolean;
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  activeDayIsOpen = true;
  eventProfileIdList: string[] = [];
  toggle = false;
  monthArray: number[] = [...Array(12).keys()].map((i) => ++i);
  dayArray: number[] = [...Array(31).keys()].map((i) => ++i);
  headFlg: boolean;
  mobileEvent: object = {};
  mobileEvents: Observable<object>;
  mobileEventSubject: Subject<object>;
  profileObject: IProfile = {
    uid: '',
    name: '',
    profession: '',
    gender: '',
    hobby: '',
    favoriteFood: '',
    birthMonth: '',
    birthDay: '',
    birthPlace: '',
    dislikes: '',
    relationship: '',
    pinningFlg: false,
    timeStamp: Date.now(),
  };

  private events: CustomCalendarEvent[] = [];

  constructor(
    public modalController: ModalController,
    private modal: NgbModal,
    private platform: Platform,
    public auth: AuthService,
    public firestore: FirestoreService,
  ) {
    this.isMobile = platform.is('mobile') && !platform.is('tablet');
    this.eventSubject = new Subject<CustomCalendarEvent[]>();
    this.events$ = this.eventSubject.asObservable();

    this.mobileEventSubject = new Subject<object>();
    this.mobileEvents = this.mobileEventSubject.asObservable();
  }

  ngOnInit() {
    this.profile = this.firestore.profileInitOrderByBirthDay(this.auth.getUserId());
    this.profile.subscribe((profiles) => {
      this.events = [];
      this.eventProfileIdList = [];
      this.updateEvent();
      this.mobileEvent = {};
      this.updateEventMobile();
    });
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  getTitle(events: CustomCalendarEvent[]) {
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

  updateEventMobile() {
    this.profile.pipe(first()).forEach((profiles) => {
      for (const profileDate of profiles) {
        if (profileDate.birthDay !== '' && profileDate.birthMonth !== '') {
          if (this.isKeyExists(this.mobileEvent, Number(profileDate.birthMonth) * 100 + Number(profileDate.birthDay))) {
            this.mobileEvent[Number(profileDate.birthMonth) * 100 + Number(profileDate.birthDay)] = [
              ...this.mobileEvent[Number(profileDate.birthMonth) * 100 + Number(profileDate.birthDay)],
              profileDate,
            ];
          } else {
            this.mobileEvent[Number(profileDate.birthMonth) * 100 + Number(profileDate.birthDay)] = [profileDate];
          }
        }
      }
      console.log(this.mobileEvent);
      this.mobileEventSubject.next(this.mobileEvent);
    });
    console.log(this.mobileEvent);
  }

  getMonthBirthDayDate(month: number, day: number) {
    if (this.isKeyExists(this.mobileEvent, month * 100 + day)) {
      return this.mobileEvent[month * 100 + day];
    } else {
      return [];
    }
  }

  private isKeyExists(obj, key) {
    return !(obj[key] === undefined);
  }

  async openDetailPage(profileData: IProfile) {
    const modal = await this.modalController.create({
      component: ProfileDetailPage,
      componentProps: {
        profileData,
        memoList: this.firestore.memoInit(profileData.id),
      },
    });
    await modal.present();
  }
}
