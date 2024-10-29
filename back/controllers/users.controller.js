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
        // Consultar la base de datos para obtener todos los usuarios
        const users = await User.find({}, {
            // Excluir campos sensibles
            password: 0,
            // Aquí puedes añadir más campos a excluir si es necesario
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

export const postUsers = async (req, res, next) => {
    try {
        const { nombre, email, password } = req.body;

        // Verificar que los campos requeridos estén presentes
        if (!nombre || !email || !password) {
            return res.status(400).json({
                message: "Faltan campos obligatorios",
                success: false
            });
        }

        // Verificar si el usuario ya existe en la base de datos
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "El usuario ya existe",
                success: false
            });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        const newUser = new User({
            nombre,
            email,
            password: hashedPassword
        });

        // Guardar el usuario en la base de datos
        await newUser.save();

        // Enviar la respuesta al cliente
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
        // Buscar al usuario por el correo electrónico
        const { email, password } = req.body;
        console.log("Procesando inicio de sesión");

        // Buscar el usuario en la base de datos
        const user = await User.findOne({ email });
        console.log("Usuario encontrado:", user);

        // Verificar si el usuario existe
        if (!user) {
            return res.status(400).json({
                msg: "Usuario no encontrado",
                success: false,
            });
        }

        // Comparar la contraseña ingresada con la almacenada (hasheada)
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                msg: "Correo electrónico o contraseña incorrectos",
                success: false,
            });
        }

        // Crear y firmar un token
        const token = jwt.sign(
            { email: user.email, id: user._id },  // Puedes incluir otros datos aquí si quieres
            JWT_SECRET, // Asegúrate de tener JWT_SECRET en tu archivo de configuración
            { expiresIn: '1h' }  // El token expira en 1 hora
        );

        // Respuesta exitosa con el token y datos del usuario
        res.status(200).json({
            data: user,
            message: "Login correcto",
            token
        });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({
            msg: "Error en el servidor",
            success: false,
            error: error.message,
        });
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id, { password: 0 });
        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado",
                success: false
            });
        }
        res.status(200).json({
            data: user,
            message: "Usuario obtenido exitosamente",
            success: true
        });
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        res.status(500).json({
            message: "Error en el servidor",
            success: false,
            error: error.message
        });
    }
};