export class RegisterError extends Error {
    constructor(message, cause) {
      super(message);
      this.name = "RegisterError"; // Nombre personalizado para el error
      this.cause = cause; // Puedes incluir información adicional sobre la causa del error si es necesario
    }
  }
  