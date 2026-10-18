import { Router } from 'express';
import * as hospitalDonorController from '../controllers/hospitalDonor.controller.js';
import { authenticateHospital } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { donorStatusUpdateSchema } from '../validators/donor.validator.js';

const router = Router();

router.use(authenticateHospital);

router.get('/donor-request', hospitalDonorController.showDonorToHospital);
router.put('/:id', validate(donorStatusUpdateSchema), hospitalDonorController.updateDonorRequest);
router.delete('/donor-request-delete/:id', hospitalDonorController.deleteDonorRequest);

export default router;
