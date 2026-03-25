import express from 'express';
import { saveDraft, getDrafts, getDraftById, deleteDraft } from '../controllers/builderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All builder routes are protected

router.post('/draft', saveDraft);
router.get('/history', getDrafts);
router.get('/draft/:id', getDraftById);
router.delete('/draft/:id', deleteDraft);

export default router;
