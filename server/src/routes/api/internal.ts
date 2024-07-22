import { Router } from 'express';
import { Patient, Practitioner } from '@medplum/fhirtypes';
import Constants from '../../constants';
import MedplumClientSingleton from '../../medplumClient';
import { PatientRequest, PractitionerRequest } from '../api/types'
import { Request, Response } from 'express';
import createPractitionerSchedule from './medplumUtils';

const router = Router();


// Check if the patient exists
async function checkPatientExists(identifier: string): Promise<boolean> {
    const medplum = MedplumClientSingleton.getInstance();
    const searchResponse = await medplum.searchResources('Patient', {
        identifier: Constants.CASCADE_URL + "|" + identifier,
    });
    return searchResponse.length > 0;
}

// Create a new patient
async function createPatient(name: string, identifier: string): Promise<Patient> {
    const medplum = MedplumClientSingleton.getInstance();
    const patient: Patient = {
        resourceType: 'Patient',
        name: [{ text: name }],
        identifier: [{ system: Constants.CASCADE_URL, value: identifier }],
    };
    return medplum.createResource(patient);
}


// Check if the practitioner exists
async function checkPractitionerExists(identifier: string): Promise<boolean> {
    const medplum = MedplumClientSingleton.getInstance();
    const searchResponse = await medplum.searchResources('Practitioner', {
        identifier: Constants.CASCADE_URL + "|" + identifier,
    });
    return searchResponse.length > 0;
}

// Create a new practitioner
async function createPractitionerAndSchedule(name: string, identifier: string): Promise<Practitioner> {
    const medplum = MedplumClientSingleton.getInstance();
    const practitioner: Practitioner = {
        resourceType: 'Practitioner',
        name: [{ text: name }],
        identifier: [{ system: Constants.CASCADE_URL, value: identifier }],
    };
    let p = await medplum.createResource(practitioner);

    // populate schedule
    console.log("Generating random practitioner schedule");
    await createPractitionerSchedule(p.id!)
    return p;
}

router.post('/createPatient', async (req: PatientRequest, res: Response) => {
    const { name, identifier } = req.body;

    try {
        // Check if the patient already exists
        const exists = await checkPatientExists(identifier);
        if (exists) {
            return res.status(400).json({ message: 'Patient with this identifier already exists' });
        }

        // Create a new patient
        const patient = await createPatient(name, identifier);
        res.status(201).json(patient);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});


router.post('/createPractitioner', async (req: PractitionerRequest, res: Response) => {
    const { name, identifier } = req.body;

    try {
        // Check if the patient already exists
        const exists = await checkPractitionerExists(identifier);
        if (exists) {
            return res.status(400).json({ message: 'Practitioner with this identifier already exists' });
        }

        // Create a new patient
        const p = await createPractitionerAndSchedule(name, identifier);
        res.status(201).json(p);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
