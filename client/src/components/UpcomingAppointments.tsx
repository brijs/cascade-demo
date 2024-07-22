import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Appointment } from '@medplum/fhirtypes';
import { Box, Text, Title, List } from '@mantine/core';
import dayjs from 'dayjs';

interface UpcomingAppointmentsProps {
  patientId: string;
}

const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({ patientId }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const response = await axios.get(`/api/appointments?patientId=${patientId}`);
      setAppointments(response.data);
    };

    fetchAppointments();
  }, [patientId]);

  if (appointments.length === 0) {
    return null;
  }

  return (
    <Box mt="md">
      <Title order={2}>Upcoming Appointments</Title>
      <List>
        {appointments.map((appointment) => (
          <List.Item key={appointment.id}>
            <Text>
              {dayjs(appointment.start).format('MMMM D, YYYY h:mm A')} 
            </Text>
          </List.Item>
        ))}
      </List>
    </Box>
  );
};

export default UpcomingAppointments;
