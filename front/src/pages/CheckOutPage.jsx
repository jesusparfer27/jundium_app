import React, { useState, useEffect, useContext, useCallback } from 'react';
import '../css/pages/checkoutpage.css'; // Importar estilos CSS
import InfoAccordion from '../components/checkout/ComponentCheckOut'; // Asegúrate de que esta importación sea correcta
import Modal from '../components/checkout/ComponentCheckOut';
import { HeaderContext } from '../context/HeaderContext';
import { useUser } from '../hooks/useUser'; // Importa el hook para obtener el usuario

export const CheckOutPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState({ price: 0, verySpenses: 0, endingPrice: 0 });
    const [expandedSections, setExpandedSections] = useState({});
    const { openMenu } = useContext(HeaderContext);
    const { user } = useUser(); // Obtiene el usuario para la autenticación
    const { VITE_API_BACKEND, VITE_IMAGES_BASE_URL } = import.meta.env;

    const removeItem = (product_id) => {
        setCartItems(cartItems.filter(item => item.product_id !== product_id)); // Cambia 'id' por 'product_id'
    };

    const fetchCartItems = useCallback(async () => {
        if (!user) return; // Si no hay usuario, no hacemos la solicitud

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
                const errorText = await response.text(); // Intenta obtener más detalles sobre el error
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
        fetchCartItems(); // Llama a la función para obtener los productos en el carrito
    }, [fetchCartItems]);

    useEffect(() => {
        const totalPrice = cartItems.reduce((sum, item) => sum + item.base_price * (item.quantity || 1), 0); // Cambiado para usar base_price
        setTotal({
            price: totalPrice,
            verySpenses: total.verySpenses || 0,
            endingPrice: totalPrice + (total.verySpenses || 0),
        });
    }, [cartItems]);

    const toggleSection = (section) => {
        setExpandedSections(prevSections => ({
            ...prevSections,
            [section]: !prevSections[section],
        }));
    };

    const handleOpenModal = () => {
        openMenu('modal'); // Abre el modal
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

                        // Encuentra la variante seleccionada
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
                                        <div className='divCosts'>{name || "Nombre no disponible"}</div>
                                    </div>
                                    <div className="upperInformation">
                                        <div className="color-size">
                                            <div className='divCosts'>Descripción:</div>
                                            <div className='divCosts'>{product_id?.description || "Descripción no disponible"}</div>
                                        </div>
                                        <div className="color-size">
                                            <div className='divCosts'>Colección:</div>
                                            <div className='divCosts'>{product_id?.collection || "Colección no disponible"}</div>
                                        </div>
                                        <div className="color-size">
                                            <div className='divCosts'>Marca:</div>
                                            <div className='divCosts'>{product_id?.brand || "Marca no disponible"}</div>
                                        </div>
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
                                            <select value={quantity} onChange={(e) => console.log(`Actualizar cantidad de ${name} a ${e.target.value}`)}>
                                                {[...Array(50)].map((_, i) => (
                                                    <option key={i} value={i + 1}>{i + 1}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className='divCosts'>{basePrice} €</div>
                                    </div>
                                    <div className="action-buttons">
                                        <button className="favorites-button" onClick={() => console.log(`Añadir ${name} a favoritos`)}>Añadir a favoritos</button>
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
                            <div className='finalPrice-CheckOutRight'>{total.price} €</div>
                        </div>
                        <div className="deliverySpendings">
                            <div className='finalPrice-CheckOut'>Envío</div>
                            <div className='finalPrice-CheckOutRight'>{total.verySpenses} €</div>
                        </div>
                        <div className="finalPriceCheckOut">
                            <div className='finalPrice-CheckOut'>Total</div>
                            <div className='finalPrice-CheckOutRight'>{total.endingPrice} €</div>
                        </div>
                        <div className="buyingButtonContainer">
                            <button>Continuar</button>
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

            <Modal /> {/* Modal para visualizar el carrito */}
        </section>
    );
};

// Funciones auxiliares para manejar títulos y contenido de la sección
const getSectionTitle = (section) => {
    switch (section) {
        case 'pedido': return 'Información de pedido';
        case 'envio': return 'Información de envío';
        case 'devolucion': return 'Política de devolución';
        case 'atencion': return 'Atención al cliente';
        default: return '';
    }
};

const getSectionContent = (section) => {
    switch (section) {
        case 'pedido': return 'Detalles de su pedido...';
        case 'envio': return 'Detalles del envío...';
        case 'devolucion': return 'Detalles de la devolución...';
        case 'atencion': return 'Detalles de atención al cliente...';
        default: return '';
    }
};

export default CheckOutPage;
