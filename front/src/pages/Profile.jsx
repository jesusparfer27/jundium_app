import React, { useEffect, useState, useContext, useCallback } from 'react';
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
    const { user, loading, error} = useUser();
    const { VITE_API_BACKEND, VITE_IMAGES_BASE_URL } = import.meta.env;
    const [isFetching, setIsFetching] = useState(false);


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
 const fetchWishlistItems = useCallback(async () => {
    if (!user || isFetching) return; // Si ya estamos en proceso de obtener datos, no hacer otra petición
 
    setIsFetching(true);
 
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${VITE_API_BACKEND}/wishlist`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Error fetching wishlist items');

        const data = await response.json();
        if (Array.isArray(data.items)) {
            setWishlistItems(data.items);
        } else {
            console.error('La respuesta de wishlist no contiene un arreglo de artículos:', data);
        }
    } catch (error) {
        console.error('Error al obtener la wishlist:', error);
    } finally {
        setIsFetching(false); // Esto se ejecuta siempre, independientemente de si hubo error o no
    }
}, [VITE_API_BACKEND, user, isFetching]);
    
    useEffect(() => {
        fetchWishlistItems();
    }, [fetchWishlistItems]);

    const handleNavigateToWishlist = () => {
        navigate('/wish-list');
    };

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

    return (
        <section className="profile-section">
            {loading && <div>Cargando datos del usuario...</div>} {/* Indicador de carga */}
            {error && <div>Error al cargar los datos del usuario: {error.message}</div>} {/* Mensaje de error */}
            <ProfileImage initials="IN" userName={`${user?.first_name || ''} ${user?.last_name || ''}`} />
            <div className="userProfile">
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
    <>
        <div className="accordion-content active">
            <label htmlFor="location">Guarda tu ubicación</label>
            <input
                type="text"
                id="location"
                name="location"
                placeholder="Ingresa tu dirección"
                value={user?.location || ''}
                onChange={handleUserInfoChange}
            />
        </div>

        <div className="accordion-content active">
            <input
                type="text"
                id="postalCode"
                name="postalCode"
                placeholder="Ingresa tu código postal"
                value={user?.postalCode || ''}
                onChange={handleUserInfoChange}
            />
        </div>
    </>
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
                                onChange={handleUserInfoChange}
                            />
                        </div>
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
                            {orderItems.map((item) => (
                                <div key={item.id} className="order-item">
                                    <p>Pedido ID: {item.id}</p>
                                    <p>Fecha: {new Date(item.date).toLocaleDateString()}</p>
                                    <p>Total: ${item.total}</p>
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
                                {wishlistItems.map((item) => {
                                    // Deconstrucción de propiedades
                                    const { product_id, variant_id } = item;
                                    const { name, base_price } = product_id || {};

                                    const variants = product_id?.variants || [];


                                    const selectedVariant = variants.find(variant => variant.variant_id === variant_id);
                                    const imageUrl = selectedVariant?.image ? selectedVariant.image[0] : null;
                                    const fullImageUrl = imageUrl ? `${VITE_IMAGES_BASE_URL}${imageUrl}` : null; // Asegúrate de manejar el caso donde no hay variantes

                                    return (
                                        <div key={item._id} className="wishlist-item">
                                            {fullImageUrl ? (
                                                <img
                                                    src={`${fullImageUrl}`}
                                                    alt={name}
                                                />
                                            ) : (
                                                <p>Imagen no disponible</p>
                                            )}
                                            <p>Artículo: {name}</p>
                                            <p>Precio: ${base_price}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p>No hay artículos en la lista de deseos.</p>
                        )}


                        {/* Botón "Ver más..." */}
                        {wishlistItems.length > 0 && (
                            <div className="view-more-button">
                                <button onClick={handleNavigateToWishlist}>Ver más...</button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </section>
    );
};

export default Profile;
