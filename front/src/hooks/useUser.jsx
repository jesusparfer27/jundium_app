import { createContext, useContext, useState, useEffect } from "react";

// Crear un contexto de Usuario que abarque toda la aplicación
const UserContext = createContext();

// Crear un provider y exportarlo para usarlo en main.jsx
export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false); // Estado de carga
    const { VITE_API_URL } = import.meta.env;

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        if (user) {
            console.log("Usuario loggeado:", user);
        } else {
            console.log("No hay usuario loggeado.");
        }
    }, [user]);

    // Función para iniciar sesión
    const login = async (userData) => {
        try {
            const response = await fetch(`${VITE_API_URL}/login`, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const responseData = await response.json();
            console.log("Respuesta del servidor:", responseData);

            if (response.ok) {
                const usuario = responseData.data;
                setUser(usuario);
                localStorage.setItem("user", JSON.stringify(usuario));
                localStorage.setItem('authToken', responseData.token);
                await fetchUserDetails(); // Llama a fetchUserDetails para obtener detalles del usuario
                return null; // Sin errores
            } else {
                throw new Error(responseData.message || "Error en el servidor");
            }
        } catch (e) {
            console.error('Error en el inicio de sesión:', e);
            return e.message || "Error en el servidor";
        }
    };

    // Función para registrarse
    const register = async (userData) => {
        try {
            const response = await fetch(`${VITE_API_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            const responseData = await response.json();

            if (response.ok) {
                const usuario = responseData.data;
                setUser(usuario);
                localStorage.setItem("user", JSON.stringify(usuario));
                localStorage.setItem('authToken', responseData.token);
                return null; // Sin errores
            } else {
                throw new Error(responseData.message || "Error en el registro");
            }
        } catch (e) {
            console.error('Error en el registro:', e);
            return e.message || "Error en el servidor";
        }
    };

    // Función para obtener el usuario logueado
    const fetchUserDetails = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.warn("No token found. User details cannot be retrieved.");
            return null; // Sin token, no hay usuario que recuperar
        }

        setLoading(true); // Estado de carga

        try {
            const response = await fetch(`${VITE_API_URL}/users/me`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorMessage = `Error al obtener los detalles del usuario: ${response.status} ${response.statusText}`;
                throw new Error(errorMessage);
            }

            const responseData = await response.json();
            setUser(responseData);
            localStorage.setItem("user", JSON.stringify(responseData));

        } catch (error) {
            console.error("Error al obtener el usuario:", error.message);
            // Aquí podrías manejar el error, como mostrar un mensaje al usuario
        } finally {
            setLoading(false); // Finaliza el estado de carga
        }
    };

    // Función para cerrar sesión
    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem('authToken');
        setUser(null);
        console.log("User logged out");
    };

    return (
        <UserContext.Provider value={{ user, loading, login, logout, register, fetchUserDetails }}>
            {children}
        </UserContext.Provider>
    );
}

// Crear un Custom Hook para usar nuestro contexto de Usuario
export function useUser() {
    return useContext(UserContext);
}
