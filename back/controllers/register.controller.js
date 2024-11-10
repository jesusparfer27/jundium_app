import { connectDB } from '../data/mongodb.js';
import { User } from '../data/mongodb.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // Importa jsonwebtoken para generar el token
import { JWT_SECRET } from '../config/mongo.config.js';


export const registerUser = async (req, res, next) => {
    try {
        const { email, password, first_name, last_name, gender } = req.body;
        console.log("Datos recibidos:", req.body);

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "El usuario ya existe", success: false });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear un nuevo usuario
        const newUser = new User({
            email,
            password: hashedPassword,
            first_name,
            last_name,
            gender
        });

        // Guardar el usuario en la base de datos
        await newUser.save();

        // Generar un token de autenticación con el ID del usuario
        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '24h' });

        // Enviar el token en la respuesta para mantener la sesión abierta
        res.status(201).json({
            message: "Registro completo",
            success: true,
            token // Incluye el token en la respuesta
        });
    } catch (error) {
        console.error("Error al registrar el usuario:", error.stack || error);
        res.status(500).json({ error: error.message });
    }
};
