const express = require('express');
const Vehicule = require('../models/Vehicule');
const router = express.Router();

// Route pour créer un véhicule
router.post('/vehicules', async (req, res) => {
  try {
    console.log("req.body: ", req.body);
    const { marque, modele, annee } = req.body;
    const nouveauVehicule = new Vehicule(marque, modele, annee);
    const vehicule = await nouveauVehicule.insert();
    res.status(201).json(vehicule);
  } catch (error) {
    console.error('Erreur lors de la création du véhicule :', error);
    res.status(500).json('Erreur lors de la création du véhicule.');
  }
});

// Route pour supprimer un véhicule
router.delete('/vehicules/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await Vehicule.delete(id);
    res.status(204).end();
  } catch (error) {
    console.error('Erreur lors de la suppression du véhicule :', error);
    res.status(500).send('Erreur lors de la suppression du véhicule.');
  }
});

// Route pour récupérer un véhicule à mettre à jour
router.get('/vehicules/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const vehicule = await Vehicule.getById(id);
    res.status(200).json(vehicule);
  } catch (error) {
    console.error('Erreur lors de la récupération du véhicule pour mise à jour :', error);
    res.status(500).send('Erreur lors de la récupération du véhicule pour mise à jour.');
  }
});

// Route pour mettre à jour un véhicule
router.put('/vehicules/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedValues = req.body;
    console.log(updatedValues)
    const vehicule = await Vehicule.update(id, updatedValues);
    res.status(200).json(vehicule);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du véhicule :', error);
    res.status(500).send('Erreur lors de la mise à jour du véhicule.');
  }
});

// Route pour récupérer tous les véhicules
router.get('/vehicules', async (req, res) => {
  try {
    const vehicules = await Vehicule.getAll();
    res.status(200).json(vehicules);
  } catch (error) {
    console.error('Erreur lors de la récupération des véhicules :', error);
    res.status(500).send('Erreur lors de la récupération des véhicules.');
  }
});

module.exports = router;
