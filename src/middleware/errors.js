import EErrors from "../Error/enums.js";

export default (error, req, res, next) => {
  if (error.code === EErrors.INVALID_TYPES_ERROR) {
    // Manejar el error de tipos no válidos
    res.status(400).json({
      status: "error",
      error: error.name,
      message: error.message,
      cause: error.cause, // Incluye la causa en la respuesta
    });
  } else if (error.code === EErrors.DATABASE_ERROR) {
    // Manejar el error de base de datos (User Not Found Error)
    res.status(400).json({
      status: "error",
      error: error.name,
      message: error.message,
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
