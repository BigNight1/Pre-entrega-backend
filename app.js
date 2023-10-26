// ......Dependencias
import express from "express";
import http from "http";
import { engine } from "express-handlebars";
import path from "path";
import passport from "passport";
import session from "express-session";
import cors from "cors"
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

// Importaciones Locales
import cartRoutes from "./src/routes/cartRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import sessionRouter from "./src/routes/sessions.router.js";
import viewRouter from "./src/routes/views.router.js";
import setupWebSocket from "./src/routes/websocket.js";
import initPassport from "./src/middleware/passport.config.js";
import { dbConnect } from "./src/DataBase/mongodb.js";
import CONFIG from "./src/config/config.js";
import mockingRoutes from "./src/routes/mockingRoutes.js";
import error from "./src/middleware/errors.js";
import { __dirname } from "./src/dirname.js";
import { addLogger } from "./src/logger.js";

const configureExpress = () => {
  const app = express();
  app.engine(
    "handlebars",
    engine({
      runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
      },
    })
  );
  app.set("views", path.resolve(__dirname + "/views"));
  app.set("view engine", "handlebars");
  app.use(express.json());
  // Configura express-session
  app.use(
    session({ secret: "Holaaa", resave: false, saveUninitialized: false })
  );
  // Rutas estáticas
  app.use(error); //Probando Middleware de Errores
  app.use(
    "/realtimeproducts",
    express.static(path.join(__dirname + "/public"))
  );
  app.use("/", express.static(path.join(__dirname + "/public")));
  app.use(addLogger(CONFIG.NODE_ENV))//Usando Pruebas de errores con Logger
  app.use(cors())//Usando restricciones con Cors 
  return app;
};

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Documentacion de las APIs",
      description: "Informacion de los Productos",
      version: "1.0.0",
      contact: {
        name: "Edu Armas",
        url: "https://www.linkedin.com/in/edu-armas-1a4b16260/",
      },
    },
  },
  apis: ["./src/docs/*.yaml"],
};

const spec = swaggerJsDoc(swaggerOptions);

const configurePassport = (app) => {
  app.use(passport.initialize());
  initPassport();
  app.use(passport.session());
};

const startServer = (app) => {
  const server = http.createServer(app);
  // Configurar WebSocket
  setupWebSocket(server);

  // Rutas del grupo
  app.use("/api/mock", mockingRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/carts", cartRoutes);
  app.use("/", viewRouter);
  app.use("/api/session", sessionRouter);
  app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(spec));

  server.listen(CONFIG.port, () => {
    console.log(`Servidor en funcionamiento en el puerto ${CONFIG.port}`);
  });
};

const app = configureExpress();
configurePassport(app);
startServer(app);
dbConnect();


export default app