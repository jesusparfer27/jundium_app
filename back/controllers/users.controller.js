import { connectDB } from '../data/mongodb.js';
import { User } from '../data/mongodb.js';
import bcrypt from 'bcrypt';
import { JWT_SECRET } from '../config/mongo.config.js';
import jwt from 'jsonwebtoken';

// Conectar a la base de datos
connectDB();

// Controlador para obtener todos los usuarios
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({}, { password: 0 }); // Excluir campos sensibles

        // Log de usuarios obtenidos
        console.log("Usuarios obtenidos:", users);

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

export const postUsers = async (req, res, next) => {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
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
            nombre,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            data: { id: newUser._id, nombre: newUser.nombre, email: newUser.email },
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

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
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
            JWT_SECRET, // Asegúrate de tener JWT_SECRET en tu archivo de configuración
            { expiresIn: '1h' }
        );

        res.status(200).json({
            data: user,
            message: "Login correcto",
            token
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

export const getUserById = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).send('Token no proporcionado');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Usa la variable de entorno aquí
        const userId = decoded.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        return res.status(500).send('Error en el servidor');
    }
};

export const getMe = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).send('Token no proporcionado');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        const user = await User.findById(userId, { password: 0 }); // Excluir el campo de la contraseña
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        return res.status(500).send('Error en el servidor');
    }
};