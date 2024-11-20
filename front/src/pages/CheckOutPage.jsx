import React, { useState, useEffect, useContext, useCallback } from 'react';
import '../css/pages/checkoutpage.css';
import InfoAccordion from '../components/checkout/ComponentCheckOut';
import Modal from '../components/checkout/ComponentCheckOut';
import { HeaderContext } from '../context/HeaderContext';
import { useUser } from '../hooks/useUser';

export const CheckOutPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState({ price: 0, verySpenses: 0, endingPrice: 0 });
    const [expandedSections, setExpandedSections] = useState({});
    const { openMenu } = useContext(HeaderContext);
    const { user } = useUser();
    const { VITE_API_BACKEND, VITE_IMAGES_BASE_URL } = import.meta.env;

    const removeItem = (product_id) => {
        setCartItems(cartItems.filter(item => item.product_id !== product_id));
    };

    const handleQuantityChange = (product_id, newQuantity) => {
        setCartItems(prevCartItems =>
            prevCartItems.map(item =>
                item.product_id === product_id
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const fetchCartItems = useCallback(async () => {
        if (!user) return;
        const token = localStorage.getItem('authToken');

        if (!token) {
            console.error('No se encontró el token de autenticación.');
            return;
        }

        try {
            const response = await fetch(`${VITE_API_BACKEND}/cart`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error en la respuesta del servidor:', errorText);
                throw new Error('Error al obtener los artículos del carrito');
            }

            const data = await response.json();
            if (Array.isArray(data.items)) {
                setCartItems(data.items);
            } else {
                console.error('La respuesta del carrito no contiene un arreglo de artículos:', data);
            }
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
        }
    }, [user, VITE_API_BACKEND]);

    useEffect(() => {
        fetchCartItems();
    }, [fetchCartItems]);

    const calculateTotalPrice = useCallback(() => {
        const totalPrice = cartItems.reduce((sum, item) => {
            const basePrice = item.product_id?.base_price || 0; // Accede a base_price en product_id
            const quantity = item.quantity || 1; // Obtiene la cantidad en item
            return sum + (basePrice * quantity); // Multiplica el precio base por la cantidad y suma
        }, 0);

        setTotal(prevTotal => ({
            ...prevTotal,
            price: totalPrice,
            endingPrice: totalPrice + prevTotal.verySpenses, // Suma los gastos adicionales al precio total
        }));
    }, [cartItems]);

    const addToWishlist = async (productId, variantId) => {
        const token = localStorage.getItem('authToken');

        // Ahora accedemos correctamente al userId del usuario autenticado
        const userId = user?._id;  // Usamos user._id aquí

        console.log("user", user)
        console.log("userId", userId)

        if (!userId || !productId || !variantId) {
            console.error('user_id, product_id y variant_id son requeridos.');
            return;
        }

        if (!token) {
            console.error('No se encontró el token de autenticación.');
            return;
        }

        try {
            const response = await fetch(`${VITE_API_BACKEND}/wishlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ user_id: userId, product_id: productId, variant_id: variantId }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error al agregar a la wishlist:', errorText);
                throw new Error('No se pudo agregar el producto a la wishlist');
            }

            const data = await response.json();
            console.log('Producto agregado a la wishlist:', data);
            alert('Producto añadido a tu lista de deseos');
        } catch (error) {
            console.error('Error al añadir el producto a la wishlist:', error);
            alert('Hubo un error al añadir a tu lista de deseos');
        }
    };



    const toggleSection = (section) => {
        setExpandedSections(prevSections => ({
            ...prevSections,
            [section]: !prevSections[section],
        }));
    };

    const handleOpenModal = () => {
        openMenu('modal');
    };


    return (
        <section className="checkoutSection">
            <div className="left-column">
                <div className="infoAboutChanges">
                    <div className="black-box"></div>
                    <div className="white-box">Texto neutro</div>
                </div>

                <div className="cartPrev">
                    <div>Mi selección: ({cartItems.length})</div>
                    <div>
                        <button className="view-cart-button" onClick={handleOpenModal}>Ver carrito</button>
                    </div>
                </div>

                <div className="cartDetails">
                    {cartItems.map(item => {
                        const { variant_id, product_id, quantity } = item;

                        const name = product_id?.name || "Producto sin nombre";
                        const basePrice = product_id?.base_price || 0;
                        const variants = product_id?.variants || [];

                        const selectedVariant = variants.find(variant => variant.variant_id === variant_id);
                        const imageUrl = selectedVariant?.image ? selectedVariant.image[0] : null;
                        const fullImageUrl = imageUrl ? `${VITE_IMAGES_BASE_URL}${imageUrl}` : null;

                        return (
                            <div key={item._id} className="cart-item">
                                {fullImageUrl ? (
                                    <img src={fullImageUrl} alt={name} />
                                ) : (
                                    <p>Imagen no disponible</p>
                                )}
                                <div className="infoProductCheckOut">
                                    <div className="product-header">
                                        <div className='divCosts'>{product_id?.name || "Nombre no disponible"}</div>
                                    </div>
                                    <div className="upperInformation">
                                        {selectedVariant && (
                                            <p>Color: {selectedVariant.color.colorName}</p>
                                        )}
                                        <div className="color-size">
                                            <div className='divCosts'>Género:</div>
                                            <div className='divCosts'>{product_id?.gender || "Género no disponible"}</div>
                                        </div>
                                    </div>
                                    <div className="quantity-price">
                                        <div className='divCosts'>
                                            <select
                                                value={quantity}
                                                onChange={(e) => handleQuantityChange(product_id, parseInt(e.target.value))}
                                            >
                                                {[...Array(50)].map((_, i) => (
                                                    <option key={i} value={i + 1}>{i + 1}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className='divCosts'>{(basePrice * quantity).toFixed(2)} €</div>
                                    </div>

                                    <div className="action-buttons">
                                        <button
                                            className="favorites-button"
                                            onClick={() => addToWishlist(product_id, variant_id)}
                                        >
                                            Añadir a favoritos
                                        </button>
                                        <button className="remove-button" onClick={() => removeItem(product_id)}>Eliminar del carrito</button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="checkout-button-container">
                    <button className="checkout-button">Continuar</button>
                </div>
            </div>

            <div className="columnFlex">
                <div className="right-column">
                    <div className='header-finalBuying'>
                        <div className="totalPrice">
                            <div className='finalPrice-CheckOut'>Subtotal</div>
                            <div className='finalPrice-CheckOutRight'>{total.price.toFixed(2)} €</div>
                        </div>
                        <div className="deliverySpendings">
                            <div className='finalPrice-CheckOut'>Envío</div>
                            <div className='finalPrice-CheckOutRight'>{total.verySpenses} €</div>
                        </div>
                        <div className="finalPriceCheckOut">
                            <div className='finalPrice-CheckOut'>Total</div>
                            <div className='finalPrice-CheckOutRight'>{total.endingPrice.toFixed(2)} €</div>
                        </div>
                        <div className="buyingButtonContainer">
                            <button className='checkout-button'>Continuar</button>
                        </div>
                    </div>
                </div>

                <div className="right-columnInformation">
                    {['pedido', 'envio', 'devolucion', 'atencion'].map((section, index) => (
                        <div key={`${section}-${index}`} className="informationToggle">
                            <div className='groupInformation'>
                                <div className="iconAccordion">
                                    <span className='Materyal-Symbol-icons'>Delete</span>
                                </div>
                                <div className='accordion-CheckOut'>
                                    <div className='accordion-CheckOut'>{getSectionTitle(section)}</div>
                                    {expandedSections[section] && (
                                        <>
                                            <p>{getSectionContent(section)}</p>
                                            <InfoAccordion section={section} />
                                        </>
                                    )}
                                    <button onClick={() => toggleSection(section)}>
                                        {expandedSections[section] ? 'Cerrar' : 'Ver más'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal />
        </section>
    );
};

const getSectionTitle = (section) => {
    switch (section) {
        case 'pedido': return 'Pedido';
        case 'envio': return 'Envío';
        case 'devolucion': return 'Devolución';
        case 'atencion': return 'Atención al Cliente';
        default: return 'Sección';
    }
};

const getSectionContent = (section) => {
    switch (section) {
        case 'pedido': return 'Información sobre el pedido...';
        case 'envio': return 'Detalles del envío...';
        case 'devolucion': return 'Información sobre la política de devoluciones...';
        case 'atencion': return 'Contacta con Atención al Cliente...';
        default: return '';
    }
};

export default CheckOutPage;
