import { createContext, useContext, useState, useEffect, useMemo, useRef } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const VITE_API_BACKEND = import.meta.env.VITE_API_BACKEND;
    const isFetched = useRef(false);


    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            fetchUserDetails();
        } else {
            setLoading(false); // Si no hay usuario, no necesitas seguir cargando
        }
    }, []);

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
            return data; // Devuelve los pedidos
        } catch (err) {
            console.error('Error loading orders:', err);
        }
    };

    const fetchWishlistItems = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            const response = await fetch(`${VITE_API_BACKEND}/wishlist`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            return data; // Devuelve los elementos de la wishlist
        } catch (err) {
            console.error('Error loading wishlist:', err);
        }
    };

    const updateUserDetails = async (userData) => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            const response = await fetch(`${VITE_API_BACKEND}/user/update`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (!response.ok) throw new Error('Error al actualizar los datos');

            const updatedUser = await response.json();
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (err) {
            setError(err.message);
            console.error('Error updating user details:', err);
        }
    };

    const login = async (userData) => {
        setError(null); // Resetear error al intentar login
        try {
            const response = await fetch(`${VITE_API_BACKEND}/login`, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const responseData = await response.json();

            if (response.ok) {
                const usuario = responseData.data;
                setUser(usuario);
                localStorage.setItem("user", JSON.stringify(usuario));
                localStorage.setItem('authToken', responseData.token);
            } else {
                throw new Error(responseData.message || "Error en el servidor");
            }
        } catch (e) {
            setError(e.message || "Error en el servidor");
            console.error('Error en el inicio de sesión:', e);
        }
    };

    const register = async (userData) => {
        setError(null); // Resetear error al intentar registro
        try {
            const response = await fetch(`${VITE_API_BACKEND}/register`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            const responseData = await response.json();

            if (response.ok) {
                const user = responseData.data;
                setUser(user);
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem('authToken', responseData.token);
            } else {
                throw new Error(responseData.message || "Error en el registro");
            }
        } catch (e) {
            setError(e.message || "Error en el servidor");
            console.error('Error en el registro:', e);
        }
    };

    const fetchUserDetails = async () => {
        const token = localStorage.getItem('authToken');
        if (!token || isFetched.current) return; // Si no hay token o ya se ha llamado, detener

        try {
            if (!VITE_API_BACKEND) {
                throw new Error("VITE_API_BACKEND no está definido.");
            }

            const response = await fetch(`${VITE_API_BACKEND}/me`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error al obtener detalles del usuario: ${response.status}`);
            }

            const responseData = await response.json();
            console.log("Detalles del usuario traídos:", responseData);
            setUser(responseData.data);
            localStorage.setItem("user", JSON.stringify(responseData.data));
            isFetched.current = true; // Marcar como ejecutado
        } catch (error) {
            console.error("Error al obtener los detalles del usuario:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem('authToken');
        setUser(null);
        console.log("User logged out");
    };

    const value = useMemo(() => ({
        user,
        loading,
        error,
        login,
        logout,
        setUser,
        register,
        fetchUserDetails,
        updateUserDetails,
        fetchWishlistItems,
        fetchOrderItems,
    }), [user, loading, error]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
