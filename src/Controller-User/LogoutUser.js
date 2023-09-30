export const logoutUser =(req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log("Error in logging out", err);
        return res
          .status(500)
          .send({ status: "error", message: "Error al Cerrar la sesión" });
      }
      res.send({ status: "success", message: "Sesion Cerrada exitosamente" });
    });
  }