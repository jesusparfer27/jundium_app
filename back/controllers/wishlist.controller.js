import { connectDB } from '../data/mongodb.js';
import { Wishlist, Product } from '../data/mongodb.js';

// Conectar a la base de datos
connectDB();

// Controlador para la Wishlist
export const addToWishlist = async (req, res) => {
    const { product_id, variant_id } = req.body;
    const user_id = req.user.id;


    console.log("Cuerpo de la solicitud en el backend:", req.body); // Verifica aquí
    console.log("El bichoso user", user_id)

    if (!user_id || !product_id || !variant_id) {
        return res.status(400).json({ message: 'user_id, product_id y variant_id son requeridos.' });
    }
    try {
        // Validar que todos los IDs estén presentes
        if (!user_id || !product_id || !variant_id) {
            return res.status(400).json({ message: 'user_id, product_id y variant_id son requeridos.' });
        }

        // Verificar si el producto existe
        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Buscar la variante
        const variant = product.variants.find(v => v.variant_id.toString() === variant_id);
        if (!variant) {
            return res.status(404).json({ message: 'Variante no encontrada' });
        }

        // Verificar si el usuario tiene una wishlist existente
        let wishlist = await Wishlist.findOne({ user_id });
        if (!wishlist) {
            wishlist = new Wishlist({ user_id, items: [] });
        }

        // Verificar si el producto ya está en la wishlist
        const existingItemIndex = wishlist.items.findIndex(item => 
            item.product_id.toString() === product_id.toString() && 
            item.variant_id.toString() === variant_id.toString()
        );

        if (existingItemIndex > -1) {
            return res.status(400).json({ message: 'El producto ya está en la wishlist' });
        } else {
            // Añadir el producto y la variante a la wishlist
            wishlist.items.push({
                product_id,
                variant_id,
                name: product.name,
                price: variant.price,
                color: variant.color.colorName,
                image: variant.image[0],
            });
        }

        await wishlist.save();
        return res.status(200).json({ message: 'Producto agregado a la wishlist correctamente.', wishlist });
    } catch (error) {
        console.error('Error añadiendo a la wishlist: ', error);
        return res.status(500).json({ message: 'Error añadiendo a la wishlist: ' + error.message });
    }
};

export const getWishlist = async (req, res) => {
    const user_id = req.user.id;

    try {
        const wishlist = await Wishlist.findOne({ user_id }).populate('items.product_id items.variant_id'); // Cambié variantId a variant_id
        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist no encontrada" });
        }
        return res.status(200).json(wishlist);
    } catch (error) {
        console.error('Error al obtener la wishlist:', error);
        return res.status(500).json({ message: "Error al obtener la wishlist" });
    }
};

export const removeFromWishlist = async (req, res) => {
    const { product_id, variant_id } = req.body; // Asegúrate de obtener ambos parámetros
    const user_id = req.user.id;

    try {
        if (!product_id || !variant_id) {
            return res.status(400).json({ message: 'Producto o variante no proporcionados' });
        }

        const wishlist = await Wishlist.findOne({ user_id });
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist no encontrada' });
        }

        const itemIndex = wishlist.items.findIndex(
            (item) => item.product_id.toString() === product_id && item.variant_id.toString() === variant_id
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Producto no encontrado en la wishlist' });
        }

        wishlist.items.splice(itemIndex, 1);
        await wishlist.save();

        return res.status(200).json({ message: 'Producto eliminado de la wishlist', wishlist });
    } catch (error) {
        console.error('Error eliminando de la wishlist:', error);
        return res.status(500).json({ message: 'Error eliminando de la wishlist', error: error.message });
    }
};

