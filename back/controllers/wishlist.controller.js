import { connectDB } from '../data/mongodb.js';
import { Wishlist } from '../data/mongodb.js';
import { Product } from '../data/mongodb.js';
import mongoose from 'mongoose';

// Conectar a la base de datos
connectDB();

// Controlador para la Wishlist
export const wishlistController = {
    // Agregar producto a la wishlist
    addToWishlist: async (req, res) => {
        try {
            console.log("Request para agregar a wishlist:", req.body); // Log del cuerpo de la solicitud
            const userId = req.user.id; // ID del usuario tras la autenticación
            const productId = req.params.productId;

            // Verificar si el producto existe
            const productExists = await Product.findById(productId);
            if (!productExists) {
                console.log("Producto no encontrado:", productId); // Log si el producto no se encuentra
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            // Agregar el producto a la wishlist o crear una nueva si no existe
            const wishlist = await Wishlist.findOneAndUpdate(
                { user_id: userId },
                { $addToSet: { items: { product_id: productId } } }, // Esto evita duplicados
                { new: true, upsert: true } // Crea un nuevo documento si no existe
            ).lean();

            console.log("Producto agregado a la wishlist:", productId); // Log del producto agregado
            return res.status(201).json({ message: 'Producto agregado a la wishlist', wishlist });
        } catch (error) {
            console.error('Error al agregar a la wishlist: ', error);
            return res.status(500).json({ message: 'Error interno al agregar a la wishlist' });
        }
    },

    // Método para obtener la wishlist del usuario
    getWishlist: async (req, res) => {
        try {
            const userId = req.user.id;

            const wishlist = await Wishlist.findOne({ user_id: userId }).populate('items.product_id').lean();
            if (!wishlist) {
                return res.status(404).json({ message: 'Wishlist no encontrada' });
            }

            return res.status(200).json({ message: 'Wishlist obtenida con éxito', wishlist });
        } catch (error) {
            console.error('Error al obtener la wishlist: ', error);
            return res.status(500).json({ message: 'Error interno al obtener la wishlist' });
        }
    },

    // Método para eliminar un producto de la wishlist
    removeFromWishlist: async (req, res) => {
        try {
            const userId = req.user.id;
            const productId = req.params.productId;

            const wishlist = await Wishlist.findOne({ user_id: userId });
            if (!wishlist) {
                return res.status(404).json({ message: 'Wishlist no encontrada' });
            }

            // Filtrar el producto que se desea eliminar
            const initialLength = wishlist.items.length;
            wishlist.items = wishlist.items.filter(item => !item.product_id.equals(productId));
            await wishlist.save();

            if (initialLength === wishlist.items.length) {
                return res.status(400).json({ message: 'El producto no estaba en la wishlist' });
            }

            return res.status(200).json({ message: 'Producto eliminado de la wishlist', wishlist });
        } catch (error) {
            console.error('Error al eliminar de la wishlist: ', error);
            return res.status(500).json({ message: 'Error interno al eliminar de la wishlist' });
        }
    }
};
