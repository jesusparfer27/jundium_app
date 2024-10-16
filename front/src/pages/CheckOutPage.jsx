// CheckOutPage.js
import React, { useState, useEffect } from 'react';
import '../css/pages/checkoutpage.css'; // Importar estilos CSS

export const CheckOutPage = () => {
    // Estado inicial con dos productos
    const [cartItems, setCartItems] = useState([
        { id: 1, name: 'Producto 1', reference: 'REF123', color: 'Rojo', size: 'M', price: 20 },
        { id: 2, name: 'Producto 2', reference: 'REF456', color: 'Azul', size: 'L', price: 30 },
    ]);

    // Estado para almacenar el total
    const [total, setTotal] = useState({
        price: 0,
        verySpenses: 5, // Por ejemplo, un costo fijo de envío
        endingPrice: 0,
    });

    // Estado para expandir secciones de información
    const [expandedSections, setExpandedSections] = useState({});

    // Función para eliminar un producto del carrito
    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    // Calcular el precio total cada vez que cambie el carrito
    useEffect(() => {
        const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
        setTotal({
            price: totalPrice,
            verySpenses: total.verySpenses,
            endingPrice: totalPrice + total.verySpenses,
        });
    }, [cartItems, total.verySpenses]);

    // Función para alternar la expansión de secciones
    const toggleSection = (section) => {
        setExpandedSections(prevSections => ({
            ...prevSections,
            [section]: !prevSections[section],
        }));
    };

    return (
        <section className="checkout-section">
            {/* Div de la izquierda (70% de width) */}
            <div className="columns-right"></div>
            <div className="left-column">
                {/* Información sobre cambios */}
                <div className="infoAboutChanges">
                    <div className="black-box"></div>
                    <div className="white-box">Texto neutro</div>
                </div>

                {/* Vista previa del carrito */}
                <div className="cartPrev">
                    <div>Mi selección: ({cartItems.length})</div>
                    <div>
                        <button className="view-cart-button">Ver carrito</button>
                    </div>
                </div>

                {/* Detalles del carrito */}
                <div className="cartDetails">
                    {cartItems.length === 0 ? (
                        <div>No hay productos en el carrito</div>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                {/* Imagen del producto */}
                                <div className="product-image">
                                    <img src={`https://via.placeholder.com/150`} alt={item.name} />
                                </div>
                                {/* Información del producto */}
                                <div className="infoProductCheckOut">
                                    {/* Referencia y nombre */}
                                    <div className="product-header">
                                        <div className='divCosts'>{item.reference}</div>
                                        <div className='divCosts'>{item.name}</div>
                                    </div>
                                    {/* Color y talla */}
                                    <div className="upperInformation">
                                        <div className="color-size">
                                            <div className='divCosts'>Color:</div>
                                            <div className='divCosts'>{item.color}</div>
                                        </div>
                                        <div className="color-size">
                                            <div className='divCosts'>Talla:</div>
                                            <div className='divCosts'>{item.size}</div>
                                        </div>
                                    </div>
                                    {/* Cantidad y precio */}
                                    <div className="quantity-price">
                                        <div className='divCosts'>
                                            <select>
                                                {[...Array(50)].map((_, i) => (
                                                    <option key={i} value={i + 1}>{i + 1}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className='divCosts'>{item.price} €</div>
                                    </div>
                                    {/* Botones de acción */}
                                    <div className="action-buttons">
                                        <button className="favorites-button" onClick={() => console.log(`Añadir ${item.name} a favoritos`)}>
                                            Añadir a favoritos
                                        </button>
                                        <button className="remove-button" onClick={() => removeItem(item.id)}>
                                            Eliminar del carrito
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Botón para realizar la compra */}
                <div className="checkout-button-container">
                    <button className="checkout-button">Realizar compra</button>
                </div>
            </div>

            {/* Div de la derecha (30% de width) */}
            <div className="columnFlex">
                <div className="right-column">
                    <div className='header-finalBuying'>
                        <div className="totalPrice">
                            <div className='finalPrice-CheckOut'>Subtotal</div>
                            <div className='finalPrice-CheckOut'>{total.price} €</div>
                        </div>
                        <div className="deliverySpendings">
                            <div className='finalPrice-CheckOut'>Envío</div>
                            <div className='finalPrice-CheckOut'>{total.verySpenses} €</div>
                        </div>
                        <div className="finalPriceCheckOut">
                            <div className='finalPrice-CheckOut'>Total</div>
                            <div className='finalPrice-CheckOut'>{total.endingPrice} €</div>
                        </div>
                        <div className="buyingButtonContainer">
                            <button>Comprar</button>
                        </div>
                    </div>
                </div>

                {/* Información adicional */}
                <div className="right-columnInformation">
                    {['pedido', 'envio', 'devolucion', 'atencion'].map((section) => (
                        <div key={section} className="informationToggle">
                            <div className='groupInformation'>
                                <img src={`path_to_image_${section}`} alt={`Información sobre ${section}`} />
                                <div>
                                    <div>{getSectionTitle(section)}</div>
                                    {expandedSections[section] && <p>{getSectionContent(section)}</p>}
                                </div>
                                <button onClick={() => toggleSection(section)}>
                                    {expandedSections[section] ? 'Cerrar' : 'Ver más'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Funciones auxiliares para los títulos y contenidos
const getSectionTitle = (section) => {
    const titles = {
        pedido: 'Cómo funciona el proceso de pedidos',
        envio: 'Envío y tiempos de entrega',
        devolucion: 'Devoluciones y reembolsos',
        atencion: 'Atención al cliente',
    };
    return titles[section];
};

const getSectionContent = (section) => {
    const contents = {
        pedido: 'La plataforma coordina el pedido con la empresa para asegurar que los productos solicitados estén disponibles y se preparen para el envío. Una vez realizado el pedido, recibirás notificaciones sobre el estado del mismo.',
        envio: 'El tiempo de entrega varía según la ubicación del cliente y la disponibilidad del producto en el almacén. Trabajamos con múltiples servicios de envío para garantizar una entrega rápida y eficiente.',
        devolucion: 'Si necesitas devolver un producto, la plataforma facilita el proceso de devolución. Simplemente sigue las instrucciones en nuestra página de devoluciones para iniciar el trámite y recibir un reembolso.',
        atencion: 'Si tienes alguna pregunta o problema con tu pedido, nuestro equipo de atención al cliente está disponible para ayudarte. Puedes contactarnos por correo electrónico, teléfono o chat en vivo.',
    };
    return contents[section];
};
