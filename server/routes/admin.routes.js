const express = require('express');

const router = express.Router();
const {
  getAllEvents,
  getAllUsers,
  getStats,
  updateUserRole,
} = require('../controllers/admin.controller.js');
const verifyToken = require('../middleware/verifyToken.js');
const checkRole = require('../middleware/checkRole.js');

router.get('/events', verifyToken, checkRole(['admin']), getAllEvents);
router.get('/users', verifyToken, checkRole(['admin']), getAllUsers);
router.get('/stats', verifyToken, checkRole(['admin']), getStats);
router.patch(
  '/users/:id/role',
  verifyToken,
  checkRole(['admin']),
  updateUserRole
);
module.exports = router;

// http://localhost:3000/api/v1/register  , {}
// $2a$12$hQ17BLI8XseEOeHwc43fP.zy7xFoIA7B44nT1vYiBr9IGzx6QDn1.
