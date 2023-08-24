const logoutButton = document.getElementById("logoutButton")

logoutButton.addEventListener("click",()=>{
    fetch("api/session/logout",{
        method: "POST",
    })
    .then(response => response.json())
    .then((data)=>{
        if (data.status === "success") {
            window.location.replace("/login")
        }
    })
    .catch((error)=>{
        console.log("Errror al cerrar Session", error)
    })
})



// const socket = io();

// function addToCart(cartId, productId) {
//   console.log("Enviando addToCart:",  cartId);
//   console.log("Enviando productid:",  productId);
//   socket.emit("addToCart", { cartId, productId });
  
//   socket.on("addToCartResponse", (response) => {
//     if (response.success) {
//       console.log("Producto agregado al carrito exitosamente");
//     } else {
//       console.log("No se pudo agregar el producto al carrito");
//     }
//   });
// }

// revisar codigo 

