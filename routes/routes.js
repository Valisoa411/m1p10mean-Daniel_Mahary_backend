const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/hello/:id', async (req, res) => {
  try {
    console.log(req.params.id);
    res.status(200).json({ message: "HELLO!!!: " });
  } catch (error) {
    res.status(500).send('Erreur lors de la récupération des véhicules.');
  }
});

module.exports = router;