import React, { useContext, useEffect, useState, useCallback } from 'react';
import { HeaderContext } from '../../context/HeaderContext';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import '../../css/components/header/cart.css';

const CartContainer = () => {
    const { activeMenu, closeMenu } = useContext(HeaderContext);
    const navigate = useNavigate();
    const { VITE_API_BACKEND } = import.meta.env;
    const { user } = useUser();
    const [cartItems, setCartItems] = useState([]);

    const fetchCartItems = useCallback(async () => {
        if (!user) return;

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${VITE_API_BACKEND}/cart`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Error al obtener los artículos del carrito');

            const data = await response.json();

            // Asegúrate de que 'items' existe y es un arreglo
            if (Array.isArray(data.items)) {
                setCartItems(data.items);
            } else {
                console.error('La respuesta del carrito no contiene un arreglo de artículos:', data);
            }
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
        }
    }, [VITE_API_BACKEND, user]);

    useEffect(() => {
        fetchCartItems();
    }, [fetchCartItems]);

    const handleRemoveItem = async (id) => {
        if (!id) {
            console.error('No se puede eliminar un producto sin ID');
            return;
        }

        console.log(`Eliminando producto con ID: ${id}`);

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${VITE_API_BACKEND}/cart/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el producto del carrito');
            }

            setCartItems(prevItems => prevItems.filter(item => item._id !== id));

            console.log(`Producto con ID: ${id} eliminado exitosamente`);
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    };

    const handleCheckout = () => {
        if (!user) {
            alert("Por favor inicia sesión para proceder con la compra.");
            navigate('/login');
            return;
        }
        navigate('/check-out');
    };

    console.log('Productos actualmente en el carrito:', cartItems);

    return (
        <section className={`cartContainer ${activeMenu === 'cart' ? 'active slideIn' : ''}`}>
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
                    {cartItems.map(product => (
    <div key={product._id} className="cartItem">
        <div className="cartItemImage">
            <img src={product.image} alt={product.name} />
        </div>
        <div className="cartItemContent">
            <p>{product.name}</p>
            <p>${(product.base_price || 0).toFixed(2)}</p>
            <p>Cantidad: {product.quantity || 1}</p>
            
            {/* Registro del ID de la variante */}
            {product.variants && product.variants.map(variant => {
                console.log(`ID de variante: ${variant.variant_id}`);
                return null; // Devuelve null ya que no deseas renderizar esto en el DOM
            })}

            <button onClick={() => handleRemoveItem(product._id)}>Eliminar</button>
        </div>
    </div>
))}

                    </div>

                    <div className="cartSummary">
                        <p>Mi Selección</p>
                        <p>Total: ${cartItems.reduce((acc, cartItem) => acc + ((cartItem.base_price || 0) * (cartItem.quantity || 1)), 0).toFixed(2)}</p>
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
