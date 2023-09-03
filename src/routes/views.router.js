import { Router } from "express";
import { productModel } from "../dao/models/productSchema.js";
import ProductManager from "../dao/controllers/productoManager.js";
import MessageManager from "../dao/controllers/messagesManager.js";
import CartManager from "../dao/controllers/cartsManager.js";

const router = Router();
const cartManager = new CartManager();
const productManager = new ProductManager();
const messageManager = new MessageManager();

router.get("/register", (req, res) => {
  res.render("session/register");
});

router.get("/login", (req, res) => {
  res.render("session/login");
});

router.get("/profile", (req, res) => {
  res.render("session/profile", {
    user: req.user,
  });
});

router.get("/",(req,res)=>{
  res.redirect("/products")
})

router.get("/restartpassword", (req, res) => {
  res.render("session/restartpassword");
});

router.get("/", (req,res)=>{
  res.redirect("/products")
})


router.get("/products", async (req, res) => {
  const isAuthenticated = req.session.user ? true : false;
  const page = req.query.page || 1;
  const limit = req.query.limit || 4;
  const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } =
    await productModel.paginate({}, { limit, page, lean: true });
  const products = docs;
  res.render("home", {
    isAuthenticated,
    products,
    hasPrevPage,
    hasNextPage,
    nextPage,
    prevPage,
  });
});
router.get("/realtimeproducts", async (req, res) => {
  const productos = await productManager.getAllProducts();
  res.render("realTimeProducts", { productos });
});
router.get("/chat", async (req, res) => {
  const messages = await messageManager.getMessages();
  res.render("chat", { messages });
});

router.get("/carts/:cartId", async (req, res) => {
  const { cartId } = req.params;
  const cart = await cartManager.getCartById(cartId);

  if (!cart) {
    console.log("Carrito no encontrado");
    return res.status(404).send("Carrito no encontrado");
  }

  console.log(cart);
  res.render("cartDetails", { cart });
});

export default router;
