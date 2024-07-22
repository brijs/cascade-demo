import React from 'react';
import { Container, Group, Avatar, Text, Title } from '@mantine/core';

interface NavigationBarProps {
  personName: string;
}



const NavigationBar: React.FC<NavigationBarProps> = ({ personName }) => {
  return (
    <Container fluid style={{ backgroundColor: 'var(--mantine-color-teal-2)', padding: '10px 20px' }}>
      <Group justify='space-between' gap="lg" grow>
        {/* <Text size="xl">Cascade Demo</Text> */}
        <Title size="h2">Cascade Demo</Title>
        
        <Group justify='flex-end'>
          <Text size="lg" fw={500}>XYZ Healthcare Clinic </Text>
          <Text>/</Text>
          <Text size="sm" fw={500}>
            {personName}
          </Text>
          <Avatar size="md" variant='filled' radius="xl" color="initials" name={personName} autoContrast= {true}/>
        </Group>
      </Group>
    </Container>
  );
};


export default NavigationBar;
