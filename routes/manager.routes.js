const express = require('express');

const router = express.Router();

const managerController = require('../controllers/managerController');
const serviceController = require('../controllers/serviceController');
const employeController = require('../controllers/employeController');

const verifyToken=require('../middleware/tokenmiddleware');

const multer = require('multer');

// Configuration Multer pour le téléchargement de fichiers
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
const upload = multer({ storage: storage });

// Configuration Cloudinary



router.post('/createEmploye' ,upload.single('photo'), managerController.createEmploye);
router.get('/listEmploye', managerController.liste_employe);
router.delete('/deleteEmploye/:id', managerController.delete_employe);

router.post('/init', managerController.initManager);
router.post('/login', managerController.loginManager);

router.post('/service', serviceController.createService);
router.get('/service/:id', serviceController.getServiceById);
router.get('/service', serviceController.allServices);
router.put('/service', serviceController.updateService);
router.delete('/service/:id', serviceController.deleteService);

router.post('/employe', employeController.createEmploye);

module.exports = router;