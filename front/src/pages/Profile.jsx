import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as jwt_decode from 'jwt-decode'; // Asegúrate de importar esto
import '../css/pages/profile.css';
import ProfileImage from '../components/profile-header/ProfileHeader';

export const Profile = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
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
    const [token, setToken] = useState(localStorage.getItem('token')); // Estado para el token

    const { VITE_API_BACKEND } = import.meta.env;
    const navigate = useNavigate();

    // useEffect(() => {
    //     // Verifica si hay un token. Si no, redirige a la página de inicio.
    //     if (!token) {
    //         navigate('/'); // Redirige a la página de inicio si no hay token
    //         return; // Detiene la ejecución del resto del código
    //     }

    //     fetchUserData(token); // Pasa el token a la función de obtención de datos del usuario
    // }, [navigate, token]); // Ahora incluye 'token' como dependencia

    const fetchUserData = async (token) => {
        try {
            const token = localStorage.getItem('token');
            console.log("Token en estado:", token); // Agrega este log

            const decodedToken = jwt_decode(token);
            const userId = decodedToken.id;

            const response = await fetch(`${VITE_API_BACKEND}/users/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const userData = await response.json();
                console.log("Datos del usuario:", userData);
                setUserInfo(prevState => ({
                    ...prevState,
                    firstName: userData.first_name || '',
                    lastName: userData.last_name || '',
                    gender: userData.gender || '',
                    country: userData.country || '',
                    birthDate: userData.birthDate || { day: '', month: '', year: '' },
                    contactPreferences: {
                        email: userData.contactPreferences?.email || false,
                        phone: userData.contactPreferences?.phone || false,
                        whatsapp: userData.contactPreferences?.whatsapp || false,
                    },
                }));
            } else {
                console.error("Error al obtener los datos del usuario:", response.statusText);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Elimina el token de localStorage
        setToken(null); // Actualiza el estado del token a null
        navigate('/'); // Redirige a la página de inicio
    };

    const handleUserInfoChange = (e) => {
        const { name, value } = e.target;
    
        // Maneja la actualización de los campos anidados como 'birthDate' y 'contactPreferences'
        if (name.startsWith('birthDate.')) {
            const key = name.split('.')[1]; // Obtiene 'day', 'month' o 'year'
            setUserInfo((prevState) => ({
                ...prevState,
                birthDate: {
                    ...prevState.birthDate,
                    [key]: value,
                },
            }));
        } else if (name.startsWith('contactPreferences.')) {
            const key = name.split('.')[1]; // Obtiene el nombre de la preferencia
            setUserInfo((prevState) => ({
                ...prevState,
                contactPreferences: {
                    ...prevState.contactPreferences,
                    [key]: e.target.checked, // Usamos checked para los checkboxes
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
            <ProfileImage initials="IN" userName={`${userInfo.firstName} ${userInfo.lastName}`} />
            <div className="userProfile">
                <div className="active-user-info">
                    <h2>{`${userInfo.firstName} ${userInfo.lastName}`}</h2>
                </div>
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
                            // onClick={handleAccordionToggle}
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
                        {Object.keys(userInfo.contactPreferences).map((pref) => (
                            <div className="contact-item" key={pref}>
                                <label htmlFor={pref} className="contact-label">
                                    Contactable por {pref}
                                </label>
                                <input
                                    type="checkbox"
                                    name={`contactPreferences.${pref}`}
                                    checked={userInfo.contactPreferences[pref]}
                                    onChange={handleUserInfoChange}
                                />
                            </div>
                        ))}

                    </div>

                    <div className="birth-date">
                        <label>Fecha de nacimiento</label>
                        <div className="date-selectors">
                            <select
                                name="birthDate.day"
                                value={userInfo.birthDate.day}
                                onChange={handleUserInfoChange}
                            >
                                <option value="">Día</option>
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
                                <option value="">Mes</option>
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
                                <option value="">Año</option>
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

                    {/* Botón de cerrar sesión */}
                    <div className="logout-buttonProfile">
                        <button onClick={handleLogout} className="logout-button">Cerrar sesión</button>
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
