import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Platform } from '@ionic/angular';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';

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
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  isMobile: boolean;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  refresh = new Subject<void>();

  events: CalendarEvent[] = [
    {
      start: new Date(),
      end: new Date(),
      title: '●●',
      color: colors.red,
      allDay: true,
      draggable: true,
    },
    {
      start: new Date(),
      end: new Date(),
      title: 'テスト',
      color: colors.red,
      allDay: true,
      draggable: true,
    },
    {
      start: addDays(new Date(), 1),
      end: addDays(new Date(), 1),
      title: 'ひとり',
      color: colors.red,
      allDay: true,
      draggable: true,
    },
  ];

  activeDayIsOpen: boolean = true;

  constructor(private modal: NgbModal, private platform: Platform) {
    this.isMobile = platform.is('mobile') && !platform.is('tablet');
  }

  ngOnInit() {}

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  getTitle(events: CalendarEvent[]) {
    const names: string[] = [];
    for (const e of events) {
      names.push(e.title + 'さん');
    }
    return names.join(',') + 'の誕生日です。';
  }
}
