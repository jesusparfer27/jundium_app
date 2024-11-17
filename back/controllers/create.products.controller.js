import { Product } from '../data/mongodb.js';
import multer from 'multer';
import { upload } from '../middlewares/multer.js'; // Asumiendo que tienes un middleware para manejar la subida de archivos

// Crear un producto
export const createProduct = async (req, res) => {
    try {
        // Extraer los datos del body que corresponden a tu esquema
        const {
            collection,
            brand,
            type,
            gender,
            variants,
            new_arrival,
            featured,
        } = req.body;

        // Validación de datos requeridos
        if (!collection || !brand || !type || !gender || !variants) {
            return res.status(400).json({ message: 'Faltan datos para crear el producto.' });
        }

        // Si hay imágenes, las manejamos aquí
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            imageUrls = req.files.map(file => `/uploads/products/${file.filename}`); // Asegúrate de que la ruta es la correcta
        }

        // Aquí es donde vamos a agregar la imagen a cada variante
        const updatedVariants = variants.map(variant => {
            if (variant.image && variant.image.length > 0) {
                // Si hay imágenes en la variante, las actualizamos
                variant.image = [...variant.image, ...imageUrls]; // Se añaden las imágenes a la variante
            } else {
                variant.image = imageUrls; // Si no hay imágenes en la variante, las asignamos
            }

            return variant;
        });

        // Crear el nuevo producto
        const newProduct = new Product({
            collection,
            brand,
            type,
            gender,
            variants: updatedVariants,
            new_arrival: new_arrival || false,
            featured: featured || false,
        });

        // Guardar el producto en la base de datos
        await newProduct.save();

        res.status(201).json({
            message: 'Producto creado con éxito',
            product: newProduct
        });
    } catch (error) {
        // Manejo de errores
        if (error instanceof multer.MulterError) {
            return res.status(400).json({ message: `Error de carga de archivo: ${error.message}` });
        }
        res.status(500).json({ message: 'Error al crear el producto', error: error.message });
    }
};