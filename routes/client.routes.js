const express = require('express');

const router = express.Router();

const clientController = require('../controllers/clientController');

const verifyToken=require('../middleware/tokenmiddleware');
const serviceController = require('../controllers/serviceController');
const rendezVousController = require('../controllers/rendezVousController');
const preferenceController = require('../controllers/preferenceController');
const employeController = require('../controllers/employeController');

router.post('/signup', clientController.signUpClient);
router.put('/validation/:id', clientController.validation_inscription);
router.post('/signin', clientController.signInClient);


const routerCli = () => {
    const routerCli = express.Router();
    
    //route qui a besoin d'authentification client
    routerCli.get('/liste_client', clientController.liste_client);

    routerCli.get('/availability', serviceController.getAvailableHoraire);
    routerCli.get('/employeAvailable', serviceController.getAvailableEmploye);
    routerCli.post('/rendezVous', rendezVousController.createRendezVous);

    routerCli.get('/service', serviceController.allServicesWithPreferences);
    routerCli.get('/employe', employeController.allEmployesWithPreferences);

    routerCli.post('/addPreference', preferenceController.addPreference);
    routerCli.delete('/removePreference/:idObject', preferenceController.removePreference);

    return routerCli;
}

router.use(verifyToken('client'), routerCli());

module.exports = router;