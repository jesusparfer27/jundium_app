import { connectDB } from '../data/mongodb.js';
import { User } from '../data/mongodb.js';
import jwt from 'jsonwebtoken';

connectDB();

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

        // Verificar permisos
        const permissions = user.permissions;

        // Verificación más flexible de permisos
        const requiredPermissions = ['manage_users', 'view_reports', 'manage_products', 'manage_orders'];
        const hasRequiredPermissions = requiredPermissions.every(permission => permissions[permission]);

        if (!hasRequiredPermissions) {
            return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos administrativos.' });
        }


        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        next(error);  // Manejo de errores
    }
};

export const adminUser = async (req, res, next) => {
    try {
        console.log("Ver contenido privado de admin");

        // Obtener el usuario desde la petición (debe haber sido agregado por el middleware verifyAdmin)
        const user = req.user;

        // Obtener los permisos del usuario (esto depende de cómo estés guardando los permisos en el modelo User)
        const userPermissions = user.permissions || {
            manage_orders: true,
            manage_products: true,
            manage_users: true,
            view_reports: true,
        };

        // Verificar si el usuario tiene todos los permisos necesarios (puedes ajustar esta lógica según tus necesidades)
        const requiredPermissions = ['manage_users', 'view_reports', 'manage_products', 'manage_orders'];
        const hasRequiredPermissions = requiredPermissions.every(permission => userPermissions[permission]);

        // Si no tiene los permisos adecuados, devolver un error 403
        if (!hasRequiredPermissions) {
            return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos administrativos.' });
        }

        // Obtener los datos de los usuarios o cualquier otra información que desees
        const users = await User.find();  // Ejemplo: obtener todos los usuarios

        // Responder con los permisos y los datos que se necesitan
        res.status(200).json({
            permissions: userPermissions,
            data: users,  // Puedes modificar esto para devolver la información que necesites
            message: 'Datos del administrador y permisos obtenidos con éxito.',
        });

    } catch (error) {
        console.error("Error en adminUser:", error);  // Imprimir detalles del error
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
