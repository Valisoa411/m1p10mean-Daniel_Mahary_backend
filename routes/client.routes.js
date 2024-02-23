const express = require('express');

const router = express.Router();

const clientController = require('../controllers/clientController');

const verifyToken=require('../middleware/tokenmiddleware');




router.post('/signup', clientController.signUpClient);
router.put('/validation/:id', clientController.validation_inscription);
router.post('/signin', clientController.signInClient);


const routerClient = () => {
    const routerCli = express.Router();
    //route qui a besoin d'authentification client
    routerCli.get('/liste_client', clientController.liste_client);
    return routerCli;
}

router.use(verifyToken('client'),routerClient());


module.exports = router;