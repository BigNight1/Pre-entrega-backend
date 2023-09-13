const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
      // Si el usuario está autenticado, permite el acceso
      return next();
    } else {
      // Si el usuario no está autenticado, muestra un mensaje de error o redirige a una página de inicio de sesión
      return res.status(401).json({ status: "error", error: "No autorizado" });
    }
  };
  export default isAuthenticated