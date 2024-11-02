import React, { useContext, useEffect, useState, useCallback } from 'react';
import { HeaderContext } from '../../context/HeaderContext';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import '../../css/components/header/cart.css';


const CartContainer = () => {
    const { activeMenu, closeMenu } = useContext(HeaderContext);
    const navigate = useNavigate();
    const { VITE_API_BACKEND, VITE_IMAGES_BASE_URL } = import.meta.env;
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

    const handleCheckout = () => {
        // Redirige a la página de detalles de compra
        navigate('/checkout');
    };
    


    const handleRemoveItem = async (productId, variantId) => {
        if (!productId || !variantId) {
            console.error('Faltan el ID del producto o de la variante');
            return;
        }
    
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${VITE_API_BACKEND}/cart/${productId}/${variantId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error('Error al eliminar el producto del carrito');
            }
    
            // Elimina el producto del estado local si la eliminación en el backend fue exitosa
            setCartItems(prevItems =>
                prevItems.filter(item => item.product_id._id !== productId || item.variant_id !== variantId)
            );
    
            console.log(`Producto con ID: ${productId} y variante: ${variantId} eliminado del carrito`);
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
        }
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
                        <div className="cartItems">
                        {cartItems.map(item => {
    const { product_id, variant_id, quantity } = item;
    const { name, base_price, variants } = product_id;

    const selectedVariant = variants ? variants.find(variant => variant.variant_id === variant_id) : null;
    const imageUrl = selectedVariant?.image[0];
    const fullImageUrl = imageUrl ? `${VITE_IMAGES_BASE_URL}${imageUrl}` : null;

    return (
        <div key={item._id} className="cartItem">
            <div className="cartItemImage">
                {fullImageUrl ? (
                    <img src={fullImageUrl} alt={name} />
                ) : (
                    <p>Imagen no disponible</p>
                )}
            </div>
            <div className="cartItemContent">
                <p>{name}</p>
                <p>${(base_price || 0).toFixed(2)}</p>
                <p>Cantidad: {quantity || 1}</p>

                {selectedVariant && (
                    <p>Color: {selectedVariant.color.colorName}</p>
                )}

                <button onClick={() => handleRemoveItem(product_id._id, variant_id)}>Eliminar</button>
            </div>
        </div>
    );
})}
                        </div>



                    </div>

                    <div className="cartSummary">
                        <p>Mi Selección</p>
                        <p>Total: ${cartItems.reduce((acc, item) => {
                            const basePrice = item.product_id?.base_price || 0; // Accede a base_price de product_id
                            const quantity = item.quantity || 1; // Accede a la cantidad en item
                            return acc + (basePrice * quantity);
                        }, 0).toFixed(2)}</p>
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
