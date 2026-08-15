const AppError = require('../../core/AppError');

class BrevoEmailProvider {
  constructor({ apiKey, senderEmail, senderName }) {
    this.apiKey = String(apiKey || '').trim();
    this.senderEmail = String(senderEmail || '').trim();
    this.senderName = String(senderName || '').trim() || 'Fidelidad APP';
  }

  async send({ to, toName, subject, htmlContent }) {
    if (!this.apiKey || !this.senderEmail) {
      throw new AppError(
        'El envío de correos no está configurado. Definí BREVO_API_KEY y BREVO_SENDER_EMAIL en el .env del backend.',
        500
      );
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': this.apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        sender: { name: this.senderName, email: this.senderEmail },
        to: [{ email: to, name: toName }],
        subject,
        htmlContent
      })
    });

    if (!response.ok) {
      const detalle = await response.text().catch(() => '');
      throw new AppError('No se pudo enviar el correo con la tarjeta de fidelidad', 502, { detalle });
    }

    return response.json();
  }
}

module.exports = BrevoEmailProvider;
