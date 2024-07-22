import React, { useEffect, useState } from 'react';
import { Container, Card, Text, Stack, Box } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Patient } from '@medplum/fhirtypes';
import NavigationBar from './NavigationBar';

interface PatientData {
  id: string;
  name: string;
  identifier: string;
}

const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<PatientData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch patients from the API
    const fetchPatients = async () => {
      try {
        const response = await axios.get('/api/profiles/patients');
        const data: Patient[] = response.data;
        
        // Extract relevant patient data
        const formattedPatients = data.map(patient => ({
          id: patient.id || '',
          name: patient.name?.[0]?.text || 'No name',
          identifier: patient.identifier?.[0]?.value || 'No identifier'
        }));

        setPatients(formattedPatients);
      } catch (error) {
        console.error('Failed to fetch patients', error);
      }
    };

    fetchPatients();
  }, []);

  return (
    <Box style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
      <NavigationBar personName={'All Patients'} />
      <Box mt="md" style={{ margin: '0 auto', maxWidth: '1200px' }}></Box>    
    <Container>
      <Stack gap="md">
        {patients.map(patient => (
          <Card
            key={patient.id}
            shadow="sm"
            padding="lg"
            style={{ cursor: 'pointer', backgroundColor: 'var(--mantine-color-gray-5)', borderRadius: '8px' }}
            onClick={() => navigate(`/patient/${patient.identifier}`)}
          >
            <Text size="xl" fw={500}>{patient.name}</Text>
            <Text size="sm" >Identifier: {patient.identifier}</Text>
            <Text size="xs" >ID: {patient.id}</Text>
          </Card>
        ))}
      </Stack>
    </Container>
    </Box>
  );
};

export default PatientList;
