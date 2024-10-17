// src/components/CartContainer.jsx
import React, { useContext, useRef } from 'react';
import { HeaderContext } from '../../context/HeaderContext';
import { useNavigate } from 'react-router-dom';
import '../../css/components/header/cart.css';

const CartContainer = () => {
    const { activeMenu, closeMenu } = useContext(HeaderContext);
    const cartContainerRef = useRef(null);
    const navigate = useNavigate();

    const cartItems = [
        // { id: 1, name: 'Camiseta Básica', price: 19.99, image: 'https://via.placeholder.com/100' },
        // { id: 2, name: 'Pantalón Deportivo', price: 39.99, image: 'https://via.placeholder.com/100' },
        // { id: 3, name: 'Chaqueta de Invierno', price: 59.99, image: 'https://via.placeholder.com/100' },
    ];

    const handleRemoveItem = (id) => {
        console.log(`Eliminando producto con ID: ${id}`);
    };

    const handleCheckout = () => {
        navigate('/check-out');
    };

    return (
        <section ref={cartContainerRef} className={`cartContainer ${activeMenu === 'cart' ? 'active slideIn' : ''}`}>
            {cartItems.length === 0 ? (
                <div className="emptyCart">
                    <div className="emptyCartMessage">
                        <p>No hay elementos en su carrito.</p>
                    </div>
                    <div className="redirectToHome">
                        <button className="emptyCartButton" onClick={() => navigate('/')}>Ir a la tienda</button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="cartHeader">
                        <div className="cartTitle">
                            <p>Mi Carrito</p>
                            <button className="closeContainerCart" onClick={closeMenu}>X</button>
                        </div>
                    </div>

                    <div className="cartItems">
                        {cartItems.map(item => (
                            <div key={item.id} className="cartItem">
                                <div className="cartItemImage">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="cartItemContent">
                                    <p>{item.name}</p>
                                    <p>${item.price.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cartSummary">
                        <p>Mi Selección</p>
                        <p>Total: ${cartItems.reduce((acc, item) => acc + item.price, 0).toFixed(2)}</p>
                    </div>

                    <div className="checkoutButtonContainer">
                        <button className="checkoutButton" onClick={handleCheckout}>Ver detalles</button>
                    </div>
                </>
            )}
        </section>
    );
};

export default CartContainer;
