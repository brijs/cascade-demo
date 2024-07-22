import { Router } from 'express';
import MedplumClientSingleton from '../../medplumClient';
import { Request, Response } from 'express';
import { createPractitionerSchedule, getFreeSlots } from './medplumUtils';
import Constants from '../../constants';
import { Patient, Practitioner } from '@medplum/fhirtypes';

const router = Router();

interface GetPatientsWithIdentifierParams {
    system: string;
    identifier?: string;
}


router.get('/patients', async (req, res) => {
    const medplum = MedplumClientSingleton.getInstance();
    const identifier: string | undefined = req.query.identifier as string;

    try {
        const medplum = MedplumClientSingleton.getInstance();
        const patientBundle = await medplum.search('Patient', {
            identifier: Constants.CASCADE_URL + "|" + (identifier ?? ''),
        });

        if (!patientBundle.entry) {
            return [];
        }

        const patients = patientBundle.entry.map(entry => entry.resource as Patient);
        res.json(patients);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/practitioners', async (req, res) => {
    const medplum = MedplumClientSingleton.getInstance();
    const identifier: string | undefined = req.query.identifier as string;

    try {
        const medplum = MedplumClientSingleton.getInstance();
        const practitionerBundle = await medplum.search('Practitioner', {
            identifier: Constants.CASCADE_URL + "|" + (identifier ?? ''),
        });

        if (!practitionerBundle.entry) {
            return [];
        }

        const practitioners = practitionerBundle.entry.map(entry => entry.resource as Practitioner);
        res.json(practitioners);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;