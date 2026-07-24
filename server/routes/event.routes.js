const express = require('express');
const {
  getEvents,
  createEvent,
} = require('../controllers/event.controller.js');
const upload = require('../middleware/upload.js');
const verifyToken = require('../middleware/verifyToken.js');
const router = express.Router();
const checkRole = require('../middleware/checkRole.js');

router.get('/events', getEvents);
router.post(
  '/events',
  verifyToken,
  checkRole(['organizer', 'admin']),
  upload.single('bannerUrl'),
  createEvent
);

module.exports = router;
