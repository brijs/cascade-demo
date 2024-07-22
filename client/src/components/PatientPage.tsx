import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Practitioner, Patient, Slot } from '@medplum/fhirtypes';
import NavigationBar from './NavigationBar';
import { Container, Box, Checkbox, Flex, Title, Text, Button, Space, Modal, Textarea, Stack  } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { DatePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

const PatientPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // const navigate = useNavigate();
  // const notifications = useNotifications();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const [selectedPractitionerIds, setSelectedPractitionerIds] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [freeSlots, setFreeSlots] = useState<Slot[]>([]);

  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [reason, setReason] = useState<string>('');
  const [modalOpened, setModalOpened] = useState<boolean>(false);

  useEffect(() => {
    const fetchPatient = async () => {
      const response = await axios.get(`/api/profiles/patients?identifier=${id}`);
      setPatient(response.data[0]);
    };

    fetchPatient();
  }, [id]);

  useEffect(() => {
    const fetchPractitioners = async () => {
      const response = await axios.get('/api/profiles/practitioners');
      setPractitioners(response.data);
      setSelectedPractitionerIds(response.data.map((practitioner: Practitioner) => practitioner.id));
    };

    fetchPractitioners();
  }, []);

  useEffect(() => {
    if (selectedPractitionerIds.length > 0 && selectedDate) {
      const fetchFreeSlots = async () => {
        const practitionerIds = selectedPractitionerIds.join(',');
        const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');
        const response = await axios.get(
          `/api/appointments/free-slots?practitionerIds=${practitionerIds}&startDate=${formattedDate}`
        );
        setFreeSlots(response.data);
      };

      fetchFreeSlots();
    }
  }, [selectedPractitionerIds, selectedDate]);

  const handlePractitionerChange = (id: string) => {
    setSelectedPractitionerIds((prev) =>
      prev.includes(id) ? prev.filter((practitionerId) => practitionerId !== id) : [...prev, id]
    );
  };

  const handleSlotClick = (slot: Slot) => {
    setSelectedSlot(slot);
    setModalOpened(true);
  };

  const handleConfirm = async () => {
    if (selectedSlot && patient) {
      try {
        // await axios.post('api/bookappointment', {
        //   patientId: patient.id,
        //   slotId: selectedSlot.id,
        //   slotInfo: selectedSlot,
        //   reason,
        // });
        setModalOpened(false);
        setReason('');
        notifications.show({
          title: 'Success',
          message: 'Appointment booked successfully',
          // color: 'green',
        });
        // navigate(`/patient/${id}`);
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: 'Failed to book appointment',
          color: 'red',
        });
      }
    }
  };  

  const groupedSlots = freeSlots.reduce((acc: Record<string, Slot[]>, slot: Slot) => {
    const date = dayjs(slot.start).format('YYYY-MM-DD');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {});

    return (
        <Box style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
            <NavigationBar personName={patient?.name?.[0]?.text || 'Loading...'} />
            <Box mt="md" style={{ margin: '0 auto', maxWidth: '1200px' }}>
                <Container>
                    <Title order={2}>Schedule Appointment</Title>
                    <Box mt="md">
                        <Title order={4}>Select Practitioners</Title>
                        <Space h={10}></Space>
                        <Flex wrap="wrap" gap="md">
                            {practitioners.map((practitioner) => (
                                <Checkbox
                                    key={practitioner.id}
                                    label={practitioner.name?.[0]?.text}
                                    checked={selectedPractitionerIds.includes(practitioner.id!)}
                                    onChange={() => handlePractitionerChange(practitioner.id!)}
                                />
                            ))}
                        </Flex>
                    </Box>

                    <Flex mt="md" gap="md">
                        <Box style={{ flex: 1 }}>
                            <Title ta="left" order={4}>Select start date</Title>
                            <DatePicker
                                // weekendDays={[5, 6]}
                                value={selectedDate}
                                onChange={setSelectedDate}
                                minDate={new Date()}
                            />
                        </Box>
                        <Box style={{ flex: 3 }}>
                            <Title ta="left" order={4}>Pick a Slot</Title>
                            {Object.keys(groupedSlots).length > 0 ? (
                                Object.keys(groupedSlots)
                                    .sort((a, b) => dayjs(a).isBefore(dayjs(b)) ? -1 : 1)
                                    .map((date) => (
                                        <Box key={date} mt="md">
                                            <Text fw={600}>{date}</Text>
                                            {groupedSlots[date].map((slot) => (
                                                <Button key={slot.id} style={{ padding: '10px', borderRadius: '4px', margin: '5px 5px' }} key={slot.id} onClick={() => handleSlotClick(slot)} >
                                                    <Text>{`${dayjs(slot.start).format('HH:mm')} - ${dayjs(slot.end).format('HH:mm')}`}</Text>
                                                </Button>
                                            ))}
                                        </Box>
                                    ))
                            ) : (
                                <Text>No available slots</Text>
                            )}
                        </Box>
                    </Flex>
                </Container>
            </Box>

            <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Book Appointment"
      >
        <Stack>
          <Textarea
            label="Reason for Visit"
            value={reason}
            onChange={(event) => setReason(event.currentTarget.value)}
          />
          <Flex gap="md">
            <Button onClick={handleConfirm} color="green">
              Confirm
            </Button>
            <Button onClick={() => setModalOpened(false)} color="red">
              Cancel
            </Button>
          </Flex>
        </Stack>
      </Modal>
        </Box>
    );


};

export default PatientPage;
