import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/pages/profile.css';
import ProfileImage from '../components/profile-header/ProfileHeader';
import { HeaderContext } from '../context/HeaderContext';
import { useUser } from '../hooks/useUser';

export const Profile = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const { openMenu } = useContext(HeaderContext);
    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');
    const { user, loading, error, fetchUserDetails } = useUser();

    useEffect(() => {
        const loadUser = async () => {
            await fetchUserDetails(); // Carga los datos del usuario
        };

        loadUser();
    }, [fetchUserDetails]);

    useEffect(() => {
        if (token) {
            console.log("Token encontrado:", token);
        } else {
            console.log("No hay token en localStorage.");
        }
    }, [token]);

    useEffect(() => {
        if (error) {
            console.error('Error fetching user data:', error);
            openMenu('login');
        }
    }, [error, openMenu]);

    const handleUserInfoChange = (e) => {
        const { name, value, checked } = e.target;

        if (name.startsWith('birthDate.') || name.startsWith('contactPreferences.')) {
            const [section, key] = name.split('.');
            user[section] = {
                ...user[section],
                [key]: section === 'birthDate' ? value : checked,
            };
        } else {
            user[name] = value;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        console.log("Sesión eliminada correctamente de localStorage.");
        navigate('/');
    };

    return (
        <section className="profile-section">
            {loading && <div>Cargando datos del usuario...</div>} {/* Indicador de carga */}
            {error && <div>Error al cargar los datos del usuario: {error.message}</div>} {/* Mensaje de error */}
            <ProfileImage initials="IN" userName={`${user?.firstName || ''} ${user?.lastName || ''}`} />
            <div className="userProfile">
                <div className="active-user-info">
                    <h2>{`${user?.firstName || ''} ${user?.lastName || ''}`}</h2>
                </div>
                <div className="profile-info">
                    <div className="headerProfile">Mi perfil:</div>
                    <div className="required-fields">Campos obligatorios</div>
                    <div className="input-group">
                        <div className="input-field">
                            <label>Género</label>
                            <select
                                name="gender"
                                value={user?.gender || ''}
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
                                value={user?.firstName || ''}
                                onChange={handleUserInfoChange}
                            />
                        </div>
                        <div className="input-field">
                            <label>Apellido</label>
                            <input
                                type="text"
                                name="lastName"
                                value={user?.lastName || ''}
                                onChange={handleUserInfoChange}
                            />
                        </div>
                        <div className="input-field">
                            <label>País</label>
                            <select
                                name="country"
                                value={user?.country || ''}
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
                            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
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
                        {user?.contactPreferences && Object.keys(user.contactPreferences).map((pref) => (
                            <div className="contact-item" key={pref}>
                                <label htmlFor={pref} className="contact-label">
                                    Contactable por {pref}
                                </label>
                                <input
                                    type="checkbox"
                                    name={`contactPreferences.${pref}`}
                                    checked={user.contactPreferences[pref] || false}
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
                                value={user?.birthDate?.day || ''}
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
                                value={user?.birthDate?.month || ''}
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
                                value={user?.birthDate?.year || ''}
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

                    <div className="logout-buttonProfile">
                        <button onClick={handleLogout} className="logout-button">Cerrar sesión</button>
                    </div>
                </div>

                <div className="order-wishlist">
                    {/* Orders */}
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
                                onClick={() => navigate('/home')}
                            >
                                Ir a tienda
                            </button>
                        </div>
                    </div>

                    {/* Wishlist */}
                    <div className="background-containerProfile">
                        <div className="separation_div">
                            <div className="headerProfileOrders">Lista de deseos:</div>
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
                            <div className="no-wishlist">Aún no hay elementos en la lista de deseos</div>
                        )}
                        <div className="go-to-store">
                            <button
                                className="submit-buttonProfile_Orders_WishList"
                                onClick={() => navigate('/home')}
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
