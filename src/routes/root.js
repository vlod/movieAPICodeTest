const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Greetings from api', version: 'GIT_VERSION' });
});

module.exports = router;
