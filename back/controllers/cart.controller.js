import { connectDB } from '../data/mongodb.js';
import { Cart } from '../data/mongodb.js';
import mongoose from 'mongoose';
import { authenticateToken } from '../middlewares/auth.js';

// Conectar a la base de datos
connectDB();

export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id; // Obtener el id del usuario desde el token

    try {
        const cartItem = await Cart.findOne({ user_id: userId, product_id: productId });

        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save();
            return res.status(200).json({ message: 'Cantidad actualizada en el carrito', cartItem });
        }

        const newCartItem = new Cart({
            user_id: userId,
            product_id: productId,
            quantity
        });
        await newCartItem.save();
        res.status(201).json({ message: 'Producto añadido al carrito', newCartItem });
    } catch (error) {
        res.status(500).json({ message: 'Error añadiendo al carrito', error });
    }
};

export const getCart = async (req, res) => {
    const userId = req.user.id;

    try {
        const cartItems = await Cart.find({ user_id: userId }).populate('product_id');
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo el carrito', error });
    }
};

export const removeFromCart = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.id;

    try {
        await Cart.deleteOne({ user_id: userId, product_id: productId });
        res.status(200).json({ message: 'Producto eliminado del carrito' });
    } catch (error) {
        res.status(500).json({ message: 'Error eliminando del carrito', error });
    }
};

export const updateCartItem = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    try {
        const cartItem = await Cart.findOne({ user_id: userId, product_id: productId });
        
        if (!cartItem) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }

        cartItem.quantity = quantity;
        await cartItem.save();
        res.status(200).json({ message: 'Cantidad actualizada', cartItem });
    } catch (error) {
        res.status(500).json({ message: 'Error actualizando el carrito', error });
    }
};
