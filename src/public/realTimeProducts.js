const socket = io();

    socket.on("realTimeProducts", (productos) => {
      const ul = document.querySelector("ol");
      ul.innerHTML = "";

      for (let i = 0; i < productos.length; i++) {
        const li = document.createElement("li");
        li.textContent = productos[i].title;
        ul.appendChild(li);
      }
    });

    function createProduct() {
      const title = document.getElementById("title").value;
      const description = document.getElementById("description").value;
      const price = document.getElementById("price").value;
      const thumbnail = document.getElementById("thumbnail").value;
      const code = document.getElementById("code").value;
      const stock = document.getElementById("stock").value;

      const product = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock
      };

      socket.emit("createProduct", product);
    }

    function deleteProduct(productId) {
      socket.emit("deleteProduct", productId);
    }