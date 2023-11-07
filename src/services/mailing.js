import mailer from "nodemailer";
import CONFIG from "../config/config.js";

export default class MailingService {
  constructor() {
    this.client = mailer.createTestAccount({
      service: CONFIG.mailing.SERVICE,
      port: 587,
      auth: {
        user: CONFIG.mailing.USER,
        pass: CONFIG.mailing.PASSWORD,
      },
    });
  }
//  cambiar este codigo 
}
