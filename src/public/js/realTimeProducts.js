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

  const product = {
    name,
    price,
    description,
    category,
  };

  socket.emit("createProduct", product);
}

function deleteProduct(productName) {
  socket.emit("deleteProduct", productName);
}
