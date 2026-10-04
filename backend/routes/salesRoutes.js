const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadSales, getSalesStats, getSalesAnalysis, getSales, clearSales, getUploadHistory, deleteUpload, getFilters, trackDownload } = require('../controllers/salesController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// Use memory storage — no disk writes needed (works on Render)
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', auth, checkRole(['admin']), upload.single('file'), uploadSales);
router.get('/uploads', auth, checkRole(['admin']), getUploadHistory);
router.delete('/uploads/:id', auth, checkRole(['admin']), deleteUpload);
router.delete('/clear', auth, checkRole(['admin']), clearSales);
router.post('/download', auth, trackDownload);
router.get('/stats', auth, getSalesStats);
router.get('/analysis', auth, getSalesAnalysis);
router.get('/filters', auth, getFilters);
router.get('/', auth, getSales);

module.exports = router;
