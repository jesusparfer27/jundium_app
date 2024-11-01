import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/mongo.config.js';

import { debug } from '../tools/utils.js'

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).send('Token no proporcionado'); // Unauthorized

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error("Error al verificar token:", err);
            return res.status(403).send('Token inválido o expirado'); // Forbidden
        }
        req.user = user;
        next();
    });
};
