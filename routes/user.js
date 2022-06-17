const express = require('express');
const router = express.Router();
const userContrl = require('../controllers/user')

router.post('/signup', userContrl.signup)
router.post('/login', userContrl.login)

module.exports = router;