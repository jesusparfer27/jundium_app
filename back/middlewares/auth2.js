// Sin testear...  pero me gusta mas el código.

import jwt from 'jsonwebtoken';

export const generateAuthToken = (user) => {

  // Lee la clave secreta desde las variables de entorno
  // generar con https://generate-secret.vercel.app/32
  const secretKey = process.env.JWT_SECRET;


  // Define el payload del token, incluyendo el ID y el rol del usuario
  const payload = {
    userId: user._id,
    rol: user.rol // Supongamos que el rol del usuario está almacenado en el campo 'role'
  };

  // Genera un token JWT con el payload y la clave secreta
  const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
  return token;
}



export const verifyToken = (req, res, next) => {
  const header = req.header("Authorization") || "";
  const token = header.split(" ")[1];

  const secretKey = process.env.JWT_SECRET;

  if (!token) {
    return res.status(401).json({ message: "Token not provied" });
  }
  try {
    const payload = jwt.verify(token, secretKey);
    req.stuff = payload; // Guardamos el payload en el request
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token not valid" });
  }
}