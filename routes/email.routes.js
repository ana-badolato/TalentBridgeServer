const express = require('express');
const sgMail = require('@sendgrid/mail');
const { isAuthenticated } = require('../middleware/jwt.middleware');
const router = express.Router();

// Configura SendGrid con la API Key
console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// POST Ruta per enviar correus
router.post('/',isAuthenticated, async (req, res) => {
    const { senderEmail, recipientEmail, subject, message } = req.body;

    const msg = {
        to: recipientEmail,        // Correu electrònic del destinatari
        from: senderEmail,        // Correu electrònic de l'emissor
        subject: subject,
        text: message,
    };

    try {
        await sgMail.send(msg);
        res.status(200).send('Email send!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to send the email.');
    }
});

module.exports = router;