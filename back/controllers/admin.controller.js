import { connectDB } from '../data/mongodb.js'
import { Album } from '../data/mongodb.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

connectDB();

export const adminUser = async (req, res, next) => {
    try {
        console.log("Ver contenido privado de admin");
        
        // Supongamos que `users` es una lista de usuarios obtenida de la base de datos
        const users = await getUsersFromDB(); // Esta es una función que debes implementar para obtener usuarios
        
        res.status(200).json({ data: users, message: 'Aquí están tus usuarios' });
    } catch (error) {
        next(error); // Pasar el error al middleware de manejo de errores
    }
};

// En tu archivo de rutas principal (por ejemplo, routes.js o index.js):
// app.get('/API/v1/admin', adminUser);
