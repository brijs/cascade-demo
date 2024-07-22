import React from 'react';
import { Container, Box, Button, Title, Text, Space } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handlePatientView = () => {
    navigate('/patient/50');
  };

  const handlePractitionerView = () => {
    navigate('/practitioner/104');
  };

  return (
    <Box style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Container style={{ textAlign: 'center' }}>
        <Title order={1}>Welcome to Cascade Appointments Demo</Title>
        <Space h={20}></Space>
        <Text size="lg" style={{ margin: '20px 0', fontWeight: 'bolder' }}>
          Choose below
        </Text>
        <Box style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <Button size="xl" onClick={handlePatientView}>
            Patient View
          </Button>
          <Button size="xl" onClick={handlePractitionerView}>
            Practitioner View
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
