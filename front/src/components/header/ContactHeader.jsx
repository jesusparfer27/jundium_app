// src/components/ContactContainer.jsx
import React, { useContext, useRef, useState } from 'react';
import  { useUser } from '../../hooks/useUser'
import { HeaderContext } from '../../context/HeaderContext';
import '../../css/components/header/header.css';
import '../../css/components/header/closeButton.css'; // Importa los estilos del botón de cierre
import '../../css/components/header/contact.css'

const ContactContainer = () => {
    const { activeMenu, closeMenu } = useContext(HeaderContext);
    const contactContainerRef = useRef(null);
    const { VITE_API_BACKEND } = import.meta.env
    
    const { user } = useUser()
    console.log(user)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        content: ''
    });
    const [statusMessage, setStatusMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setStatusMessage('Usuario no autenticado.');
            return;
        }
    
        try {
            const token = localStorage.getItem('authToken');
    
            const response = await fetch(`${VITE_API_BACKEND}/support/email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    user_id: user,
                    name: formData.name, // Ajustado a first_name
                    email: formData.email,    // user_email en el schema
                    content: formData.content
                })
            });
            console.log(formData)
    
            if (response.ok) {
                setStatusMessage('Tu mensaje se envió correctamente.');
                setFormData({ name: '', email: '', content: '' });
            } else {
                const errorData = await response.json();
                setStatusMessage(`Error al enviar mensaje: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error al enviar la solicitud:', error);
            setStatusMessage('Hubo un error al enviar tu mensaje. Inténtalo más tarde.');
        }
    };

    return (
        <div
            ref={contactContainerRef}
            className={`contactContainer ${activeMenu === 'contact' ? 'active slideInVertical' : ''}`}
        >
            <button className="closeContainer" onClick={closeMenu}><span className="material-symbols-outlined">
                close
            </span></button>
            <h2>Contáctenos</h2>
            <div className="headerContactContainer">
                <div className='borderContact'>
                    <div className="contactList">
                        <div className="contactItem">
                            <span className="material-symbols-outlined">phone</span>
                            <a href="tel:1234567890">Teléfono: 123-456-7890</a>
                        </div>
                        <div className="contactItem">
                            <span className="material-symbols-outlined">email</span>
                            <a href="mailto:example@example.com">Email: example@example.com</a>
                        </div>
                        <div className="contactItem">
                            <span className="material-symbols-outlined">location_on</span>
                            <a href="#">Dirección: Calle Ejemplo, Ciudad</a>
                        </div>
                    </div>
                </div>
                <div className="formContainer">
                    <h1>Mandanos un Email</h1>
                    <form className='formInfo' onSubmit={handleSubmit}>
                    <input
                            type="text"
                            name="name"
                            placeholder="Tu nombre"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Tu email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <textarea
                        name="content" // Añade el atributo name
                        placeholder="Tu mensaje"
                        value={formData.content}
                        onChange={handleChange}
                        required></textarea>
                        <button type="submit" onClick={handleSubmit}>Enviar</button>
                    </form>
                    {statusMessage && <p className="statusMessage">{statusMessage}</p>}
                </div>
            </div>
        </div>
    );
};

export default ContactContainer;
