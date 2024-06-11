const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { absenMasukController } = require('../controllers/absenMasuk');

router.put('/absen-masuk', verifyToken, absenMasukController);

module.exports = router;