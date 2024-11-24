import { connectDB } from '../data/mongodb.js';
import { User } from '../data/mongodb.js';
import bcrypt from 'bcrypt';

// Conectar a la base de datos
connectDB();

export const registerUser = async (req, res, next) => {
    try {
        const { email, password, first_name, last_name, gender} = req.body;
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

        // Buscar al usuario guardado para confirmar
        const user = await User.findOne({ email });

        // Crear una respuesta exitosa
        console.log("Usuario registrado exitosamente:", newUser);
        res.status(200).json({
            data: user,
            message: "Registro completo",
            success: true
        });
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        res.status(500).json({ error: error.message });
    }
};