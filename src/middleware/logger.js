import winston from "winston";

const levelOptions = {
  levels: {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5,
  },
  colors: {
    debug: "white",
    http: "green",
    info: "blue",
    warning: "yellow",
    error: "orange",
    fatal: "red",
  },
};

const productionLogger = winston.createLogger({
  levels: levelOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize({ colors: levelOptions.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "src/Log/errors.log",
      level: "info",
      format: winston.format.simple(),
    }),
  ],
});

const developmentLogger = winston.createLogger({
  levels: levelOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize({ colors: levelOptions.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "src/Log/errors.log",
      level: "debug",
      format: winston.format.simple(),
    }),
  ],
});

export const addLogger = (environment) => {
  return (req, res, next) => {
    req.logger =
      environment === "development" ? developmentLogger : productionLogger;
    const logMessage = `-${new Date().toLocaleDateString()}-${req.method} en ${req.url}`;
    // req.logger.debug(logMessage);
    // req.logger.info(logMessage);
    next();
  };
};
