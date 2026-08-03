const express = require('express');
const {
  getEvents,
  createEvent,
  getEventById,
  bookevent,
  updateStatus,
  getMyEvents,
  getMyBookings,
  cancelBooking,
} = require('../controllers/event.controller.js');
const upload = require('../middleware/upload.js');
const verifyToken = require('../middleware/verifyToken.js');
const optionalAuth = require('../middleware/optionalAuth.js');
const router = express.Router();
const checkRole = require('../middleware/checkRole.js');

router.get('/events', getEvents);
router.get('/my-events', verifyToken, getMyEvents);
router.get('/my-bookings', verifyToken, getMyBookings);
router.get('/events/:id', getEventById);
router.post(
  '/events',
  verifyToken,
  checkRole(['organizer', 'admin']),
  upload.single('bannerUrl'),
  createEvent
);
router.post('/bookevent/:id', optionalAuth, bookevent);
router.delete('/bookevent/:id', verifyToken, cancelBooking);

router.patch(
  '/events/:id/status',
  verifyToken,
  checkRole(['admin']),
  updateStatus
);

module.exports = router;
