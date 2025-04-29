// 📁 routes/index.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const UserController = require('../controllers/user-controller'); // ✅ ПРАВИЛЬНО!

const uploadDestination = 'uploads';

const storage = multer.diskStorage({
  destination: uploadDestination,
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const uploads = multer({ storage: storage });

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/current', UserController.currentUser); // 🔧 исправил: current → currentUser
router.get('/user/:id', UserController.getUserById); // 🔧 исправил: login → getUserById
router.put('/users/:id', UserController.updateUser);

module.exports = router;
