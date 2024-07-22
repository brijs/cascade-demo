import { Router } from 'express';
import MedplumClientSingleton from '../../medplumClient';
import { getFreeSlots } from './medplumUtils';

const router = Router();

router.get('/free-slots', async (req, res) => {
    const medplum = MedplumClientSingleton.getInstance();

    try {
        const practitionerIds = (req.query.practitionerIds as string)?.split(',') || [];
        if (practitionerIds.length == 0) {
            return res.status(400).json({ error: "Practitioner IDs can't be empty" });
        }
        const patientId = req.query.patientId as string;
        const startDate = req.query.startDate as string;
        const endDate = req.query.endDate as string;

        const slots = await getFreeSlots({
            practitionerIds,
            patientId,
            startDate,
            endDate
        });
        res.json(slots);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;