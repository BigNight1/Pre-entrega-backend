const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));

  const response = await fetch("api/session/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 200) {
    const responseData = await response.json();

    if (responseData.payload && responseData.payload) {
      const { name, cart } = responseData.payload;
      // Cuando el usuario inicia sesión y obtienes el ID del carrito, guárdalo en el localStorage
      localStorage.setItem("cartId", cart);
      Swal.fire({
        position: "center",
        icon: "success",
        title: `Bienvenido ${name}`,
        showConfirmButton: false,
        timer: 1100,
      });
      setTimeout(() => {
        window.location.replace("/products");
      }, 1150);
    } else {
      alert(
        "Inicio de sesión exitoso, pero no se pudo obtener el nombre del usuario."
      );
    }
  } else if (response.status === 400) {
    Swal.fire({
      icon: "error",
      title: "Datos Incorrectos",
    });
  }
});
