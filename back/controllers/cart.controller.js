import { connectDB } from '../data/mongodb.js';
import { Cart, Product } from '../data/mongodb.js';

// Conectar a la base de datos
connectDB();

export const addToCart = async (req, res) => {
    const { user_id, product_id, variant_id, quantity } = req.body;
    
    console.log("Valor de product_id recibido:", product_id);
    console.log("Valor de variant_id recibido:", variant_id);

    try {
        // Validar los campos necesarios
        if (!user_id || !product_id || !variant_id || !quantity) {
            return res.status(400).json({ message: "Todos los campos son requeridos." });
        }

        console.log("product_id:", product_id, "variant_id:", variant_id); // Asegúrate de que estos valores se imprimen correctamente
        // Verificar si el producto existe
        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado." });
        }

        // Verificar si el usuario tiene un carrito existente
        let cart = await Cart.findOne({ user_id });
        if (!cart) {
            // Si no existe un carrito, se crea uno nuevo
            cart = new Cart({
                user_id,
                items: []
            });
        }

        // Verificar si el producto ya está en el carrito
        const existingItemIndex = cart.items.findIndex(item => 
            item.product_id.toString() === product_id && item.variant_id.toString() === variant_id
        );

        if (existingItemIndex > -1) {
            // Si el producto ya existe en el carrito, se actualiza la cantidad
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Si el producto no está en el carrito, se añade como nuevo
            cart.items.push({ product_id, variant_id, quantity });
        }

        // Guardar los cambios en el carrito
        await cart.save();
        return res.status(200).json({ message: "Producto añadido al carrito correctamente.", cart });
    } catch (error) {
        console.error("Error añadiendo al carrito: ", error);
        return res.status(500).json({ message: "Error añadiendo al carrito: " + error.message });
    }
};

export const removeFromCart = async (req, res) => {
    const { productId, variantId } = req.params; // Cambié req.body a req.params
    const userId = req.user.id;

    try {
        const cart = await Cart.findOne({ user_id: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Encontrar el índice del producto en el carrito
        const itemIndex = cart.items.findIndex(
            item => item.product_id.toString() === productId && item.variant_id.toString() === variantId
        );
        

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }

        // Reducir la cantidad del producto en uno
        if (cart.items[itemIndex].quantity > 1) {
            cart.items[itemIndex].quantity -= 1;
        } else {
            // Si la cantidad es 1, eliminar el producto del carrito
            cart.items.splice(itemIndex, 1);
        }

        await cart.save();
        return res.status(200).json({ message: 'Producto actualizado en el carrito', cart });
    } catch (error) {
        console.error('Error eliminando del carrito:', error);
        return res.status(500).json({ message: 'Error eliminando del carrito', error });
    }
};


export const updateCartItem = async (req, res) => {
    const { productId, variantId, quantity } = req.body;
    const userId = req.user.id;

    try {
        const cart = await Cart.findOne({ user_id: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        const cartItem = cart.items.find(item => 
            item.product_id.toString() === productId && item.variant_id.toString() === variantId
        );

        if (!cartItem) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }

        cartItem.quantity = quantity;

        await cart.save();
        return res.status(200).json({ message: 'Cantidad actualizada', cart });
    } catch (error) {
        console.error('Error actualizando el carrito:', error);
        return res.status(500).json({ message: 'Error actualizando el carrito', error });
    }
};

export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user_id: req.user.id }).populate('items.product_id items.variant_id');
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        return res.status(200).json(cart);
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        return res.status(500).json({ message: "Error al obtener el carrito" });
    }
};