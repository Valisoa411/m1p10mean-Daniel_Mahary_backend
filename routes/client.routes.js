const express = require('express');

const router = express.Router();

const clientController = require('../controllers/clientController');

router.post('/signup', clientController.signUpClient);
router.put('/validation/:id', clientController.validation_inscription);

module.exports = router;