import dotenv from 'dotenv';

// Creación de variable __dirname para usar carpeta public con vercel
import path from 'path';
export const __dirname = path.resolve()

const result = dotenv.config();
if (result.error) {
    throw new Error("Error al cargar las variables de entorno: " + result.error);
}

export const HOST = process.env.HOST || "http://localhost";
export const PORT = process.env.PORT || 3027;

export const FULL_DOMAIN = `${HOST}:${PORT}`

export const JWT_SECRET = process.env.JWT_SECRET || 'S4jIRHqt'

// Configuración de MongoDB
export const mongodbUri = process.env.MONGODB_URI;
