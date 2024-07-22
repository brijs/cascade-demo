import { Router } from 'express';
import { MedplumClient } from '@medplum/core';
import { Patient } from '@medplum/fhirtypes';
import Constants from '../../constants';
import MedplumClientSingleton from '../../medplumClient';
import { PatientRequest } from '../api/types'
import { Request, Response } from 'express';

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

export default router;
