const nodemailer = require('nodemailer');

class SendMail {
  constructor(customer) {
    this.customer = customer;
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Remplacez par l'adresse de votre serveur SMTP
      port: 587, // Port SMTP
      secure: false, // false pour les connexions non sécurisées (TLS)
      auth: {
        user: 'dmbeautyweb@gmail.com', // Votre adresse e-mail
        pass: 'kimv frui rqbj ugbm', // Votre mot de passe
      },
    });
  }

  async send() {
    // URL de l'API avec l'ID du client en tant que paramètre
    const apiURL = `http://localhost:4200/validation/${this.customer._id}`;

    // Corps du message avec le lien vers l'API
    const mailBody = `
      Bonjour ${this.customer.nom},
      Cliquez sur le lien suivant pour confirmer votre inscription : ${apiURL}
    `;

    // Options du message
    const mailOptions = {
      from: 'dmbeautyweb@gmail.com',
      to: this.customer.email,
      subject: 'confirmation inscription dmbeautyweb',
      text: mailBody,
    };

    // Envoi de l'e-mail
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message envoyé: %s', info.messageId);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error.message);
    }
  }

  async sendPassword(employe){
    const mailBody = `
      Bonjour ${employe.prenom},
      voici votre mot de passe temporaire : ${employe.mdp},
      vous pourrez plus tard modifier ce mot de passe
    `;

    // Options du message
    const mailOptions = {
      from: 'dmbeautyweb@gmail.com',
      to: employe.login,
      subject: 'informations de mot de passe temporaire dmbeautyweb',
      text: mailBody,
    };

    // Envoi de l'e-mail
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message envoyé: %s', info.messageId);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error.message);
    }
  }
}

// // Exemple d'utilisation de la classe SendMail
// const customerData = {
//   id: 123,
//   name: 'John Doe',
//   email: 'andriamahefazafymahali@gmail.com',
// };

// const mailSender = new SendMail(customerData);
// mailSender.send();

module.exports=SendMail;
