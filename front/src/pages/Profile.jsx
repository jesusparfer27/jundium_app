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
    const { user, setUser, loading, error, fetchUserDetails } = useUser();
    const [isUserLoaded, setIsUserLoaded] = useState(false);
    const { VITE_API_BACKEND, VITE_IMAGES_BASE_URL } = import.meta.env;
    const [isDirty, setIsDirty] = useState(false); // Nueva variable para controlar cambios
    const [saveStatus, setSaveStatus] = useState(null);

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

    const fetchWishlistItems = useCallback(async () => {
        if (!user) return;

        try {
            const token = localStorage.getItem('authToken');
            console.log("Token del usuario logueado:", token);

            const response = await fetch(`${VITE_API_BACKEND}/wishlist`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error fetching wishlist items');
            }

            const data = await response.json();
            console.log("esto es data:", data); // Verifica la estructura de la respuesta

            // Asegúrate de que 'wishlist' y 'items' existen y 'items' es un arreglo
            if (Array.isArray(data.items)) {
                setWishlistItems(data.items);
            } else {
                console.error('La respuesta de wishlist no contiene un arreglo de artículos:', data);
            }
        } catch (error) {
            console.error('Error al obtener la wishlist:', error);
        }
    }, [VITE_API_BACKEND, user]);

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
        const { name, value, checked, type } = e.target;
        setIsDirty(true); // Marca como "sucio" al modificar
        
        // Log del cambio en el input
        console.log(`Cambio en el campo: ${name} -> Valor: ${type === 'checkbox' ? checked : value}`);
    
        setUser((prevUser) => {
            if (type === 'checkbox') {
                const [parent, child] = name.split('.');  // Para manejar propiedades anidadas como contactPreferences
                return {
                    ...prevUser,
                    [parent]: {
                        ...prevUser[parent],
                        [child]: checked
                    }
                };
            }
    
            // Para campos de texto
            return {
                ...prevUser,
                [name]: value
            };
        });
    };
    
    const handleSaveChanges = async () => {
        const token = localStorage.getItem('authToken');
        if (!token || loading || !isDirty) return; // Permitir guardado solo si hubo cambios

        // Log antes de guardar los cambios
        console.log("Guardando cambios con los siguientes datos del usuario:", user);

        try {
            const response = await fetch(`${VITE_API_BACKEND}/me/update`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
            if (!response.ok) throw new Error('Error al guardar los cambios');

            const updatedUser = await response.json();
            console.log('Datos de usuario actualizados:', updatedUser);

            // Guarda el usuario actualizado en el localStorage
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setUser(updatedUser);
            setIsDirty(false); // Reiniciar estado de cambios
            setSaveStatus({ success: true, message: 'Cambios guardados exitosamente' }); // Mensaje de éxito

            // Recarga los detalles del usuario después de guardar los cambios
            await fetchUserDetails();
        } catch (err) {
            console.error('Error al guardar cambios:', err);
            setSaveStatus({ success: false, message: 'Hubo un error al guardar los cambios' }); // Mensaje de error
        }
    };
    


    const handleLogout = () => {
        localStorage.removeItem("user");
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
                                name="first_name"
                                value={user?.first_name || ''}
                                onChange={handleUserInfoChange}
                            />
                        </div>
                        <div className="input-field">
                            <label>Apellido</label>
                            <input
                                type="text"
                                name="last_name"
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
                                <option value="Otro">Otro</option>
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
                                    <label htmlFor="city">Ciudad</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        placeholder="Ingresa tu ciudad"
                                        value={user?.city || ''}
                                        onChange={handleUserInfoChange}
                                    />
                                </div>
                                <div className="accordion-content active">
                                    <label htmlFor="street">Calle</label>
                                    <input
                                        type="text"
                                        id="street"
                                        name="street"
                                        placeholder="Ingresa tu dirección"
                                        value={user?.street || ''}
                                        onChange={handleUserInfoChange}
                                    />
                                </div>
                                <div className="accordion-content active">
                                    <label htmlFor="postal_code">Codigo Postal</label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="postalCode"
                                        placeholder="Ingresa tu codigo postal"
                                        value={user?.postal_code || ''}
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
                                checked={user?.contact_preferences?.email || false}
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
                                checked={user?.contact_preferences?.phone || false}
                                onChange={handleUserInfoChange}
                            />
                        </div>
                        <div className="contact-item">
                            <label htmlFor="whatsapp" className="contact-label">
                                Contactable por WhatsApp
                            </label>
                            <input
                                type="checkbox"
                                name="contactPreferences.whatsapp"
                                checked={user?.contact_preferences?.whatsapp || false}
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
