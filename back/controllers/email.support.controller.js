import { SupportEmail } from '../data/mongodb.js'; // Ajusta el path según tu estructura

// Enviar un correo de soporte
export const sendSupportEmail = async (req, res, next) => {
    try {
        const { user_id, name, email, content } = req.body;

        if (!user_id || !email || !content || !name) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        const newSupportEmail = new SupportEmail({
            user_id,
            first_name: name,
            user_email: email,
            content
        });

        const savedEmail = await newSupportEmail.save();
        res.status(201).json({ message: 'Correo enviado correctamente', data: savedEmail });
    } catch (error) {
        next(error);
    }
};

