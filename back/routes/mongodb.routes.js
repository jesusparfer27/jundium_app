import { Router } from 'express';
import getProducts, { getProductById } from "../controllers/product.controller.js";
import { getUsers, loginUser, getUserById, getMe } from '../controllers/users.controller.js';
import { authenticateToken } from '../middlewares/auth.js';
import { registerUser } from '../controllers/register.controller.js';
// Otras importaciones de controladores...

const router = Router();

// Ruta para obtener todos los productos
router.get("/products", getProducts); // Aquí defines tu ruta
router.get("/products/:id", authenticateToken, getProductById); // Nueva ruta para obtener un producto por ID
router.get("/me", authenticateToken, getMe);
router.get("/users", getUsers);
router.get("/users/:id", getUserById);

router.post("/login", loginUser, authenticateToken);
router.post("/register", registerUser)


// Si decides implementar filtros más adelante, podrías hacerlo así:
router.get("/products/filter", getProducts); // Ruta para filtros específicos

// Otras rutas...

export default router;
