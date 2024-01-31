import dotenv from "dotenv";

dotenv.config();

const CONFIG = {
  port: process.env.port || 3015,
  NODE_ENV: process.env.NODE_ENV || "development",
  DataBase: {
    DB_ECOMMERCE: process.env.DB_ECOMMERCE || "error db",
  },
  GitHub: {
    clientID: process.env.clientID || "Iv1.5e07bb792c8a3b76",
    clientSecret:process.env.clientSecret || "b76779a99cb40930302f4e6ff5a9a8cc31dfda44",
  },
  Mailing: {
    SERVICE: process.env.MAILING_SERVICE,
    USER: process.env.MAILING_USER,
    PASSWORD: process.env.MAILING_PASSWORD,
  },
};

export default CONFIG;
