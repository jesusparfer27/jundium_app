import { connectDB } from '../data/mongodb.js';
import { Product } from '../data/mongodb.js';
import mongoose from 'mongoose';

// Conectar a la base de datos
connectDB();

// Obtener producto por ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el id desde los parámetros de la ruta
        console.log('ID del producto recibido:', id); // Para depuración

        // Verificar si el ID es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID de producto inválido' });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        return res.json(product);
    } catch (e) {
        console.error(e); // Para depuración
        res.status(500).json({ message: e.message });
    }
};

// Obtener todos los productos con filtros
const getProducts = async (req, res) => {
    try {
        const { type, color, size, discount, product_code, gender, collection, base_price } = req.query; // Obtener filtros desde la query
        const filters = {};

        // Aplicar filtros
        if (type) filters.type = type;
        if (color) filters['variants.color.colorName'] = color;
        if (size) filters['variants.size'] = size;
        if (discount) filters.discount = { $gt: discount };
        if (product_code) filters.product_code = product_code;
        if (gender) filters.gender = gender;
        if (collection) filters.collection = collection;

        // Filtro por base_price
        if (base_price) {
            const priceRange = base_price.split('-');
            if (priceRange.length === 2) {
                // Si se proporciona un rango de precios, aplicar $gte y $lte
                const minPrice = parseFloat(priceRange[0]);
                const maxPrice = parseFloat(priceRange[1]);
                filters.base_price = { $gte: minPrice, $lte: maxPrice };
            } else {
                // Si solo se proporciona un precio específico, aplicar $eq
                const price = parseFloat(base_price);
                filters.base_price = price;
            }
        }

        const products = await Product.find(filters);
        res.json(products);
    } catch (e) {
        console.error(e); // Para depuración
        res.status(500).json({ message: e.message });
    }
};

export default getProducts;
