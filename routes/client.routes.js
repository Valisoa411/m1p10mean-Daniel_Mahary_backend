const express = require('express');

const router = express.Router();

const clientController = require('../controllers/clientController');

const verifyToken=require('../middleware/tokenmiddleware');




router.post('/signup', clientController.signUpClient);
router.put('/validation/:id', clientController.validation_inscription);
router.get('/liste_client',verifyToken ,clientController.liste_client);
router.post('/signin', clientController.signInClient);

module.exports = router;