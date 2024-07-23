import MedplumClientSingleton from '../../medplumClient';
import { Schedule, Practitioner, Slot, Appointment, Patient, Reference } from '@medplum/fhirtypes';
import { v4 as uuidv4 } from 'uuid';
import Constants from '../../constants';



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

export async function createPractitionerSchedule(practitionerId: string): Promise<Schedule> {
    const startDate = new Date();
    startDate.setHours(23, 59, 59, 999);
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    endDate.setDate(startDate.getDate() + 30); // Generate a schedule for the next 30 days

    const slots = generateRandomSlots(startDate, endDate, 2); // 2 free slots per weekday

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



export interface GetFreeSlotsParams {
    practitionerIds: string[];
    patientId?: string;
    startDate?: string;
    endDate?: string;
}

export async function getFreeSlots(params: GetFreeSlotsParams): Promise<Slot[]> {
    const { practitionerIds, patientId, startDate, endDate } = params;

    const medplumClient = MedplumClientSingleton.getInstance();

    // Fetch schedules for the specified practitioners
    const scheduleSearchParams = new URLSearchParams({
        'actor': practitionerIds.map(id => `Practitioner/${id}`).join(',')
    });

    const scheduleBundle = await medplumClient.search('Schedule',
        scheduleSearchParams.toString()
    );

    if (!scheduleBundle.entry) {
        return [];
    }

    const scheduleIds = scheduleBundle.entry.map(entry => (entry.resource as Schedule).id);

    if (!scheduleIds.length) {
        return [];
    }

    // Fetch slots with 'free' status linked to the fetched schedules
    const slotSearchParams = new URLSearchParams({
        'status': 'free',
        'schedule': scheduleIds.map(id => `Schedule/${id}`).join(',')
    });

    // Add date range parameters if specified
    if (startDate) {
        slotSearchParams.append('start', `ge${startDate}`);
    }
    if (endDate) {
        slotSearchParams.append('end', `le${endDate}`);
    }

    // Add patient reference if specified - Logical AND
    if (patientId) {
        slotSearchParams.append('patient', `Patient/${patientId}`);
    }

    // Perform the search query
    const slotBundle = await medplumClient.search('Slot',
        slotSearchParams.toString()
    );

    if (!slotBundle.entry) {
        return [];
    }

    return slotBundle.entry.map((entry) => entry.resource as Slot);
}


interface BookAppointmentParams {
    patientId: string;
    slotId: string;
}

export async function bookAppointment(params: BookAppointmentParams): Promise<Appointment> {
    const { patientId, slotId } = params;

    const medplumClient = MedplumClientSingleton.getInstance();

    // Fetch the slot
    const slot = await medplumClient.readResource('Slot', slotId);

    if (!slot.schedule?.reference) {
        throw new Error('Schedule reference not found in Slot');
    }

    // Fetch the schedule
    const schedule = await medplumClient.readReference<Schedule>(slot.schedule);

    if (!schedule.actor || !schedule.actor.length) {
        throw new Error('No practitioners found in Schedule');
    }

    // Fetch the first practitioner in the schedule
    const practitionerReference = schedule.actor.find(actor => actor.reference?.startsWith('Practitioner/'));

    if (!practitionerReference) {
        throw new Error('Practitioner reference not found in Schedule');
    }

    // const practitioner = await medplumClient.readReference<Practitioner>(
    //     practitionerReference as Reference<Practitioner>);

    // Create the appointment
    const appointment: Appointment = {
        resourceType: 'Appointment',
        status: 'booked',
        participant: [
            {
                actor: { reference: `Patient/${patientId}` },
                status: 'accepted'
            },
            {
                actor: { reference: practitionerReference.reference },
                status: 'accepted'
            }
        ],
        start: slot.start,
        end: slot.end,
        slot: [{ reference: `Slot/${slotId}` }],
        identifier: [{
            system: Constants.CASCADE_URL, // for filtering
            value: `Patient/${patientId}-Slot/${slotId}`
        }]
    };

    const createdAppointment = await medplumClient.createResource<Appointment>(appointment);

    // Update the slot to be busy
    slot.status = 'busy';
    await medplumClient.updateResource<Slot>(slot);

    return createdAppointment;
}


interface GetAppointmentsParams {
    patientId?: string;
    practitionerId?: string;
}

export async function getAppointments(params: GetAppointmentsParams): Promise<Appointment[]> {
    const { patientId, practitionerId } = params;

    const medplumClient = MedplumClientSingleton.getInstance();

    if (!patientId && !practitionerId) {
        throw new Error('At least one of patientId or practitionerId must be specified');
    }

    const searchParams = new URLSearchParams();
    if (patientId) {
        searchParams.append('actor', `Patient/${patientId}`);
    }
    if (practitionerId) {
        searchParams.append('actor', `Practitioner/${practitionerId}`);
    }

    const appointmentBundle = await medplumClient.search(
        'Appointment',
        searchParams.toString()
    );

    if (!appointmentBundle.entry) {
        return [];
    }

    return appointmentBundle.entry.map(entry => entry.resource as Appointment);
}