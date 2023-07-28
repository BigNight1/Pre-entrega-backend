const socket = io();

socket.on("realTimeProducts", (productos) => {
  const ul = document.querySelector("ol");

  // Crear un fragmento para agregar los nuevos elementos
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < productos.length; i++) {
    const li = document.createElement("li");
    li.textContent = productos[i].title;
    fragment.appendChild(li);
  }

  // Agregar los nuevos elementos al final de la lista
  ul.appendChild(fragment);
});

function createProduct() {
  const id = document.getElementById("id").value;
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;

  const product = {
    id,
    name,
    price,
    description,
    category,
  };

  socket.emit("createProduct", product);
  
  // Esperar la respuesta del servidor
  socket.once("productResponse", (response) => {
    const errorMessage = document.getElementById("errorMessage");

    if (response.error) {
      errorMessage.textContent = response.error;
      errorMessage.style.display = "block"; // Mostrar el mensaje de error
    } else {
      errorMessage.style.display = "none"; // Ocultar el mensaje de error si no hay errores
    }
  });
}

function deleteProduct(productName) {
  socket.emit("deleteProduct", productName);
}

