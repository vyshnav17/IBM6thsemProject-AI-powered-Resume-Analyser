import express from 'express';
import multer from 'multer';
import { uploadAndAnalyze, getAnalysisById, generateOptimized, getSampleAnalysis, getHistory, downloadOriginal } from '../controllers/analyzerController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed"));
        }
    },
});

router.post('/analyze-resume', protect, upload.single("resume"), uploadAndAnalyze);
router.get('/history', protect, getHistory);
router.get('/analysis/:id', protect, getAnalysisById);
router.get('/download-original/:id', protect, downloadOriginal);
router.post('/generate-optimized-resume/:id', protect, generateOptimized);

// Internal routes for service-to-service communication
router.get('/internal/analysis/:id', getAnalysisById);
router.post('/internal/generate-optimized-resume/:id', generateOptimized);
router.get('/sample-analysis/:sampleId', protect, getSampleAnalysis);

export default router;
