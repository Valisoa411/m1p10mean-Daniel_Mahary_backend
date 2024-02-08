const express = require('express');

const router = express.Router();

//import all specific routes
const client = require('./client.routes');

//integrate all specific routes to router
router.use('/client', client);

module.exports = router;