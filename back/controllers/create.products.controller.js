import { Product } from '../data/mongodb.js';
import { upload } from '../middlewares/multer.js'; // Asegúrate de que este middleware esté configurado
import { connectDB } from '../data/mongodb.js';
import mongoose from 'mongoose';

connectDB();

function generateProductCode() {
    return `PROD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
}

export const createProduct = async (req, res) => {
    try {
        // Log para verificar los datos recibidos
        console.log('Datos recibidos en el backend:', req.body);
        console.log('Archivos recibidos:', req.files); // Los archivos deberían estar en req.files

        // Desestructuración de los datos del producto
        const { collection, brand, type, gender, new_arrival, featured } = req.body.generalProduct || {};
        const { variants } = req.body;

        // Verificar que los datos esenciales están presentes
        if (!collection || !brand || !type || !gender || !Array.isArray(variants) || variants.length === 0) {
            return res.status(400).json({ message: 'Faltan datos requeridos para crear el producto.' });
        }

        // Procesar las variantes y generar un código único
        const updatedVariants = await Promise.all(variants.map(async (variant) => {
            let productCode;
            let isUnique = false;

            const variantId = new mongoose.Types.ObjectId();

            // Generar códigos de producto únicos
            while (!isUnique) {
                productCode = generateProductCode();
                const existingProduct = await Product.findOne({ 'variants.product_code': productCode });

                if (!existingProduct) {
                    isUnique = true;
                }
            }

            const updatedVariant = {
                ...variant,
                variant_id: variantId,
                product_code: productCode,
            };

            delete updatedVariant._id;

            return updatedVariant;
        }));

        if (updatedVariants.some(v => !v.product_code)) {
            return res.status(400).json({ message: 'Algunas variantes no tienen un código de producto válido.' });
        }

        // Crear el nuevo producto
        const product = new Product({
            collection,
            brand,
            type,
            gender,
            new_arrival,
            featured,
            variants: updatedVariants,
            images: req.files || [], // Asegúrate de que los archivos subidos estén guardados correctamente
        });

        await product.save();
        res.status(201).json({ message: 'Producto creado con éxito.', product });

    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ message: 'Error al crear el producto.' });
    }
};
