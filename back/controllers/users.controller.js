import { connectDB } from '../data/mongodb.js';
import { User } from '../data/mongodb.js';
import bcrypt from 'bcrypt';
import { JWT_SECRET } from '../config/mongo.config.js';
import jwt from 'jsonwebtoken';

// Conectar a la base de datos
connectDB();

// Controlador para obtener todos los usuarios
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }); // Excluir campos sensibles
        if (users.length === 0) {
            return res.status(404).json({
                message: "No se encontraron usuarios",
                success: false
            });
        }

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

// Controlador para registrar un usuario
export const postUsers = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body; // Cambiado aquí

        if (!first_name || !last_name || !email || !password) { // Cambiado aquí
            return res.status(400).json({
                message: "Faltan campos obligatorios",
                success: false
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "El usuario ya existe",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            first_name, // Asegúrate de que estás utilizando el nombre correcto
            last_name,  // Añade también last_name aquí
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            data: { id: newUser._id, first_name: newUser.first_name, last_name: newUser.last_name, email: newUser.email },
            message: "Usuario creado exitosamente",
            success: true
        });
    } catch (error) {
        console.error("Error al crear el usuario:", error);
        res.status(500).json({
            message: "Error en el servidor",
            success: false,
            error: error.message
        });
    }
};


// Controlador para iniciar sesión
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Por favor, proporciona email y contraseña.",
                success: false,
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado",
                success: false,
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Correo electrónico o contraseña incorrectos",
                success: false,
            });
        }

        const token = jwt.sign(
            { email: user.email, id: user._id },
            JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(200).json({
            data: {
                id: user._id,
                email: user.email,
                first_name: user.first_name
            },
            message: "Login correcto",
            success: true,
            token,
        });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({
            message: "Error en el servidor",
            success: false,
            error: error.message,
        });
    }
};

// Controlador para obtener un usuario por ID
export const getUserById = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado', success: false });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        const user = await User.findById(userId, { password: 0 });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado', success: false });
        }

        return res.status(200).json({
            data: user,
            message: "Usuario obtenido correctamente",
            success: true
        });
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        return res.status(500).json({
            message: 'Error en el servidor',
            success: false,
            error: error.message
        });
    }
};

// Controlador para obtener los detalles del usuario actual
export const getMe = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado', success: false });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        const user = await User.findById(userId, { password: 0 });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado', success: false });
        }

        return res.status(200).json({
            data: user,
            message: "Usuario actual obtenido correctamente",
            success: true
        });
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        return res.status(500).json({
            message: 'Error en el servidor',
            success: false,
            error: error.message
        });
    }
};
