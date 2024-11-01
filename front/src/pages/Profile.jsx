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
    const { user, loading, error, fetchUserDetails } = useUser();
    const [isUserLoaded, setIsUserLoaded] = useState(false);
    const { VITE_API_BACKEND, VITE_IMAGES_BASE_URL } = import.meta.env;

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('authToken');
            if (!token || user) return; // Si ya hay un usuario, no cargues de nuevo

            try {
                await fetchUserDetails(); // Esto debería establecer el usuario en el contexto
                setIsUserLoaded(true);
            } catch (err) {
                console.error('Error fetching user data:', err);
                openMenu('login');
            }
        };

        loadUser();
    }, [user, fetchUserDetails, openMenu]);

    const handleSaveChanges = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return;
    
        try {
            const response = await fetch(`${VITE_API_BACKEND}/user/update`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user), // Suponiendo que `user` contenga los datos actualizados
            });
            if (!response.ok) throw new Error('Error al guardar los cambios');
    
            const updatedUser = await response.json();
            console.log('Datos de usuario actualizados:', updatedUser);
            // Aquí podrías actualizar el estado del usuario con el nuevo objeto
        } catch (err) {
            console.error('Error al guardar cambios:', err);
        }
    };

    useEffect(() => {
        const fetchWishlistItems = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;
        
            try {
                const response = await fetch(`${VITE_API_BACKEND}/wishlist`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
        
                if (!response.ok) {
                    throw new Error('Error fetching wishlist items');
                }
        
                const data = await response.json();
                // Cambia esta línea para acceder a `wishlist.items`
                setWishlistItems(data.wishlist.items); // Establece los elementos de la wishlist
        
                // Comprobar si no hay elementos en la wishlist
                if (data.wishlist.items.length === 0) {
                    console.warn('No se encontraron artículos en la lista de deseos.'); // Registra una advertencia en la consola
                }
        
                console.log("Datos de la wishlist del usuario logueado:", data.wishlist.items); // Log de los datos recibidos
            } catch (err) {
                console.error('Error al cargar la wishlist:', err);
            }
        };
        
    
        fetchWishlistItems();
    }, [VITE_API_BACKEND]);

    useEffect(() => {
        const fetchOrderItems = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            try {
                const response = await fetch(`${VITE_API_BACKEND}/orders`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                setOrderItems(data); // Establece los elementos de los pedidos
                console.log("Datos de los pedidos del usuario logueado:", data); // Log de los datos recibidos
            } catch (err) {
                console.error('Error al cargar los pedidos:', err);
            }
        };

        fetchOrderItems();
    }, [VITE_API_BACKEND]);

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

    console.log("Usuario logeado:", user); // Para revisar en la consola
    console.log("Nombre del usuario logeado:", user?.first_name); // Agrega este console.log

    const firstVariantImage = wishlistItems[0]?.product_id?.variants[0]?.image[0];

    return (
        <section className="profile-section">
            {loading && <div>Cargando datos del usuario...</div>} {/* Indicador de carga */}
            {error && <div>Error al cargar los datos del usuario: {error.message}</div>} {/* Mensaje de error */}
            <ProfileImage initials="IN" userName={`${user?.first_name || ''} ${user?.last_name || ''}`} />
            <div className="userProfile">
                <div className="active-user-info">
                    <h2>{`${user?.first_name || ''} ${user?.last_name || ''}`}</h2>
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
                                value={user?.first_name || ''}
                                onChange={handleUserInfoChange}
                            />
                        </div>
                        <div className="input-field">
                            <label>Apellido</label>
                            <input
                                type="text"
                                name="lastName"
                                value={user?.last_name || ''}
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
                    <button onClick={handleSaveChanges}>Guardar cambios</button>
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
                            <div className="orders-list">
                                {orderItems.map((order) => (
                                    <div key={order.id} className="order-item">
                                        <p>Pedido ID: {order.id}</p>
                                        <p>Fecha: {new Date(order.date).toLocaleDateString()}</p>
                                        <p>Total: ${order.total}</p>
                                    </div>
                                ))}
                            </div>
                    </div>

                    {/* Wishlist */}
                    <div className="background-containerProfile">
                        <div className="separation_div">
                            <div className="headerProfileWishlist">Lista de deseos:</div>
                        </div>
                        {wishlistItems.length > 0 ? (
    <div className="wishlist-list">
        {wishlistItems.map((item) => (
            <div key={item._id} className="wishlist-item">
                <img 
                        src={`${VITE_IMAGES_BASE_URL}${firstVariantImage}`} 
                        alt={wishlistItems[0].product_id.name} 
                    />
                <p>Artículo: {item.product_id.name}</p>
                <p>Precio: ${item.product_id.base_price}</p>
            </div>
        ))}
    </div>
) : (
    <p>No hay artículos en la lista de deseos.</p>
)}

                    </div>
                </div>
            </div>
        </section>
    );
};

export default Profile;
