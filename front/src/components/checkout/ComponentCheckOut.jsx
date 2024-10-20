// src/components/Modal.jsx
import React, { useContext } from 'react';
import { HeaderContext } from '../../context/HeaderContext';
import '../../css/components/checkout/checkout_component.css'; // Asegúrate de tener estilos para el modal

const Modal = () => {
    const { activeMenu, closeMenu } = useContext(HeaderContext);

    return (
        <div className={`modal ${activeMenu === 'modal' ? 'active' : ''}`}>
            <button className="closeModal" onClick={closeMenu}>X</button>
            <h2>Información del Modal</h2>
            <p>Aquí va la información que quieres mostrar en el modal.</p>
            {/* Puedes agregar más contenido aquí */}
        </div>
    );
};

export default Modal;
