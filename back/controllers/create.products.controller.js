import { Product } from '../data/mongodb.js';
import multer from 'multer'; // Si usas multer para manejo de imágenes
import { upload } from '../middlewares/multer.js'; // Middleware de multer, si aplica
import { connectDB } from '../data/mongodb.js';
import mongoose from 'mongoose';

connectDB();

// Generar un código único para cada producto
function generateProductCode() {
    return `PROD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
}

export const createProduct = async (req, res) => {
    try {
        console.log('Datos recibidos en el backend:', req.body);  // Verifica los datos recibidos
        console.log('Archivos recibidos:', req.files); // Verifica los archivos recibidos

        const { collection, brand, type, gender, new_arrival, featured } = req.body.generalProduct || {};
        const { variants } = req.body;

        // Validación de datos principales del producto
        if (!collection || !brand || !type || !gender || !Array.isArray(variants) || variants.length === 0) {
            console.log('Faltan datos en el producto principal');
            return res.status(400).json({ message: 'Faltan datos requeridos para crear el producto.' });
        }

        // Validación de las variantes y asignación del variant_id
        const updatedVariants = await Promise.all(variants.map(async (variant) => {
            let productCode;
            let isUnique = false;
        
            // Generar un variant_id único
            const variantId = new mongoose.Types.ObjectId();
        
            // Generar un código de producto único para cada variante
            while (!isUnique) {
                productCode = generateProductCode();
                const existingProduct = await Product.findOne({ 'variants.product_code': productCode });
        
                if (!existingProduct) {
                    isUnique = true;  // Si no existe un producto con ese código, lo consideramos único
                }
            }
        
            // Eliminar el campo _id (si existe) y asignar el variant_id y product_code
            const updatedVariant = {
                ...variant,
                variant_id: variantId, // Asignar variant_id único
                product_code: productCode, // Sobrescribir el código de producto con uno único
            };
        
            // Eliminar el campo _id si existe
            delete updatedVariant._id;
        
            return updatedVariant;
        }));
        

        // Validación adicional para evitar product_code null
        if (updatedVariants.some(v => !v.product_code)) {
            console.log('Algunas variantes no tienen un código de producto válido:', updatedVariants);
            return res.status(400).json({ message: 'Algunas variantes no tienen un código de producto válido.' });
        }

        console.log('Códigos de producto generados:', updatedVariants.map(v => v.product_code));

        // Crear el producto en la base de datos
        const product = new Product({
            collection,
            brand,
            type,
            gender,
            new_arrival,
            featured,
            variants: updatedVariants, //    Asignar las variantes actualizadas al producto
        });

        await product.save();
        res.status(201).json({ message: 'Producto creado con éxito.', product });

    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ message: 'Error al crear el producto.' });
    }
};
