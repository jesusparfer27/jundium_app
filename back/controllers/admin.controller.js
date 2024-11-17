import { connectDB } from '../data/mongodb.js';
import { User } from '../data/mongodb.js';
import jwt from 'jsonwebtoken';

connectDB();

// Middleware para verificar si el usuario tiene todos los permisos necesarios
export const verifyAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];  // Obtener el token
        if (!token) {
            return res.status(401).json({ message: 'No autorizado, se requiere un token.' });
        }

        // Verificación del token y decodificación
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Buscar usuario en la base de datos
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Verificar si el usuario tiene el rol de administrador
        if (!user.roles.includes('admin')) {
            return res.status(403).json({ message: 'Acceso denegado. Se requieren privilegios de administrador.' });
        }

        // Verificar permisos
        const permissions = user.permissions;
        const hasAllPermissions = Object.values(permissions).every(permission => permission === true);

        if (!hasAllPermissions) {
            return res.status(403).json({ message: 'Acceso denegado. Se requieren todos los permisos.' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        next(error);  // Manejo de errores
    }
};

// Controlador para manejar la lógica de admin (ver lista de usuarios)
export const adminUser = async (req, res, next) => {
    try {
        console.log("Ver contenido privado de admin");

        // Obtener todos los usuarios de la base de datos (puedes ajustar esto según tus necesidades)
        const users = await User.find(); // Obtener todos los usuarios
        res.status(200).json({ data: users, message: 'Aquí están tus usuarios' });
    } catch (error) {
        next(error); // Pasar el error al middleware de manejo de errores
    }
};
