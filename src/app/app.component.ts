import { ChangeDetectorRef, Component } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import heLocale from '@fullcalendar/core/locales/he';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'full-calendar';
  currentEvents: EventApi[] = [];
  
  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    locale: heLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    weekends: true,
    direction: 'rtl',
    initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    events: [      
      {
        id: 'a',
        title: 'event 1',
        start: '2023-09-03',
        end: '2023-09-09',
        display: 'background', //'background' 'auto' 'block' 'list-item' 'inverse-background' 'none' 
        // className: 'gcal-event',
        color: 'red',
        // textColor: 'blue'
      },
      {
        id: 'b',
        title: 'event 2',
        start: '2023-09-10',
        end: '2023-09-15',
        display: 'block', 
        // className: 'gcal-event',
        color: 'red',
        // textColor: 'blue'
      }
    ]
  };

  eventsPromise!: Promise<EventInput>;

  constructor(private changeDetector: ChangeDetectorRef){}

  toggleWeekends() {
    this.calendarOptions.weekends = !this.calendarOptions.weekends // toggle the boolean!
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

}
