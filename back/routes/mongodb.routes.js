import { Router } from 'express'
import getProducts from "../controllers/product.controller.js";
// Otras importaciones de controladores...

const router = Router();

// Ruta para obtener todos los productos
router.get("/products", getProducts); // Aquí agregas tu ruta

// Otras rutas...

export default router;
