// CheckOutPage.js
import React, { useState, useEffect, useContext } from 'react';
import '../css/pages/checkoutpage.css'; // Importar estilos CSS
import InfoAccordion from '../components/checkout/ComponentCheckOut'; // Asegúrate de que esta importación sea correcta
import CheckOutComponent from '../components/checkout/ComponentCheckOut'; // Importar el nuevo componente
import Modal from '../components/checkout/ComponentCheckOut';
import { HeaderContext } from '../context/HeaderContext'; // Importa el contexto

export const CheckOutPage = () => {
    const [cartItems, setCartItems] = useState([
        { id: 1, name: 'Producto 1', reference: 'REF123', color: 'Rojo', size: 'M', price: 20 },
        { id: 2, name: 'Producto 2', reference: 'REF456', color: 'Azul', size: 'L', price: 30 },
    ]);

    const [total, setTotal] = useState({
        price: 0,
        verySpenses: 5,
        endingPrice: 0,
    });

    const [expandedSections, setExpandedSections] = useState({});
    const { openMenu } = useContext(HeaderContext); // Accede a openMenu desde el contexto

    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    useEffect(() => {
        const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
        setTotal({
            price: totalPrice,
            verySpenses: total.verySpenses,
            endingPrice: totalPrice + total.verySpenses,
        });
    }, [cartItems, total.verySpenses]);

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
                {/* Información sobre cambios */}
                <div className="infoAboutChanges">
                    <div className="black-box"></div>
                    <div className="white-box">Texto neutro</div>
                </div>

                {/* Vista previa del carrito */}
                <div className="cartPrev">
                    <div>Mi selección: ({cartItems.length})</div>
                    <div>
                        <button className="view-cart-button" onClick={handleOpenModal}>Ver carrito</button>
                    </div>
                </div>

                {/* Detalles del carrito */}
                <div className="cartDetails">
                    {cartItems.length === 0 ? (
                        <div>No hay productos en el carrito</div>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <div className="product-image">
                                    <img src={`https://via.placeholder.com/150`} alt={item.name} />
                                </div>
                                <div className="infoProductCheckOut">
                                    <div className="product-header">
                                        <div className='divCosts'>{item.reference}</div>
                                        <div className='divCosts'>{item.name}</div>
                                    </div>
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
                    <button className="checkout-button">Continuar</button>
                </div>
            </div>

            {/* Div de la derecha (30% de width) */}
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

                {/* Información adicional */}
                <div className="right-columnInformation">
                    {['pedido', 'envio', 'devolucion', 'atencion'].map((section) => (
                        <div key={section} className="informationToggle">
                            <div className='groupInformation'>
                                <div className="iconAccordion">
                                    <span className='Materyal-Symbol-icons'>Delete</span>
                                </div>
                                <div className='accordion-CheckOut'>
                                    <div className='accordion-CheckOut'>{getSectionTitle(section)}</div>
                                    {expandedSections[section] && (
                                        <>
                                            <p>{getSectionContent(section)}</p>
                                            <InfoAccordion section={section} /> {/* Renderiza el componente aquí */}
                                            <CheckOutComponent cartItems={cartItems} /> {/* Renderiza CheckOutComponent */}
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

            {/* Modal para la vista del carrito */}
            <Modal />
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
        pedido: 'La plataforma coordina el pedido con la empresa...',
        envio: 'El tiempo de entrega varía según la ubicación...',
        devolucion: 'Si necesitas devolver un producto...',
        atencion: 'Si tienes alguna pregunta o problema...',
    };
    return contents[section];
};
