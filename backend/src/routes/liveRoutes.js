const express = require('express');
const router = express.Router();
const liveController = require('../controllers/liveController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.post('/start', auth, roleCheck('admin'), liveController.startLiveMode);
router.post('/stop', auth, roleCheck('admin'), liveController.stopLiveMode);
router.post('/change-song', auth, roleCheck('admin'), liveController.changeLiveSong);
router.get('/session', auth, roleCheck('admin'), liveController.getActiveSession);

router.get('/current', auth, liveController.getCurrentLiveSession);

module.exports = router;