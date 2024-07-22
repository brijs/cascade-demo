import express from 'express';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { MedplumClient } from '@medplum/core';
import { Patient } from '@medplum/fhirtypes';
import Constants from './constants';

dotenv.config();

const app = express();
app.use(express.json());

// medplum client
const medplum = new MedplumClient({
    clientId: process.env.MEDPLUM_CLIENT_ID,
    clientSecret: process.env.MEDPLUM_CLIENT_SECRET,
    baseUrl: process.env.MEDPLUM_API_BASE_URL,
});

interface PatientRequest extends Request {
    body: {
        name: string;
        identifier: string;
    };
}

// Check if the patient exists
async function checkPatientExists(identifier: string): Promise<boolean> {
    const searchResponse = await medplum.searchResources('Patient', {
        identifier: Constants.CASCADE_URL + "|" + identifier,
    });
    return searchResponse.length > 0;
}

// Create a new patient
async function createPatient(name: string, identifier: string): Promise<Patient> {
    const patient: Patient = {
        resourceType: 'Patient',
        name: [{ text: name }],
        identifier: [{ system: Constants.CASCADE_URL, value: identifier }],
    };
    return medplum.createResource(patient);
}

app.post('/createPatient', async (req: PatientRequest, res: Response) => {
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

app.get('/', (req, res) => {
    res.send('Cascade Demo API server!');
});


app.listen(Constants.PORT, () => {
    console.log(`Server running at http://localhost:${Constants.PORT}`);
});
