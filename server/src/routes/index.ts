import { Router } from 'express';
import internalRouter from './api/internal';
import appointmentsRouter from './api/appointments';
import profilesRouter from './api/profiles';

const router = Router();

// Mount Routes
router.use('/internal', internalRouter);
router.use('/appointments', appointmentsRouter);
router.use('/profiles', profilesRouter);

export default router;
