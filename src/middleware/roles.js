function checkUserRole(role) {
  return (req, res, next) => {
    if (req.session.user && req.session.user.role === role) {
      // El usuario tiene el rol adecuado, permitir el acceso
      next();
    } else {
      // El usuario no tiene el rol adecuado, prohibir el acceso
      res
        .status(403)
        .json({ status: "error", message: "Acceso no autorizado" });
    }
  };
}

export default checkUserRole;
