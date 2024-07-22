import { Router } from 'express';
import internalRouter from './api/internal';

const router = Router();

// Mount Routes
router.use('/internal', internalRouter);
// ..

export default router;
