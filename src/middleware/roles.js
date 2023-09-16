function checkUserRole(role) {
  return (req, res, next) => {
    if (req.session.user && req.session.user.role === role) {
      next();
    } else {
      res
        .status(403)
        .json({ status: "error", message: "Acceso no autorizado" });
    }
  };
}

export default checkUserRole;
