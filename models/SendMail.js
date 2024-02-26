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
    const apiURL = `http://localhost:4200/client/validation/${this.customer._id}`;

    // Corps HTML du mail
    const mailBody = `
        <html>
        <head>
        </head>
        <body style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h1 style="color: #333333;">Bonjour ${this.customer.nom},</h1>
                <p style="color: #666666;">Cliquez sur le lien suivant pour confirmer votre inscription :</p>
                <p><a href="${apiURL}" style="color: #007bff; text-decoration: none;">valider</a></p>
            </div>
        </body>
        </html>
    `;

    // Options du message
    const mailOptions = {
        from: 'dmbeautyweb@gmail.com',
        to: this.customer.email,
        subject: 'Confirmation inscription dmbeautyweb',
        html: mailBody,
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
    const mailBody =  `
    <html>
    <head>
    </head>
    <body style="font-family: 'Arial', sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #333333;">Bonjour ${employe.prenom},</h1>
            <p style="color: #666666;">voici votre mot de passe temporaire :${employe.mdp}</p>
        </div>
    </body>
    </html>
`;

    // Options du message
    const mailOptions = {
      from: 'dmbeautyweb@gmail.com',
      to: employe.login,
      subject: 'informations de mot de passe temporaire dmbeautyweb',
      html: mailBody,
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
