// src/components/ContactContainer.jsx
import React, { useContext, useRef } from 'react';
import { HeaderContext } from '../../context/HeaderContext';
import '../../css/components/header/header.css';
import '../../css/components/header/closeButton.css'; // Importa los estilos del botón de cierre
import '../../css/components/header/contact.css'

const ContactContainer = () => {
    const { activeMenu, closeMenu } = useContext(HeaderContext);
    const contactContainerRef = useRef(null);

    return (
        <div
            ref={contactContainerRef}
            className={`contactContainer ${activeMenu === 'contact' ? 'active slideInVertical' : ''}`}
        >
            <button className="closeContainer" onClick={closeMenu}>X</button>
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
                    <form className='formInfo'>
                        <input type="text" placeholder="Tu nombre" />
                        <input type="email" placeholder="Tu email" />
                        <textarea placeholder="Tu mensaje"></textarea>
                        <button type="submit">Enviar</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactContainer;
