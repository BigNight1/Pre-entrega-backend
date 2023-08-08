const socket = io();

function addToCart(productId) {
  socket.on("addToCart", {cartId,productId});
}


