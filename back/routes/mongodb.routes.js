import { Router } from 'express';
import getProducts, { getProductById } from "../controllers/product.controller.js";
// Otras importaciones de controladores...

const router = Router();

// Ruta para obtener todos los productos
router.get("/products", getProducts); // Aquí defines tu ruta
router.get("/products/:id", getProductById); // Nueva ruta para obtener un producto por ID

// Si decides implementar filtros más adelante, podrías hacerlo así:
router.get("/products/filter", getProducts); // Ruta para filtros específicos

// Otras rutas...

export default router;
