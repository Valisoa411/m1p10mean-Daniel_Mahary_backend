const express = require('express');

const router = express.Router();

const managerController = require('../controllers/managerController');
const serviceController = require('../controllers/serviceController');
const employeController = require('../controllers/employeController');

const verifyToken = require('../middleware/tokenmiddleware');

const multer = require('multer');

// Configuration Multer pour le téléchargement de fichiers
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// Configuration Cloudinary

// router.post('/init', managerController.initManager);
router.post('/login', managerController.loginManager);

router.get('/service', serviceController.allServices);

const routerManager = () => {
  const routerMan = express.Router();

  //route qui a besoin d'authentification client
  routerMan.post('/createEmploye', upload.single('photo'), managerController.createEmploye);
  routerMan.get('/listEmploye', managerController.liste_employe);
  routerMan.delete('/deleteEmploye/:id', managerController.delete_employe);

  routerMan.post('/service', serviceController.createService);
  routerMan.get('/service/:id', serviceController.getServiceById);
  routerMan.put('/service', serviceController.updateService);
  routerMan.delete('/service/:id', serviceController.deleteService);

  routerMan.post('/employe', employeController.createEmploye);

  routerMan.get('/search', managerController.searchEmploye);

  return routerMan;
}
router.use(verifyToken('manager'), routerManager());


module.exports = router;