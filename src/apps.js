// ......Dependencias
import express from "express";
import http from "http";
import { engine } from "express-handlebars";
import path from "path";
import session from "express-session";
import passport from "passport";

// Importaciones Locales
import cartRoutes from "./routes/cartRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import sessionRouter from "./routes/sessions.router.js";
import viewRouter from "./routes/views.router.js";
import setupWebSocket from "./routes/websocket.js";
import initPassport from "./middleware/passport.config.js";
import { dbConnect } from "./DataBase/mongodb.js";
import { __dirname } from "./utils.js";



const configureExpress = () => {
  const app = express();
  app.engine("handlebars",
    engine({
      runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
      },
    })
  );
  app.set("view engine", "handlebars");
  app.set("views", path.resolve(__dirname + "/views"));
  app.use(express.json());

  // Rutas estáticas
  app.use("/realtimeproducts",express.static(path.join(__dirname + "/public")));
  app.use("/", express.static(path.join(__dirname + "/public")));

  //Configuracion de la sesión
  app.use(session({secret: "Coder",resave: true,saveUninitialized: true,}));
  return app;
};

const configurePassport = (app) => {
  app.use(passport.initialize());
  initPassport();
  app.use(passport.session());
};

const startServer = (app) => {
  const server = http.createServer(app);

  // Configurar WebSocket
  setupWebSocket(server)

  // Rutas del grupo
  app.use("/api/products", productRoutes);
  app.use("/api/carts", cartRoutes);
  app.use("/", viewRouter);
  app.use("/api/session", sessionRouter);

  server.listen(process.env.port, () => {
    console.log(`Servidor en funcionamiento en el puerto ${process.env.port}`);
  });
};

const app = configureExpress();
configurePassport(app);
startServer(app);
// Iniciar el servidor
dbConnect();
