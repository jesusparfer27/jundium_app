import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/mongo.config.js';

import { debug } from '../tools/utils.js'

export const authenticateToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    debug.magenta(authHeader);

    // string= "Bearer 373652671shhdgtwdg8y87fy2..."
    // const array = string.split('');
    // array[0] = "Bearer";
    // array[1] = "373652671shhdgtwdg8y87fy2...""

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401); //Unhautorized

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user;
        next()
        // si la llave es correcta
    });
};