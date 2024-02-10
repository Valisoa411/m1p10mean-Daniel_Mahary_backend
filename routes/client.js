// const express = require('express');
// const router = express.Router();
// const db = require('../db/db');
// const Client = require('../models/Client');
// const SendMail = require('../models/SendMail');

// router.post('/sendMailTest', async (req, res) => {
//   try {
//   // Création d'une instance de la classe Customer
//   const customer = new Client(
//     'Doe',
//     'alice',
//     'andriamahefazafymahali@gmail.com',
//     'mahariabo',
//     'Masculin',
//     new Date('1990-01-01'),
//     0,
//     new Date()
//   );

//   newclient= await customer.insert();

//   console.log(newclient);

//   const mailSender = new SendMail(newclient);

//   mailSender.send();

//   // Réponse de confirmation
//   res.send('E-mail en cours d\'envoi...');
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Erreur lors de la récupération des véhicules.');
//   }
// });

// module.exports = router;