import React, { useEffect, useState } from 'react';
import { Container, Card, Text, Stack, Box } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Practitioner } from '@medplum/fhirtypes';
import NavigationBar from './NavigationBar';

interface PractitionerData {
  id: string;
  name: string;
  identifier: string;
}

const PractitionerList: React.FC = () => {
  const [practitioners, setPractitioners] = useState<PractitionerData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch practitioners from the API
    const fetchPractitioners = async () => {
      try {
        const response = await axios.get('/api/profiles/practitioners');
        const data: Practitioner[] = response.data;
        
        // Extract relevant practitioner data
        const formattedPractitioners = data.map(practitioner => ({
          id: practitioner.id || '',
          name: practitioner.name?.[0]?.text || 'No name',
          identifier: practitioner.identifier?.[0]?.value || 'No identifier'
        }));

        setPractitioners(formattedPractitioners);
      } catch (error) {
        console.error('Failed to fetch practitioners', error);
      }
    };

    fetchPractitioners();
  }, []);

  return (
    <Box style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
      <NavigationBar personName={'All Practitioners'} />
      <Box mt="md" style={{ margin: '0 auto', maxWidth: '1200px' }}></Box>    
    <Container>
      <Stack gap="md">
        {practitioners.map(practitioner => (
          <Card
            key={practitioner.id}
            shadow="sm"
            padding="lg"
            style={{ cursor: 'pointer', backgroundColor: 'var(--mantine-color-gray-5)', borderRadius: '8px' }}
            onClick={() => navigate(`/practitioner/${practitioner.identifier}`)}
          >
            <Text size="xl" fw={500}>{practitioner.name}</Text>
            <Text size="sm" >Identifier: {practitioner.identifier}</Text>
            <Text size="xs" >ID: {practitioner.id}</Text>
          </Card>
        ))}
      </Stack>
    </Container>
    </Box>
  );
};

export default PractitionerList;
