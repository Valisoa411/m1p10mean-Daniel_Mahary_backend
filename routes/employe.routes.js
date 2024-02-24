const express = require('express');

const router = express.Router();

const employeController = require('../controllers/employeController');
const horaireController = require('../controllers/horaireController');
const verifyToken=require('../middleware/tokenmiddleware');

const multer = require('multer');

// Configuration Multer pour le téléchargement de fichiers
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
const upload = multer({ storage: storage });


router.post('/horaire', horaireController.createHoraire);
router.get('/horaire/:id', horaireController.getHoraireById);
router.get('/horaire', horaireController.allHoraires);
router.put('/horaire', horaireController.updateHoraire);
router.delete('/horaire/:id', horaireController.deleteHoraire);

router.post('/signin', employeController.signinEmploye);

const routerEmploye = () => {
    const routerEmployer = express.Router();
    //route qui a besoin d'authentification client
    routerEmployer.get('/info_employe', employeController.info_employe);
    routerEmployer.put('/updateEmployeWithPic' ,upload.single('photo'), employeController.updateEmployeWithPic);
    routerEmployer.put('/updateEmploye' , employeController.updateEmploye);
    return routerEmployer;
}

router.use(verifyToken('employe'),routerEmploye());

module.exports = router;