import React, { useState, useEffect } from 'react';
import '../css/pages/admin.css';
import ProfileImage from '../components/profile-header/ProfileHeader';

export const Admin = () => {
    const [productData, setProductData] = useState({
        reference: '',
        typeOfProduct: '',
        name: '',
        price: '',
        image: null,
        multimedia: null,
        sizes: '',
        colors: '',
        materials: '',
        description: '',
        discount: '',
        outOfStock: false,
    });

    const [error, setError] = useState('');
    const [userRole, setUserRole] = useState(''); // Estado para el rol del usuario

    useEffect(() => {
        // Aquí se debe obtener el rol del usuario desde el backend o contexto
        // Simulamos la obtención del rol del usuario actual
        const currentUserRole = 'admin'; // Ejemplo: obtener del contexto o API
        setUserRole(currentUserRole);
    }, []);

    const handleChange = (e) => {
        const { id, value, type, checked, files } = e.target;
        setProductData({
            ...productData,
            [id]: type === 'checkbox' ? checked : (type === 'file' ? files[0] : value)
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!productData.reference) {
            setError('Debes introducir la referencia');
            return;
        }
        setError('');
        console.log('Producto creado/actualizado:', productData);
    };

    // Verificar si el usuario tiene permisos de administrador
    const isAdmin = userRole === 'admin';

    return (
        <section className="admin-panel">
            <ProfileImage initials={"ADMIN"}/>

            {isAdmin ? (
                <>
                    <div className="createProductContainer">
                        <div className="createProduct">
                            <div className="introduceTypeOfProduct">
                                <label htmlFor="typeOfProduct" className="labelTypeOfProduct">Tipo de Producto</label>
                                <input 
                                    type="text" 
                                    id="typeOfProduct" 
                                    className="inputTypeOfProduct" 
                                    placeholder="EXAMPLE: Camiseta" 
                                    value={productData.typeOfProduct}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="introduceName">
                                <label htmlFor="name" className="labelName">Nombre</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    className="inputName" 
                                    placeholder="EXAMPLE: Camiseta Básica" 
                                    value={productData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="introducePrice">
                                <label htmlFor="price" className="labelPrice">Precio</label>
                                <input 
                                    type="text" 
                                    id="price" 
                                    className="inputPrice" 
                                    placeholder="EXAMPLE: $19.99" 
                                    value={productData.price}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="introduceImage">
                                <label htmlFor="image" className="labelImage">Subir Imagen</label>
                                <input 
                                    type="file" 
                                    id="image" 
                                    className="inputImage"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="introduceMultimedia">
                                <label htmlFor="multimedia" className="labelMultimedia">Contenido Multimedia</label>
                                <input 
                                    type="file" 
                                    id="multimedia" 
                                    className="inputMultimedia"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="introduceSetSizes">
                                <label htmlFor="sizes" className="labelSizes">Tamaños Disponibles</label>
                                <input 
                                    type="text" 
                                    id="sizes" 
                                    className="inputSizes" 
                                    placeholder="EXAMPLE: S, M, L, XL" 
                                    value={productData.sizes}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="introduceSetColors">
                                <label htmlFor="colors" className="labelColors">Colores Disponibles (HEX)</label>
                                <input 
                                    type="text" 
                                    id="colors" 
                                    className="inputColors" 
                                    placeholder="EXAMPLE: #191919" 
                                    value={productData.colors}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="introduceAddMaterials">
                                <label htmlFor="materials" className="labelMaterials">Materiales</label>
                                <input 
                                    type="text" 
                                    id="materials" 
                                    className="inputMaterials" 
                                    placeholder="EXAMPLE: Algodón, Poliéster" 
                                    value={productData.materials}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="introduceAddDescription">
                                <label htmlFor="description" className="labelDescription">Descripción</label>
                                <textarea 
                                    id="description" 
                                    className="inputDescription" 
                                    placeholder="EXAMPLE: Camiseta de algodón de alta calidad." 
                                    value={productData.description}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="submitEdition">
                        <button className="submitCreateButton" onClick={handleSubmit}>
                            Crear Producto
                        </button>
                    </div>

                    <div className="editProductContainer">
                        <div className="editProduct">
                            <div className="editProductReference">
                                <label htmlFor="reference" className="labelReference">Referencia del Producto</label>
                                <input 
                                    type="text" 
                                    id="reference" 
                                    className="inputReference" 
                                    placeholder="EXAMPLE: #72312" 
                                    value={productData.reference}
                                    onChange={handleChange}
                                />
                                {error && <p className="error-text">{error}</p>}
                            </div>
                            <div className="editDiscount">
                                <label htmlFor="discount" className="labelDiscount">Descuento</label>
                                <input 
                                    type="text" 
                                    id="discount" 
                                    className="inputDiscount" 
                                    placeholder="EXAMPLE: 20%" 
                                    value={productData.discount}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="editSetOutOfStock">
                                <label htmlFor="outOfStock" className="labelOutOfStock">Fuera de Stock</label>
                                <input 
                                    type="checkbox" 
                                    id="outOfStock" 
                                    className="inputOutOfStock"
                                    checked={productData.outOfStock}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="submitEditProduct">
                        <button className="submitEditProductButton" onClick={handleSubmit}>
                            Editar Producto
                        </button>
                    </div>
                </>
            ) : (
                <p>No tienes permisos para acceder a esta sección.</p>
            )}
        </section>
    );
};
