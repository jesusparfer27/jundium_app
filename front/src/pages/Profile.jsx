import React, { useState, useEffect } from 'react';
import '../css/pages/profile.css';
import ProfileImage from '../components/profile-header/ProfileHeader';

export const Profile = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false); // Estado para controlar el acordeón
    const [userInfo, setUserInfo] = useState({
        gender: '',
        firstName: '',
        lastName: '',
        country: '',
        birthDate: { day: '', month: '', year: '' },
        contactPreferences: {
            email: false,
            phone: false,
            whatsapp: false,
        },
    });

    useEffect(() => {
        const mockWishlist = [
            { id: 1, imageUrl: 'path/to/image1.jpg', name: 'Producto 1', price: '$100' },
            { id: 2, imageUrl: 'path/to/image2.jpg', name: 'Producto 2', price: '$150' },
        ];
        const mockOrders = [
            { id: 3, imageUrl: 'path/to/image3.jpg', name: 'Pedido 1', price: '$200' },
            { id: 4, imageUrl: 'path/to/image4.jpg', name: 'Pedido 2', price: '$250' },
        ];

        setWishlistItems(mockWishlist);
        setOrderItems(mockOrders);
    }, []);

    const handleAccordionToggle = () => {
        setIsAccordionOpen(!isAccordionOpen);
    };

    const handleUserInfoChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes('contactPreferences')) {
            const preference = name.split('.')[1];
            setUserInfo((prevState) => ({
                ...prevState,
                contactPreferences: {
                    ...prevState.contactPreferences,
                    [preference]: checked,
                },
            }));
        } else {
            setUserInfo((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    return (
        <section className="profile-section">
            <ProfileImage initials="IN" userName="Jesus Parfer" />

            <div className="userProfile">
                <div className="profile-info">
                    <div className="headerProfile">Mi perfil:</div>
                    <div className="required-fields">Campos obligatorios</div>
                    <div className="input-group">
                        <div className="input-field">
                            <label>Género</label>
                            <select
                                name="gender"
                                value={userInfo.gender}
                                onChange={handleUserInfoChange}
                            >
                                <option value="">Seleccionar</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                        <div className="input-field">
                            <label>Nombre</label>
                            <input
                                type="text"
                                name="firstName"
                                value={userInfo.firstName}
                                onChange={handleUserInfoChange}
                            />
                        </div>
                        <div className="input-field">
                            <label>Apellido</label>
                            <input
                                type="text"
                                name="lastName"
                                value={userInfo.lastName}
                                onChange={handleUserInfoChange}
                            />
                        </div>
                        <div className="input-field">
                            <label>País</label>
                            <select
                                name="country"
                                value={userInfo.country}
                                onChange={handleUserInfoChange}
                            >
                                <option value="">Seleccionar</option>
                                <option value="México">México</option>
                                <option value="España">España</option>
                                <option value="Argentina">Argentina</option>
                            </select>
                        </div>
                    </div>

                    <div className="accordionProfile">
                        <button
                            className="accordion-buttonLocation"
                            onClick={handleAccordionToggle}
                        >
                            {isAccordionOpen ? 'Ocultar ubicación' : 'Agregar ubicación'}
                        </button>
                        {isAccordionOpen && (
                            <div className="accordion-content">
                                <input type="text" placeholder="Ubicación" />
                            </div>
                        )}
                    </div>

                    <div className="contact-preferences">
                        <div className="contact-item">
                            <label htmlFor="email" className="contact-label">
                                Contactable por email
                            </label>
                            <input
                                type="checkbox"
                                name="contactPreferences.email"
                                checked={userInfo.contactPreferences.email}
                                onChange={handleUserInfoChange}
                            />
                        </div>
                        <div className="contact-item">
                            <label htmlFor="phone" className="contact-label">
                                Contactable por teléfono
                            </label>
                            <input
                                type="checkbox"
                                name="contactPreferences.phone"
                                checked={userInfo.contactPreferences.phone}
                                onChange={handleUserInfoChange}
                            />
                        </div>
                        <div className="contact-item">
                            <label htmlFor="whatsapp" className="contact-label">
                                Contactable vía WhatsApp
                            </label>
                            <input
                                type="checkbox"
                                name="contactPreferences.whatsapp"
                                checked={userInfo.contactPreferences.whatsapp}
                                onChange={handleUserInfoChange}
                            />
                        </div>
                    </div>

                    <div className="birth-date">
                        <label>Fecha de nacimiento</label>
                        <div className="date-selectors">
                            <select
                                name="birthDate.day"
                                value={userInfo.birthDate.day}
                                onChange={handleUserInfoChange}
                            >
                                {[...Array(31)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1}
                                    </option>
                                ))}
                            </select>
                            <select
                                name="birthDate.month"
                                value={userInfo.birthDate.month}
                                onChange={handleUserInfoChange}
                            >
                                {[...Array(12)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1}
                                    </option>
                                ))}
                            </select>
                            <select
                                name="birthDate.year"
                                value={userInfo.birthDate.year}
                                onChange={handleUserInfoChange}
                            >
                                {[...Array(75)].map((_, i) => (
                                    <option key={1950 + i} value={1950 + i}>
                                        {1950 + i}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="submit-buttonProfile">
                        <button>Guardar cambios</button>
                    </div>
                </div>

                <div className="order-wishlist">
                    <div className="background-containerProfile">
                        <div className="separation_div">
                            <div className="headerProfileOrders">Mis pedidos:</div>
                        </div>
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
                            <button
                                className="submit-buttonProfile_Orders_WishList"
                                onClick={() => (window.location.href = '/home')}
                            >
                                Ir a tienda
                            </button>
                        </div>
                    </div>

                    <div className="background-containerProfile">
                        <div className="separation_div">
                            <div className="headerProfileWishList">Mi Wishlist:</div>
                        </div>
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
                            <button
                                className="submit-buttonProfile_Orders_WishList"
                                onClick={() => (window.location.href = '/home')}
                            >
                                Ir a tienda
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
