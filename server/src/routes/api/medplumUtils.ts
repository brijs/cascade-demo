import MedplumClientSingleton from '../../medplumClient';
import { Schedule, Practitioner, Slot, Identifier } from '@medplum/fhirtypes';
import { v4 as uuidv4 } from 'uuid';


function generateRandomSlots(startDate: Date, endDate: Date, freeSlots: number): Slot[] {
    const slots: Slot[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        // Generate busy slots only on weekdays
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) { // 0 = Sunday, 6 = Saturday
            for (let i = 0; i < freeSlots; i++) {
                const startHour = 9 + Math.floor(Math.random() * 8); // Random hour between 9 and 16
                const slotStart = new Date(currentDate);
                slotStart.setHours(startHour, 0, 0, 0);

                const slotEnd = new Date(slotStart);
                slotEnd.setHours(startHour + 1);

                slots.push({
                    resourceType: 'Slot',
                    id: uuidv4(),
                    schedule: { reference: 'Schedule/example' },
                    start: slotStart.toISOString(),
                    end: slotEnd.toISOString(),
                    status: 'free'
                });
            }
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return slots;
}

async function createPractitionerSchedule(practitionerId: string): Promise<Schedule> {
    const startDate = new Date();
    startDate.setHours(23, 59, 59, 999);
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    endDate.setDate(startDate.getDate() + 3); // Generate a schedule for the next 30 days

    const slots = generateRandomSlots(startDate, endDate, 3); // 3 free slots per weekday

    const schedule: Schedule = {
        resourceType: 'Schedule',
        id: uuidv4(), // id is overriden by medplum
        identifier: [{ system: 'http://example.org/schedules', value: `schedule-${practitionerId}` }],
        active: true,
        serviceType: [{ coding: [{ system: 'http://example.org/service-types', code: 'practitioner-availability' }] }],
        actor: [{ reference: `Practitioner/${practitionerId}` }],
        planningHorizon: {
            start: startDate.toISOString(),
            end: endDate.toISOString()
        },
        comment: 'Practitioner schedule including busy slots and unavailable times outside of 9-5pm on weekdays.'
    };

    const medplumClient = MedplumClientSingleton.getInstance();
    const s = await medplumClient.createResource(schedule);
    // console.log(`id1=${schedule.id} id2=${s.id}`);

    for (const slot of slots) {
        slot.schedule.reference = `Schedule/${s.id}`;
        await medplumClient.createResource(slot);
    }

    return schedule;
}

export default createPractitionerSchedule;
