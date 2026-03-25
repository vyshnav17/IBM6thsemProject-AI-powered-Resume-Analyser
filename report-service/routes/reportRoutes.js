import express from 'express';
import { downloadAnalysisReport, downloadOptimizedResume, downloadBuilderResume } from '../controllers/reportController.js';

const router = express.Router();

router.get('/download-analysis-report/:id', downloadAnalysisReport);
router.get('/download-optimized-resume/:id', downloadOptimizedResume);
router.post('/download-builder-resume', downloadBuilderResume);
router.post('/internal/generate-builder-pdf', downloadBuilderResume);

export default router;
