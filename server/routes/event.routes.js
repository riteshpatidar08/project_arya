const express = require('express');
const {
  getEvents,
  createEvent,
  getEventById,
  bookevent,
  updateStatus,
} = require('../controllers/event.controller.js');
const upload = require('../middleware/upload.js');
const verifyToken = require('../middleware/verifyToken.js');
const router = express.Router();
const checkRole = require('../middleware/checkRole.js');

router.get('/events', getEvents);
router.get('/events/:id', getEventById);
router.post(
  '/events',
  verifyToken,
  checkRole(['organizer', 'admin']),
  upload.single('bannerUrl'),
  createEvent
);
router.post('/bookevent/:id', verifyToken, checkRole(['attendee']), bookevent);

router.patch(
  '/events/:id/status',
  verifyToken,
  checkRole(['admin']),
  updateStatus
);

module.exports = router;
