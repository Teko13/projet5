const express = require('express');
const router = express.Router();
const multer = require('../multer-config');
const auth = require('../auth');
const sauceContrl = require('../controllers/sauce');

router.get('/', auth, sauceContrl.sauces);
router.get('/:id', auth, sauceContrl.sauce)
router.post('/', auth, multer, sauceContrl.createSauce);
router.put('/:id', auth, multer, sauceContrl.updateSauce);
router.delete('/:id', auth, sauceContrl.deleteSauce);
router.post('/:id/like', auth, sauceContrl.SauceReview);

module.exports = router;