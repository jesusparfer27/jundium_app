import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate
import '../css/pages/admin.css';
import ProfileImage from '../components/profile-header/ProfileHeader';
import { useUser } from '../hooks/useUser'

export const Admin = () => {
    const [generalProduct, setGeneralProduct] = useState({
        name: '',
        collection: '',
        brand: '',
        type: '',
        gender: '',
        new_arrival: true,
        featured: false,
    });

    const [variants, setVariants] = useState([]);
    const [activeAccordion, setActiveAccordion] = useState('general');
    const [variantCount, setVariantCount] = useState(1);

    const [productData, setProductData] = useState([])

    const [currentVariant, setCurrentVariant] = useState({
        color: { colorName: '', hexCode: '' },
        size: [],
        material: '',
        price: '',
        discount: 0,
        image: [],
        is_main: false,
        description: '',
    });

    const [typeOptions] = useState(['camiseta', 'bolso', 'abrigo', 'zapatillas']);

    const [error, setError] = useState('');
    const navigate = useNavigate(); // useNavigate para redirigir
    const { user } = useUser();
    console.log(user)
    const { VITE_API_BACKEND } = import.meta.env;
    const [isAdmin, setIsAdmin] = useState(false); // Estado para verificar si el usuario es admin
    const [adminData, setAdminData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);  // Estado para manejo de carga

    useEffect(() => {
        // Espera hasta que el usuario esté cargado completamente
        if (!user) return;

        // Verifica si el usuario tiene permisos válidos
        if (!user.permissions) {
            console.error('El usuario no tiene permisos definidos:', user);
            navigate('/error');
        } else {
            const { manage_orders, manage_products, manage_users, view_reports } = user.permissions;

            // Verifica si el usuario tiene algún permiso administrativo
            if (manage_orders || manage_products || manage_users || view_reports) {
                setIsAdmin(true);
            } else {
                console.warn('El usuario no tiene permisos administrativos:', user.permissions);
                navigate('/error');
            }
        }
    }, [user, navigate]);

    useEffect(() => {
        console.log('Estado de usuario:', user);
    }, [user]);

    // Cambiar estado para las propiedades generales del producto
    const handleGeneralChange = (e) => {
        const { id, value } = e.target;
        setGeneralProduct({ ...generalProduct, [id]: value });
    };

    // Cambiar estado para las propiedades de la variante actual
    const handleVariantChange = (e) => {
        const { id, value, type, checked } = e.target;
        setCurrentVariant({
            ...currentVariant,
            [id]: type === 'checkbox' ? checked : value,
        });
    };

    const addNewVariantAccordion = () => {
        // Validar que la variante actual tenga datos válidos antes de guardarla
        if (!currentVariant.color.colorName || !currentVariant.price) {
            alert('Por favor, completa todos los campos obligatorios de la variante.');
            return;
        }

        // Guardar la variante actual en la lista de variantes
        setVariants((prevVariants) => [...prevVariants, currentVariant]);

        // Reiniciar el estado de la variante actual
        setCurrentVariant({
            color: { colorName: '', hexCode: '' },
            size: [],
            material: '',
            price: '',
            discount: 0,
            image: [],
            is_main: false,
            description: '',
        });

        // Incrementar el contador de variantes (si se usa para el diseño)
        setVariantCount((prevCount) => prevCount + 1);
    };

    // Agregar talla al array de tamaños de la variante
    const addSize = (size) => {
        if (!size || currentVariant.size.includes(size)) return;
        setCurrentVariant((prev) => ({
            ...prev,
            size: [...prev.size, size],
        }));
    };

    // Agregar imagen al array de imágenes de la variante
    const addImage = (url) => {
        if (!url) return;
        setCurrentVariant((prev) => ({
            ...prev,
            image: [...prev.image, url],
        }));
    };

    // Guardar la variante actual en la lista de variantes
    const saveVariant = () => {
        setVariants((prev) => [...prev, currentVariant]);
        setCurrentVariant({
            color: { colorName: '', hexCode: '' },
            size: [],
            material: '',
            price: '',
            discount: 0,
            image: [],
            is_main: false,
            description: '',
        });
    };

    // Cambiar el estado de `new_arrival` después de una semana
    useEffect(() => {
        const timer = setTimeout(() => {
            setGeneralProduct((prev) => ({ ...prev, new_arrival: false }));
        }, 7 * 24 * 60 * 60 * 1000); // 1 semana

        return () => clearTimeout(timer);
    }, []);

    // Manejar el envío del producto completo
    const handleSubmit = () => {
        const completeProduct = {
            ...generalProduct,
            variants,
        };
        console.log('Producto completo:', completeProduct);

    };

    useEffect(() => {
        if (isAdmin) {
            fetchAdminData();
        }
    }, [isAdmin]);

    const fetchAdminData = async () => {
        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch(`${VITE_API_BACKEND}/admin`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener los datos del admin.');
            }

            const data = await response.json();
            setAdminData(data);
        } catch (err) {
            console.error('Error en fetchAdminData:', err);
            setError('No se pudieron cargar los datos del admin.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { id, value, type, checked, files } = e.target;
        setProductData({
            ...productData,
            [id]: type === 'checkbox' ? checked : (type === 'file' ? files[0] : value),
        });
    };

    return (
        <section className="admin-panel">
            <ProfileImage initials={"ADMIN"} />

            {isAdmin ? (
                <>
                    <div className="createProductContainer">
                        <div className="createProduct">
                            <div className="containerTittle_AdminContainer_Create">
                                <div className="containerTittle_AdminCreate">
                                    <h1>Create a product</h1>
                                </div>
                            </div>
                            <div className="productForm">
                                <div className="divForm_ColumnContainer">
                                    <div className="divForm_Column">
                                        <label htmlFor="typeOfProduct" className="labelTypeOfProduct">Gender</label>
                                        <input
                                            type="text"
                                            id="typeOfProduct"
                                            className="inputTypeOfProduct"
                                            placeholder="EXAMPLE: Camiseta"
                                            value={productData.typeOfProduct}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="divForm_Column">
                                        <label htmlFor="typeOfProduct" className="labelTypeOfProduct">Brand</label>
                                        <input
                                            type="text"
                                            id="typeOfProduct"
                                            className="inputTypeOfProduct"
                                            placeholder="EXAMPLE: Camiseta"
                                            value={productData.typeOfProduct}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="divForm_Column">
                                        <label htmlFor="typeOfProduct" className="labelTypeOfProduct">Collection</label>
                                        <input
                                            type="text"
                                            id="typeOfProduct"
                                            className="inputTypeOfProduct"
                                            placeholder="EXAMPLE: Camiseta"
                                            value={productData.typeOfProduct}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="divForm_Column">
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
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`accordion ${activeAccordion === 'variant' ? 'open' : ''}`}>
                        <div className="createVariant_Container">
                            <div className="containerTittle_AdminContainer">
                                <div className="containerTittle_Admin">
                                    <h2 className='text_createVariant' onClick={() => setActiveAccordion('variant')}>Variante</h2>
                                </div>
                            </div>
                            {activeAccordion === 'variant' && (
                                <div className="variantForm">
                                    {/* Campos de la variante */}
                                    <div className="divForm_Column">
                                        <label htmlFor="colorName">Color Name:</label>
                                        <input
                                            type="text"
                                            id="colorName"
                                            value={currentVariant.color.colorName}
                                            onChange={(e) => handleVariantChange(e)}
                                        />
                                    </div>
                                    <div className="divForm_Column">
                                        <label htmlFor="hexCode">Hex Code:</label>
                                        <input
                                            type="text"
                                            id="hexCode"
                                            value={currentVariant.color.hexCode}
                                            onChange={(e) => handleVariantChange(e)}
                                        />
                                    </div>
                                    <div className="divForm_Column">
                                        <label htmlFor="material">Material:</label>
                                        <input
                                            type="text"
                                            id="material"
                                            value={currentVariant.material}
                                            onChange={handleVariantChange}
                                        />
                                    </div>
                                    {/* Agregar tallas */}
                                    <div className="divForm_Column">
                                        <label htmlFor="size">Talla:</label>
                                        <input
                                            type="text"
                                            id="size"
                                            placeholder="Ej: M"
                                            onKeyDown={(e) => e.key === 'Enter' && addSize(e.target.value)}
                                        />
                                    </div>
                                    <div className="divForm_Column">
                                        <div className="sizeList">
                                            {currentVariant.size.map((size, index) => (
                                                <div key={index}>{size}</div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="divForm_Column">
                                        <div className="introduceImage">
                                            <label htmlFor="image" className="labelImage">Subir Imagen</label>
                                            <input
                                                type="file"
                                                id="image"
                                                className="inputImage"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    {/* Agregar imágenes */}
                                    <div className="divForm_Column">
                                        <label htmlFor="image">Agregar Imagen:</label>
                                        <input
                                            type="text"
                                            id="image"
                                            placeholder="URL de la imagen"
                                            onKeyDown={(e) => e.key === 'Enter' && addImage(e.target.value)}
                                        />
                                    </div>
                                    <div className="divForm_Column">
                                        <div className="imageList">
                                            {currentVariant.image.map((img, index) => (
                                                <div key={index}>{img}</div>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Otros campos */}
                                    <div className="divForm_Column">
                                        <label htmlFor="price">Precio:</label>
                                        <input
                                            type="number"
                                            id="price"
                                            value={currentVariant.price}
                                            onChange={handleVariantChange}
                                        />
                                    </div>
                                    <div className="divForm_Column">
                                        <label htmlFor="discount">Descuento:</label>
                                        <input
                                            type="number"
                                            id="discount"
                                            value={currentVariant.discount}
                                            onChange={handleVariantChange}
                                        />
                                    </div>
                                    <div className="divForm_Column">
                                        <label htmlFor="description">Descripción:</label>
                                        <textarea
                                            id="description"
                                            value={currentVariant.description}
                                            onChange={handleVariantChange}
                                        />
                                    </div>
                                    {/* Checkbox para is_main */}
                                    <div className="divForm_Column">
                                        <label htmlFor="is_main">¿Es Principal?</label>
                                        <input
                                            type="checkbox"
                                            id="is_main"
                                            checked={currentVariant.is_main}
                                            onChange={handleVariantChange}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="submitEdition">
                        <button className="submitCreateButton" onClick={addNewVariantAccordion}>Añadir otra variante</button>
                    </div>

                    <div className="submitEdition">
                        <button className="submitCreateButton" onClick={handleSubmit}>
                            Crear Producto
                        </button>
                    </div>


                    <div className="editProductContainer">
                        <div className="editProduct">
                            <div className="containerTittle_Admin">
                                <h1>Edit a product</h1>
                            </div>
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
