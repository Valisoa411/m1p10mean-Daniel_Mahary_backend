const express = require('express');

const router = express.Router();

const managerController = require('../controllers/managerController');

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


module.exports = router;