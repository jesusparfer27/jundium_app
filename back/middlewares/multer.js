import multer from 'multer';
import path from 'path';
import fs from 'fs';
import express from 'express';

const app = express();

// Configuración de Multer
export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const { gender, type, productName, color } = req.body;
    
        // Verifica que se han recibido los datos necesarios
        if (!gender || !type || !productName || !color) {
            return cb(new Error("Faltan datos para guardar el archivo en la ruta correcta"), null);
        }
    
        // Define la ruta de la carpeta donde se guardará la imagen
        const folderPath = path.join(
            'assets',
            'images',
            gender,
            type,
            productName,
            color
        );
    
        // Crear carpetas dinámicamente si no existen
        fs.mkdirSync(folderPath, { recursive: true });
    
        // Asigna la carpeta de destino
        cb(null, folderPath); 
    },
    filename: function (req, file, cb) {
        // Asegura un nombre único para cada archivo
        const extension = path.extname(file.originalname);
        const uniqueSuffix = new Date().toISOString().replace(/:/g, '-').replace(/\./g, '-');
        cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
    }
});

// Middleware Multer
export const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limite de archivo: 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Formato de archivo no permitido"), false);
        }
        cb(null, true); // Aceptar archivo
    }
});