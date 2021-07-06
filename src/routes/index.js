const express = require('express');

const router = express.Router();

router.use('/api/v1/movies', require('./movies'));
router.use('/api/v1', require('./root'));
router.use('/', require('./root'));

module.exports = router;
