import React from 'react';
import { Appointment, Slot } from '@medplum/fhirtypes';
import { Calendar , momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface CalendarProps {
  freeSlots: Slot[];
  appointments: Appointment[];
}

const convertToCalendarEvents = (slots: Slot[], appointments: Appointment[]) => {
  const slotEvents = slots.map(slot => ({
    id: slot.id || '',
    title: 'Free',
    start: new Date(slot.start || ''),
    end: new Date(slot.end || ''),
    resourceType: 'slot',
    color: 'lightblue' // Customize color for slots
  }));

  const appointmentEvents = appointments.map(appointment => ({
    id: appointment.id || '',
    title: 'Confirmed',
    start: new Date(appointment.start || ''),
    end: new Date(appointment.end || ''),
    resourceType: 'appointment',
    color: 'lightcoral' // Customize color for appointments
  }));

  return [...slotEvents, ...appointmentEvents];
};


const Calendar2: React.FC<CalendarProps> = ({ freeSlots, appointments }) => {
  const events = convertToCalendarEvents(freeSlots, appointments);

  const backgroundEvents = [{ title: 'All Day Busy', start: new Date(2022, 0, 0, 0), end: new Date(2025, 0, 0, 0) }];
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
      style={{ height: 900 }}
      views={['week', 'month', 'agenda']}
      defaultView='week'
      scrollToTime={ startDate9AM }
      dayLayoutAlgorithm={'no-overlap'}
      eventPropGetter={
        (event, _start, _end, _isSelected) => { 
          const bg = (event.title.includes('Confirmed')) ? 
            'var(--mantine-color-red-8)' : (event.title.includes('All')) ? 
              'var(--mantine-color-pink-1)' : 'blue';
          return {style: {backgroundColor: bg}}
        }
      }
      
    />
  );
};

export default Calendar2;
