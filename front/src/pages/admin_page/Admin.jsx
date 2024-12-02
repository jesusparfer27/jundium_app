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


 {/* <div className="container_ButtonSubmitContainer">
                                <div className="submitEdition">
                                    <button className="submitCreateButton" onClick={() => handleDeleteVariant(index)}>Eliminar variante</button>
                                </div>
                            </div> */}

                                // const handleDeleteVariant = (index) => {
    //     setVariants((prevVariants) => {
    //         const updatedVariants = prevVariants.filter((_, i) => i !== index);
    //         return updatedVariants;
    //     });
    // };

                                        

                                        // const validateVariant = (variant) => {
    //     console.log('Validating Variant:', variant);

    //     if (!variant || !variant.name || !variant.color.colorName || !variant.color.hexCode || !variant.price) {
    //         setError('Por favor, complete todos los campos requeridos.');
    //         console.log('Validation Error: Missing required fields', variant);
    //         console.log('Validation Error: Falta completar campos requeridos.');
    //         return false;
    //     }
    //     if (isNaN(variant.price)) {
    //         setError('El precio debe ser un número válido.');
    //         console.log('Validation Error: El precio no es válido.');
    //         return false;
    //     }
    //     if (isNaN(variant.discount)) {
    //         setError('El descuento debe ser un número válido.');
    //         console.log('Validation Error: El descuento no es válido.');
    //         return false;
    //     }
    //     setError('');
    //     console.log('Validation Passed.');
    //     return true;
    // };

        // const handleImageChange = (e, index) => {
    //     const files = Array.from(e.target.files);
    //     const imageUrls = files.map((file) => URL.createObjectURL(file));

    //     setVariants((prevVariants) => {
    //         const updatedVariants = [...prevVariants];
    //         updatedVariants[index].image = imageUrls;
    //         return updatedVariants;
    //     });

    //     const fileNames = files.map((file) => file.name);
    //     setVariants((prevVariants) => {
    //         const updatedVariants = [...prevVariants];
    //         updatedVariants[index].file = fileNames;
    //         return updatedVariants;
    //     });
    // };


//     Hay un error en mi codigo y es que esta definiendose las img como una url, cuando quiero que sea por nombre de archivo que tienen

// example-blue-man-shoes-2

// no este 

// blob:http://localhost:5173/41a445bf-7697-4d89-ae6d-22eb10420ab7

// <div className="divForm_Column">
//                                                 <label htmlFor="img_name">Path to Image</label>
//                                                 {variants[index]?.image && Array.isArray(variants[index]?.image) && variants[index]?.image.map((image, imgIndex) => (
//                                                     <div key={imgIndex}>
//                                                         <input
//                                                             name={`image-${imgIndex}`}
//                                                             type="text"
//                                                             value={image}
//                                                             onChange={(e) => handleImageUrlChange(index, imgIndex, e.target.value)}
//                                                         />
//                                                         <button onClick={() => handleDeleteImageInput(index, imgIndex)}>Eliminar casilla</button>
//                                                     </div>
//                                                 ))}
//                                                 <button onClick={() => handleAddImageInput(index)}>Agregar casilla</button>
//                                             </div>