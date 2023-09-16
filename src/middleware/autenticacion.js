const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
      return next();
    } else {
      return res.status(401).json({ status: "error", error: "No autorizado" });
    }
  };
  export default isAuthenticated