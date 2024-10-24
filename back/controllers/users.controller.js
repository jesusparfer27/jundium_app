import { connectDB } from '../data/mongodb.js';
import { User } from '../data/mongodb.js';

// Conectar a la base de datos
connectDB();

// Controlador para obtener todos los usuarios
export const getUsers = async (req, res, next) => {
    try {
        // Consultar la base de datos para obtener todos los usuarios
        const users = await User.find({}, {
            // Excluir campos sensibles
            password: 0,
            datos_bancarios: 0,
            palabra_de_seguridad: 0
        });

        // Verificar si se encontraron usuarios
        if (users.length === 0) {
            return res.status(404).json({
                message: "No se encontraron usuarios",
                success: false
            });
        }

        // Enviar la lista de usuarios como respuesta
        res.status(200).json({
            data: users,
            message: "Usuarios obtenidos exitosamente",
            success: true
        });
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        res.status(500).json({
            message: "Error en el servidor",
            success: false,
            error: error.message
        });
    }
};
