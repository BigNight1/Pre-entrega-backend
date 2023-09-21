import { Router } from "express";
import { productModel } from "../dao/schemas/productSchema.js";
import ProductManager from "../dao/Controller/productoController.js";
import MessageManager from "../dao/Controller/messagesController.js";
import CartManager from "../dao/Controller/cartController.js";
import isAuthenticated from "../middleware/autenticacion.js";
import checkUserRole from "../middleware/roles.js";
import requireAuth from "../middleware/requireAuth.js";

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
    user: req.session.user,
  });
});

router.get("/restartpassword", (req, res) => {
  res.render("session/restartpassword");
});

router.get("/", (req,res)=>{
  res.redirect("/products")
})


router.get("/products", async (req, res) => {
  const isAuthenticated = req.session.user ? true : false;
  const isAdmin = req.session.isAdmin || false; // Agregar isAdmin
  const page = req.query.page || 1;
  const limit = req.query.limit || 6;
  const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } =
    await productModel.paginate({}, { limit, page, lean: true });
  const products = docs;
  res.render("product", {
    isAuthenticated,
    isAdmin,
    products,
    hasPrevPage,
    hasNextPage,
    nextPage,
    prevPage,
  });
});
router.get("/realtimeproducts", isAuthenticated, checkUserRole("admin"), async (req, res) => {
  const productos = await productManager.getAllProducts();
  res.render("realTimeProducts", { productos });
});
router.get("/chat", async (req, res) => {
  const messages = await messageManager.getMessages();
  res.render("chat", { messages });
});

router.get("/carts/:cartId",requireAuth, async (req, res) => {
  const { cartId } = req.params;
  const cart = await cartManager.getCartById(cartId);

  if (!cart) {
    console.log("Carrito no encontrado");
    return res.status(404).send("Carrito no encontrado");
  }

  res.render("cartDetails", { cart });
});

export default router;
