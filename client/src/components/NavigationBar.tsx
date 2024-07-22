import React from 'react';
// import { Avatar, Text } from '@mantine/core';
import { Container, Group, Avatar, Text, Title } from '@mantine/core';
// import { Container, Flex, Avatar, Text } from '@mantine/core';

interface NavigationBarProps {
  practitionerName: string;
}

// const NavigationBar: React.FC<NavigationBarProps> = ({ practitionerName }) => {
//   return (
//     // <header height={60} p="xs">
//     <header>
//       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//         <Text size="xl" style= { {marginLeft: '10px'}}>Cascade Demo / XYZ Healthcare Clinic</Text>
//         <div style={{ display: 'flex', alignItems: 'center' }}>
//           <Text size="lg" style={{ marginRight: '5px' }}>
//             {practitionerName} 
//           </Text>
//           <Avatar 
//             radius="lg" size={30} />
//         </div>
//       </div>
//     </header>
//   );
// };

const NavigationBar: React.FC<NavigationBarProps> = ({ practitionerName }) => {
  return (
    <Container fluid style={{ backgroundColor: 'var(--mantine-color-teal-2)', padding: '10px 20px' }}>
      <Group justify='space-between' gap="lg" grow>
        {/* <Text size="xl">Cascade Demo</Text> */}
        <Title size="h2">Cascade Demo</Title>
        
        <Group justify='flex-end'>
          <Text size="lg" fw={500}>XYZ Healthcare Clinic </Text>
          <Text>/</Text>
          <Text size="sm" fw={500}>
            {practitionerName}
          </Text>
          <Avatar size="md" variant='filled' radius="xl" color="initials" name={practitionerName} autoContrast= {true}/>
        </Group>
      </Group>
    </Container>
  );
};


// const NavigationBar: React.FC<NavigationBarProps> = ({ practitionerName }) => {
//   return (
//     <Container fluid style={{ backgroundColor: '#f8f9fa', padding: '10px 20px' }}>
//       <Flex justify="space-between" align="center">
//         <Text size="xl">Cascade demo</Text>
//         <Flex align="center">
//           <Text size="sm" style={{ marginRight: '10px' }}>
//             {practitionerName}
//           </Text>
//           <Avatar radius="xl" />
//         </Flex>
//       </Flex>
//     </Container>
//   );
// };
export default NavigationBar;
