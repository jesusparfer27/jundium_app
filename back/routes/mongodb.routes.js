import { Router } from 'express';
import getProducts, { getProductById } from "../controllers/product.controller.js";
import { getUsers, loginUser, getUserById, getMe } from '../controllers/users.controller.js';
import { authenticateToken } from '../middlewares/auth.js';
import { addToWishlist, getWishlist, removeFromWishlist } from '../controllers/wishlist.controller.js';
import { registerUser } from '../controllers/register.controller.js';
import {
    addToCart,
    getCart,
    removeFromCart,
    updateCartItem
} from '../controllers/cart.controller.js';
import {
    createOrder,
    getOrders,
    updateOrderStatus
} from '../controllers/orders.controller.js';

// Crear el router
const router = Router();

// Ruta para obtener todos los productos
router.get("/products", getProducts); // Aquí defines tu ruta
router.get("/products/:id", getProductById); // Nueva ruta para obtener un producto por ID
router.get("/me", authenticateToken, getMe);
router.get("/users", getUsers);
router.get("/users/:id", getUserById);

router.post("/login", loginUser, authenticateToken);
router.post("/register", registerUser);

// Rutas para el carrito
router.post("/cart", authenticateToken, addToCart); // Añadir producto al carrito
router.get("/cart", authenticateToken, getCart); // Obtener carrito del usuario
router.delete("/cart/:productId/:variantId", authenticateToken, removeFromCart); // Eliminar producto del carrito
router.put("/cart", authenticateToken, updateCartItem); // Actualizar cantidad de producto en el carrito

// Rutas para pedidos
router.post("/orders", authenticateToken, createOrder); // Crear nuevo pedido
router.get("/orders", authenticateToken, getOrders); // Obtener pedidos del usuario
router.put("/orders/status", authenticateToken, updateOrderStatus); // Actualizar estado del pedido

// Rutas para la wishlist
router.post("/wishlist", authenticateToken, addToWishlist); // Agregar producto a la wishlist
router.get("/wishlist", authenticateToken, getWishlist); // Obtener wishlist del usuario
router.delete("/wishlist/:productId/:variantId", authenticateToken, removeFromWishlist); // Eliminar producto de la wishlist con IDs en el cuerpo

// Si decides implementar filtros más adelante, podrías hacerlo así:
router.get("/products/filter", getProducts); // Ruta para filtros específicos

// Otras rutas...

export default router;
