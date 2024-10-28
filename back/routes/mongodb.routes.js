import { Router } from 'express';
import getProducts, { getProductById } from "../controllers/product.controller.js";
import { getUsers, loginUser } from '../controllers/users.controller.js';
import { authenticateToken } from '../middlewares/auth.js';
import { registerUser } from '../controllers/register.controller.js';
import { User } from '../data/mongodb.js';
// Otras importaciones de controladores...

const router = Router();

// Ruta para obtener todos los productos
router.get("/products", getProducts); // Aquí defines tu ruta
router.get("/products/:id", getProductById); // Nueva ruta para obtener un producto por ID

router.get("/users", getUsers);

router.get("/check-email", async (req, res) => {
    const { email } = req.query;
    const user = await User.findOne({ email });
    if (user) {
        return res.status(200).json({ exists: true });
    }
    res.status(200).json({ exists: false });
});

router.post("/login", loginUser, authenticateToken);
router.post("/sign-in", registerUser)


// Si decides implementar filtros más adelante, podrías hacerlo así:
router.get("/products/filter", getProducts); // Ruta para filtros específicos

// Otras rutas...

export default router;
