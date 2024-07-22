import React from 'react';
import { Slot } from '@medplum/fhirtypes';
import { Calendar as MantineCalendar } from '@mantine/dates';
import { Badge } from '@mantine/core';

interface CalendarProps {
  freeSlots: Slot[];
}

const Calendar: React.FC<CalendarProps> = ({ freeSlots }) => {
  const events = freeSlots.map(slot => ({
    start: new Date(slot.start),
    end: new Date(slot.end),
    title: 'Free Slot',
    allDay: false,
  }));

  return (
    <div>
      <MantineCalendar />
      {events.map((event, index) => (
        <Badge key={index} color="green">
          {event.title} - {event.start.toLocaleString()} to {event.end.toLocaleString()}
        </Badge>
      ))}
    </div>
  );
};

export default Calendar;
