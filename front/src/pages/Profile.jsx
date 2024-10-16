import React, { useState, useEffect } from 'react';
import '../css/pages/profile.css';

export const Profile = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [orderItems, setOrderItems] = useState([]);

    // Simulación de la obtención de datos mediante fetch
    useEffect(() => {
        const mockWishlist = [
            { id: 1, imageUrl: 'path/to/image1.jpg', name: 'Producto 1', price: '$100' },
            { id: 2, imageUrl: 'path/to/image2.jpg', name: 'Producto 2', price: '$150' }
        ];
        const mockOrders = [
            { id: 3, imageUrl: 'path/to/image3.jpg', name: 'Pedido 1', price: '$200' },
            { id: 4, imageUrl: 'path/to/image4.jpg', name: 'Pedido 2', price: '$250' }
        ];

        setWishlistItems(mockWishlist);
        setOrderItems(mockOrders);
    }, []);

    return (
        <section className="profile-section">
            {/* Imagen de perfil */}
            <div className="profile-image">
                <div className="profile-initials">IN</div>
            </div>

            <div className="userProfile">
                {/* Información del perfil */}
                <div className="profile-info">
                    <div className="headerProfile">Mi perfil:</div>
                    <div className="required-fields">Campos obligatorios</div>
                    <div className="input-group">
                        <div className="input-field">
                            <label>Género</label>
                            <select>
                                <option>Masculino</option>
                                <option>Femenino</option>
                                <option>Otro</option>
                            </select>
                        </div>
                        <div className="input-field">
                            <label>Nombre</label>
                            <input type="text" />
                        </div>
                        <div className="input-field">
                            <label>Apellido</label>
                            <input type="text" />
                        </div>
                        <div className="input-field">
                            <label>País</label>
                            <select>
                                <option>México</option>
                                <option>España</option>
                                <option>Argentina</option>
                            </select>
                        </div>
                    </div>

                    {/* Acordeón para ubicación */}
                    <div className="accordionProfile">
                        <button className="accordion-button">Agregar ubicación</button>
                        <div className="accordion-content">
                            <input type="text" placeholder="Ubicación" />
                        </div>
                    </div>

                    {/* Preferencias de contacto */}
                    <div className="contact-preferences">
                        <div className="contact-item">
                            <label htmlFor="email" className="contact-label">Contactable por email</label>
                            <input type="checkbox" id="email" className="contact-checkbox" />
                        </div>
                        <div className="contact-item">
                            <label htmlFor="telefono" className="contact-label">Contactable por teléfono</label>
                            <input type="checkbox" id="telefono" className="contact-checkbox" />
                        </div>
                        <div className="contact-item">
                            <label htmlFor="whatsapp" className="contact-label">Contactable vía WhatsApp</label>
                            <input type="checkbox" id="whatsapp" className="contact-checkbox" />
                        </div>
                    </div>

                    {/* Fecha de nacimiento */}
                    <div className="birth-date">
                        <label>Fecha de nacimiento</label>
                        <div className="date-selectors">
                            <select>
                                {[...Array(31)].map((_, i) => (
                                    <option key={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                            <select>
                                {[...Array(12)].map((_, i) => (
                                    <option key={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                            <select>
                                {[...Array(75)].map((_, i) => (
                                    <option key={1950 + i}>{1950 + i}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Botón para enviar */}
                    <div className="submit-buttonProfile">
                        <button>Guardar cambios</button>
                    </div>
                </div>

                {/* Wishlist y pedidos */}
                <div className="order-wishlist">
                    {/* Sección de pedidos */}
                    <div className="background-containerProfile">
                        <div className="headerProfile">Mis pedidos:</div>
                        {orderItems.length > 0 ? (
                            <div className="orders-list">
                                {orderItems.map(order => (
                                    <div key={order.id} className="order-item">
                                        <div className="order-image">
                                            <img src={order.imageUrl} alt={order.name} />
                                        </div>
                                        <div className="order-name">{order.name}</div>
                                        <div className="order-price">{order.price}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-orders">Aún no hay pedidos disponibles</div>
                        )}
                        <div className="go-to-store">
                            <button onClick={() => window.location.href = '/home'}>Ir a tienda</button>
                        </div>
                    </div>

                    {/* Sección de Wishlist */}
                    <div className="background-containerProfile">
                        <div className="headerProfile">Mi Wishlist:</div>
                        {wishlistItems.length > 0 ? (
                            <div className="wishlist-list">
                                {wishlistItems.map(item => (
                                    <div key={item.id} className="wishlist-item">
                                        <div className="wishlist-image">
                                            <img src={item.imageUrl} alt={item.name} />
                                        </div>
                                        <div className="wishlist-name">{item.name}</div>
                                        <div className="wishlist-price">{item.price}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-wishlist">No hay artículos disponibles</div>
                        )}
                        <div className="go-to-store">
                            <button onClick={() => window.location.href = '/home'}>Ir a tienda</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
