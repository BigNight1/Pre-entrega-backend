function requireAuth(req, res, next) {
    if (!req.session.user) {
      // Si el usuario no está autenticado, responde con un error 401
      return res.status(401).json({ error: "Usuario no autenticado" });
    }
    // Si el usuario está autenticado, permite que la solicitud continúe
    next();
  }
  export default requireAuth