import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import  ProfileHeader  from '../../components/profile-header/ProfileHeader'
import { useUser } from "../../hooks/useUser";
import { Variant } from "../admin_page/variant-form/Variant";
import { Product } from "../admin_page/product-form/Product";

import "../../css/pages/admin.css";

export const Admin = () => {
    const [activeAccordion, setActiveAccordion] = useState("general");
    const navigate = useNavigate();
    const { user, loading } = useUser();
    const { VITE_API_BACKEND } = import.meta.env;
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminData, setAdminData] = useState(null);
    const [error, setError] = useState("");


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
    
            const permissions = userData.permissions;
    
            if (!permissions) {
                console.error("Permisos no encontrados en los datos del usuario.");
                navigate("/error");
                return;
            }
    
            console.log("Permisos recibidos:", permissions);
    
            const allPermissionsGranted = Object.values(permissions).every(permission => permission === true);
    
            if (allPermissionsGranted) {
                setIsAdmin(true);
                fetchAdminData(token);
            } else {
                console.warn("El usuario no tiene permisos administrativos completos.");
                navigate("/error"); 
            }
        } catch (err) {
            console.error("Error al obtener permisos:", err);
            navigate("/error");
        }
    };
    
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