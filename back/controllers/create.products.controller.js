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

        // Validación de las variantes
        // Validación de las variantes
        const updatedVariants = await Promise.all(variants.map(async (variant) => {
            let productCode;
            let isUnique = false;

            while (!isUnique) {
                productCode = generateProductCode();
                const existingProduct = await Product.findOne({ 'variants.product_code': productCode });

                if (!existingProduct) {
                    isUnique = true;
                }
            }

            return {
                ...variant,
                product_code: productCode, // Sobrescribe cualquier product_code existente
            };
        }));

        // Validación adicional para evitar product_code null
        if (updatedVariants.some(v => !v.product_code)) {
            console.log('Algunas variantes no tienen un código de producto válido:', updatedVariants);
            return res.status(400).json({ message: 'Algunas variantes no tienen un código de producto válido.' });
        }
        console.log('Códigos de producto generados:', updatedVariants.map(v => v.product_code));


        // Creación del producto en la base de datos
        const product = new Product({
            collection,
            brand,
            type,
            gender,
            new_arrival,
            featured,
            variants: updatedVariants,
        });

        await product.save();
        res.status(201).json({ message: 'Producto creado con éxito.', product });

    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ message: 'Error al crear el producto.' });
    }
};