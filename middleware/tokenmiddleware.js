// middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'beauty'; // Remplacez par votre clé secrète

const verifyToken = (role) => (req, res, next) => {

  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Accès non autorisé. Token manquant.' });
  }

  try {
    // console.log(token);
    const decoded = jwt.verify(token, "beauty");
    const userRole = decoded.role;
    if(userRole !== role) {
      return res.status(401).json({ error: 'Ressources non autorisés' });
    }
    req.user = decoded; // Stocke le payload dans req.user
    next();
  } catch (error) {
    console.log(error.message);
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    } else {
      console.error('Erreur de vérification du token :', error);
      return res.status(401).json({ error: 'Accès non autorisé. Token invalide.' });
    }
  }
};

module.exports = verifyToken;
