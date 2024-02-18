const express = require('express');

const router = express.Router();

const employeController = require('../controllers/employeController');
const horaireController = require('../controllers/horaireController');

router.get('/:id', employeController.getEmployeById);

router.post('/horaire', horaireController.createHoraire);
router.get('/horaire/:id', horaireController.getHoraireById);
router.get('/horaire', horaireController.allHoraires);
router.put('/horaire', horaireController.updateHoraire);
router.delete('/horaire/:id', horaireController.deleteHoraire);

module.exports = router;