// src/components/CartContainer.jsx
import React, { useContext, useRef } from 'react';
import { HeaderContext } from '../../context/HeaderContext';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para la redirección
import '../../css/components/header/cart.css';
import '../../css/components/header/closeButton.css'; // Importa los estilos del botón de cierre

const CartContainer = () => {
    const { activeMenu, closeMenu } = useContext(HeaderContext);
    const cartContainerRef = useRef(null);
    const navigate = useNavigate(); // Inicializa el hook useNavigate

    const cartItems = [
        { id: 1, name: 'Camiseta Básica', price: 19.99, image: 'https://via.placeholder.com/100' },
        { id: 2, name: 'Pantalón Deportivo', price: 39.99, image: 'https://via.placeholder.com/100' },
        { id: 3, name: 'Chaqueta de Invierno', price: 59.99, image: 'https://via.placeholder.com/100' },
    ];

    const handleRemoveItem = (id) => {
        console.log(`Eliminando producto con ID: ${id}`);
    };

    const handleCheckout = () => {
        navigate('/check-out'); // Redirige a la ruta /cart
    };

    return (
        <div ref={cartContainerRef} className={`cartContainer ${activeMenu === 'cart' ? 'active slideIn' : ''}`}>
            <button className="closeContainer" onClick={closeMenu}>X</button>
            <h2>Carrito</h2>
            {cartItems.length === 0 ? (
                <p>No hay productos en su carrito.</p>
            ) : (
                <ul>
                    {cartItems.map(item => (
                        <li key={item.id} className="cart-item">
                            <img src={item.image} alt={item.name} />
                            <div>
                                <h3>{item.name}</h3>
                                <p>${item.price.toFixed(2)}</p>
                                <button onClick={() => handleRemoveItem(item.id)}>Eliminar</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <div className="total">
                <h3>Total: ${cartItems.reduce((acc, item) => acc + item.price, 0).toFixed(2)}</h3>
            </div>
            <button className="checkout-button" onClick={handleCheckout}>Realizar la compra</button> {/* Botón de compra */}
        </div>
    );
};

export default CartContainer;
