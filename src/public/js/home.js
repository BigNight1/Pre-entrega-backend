const socket = io();

function addToCart(productId) {
  console.log("Adding product to cart:", productId);
  const cartId = "your-cart-id"
  socket.on("addToCart", {cartId,productId});
}


