import { connectDB } from '../data/mongodb.js';
import { Product } from '../data/mongodb.js';

// Conectar a la base de datos
connectDB();

const getProducts = async (req, res, next) => {
    try {
        console.log("products")
        const products = await Product.find(); // Obtiene todos los productos
        res.json(products); // Responde con la lista de productos en formato JSON
    } catch (e) {
        res.status(500).json({ message: e.message }); // Manejo de errores
    }
};

export default getProducts