const express = require('express');
const router = express.Router();
const { loginUser,logoutUser} = require('../controllers/authController');

// POST route for user login
router.post('/login', loginUser);
router.get('/logout', logoutUser);
module.exports = router;
