const BotonPurchase = document.getElementById("FinishPurchase");
const DeleteProduct = document.querySelectorAll(".botoncancelar")

BotonPurchase.addEventListener("click", Finish);

if (DeleteProduct) {
  DeleteProduct.forEach((button) => {
    button.addEventListener("click", Delete);
  });
}

async function Finish() {
  const cartId = localStorage.getItem("cartId");

  if (!cartId) {
    alert("No se encontro el Id del carrito");
  }

  try {
    const response = await fetch(`/api/carts/${cartId}/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      alert("finalizo la compra");
    }
  } catch (error) {
    console.error("Error en la Compra", error);
  }
}

async function Delete(event) {
  const cartId = localStorage.getItem("cartId");
  const productId = event.target.getAttribute("data-product-id");

  try {
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Producto Eliminado",
        showConfirmButton: false,
        timer: 1000
      });
    }
  } catch (error) {
    console.error("Error en la Compra", error);
  }
}
