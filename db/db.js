// db/mongoose.js

const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://andriamahefazafymahali:XBLFkgwK4psPGSLi@cluster0.1j3scbv.mongodb.net/Beaute?retryWrites=true&w=majority"; // Remplacez ceci par l'URI réel de votre base de données MongoDB
// const mongoURI="mongodb+srv://andriamahefazafymahali:kgCJA6D5S6lFgN57@cluster0.isejbak.mongodb.net/?retryWrites=true&w=majority"


mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Erreur de connexion à MongoDB :'));
db.once('open', () => {
  console.log('Connexion à MongoDB établie avec succès.');
});

module.exports = mongoose;
