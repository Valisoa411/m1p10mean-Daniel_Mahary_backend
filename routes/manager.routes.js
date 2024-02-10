const express = require('express');

const router = express.Router();

const managerController = require('../controllers/managerController');
const serviceController = require('../controllers/serviceController');

router.post('/init', managerController.initManager);
router.post('/login', managerController.loginManager);
router.post('/service', serviceController.createService);
router.get('/service/:id', serviceController.allServices);
router.get('/service', serviceController.getServiceById);
router.put('/service/:id', serviceController.updateService);
router.delete('/service/:id', serviceController.deleteService);

module.exports = router;