import EErrors from "../Error/enums.js";

const errorMappings = {
  [EErrors.INVALID_TYPES_ERROR]: {
    name: "Invalid Types Error",
    message: "Error de tipos no válidos",
  },
  [EErrors.DATABASE_ERROR]: {
    name: "Database Error",
    message: "Error de base de datos",
  },
  // Agrega más mapeos para otros tipos de errores aquí
};

export default (error, req, res, next) => {
  const errorMapping = errorMappings[error.code];

  if (errorMapping) {
    const { name, message } = errorMapping;
    res.status(400).json({
      status: "error",
      error: name,
      message,
      cause: error.cause, // Incluye la causa en la respuesta
    });
  } else {
    // Manejar otros errores (por defecto, Error interno)
    res.status(500).json({
      status: "error",
      error: "Error interno",
      message: error.message,
      cause: error.cause, // Incluye la causa en la respuesta
    });
  }
};
