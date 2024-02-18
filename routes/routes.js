const express = require('express');

const router = express.Router();

//import all specific routes
const client = require('./client.routes');
const manager = require('./manager.routes');
//integrate all specific routes to router
router.use('/client', client);
router.use('/manager', manager);



module.exports = router;