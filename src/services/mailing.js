import nodemailer from "nodemailer";
import CONFIG from "../config/config.js";

export default class MailingService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: CONFIG.Mailing.SERVICE,
      port: 587,
      auth: {
        user: CONFIG.Mailing.USER,
        pass: CONFIG.Mailing.PASSWORD,
      },
    });
  }
  async sendEmail(to, subject, htmlContent) {
    try {
      const info = await this.transporter.sendMail({
        from: CONFIG.Mailing.USER,
        to: to,
        subject: subject,
        html: htmlContent,
      });

      console.log("Correo electrónico enviado: " + info.response);
      return true;
    } catch (error) {
      console.error("Error al enviar el correo electrónico:", error);
      return false;
    }
  }
}

