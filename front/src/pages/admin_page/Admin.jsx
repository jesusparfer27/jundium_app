import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate
import ProfileImage from "../../components/profile-header/ProfileHeader";

import  ProfileHeader  from '../../components/profile-header/ProfileHeader'
import { useUser } from "../../hooks/useUser";
import { Variant } from "../admin_page/variant-form/Variant";
import { Product } from "../admin_page/product-form/Product";

import "../../css/pages/admin.css";

export const Admin = () => {
    const [activeAccordion, setActiveAccordion] = useState("general");
    const navigate = useNavigate(); // useNavigate para redirigir
    const { user, loading } = useUser();
    const { VITE_API_BACKEND } = import.meta.env;
    const [isLoading, setIsLoading] = useState(true); // Estado para manejo de carga
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminData, setAdminData] = useState(null);
    const [error, setError] = useState("");

    // Función para obtener los datos del admin
    const fetchAdminData = async (token) => {
        try {
            const response = await fetch(`${VITE_API_BACKEND}/me`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Error al obtener los datos del admin.");
            }

            const data = await response.json();
            setAdminData(data);
        } catch (err) {
            console.error("Error en fetchAdminData:", err);
            setError("No se pudieron cargar los datos del admin.");
        } finally {
            setIsLoading(false);
        }
    };

    // Función para obtener los permisos del usuario
    const fetchUserPermissions = async (token) => {
        try {
            const response = await fetch(`${VITE_API_BACKEND}/admin`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (!response.ok) {
                throw new Error(`Error al obtener los permisos del usuario: ${response.status}`);
            }
    
            const userData = await response.json();
    
            // Verificar que los permisos existen antes de intentar acceder a ellos
            const permissions = userData.permissions;
    
            if (!permissions) {
                console.error("Permisos no encontrados en los datos del usuario.");
                navigate("/error");
                return;
            }
    
            console.log("Permisos recibidos:", permissions); // Para depuración
    
            // Verificar si todos los permisos son true
            const allPermissionsGranted = Object.values(permissions).every(permission => permission === true);
    
            if (allPermissionsGranted) {
                setIsAdmin(true);
                fetchAdminData(token);  // Cargar datos del admin
            } else {
                console.warn("El usuario no tiene permisos administrativos completos.");
                navigate("/error");  // Redirigir a la página de error
            }
        } catch (err) {
            console.error("Error al obtener permisos:", err);
            navigate("/error");  // Redirigir en caso de error
        }
    };
    
    


    // useEffect para verificar el estado del token y los permisos del usuario
    useEffect(() => {
        const token = localStorage.getItem("authToken");

        if (!token) {
            console.error("No se encontró un token de autenticación.");
            navigate("/login");
            return;
        }

        fetchUserPermissions(token);
    }, [navigate, VITE_API_BACKEND]);

    return (
        <>
        <div className="container_adminContainer">
         <ProfileHeader initials="ADMIN"/>
         <Product/>
         <Variant/>
        </div>

        </>
    );
};
