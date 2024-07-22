import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Practitioner, Slot } from '@medplum/fhirtypes';
import NavigationBar from './NavigationBar';
// import Calendar from './Calendar';
import Calendar2 from './Calendar2';
import { Box } from '@mantine/core';

// interface RouteParams {
//   id: string;
// }

const PractitionerPage: React.FC = () => {
  // const { id } = useParams<RouteParams>();
  const { id } = useParams<{ id: string }>();
  const [practitioner, setPractitioner] = useState<Practitioner | null>(null);
  const [freeSlots, setFreeSlots] = useState<Slot[]>([]);

  useEffect(() => {
    const fetchPractitioner = async () => {
      const response = await axios.get(`/api/profiles/practitioners?identifier=${id}`);
      setPractitioner(response.data[0]);
    };

    fetchPractitioner();
  }, [id]);

  useEffect(() => {

    if (practitioner) {
      const fetchFreeSlots = async () => {
        const response = await axios.get(`/api/appointments/free-slots?practitionerIds=${practitioner.id}`);
        console.log(practitioner.id, response.data);
        setFreeSlots(response.data);
      };

      fetchFreeSlots();
    }
  }, [practitioner]);

  return (
    <Box style={{ backgroundColor: 'var(--mantine-color-gray-1', minHeight: '100vh' }}>
      <NavigationBar personName={practitioner?.name?.[0]?.text || 'Loading...'} />
      <Box mt="md" style={{ margin: '0 auto', maxWidth: '1200px', paddingLeft: '10px', paddingRight: '10px' }}>
        <Calendar2 freeSlots={freeSlots} />
      </Box>
    </Box>
  );
};

export default PractitionerPage;
