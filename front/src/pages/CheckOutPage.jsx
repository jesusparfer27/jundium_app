// CheckOutPage.js
import React, { useState } from 'react';
import '../css/pages/checkoutpage.css'; // Importar estilos CSS

export const CheckOutPage = () => {
    // Estado inicial con dos productos
    const [cartItems, setCartItems] = useState([
        { id: 1, name: 'Producto 1', reference: 'REF123', color: 'Rojo', size: 'M', price: 20 },
        { id: 2, name: 'Producto 2', reference: 'REF456', color: 'Azul', size: 'L', price: 30 },
    ]);

    // Función para eliminar un producto del carrito
    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    return (
        <section className="checkout-section">
            {/* Div de la izquierda (70% de width) */}
            <div className="left-column">
                {/* Primer div: infoAboutChanges */}
                <div className="infoAboutChanges">
                    <div className="black-box"></div>
                    <div className="white-box">Texto neutro</div>
                </div>

                {/* Segundo div: cartPrev */}
                <div className="cartPrev">
                    <div>Mi selección: ({cartItems.length})</div>
                    <div>
                        <button className="view-cart-button">Ver carrito</button>
                    </div>
                </div>

                {/* Tercer div: cartDetails */}
                <div className="cartDetails">
                    {cartItems.length === 0 ? (
                        <div>No hay productos en el carrito</div>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                {/* Imagen del producto (izquierda) */}
                                <div className="product-image">
                                    <img src={`https://via.placeholder.com/150`} alt={item.name} />
                                </div>
                                {/* Información del producto (derecha) */}
                                <div className="infoProductCheckOut">
                                    {/* Primer div: referencia y nombre */}
                                    <div className="product-header">
                                        <div>{item.reference}</div>
                                        <div>{item.name}</div>
                                    </div>

                                    {/* Segundo div: color y talla */}
                                    <div className="upperInformation">
                                        <div className="color-size">
                                            <div>Color:</div>
                                            <div>{item.color}</div>
                                        </div>
                                        <div className="color-size">
                                            <div>Talla:</div>
                                            <div>{item.size}</div>
                                        </div>
                                    </div>

                                    {/* Tercer div: cantidad y precio */}
                                    <div className="quantity-price">
                                        <div>
                                            <select>
                                                {[...Array(50)].map((_, i) => (
                                                    <option key={i} value={i + 1}>{i + 1}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>{item.price} €</div>
                                    </div>

                                    {/* Cuarto div: botones */}
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
            <div className="right-column">
                {/* Aquí puedes agregar contenido adicional */}
            </div>
        </section>
    );
};
