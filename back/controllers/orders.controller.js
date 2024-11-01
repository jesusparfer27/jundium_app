import { connectDB } from '../data/mongodb.js';
import { Order, User, Product } from '../data/mongodb.js';
import mongoose from 'mongoose';
import { authenticateToken } from '../middlewares/auth.js';

// Conectar a la base de datos
connectDB();

const createOrder = async (req, res) => {
    const userId = req.user.id;
    const { items, total } = req.body;

    try {
        const newOrder = new Order({
            user_id: userId,
            items,
            total
        });
        await newOrder.save();
        res.status(201).json({ message: 'Pedido creado', newOrder });
    } catch (error) {
        res.status(500).json({ message: 'Error creando el pedido', error });
    }
};

const getOrders = async (req, res) => {
    const userId = req.user.id;

    try {
        const orders = await Order.find({ user_id: userId });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo los pedidos', error });
    }
};

const updateOrderStatus = async (req, res) => {
    const { orderId, status } = req.body;

    try {
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        order.status = status;
        await order.save();
        res.status(200).json({ message: 'Estado del pedido actualizado', order });
    } catch (error) {
        res.status(500).json({ message: 'Error actualizando el estado del pedido', error });
    }
};

// Exportar funciones
export { createOrder, getOrders, updateOrderStatus };
