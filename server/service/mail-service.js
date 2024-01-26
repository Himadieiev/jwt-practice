const nodemailer = require('nodemailer');

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.meta.ua',
      port: 465,
      secure: true,
      auth: {
        user: 'gimadejev86@meta.ua',
        pass: process.env.META_PASSWORD,
      },
    });
  }

  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: 'gimadejev86@meta.ua',
      to,
      subject: 'Активація акаунту на ' + process.env.API_URL,
      text: '',
      html: `
      <div>
        <h1>Для активації перейдіть за посиланням</h1>
        <a href="${link}">${link}</a>
      </div>`,
    });
  }
}

module.exports = new MailService();
