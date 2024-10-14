// src/components/ContactContainer.jsx
import React, { useContext, useRef } from 'react';
import { HeaderContext } from '../../context/HeaderContext';
import '../../css/components/header/header.css';
import '../../css/components/header/cart.css'; // Importa los estilos del carrito
import '../../css/components/header/closeButton.css'; // Importa los estilos del botón de cierre

const ContactContainer = () => {
    const { activeMenu, closeMenu } = useContext(HeaderContext);
    const contactContainerRef = useRef(null);

    return (
        <div
            ref={contactContainerRef}
            className={`cartContainer ${activeMenu === 'contact' ? 'active slideInVertical' : ''}`}
        >
            <button className="closeContainer" onClick={closeMenu}>X</button>
            <h2>Contáctenos</h2>
            <p>Teléfono: 123-456-7890</p>
            {/* Puedes agregar un formulario aquí si lo deseas */}
            <form>
                <input type="text" placeholder="Tu nombre" />
                <input type="email" placeholder="Tu email" />
                <textarea placeholder="Tu mensaje"></textarea>
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
};

export default ContactContainer;
