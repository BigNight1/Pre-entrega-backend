// Agrega un evento clic a todos los botones "Agregar al Carrito"
const addToCartButtons = document.querySelectorAll(".add-to-cart-button");
addToCartButtons.forEach((button) => {
  button.addEventListener("click", addToCart);
});

// Función para agregar un producto al carrito
async function addToCart(event) {
  // Obtener el ID del producto y el ID del carrito desde los atributos del botón
  const productId = event.target.getAttribute("data-product-id");
  // Obtén el ID del carrito desde el localStorage
  const cartId = localStorage.getItem("cartId");

  console.log("ID del producto:", productId);
  console.log("ID del carrito:", cartId);
  if (!cartId) {
    // Si el ID del carrito no se encuentra en el botón, puedes manejarlo aquí
    alert(
      "No se encontró el ID del carrito en el botón. Asegúrate de que el usuario esté logeado."
    );
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
      alert("Producto agregado al carrito correctamente");
    } else {
      // Error al agregar el producto al carrito
      alert("Error al agregar el producto al carrito");
    }
  } catch (error) {
    console.error("Error al agregar el producto al carrito:", error);
  }
}
