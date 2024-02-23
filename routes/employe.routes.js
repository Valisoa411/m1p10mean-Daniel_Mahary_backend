const express = require('express');

const router = express.Router();

const employeController = require('../controllers/employeController');
const horaireController = require('../controllers/horaireController');
const verifyToken = require('../middleware/tokenmiddleware');

router.get('/:id', employeController.getEmployeById);

router.get('/horaire/:idEmploye', employeController.getEmployeHoraires);

router.post('/horaire', horaireController.createHoraire);

router.get('/horaire/detail/:id', horaireController.getHoraireById);
router.put('/horaire', horaireController.updateHoraire);
router.delete('/horaire/:id', horaireController.deleteHoraire);

const routerEmploye = () => {
    const routerEmp = express.Router();



    return routerEmp;
}

router.use(verifyToken('employe'), routerEmploye());


module.exports = router;