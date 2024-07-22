import React from 'react';
import { Slot } from '@medplum/fhirtypes';
import { Calendar , momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface CalendarProps {
  freeSlots: Slot[];
}

const Calendar2: React.FC<CalendarProps> = ({ freeSlots }) => {
  const events = freeSlots.map(slot => ({
    title: 'Free',
    start: new Date(slot.start),
    end: new Date(slot.end),
    allDay: false,
  }));

  const backgroundEvents = [{ title: 'Busy', start: new Date(2022, 0, 0, 0), end: new Date(2025, 0, 0, 0) }];
  const startDate9AM = events.length > 0 ? new Date(events[0].start) : new Date();
  startDate9AM.setHours(9,0,0,0);

  console.log(events);

  return (
    <Calendar
      localizer={localizer}
      events={ events }
      backgroundEvents={ backgroundEvents }
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
      views={['week', 'month', 'agenda']}
      defaultView='week'
      scrollToTime={ startDate9AM }
      dayLayoutAlgorithm={'no-overlap'}
      
    />
  );
};

export default Calendar2;
