import mailer from "nodemailer";
import CONFIG from "../config/config.js";

export default class MailingService {
  constructor() {
    this.client = mailer.createTestAccount({
      service: CONFIG.Mailing.SERVICE,
      port: 587,
      auth: {
        user: CONFIG.Mailing.USER,
        pass: CONFIG.Mailing.PASSWORD,
      },
    });
  }
}
