const express = require('express');
const router = express.Router();
const FilesController = require('../controllers/FilesController');
const UsersController = require('../controllers/UsersController');

// File routes
router.get('/files/:id/data', FilesController.getFile);
router.post('/files', FilesController.addToThumbnailQueue);

// User routes
router.post('/users', UsersController.createUser);

module.exports = router;
