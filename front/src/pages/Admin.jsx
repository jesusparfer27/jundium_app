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

    const [currentSize, setCurrentSize] = useState(''); // Talla actual a añadir
    const [sizes, setSizes] = useState([]); // Lista de tallas

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

    // Manejar el cambio en el input de talla
    const handleSizeChange = (e) => {
        setCurrentSize(e.target.value.toUpperCase()); // Convertir a mayúsculas para consistencia
    };

    // Agregar talla al listado
    const handleAddSize = () => {
        if (currentSize && !sizes.includes(currentSize)) {
            setSizes((prevSizes) => [...prevSizes, currentSize]);
        }
        setCurrentSize(''); // Limpiar el input después de añadir
    };

    // Eliminar talla del listado
    const handleDeleteSize = (sizeToRemove) => {
        setSizes((prevSizes) => prevSizes.filter((size) => size !== sizeToRemove));
    };

    // Cambiar estado para las propiedades de la variante actual
    const handleVariantChange = (e) => {
        const { id, value } = e.target;

        if (id === 'colorName' || id === 'hexCode') {
            setCurrentVariant((prev) => ({
                ...prev,
                color: {
                    ...prev.color,
                    [id === 'colorName' ? 'colorName' : 'hexCode']: value,
                },
            }));
        } else {
            setCurrentVariant((prev) => ({
                ...prev,
                [id]: value,
            }));
        }
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
                                        <select
                                            name=""
                                            id="">
                                            <option value="mujer">Mujer</option>
                                            <option value="hombre">Hombre</option>
                                            <option value="unisex">Unisex</option>
                                        </select>
                                    </div>
                                    <div className="divForm_Column">
                                        <label htmlFor="typeOfProduct" className="labelTypeOfProduct">Brand</label>
                                        <input
                                            type="text"
                                            id="brand"
                                            className="inputTypeOfProduct"
                                            placeholder="EXAMPLE: Camiseta"
                                            value={productData.brand}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="divForm_Column">
                                        <label htmlFor="typeOfProduct" className="labelTypeOfProduct">Collection</label>
                                        <input
                                            type="text"
                                            id="collection"
                                            className="inputTypeOfProduct"
                                            placeholder="EXAMPLE: Camiseta"
                                            value={productData.collection}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="divForm_Column">
                                        <label htmlFor="typeOfProduct" className="labelTypeOfProduct">Tipo de Producto</label>
                                        <select
                                            name=""
                                            id="">
                                            <option value="camiseta">Camiseta</option>
                                            <option value="abrigo">Abrigo</option>
                                            <option value="zapatillas">Zapatillas</option>
                                            <option value="bolso">Bolso</option>
                                        </select>
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
                                        <label htmlFor="colorName">Name:</label>
                                        <input
                                            name="name"
                                            type="text"
                                            id="name"
                                            value={currentVariant.name}
                                            onChange={handleVariantChange}
                                        />
                                    </div>
                                    <div className="divForm_Column">
                                        <label htmlFor="colorName">Color Name:</label>
                                        <input
                                            name="colorName"
                                            type="text"
                                            id="colorName"
                                            value={currentVariant.color.colorName}
                                            onChange={handleVariantChange}
                                        />
                                    </div>
                                    <div className="divForm_Column">
                                        <label htmlFor="hexCode">Hex Code:</label>
                                        <input
                                            name="hexCode"
                                            type="text"
                                            id="hexCode"
                                            value={currentVariant.color.hexCode}
                                            onChange={handleVariantChange}
                                        />
                                    </div>
                                    <div className="divForm_Column">
                                        <label htmlFor="material">Material:</label>
                                        <input
                                            name='material'
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
                                            value={currentSize}
                                            onChange={handleSizeChange}
                                        />
                                        <div className='sizeContainer_Button'>
                                            <button
                                                className="submitEditProductButton"
                                                onClick={handleAddSize}
                                            >
                                                Enviar talla
                                            </button>

                                        </div>
                                        <div className="containerSize_Display">
                                            <div className="blockSize_Display">
                                                <ul className="sizeDisplay">
                                                    {sizes.map((size, index) => (
                                                        <div className="sizeSelected_Group" key={index}>
                                                            <div className="sizeBlock_displaySize">
                                                                <li>{size}</li>
                                                            </div>
                                                            <div className="containerSize_displayButton">
                                                                <button
                                                                    className="deleteSize_Button"
                                                                    onClick={() => handleDeleteSize(size)}
                                                                >
                                                                    X
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="divForm_Column">
                                        <div className="introduceImage">
                                            <label htmlFor="image" className="labelImage">Subir Imagen</label>
                                            <input
                                                name='image'
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
                                            name='image'
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
                                            name='discount'
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
