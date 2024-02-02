const form = document.getElementById("restartPasswordForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  const response = await fetch("api/session/forgotpassword", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  if (response.status === 200) {
    const responseData = await response.json();
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Se te envio El cambio de contraseña a tu Correo Electronico",
      showConfirmButton: false,
      timer: 2000
    });
    setTimeout(() => {
      window.location.href = "/login"
    }, 2050);
  } else {
    console.error("Error en la respuesta:", response.statusText);
  }
});
