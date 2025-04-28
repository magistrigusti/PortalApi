// routes/index.js
const express = require('express');
const router = express.Router();
const multer = require('multer');

router.get('/register', (req, res) => {
  res.send('register');
});

module.exports = router;  