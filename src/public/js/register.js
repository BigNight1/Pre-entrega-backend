const form = document.getElementById("registerForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));

  fetch("api/session/register", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((result) => result.json())
    .then((json) => {
      if (json.status === "success") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Usuario Creado",
          showConfirmButton: false,
          timer: 1000
        });
        setTimeout(() => {
          window.location.href = "/login"
        }, 1200);
      }
    })
    .catch((error) => {
      console.log("Error", error);
    });
});
