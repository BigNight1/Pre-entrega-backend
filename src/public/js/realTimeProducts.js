const socket = io();

socket.on("realTimeProducts", (productos) => {
  const ul = document.querySelector("ol");
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < productos; i++) {
    const li = document.createElement("li");
    li.textContent = productos[i].title;
    fragment.appendChild(li);
  }
  ul.appendChild(fragment);
});

function createProduct() {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;
  const stock = document.getElementById("stock").value;

  if (!name || !price || !description || !category || !stock) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Por favor, complete todos los campos requeridos.",
    });
    return; // Salir de la función si hay campos faltantes
  }

  const product = {
    name,
    price,
    description,
    category,
    stock,
  };

  socket.emit("createProduct", product);
  Swal.fire({
    position: "center",
    icon: "success",
    title: "Producto Creado",
    showConfirmButton: false,
    timer: 1500,
  });
}

// search product and delete
function deleteProduct(productName) {
  socket.emit("deleteProduct", productName);

  socket.on("deleteProductResponse", (response) => {
    const { success, message } = response;

    if (success) {
      console.log(message);
      // Muestra el mensaje de éxito al usuario, por ejemplo, con una alerta o modal
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Producto Eliminado",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      console.error(message);
      // Muestra el mensaje de error al usuario, por ejemplo, con una alerta o modal
      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
      });
    }
  });
}

function updateProduct() {
  const updateProductName = document.getElementById("updateProductName").value;
  const newProductName = document.getElementById("updateProductNewName").value;
  const updateProductPrice =
    document.getElementById("updateProductPrice").value;
  const updateProductDescription = document.getElementById(
    "updateProductDescription"
  ).value;
  const updateProductCategory = document.getElementById(
    "updateProductCategory"
  ).value;
  const updateProductStock =
    document.getElementById("updateProductStock").value;

  if (
    !updateProductName ||
    !newProductName ||
    !updateProductPrice ||
    !updateProductDescription ||
    !updateProductCategory ||
    !updateProductStock
  ) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Por favor, complete todos los campos requeridos.",
    });
    return; // Salir de la función si hay campos faltantes
  }

  const updatedProduct = {
    name: updateProductName,
    newProductName: newProductName,
    price: updateProductPrice,
    description: updateProductDescription,
    category: updateProductCategory,
    stock: updateProductStock,
  };

  socket.emit("updateProduct", updatedProduct);

  Swal.fire({
    position: "center",
    icon: "success",
    title: "Producto Actualizado",
    showConfirmButton: false,
    timer: 1500,
  });
}
