const addToCartButtons = document.querySelectorAll(".add-to-cart-button");
const carritoLink = document.getElementById("carritoid");


addToCartButtons.forEach((button) => {
  button.addEventListener("click", addToCart);
});

// Agrega un evento clic al enlace "Ir al Carrito"
if (carritoLink) {
  carritoLink.addEventListener("click", redirectToCart);
}

// Función para agregar un producto al carrito
async function addToCart(event) {
  // Obtener el ID del producto
  const productId = event.target.getAttribute("data-product-id");
  // Obtén el ID del carrito desde el localStorage
  const cartId = localStorage.getItem("cartId");

  if (!cartId) {
    // Si el ID del carrito no se encuentra en el botón, puedes manejarlo aquí
    alert(
      "No se encontró el ID del carrito en el botón. Asegúrate de que el usuario esté logeado."
    );
    window.location.href = "/login"; // Redirige al usuario a la página de inicio de sesión
    return;
  }

  try {
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      // Producto agregado exitosamente al carrito
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Se Agrego el producto",
        showConfirmButton: false,
        timer: 1000
      });

    } else {
      // Error al agregar el producto al carrito
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Tienes que estas Logeado",
      });
      setTimeout(() => {
        window.location.href = "/login"; 
      }, 1500);
    }
  } catch (error) {
    console.error("Error al agregar el producto al carrito:", error);
  }
}

// Función para redirigir al carrito
function redirectToCart(event) {
  // Evita que el enlace funcione como una URL normal
  event.preventDefault();

  const cartId = localStorage.getItem("cartId");

  if (!cartId) {
    // Si el ID del carrito no se encuentra en el localStorage, muestra un mensaje de error
    alert(
      "No se encontró el ID del carrito. Asegúrate de que el usuario esté logeado."
    );
  } else {
    const cartUrl = `carts/${cartId}`;
    window.location.href = cartUrl;
  }
}
