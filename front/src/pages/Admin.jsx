import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate
import '../css/pages/admin.css';
import ProfileImage from '../components/profile-header/ProfileHeader';
import { useUser } from '../hooks/useUser'

export const Admin = () => {

    const [variants, setVariants] = useState([]);
    const [variantCount, setVariantCount] = useState(0);
    const [activeAccordion, setActiveAccordion] = useState('general');
    const [imageUrls, setImageUrls] = useState([]);
    // Estado para guardar los archivos seleccionados
    const [fileNames, setFileNames] = useState([]);

    const [generalProduct, setGeneralProduct] = useState({
        collection: '',
        brand: '',
        type: '',
        gender: '',
        new_arrival: true,
        featured: false,
    });
    const [currentVariant, setCurrentVariant] = useState({
        color: { colorName: '', hexCode: '' },
        size: [],
        material: '',
        name: '',
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

    // LOGICAS PARA LA AUTORIZACIÓN DEL ADMINISTRADOR

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





    // LOGICAS PARA CREAR TALLAS

    // Manejar el cambio en el input de talla
    const handleSizeChange = (e) => {
        setCurrentSize(e.target.value.toUpperCase()); // Convertir a mayúsculas
    };

    // Eliminar talla del listado
    const handleDeleteSize = (sizeToRemove) => {
        const updatedSizes = sizes.filter((size) => size !== sizeToRemove);
        setSizes(updatedSizes);
        setCurrentVariant((prevVariant) => ({
            ...prevVariant,
            size: updatedSizes,
        }));
    };

    // Agregar talla al listado
    const handleAddSize = () => {
        if (currentSize && !sizes.includes(currentSize)) {
            const updatedSizes = [...sizes, currentSize.toUpperCase()];
            setSizes(updatedSizes);
            setCurrentVariant((prevVariant) => ({
                ...prevVariant,
                size: updatedSizes,
            }));
        } else {
            alert('La talla ya está en la lista o está vacía.');
        }
        setCurrentSize('');
    };




    // LOGICAS PARA AGREGAR IMAGENES

    // Agregar imagen al array de imágenes de la variante
    const addImage = (url) => {
        if (!url) return;
        setCurrentVariant((prev) => ({
            ...prev,
            image: [...prev.image, url],
        }));
    };


    const generateImageFolderPath = (product, variant) => {
        console.log('Product:', product);
        console.log('Variant:', variant);
        // Destructurar con validaciones
        const type = product?.type || 'unknownType';
        const gender = product?.gender || 'unknownGender';
        const name = variant?.name || 'unknownProduct';
        const colorName = variant?.color?.colorName || 'unknownColor';

        // Crear estructura de carpetas
        const folderPath = `${gender}/${type}/${name}/${colorName}`;
        console.log('Folder Path:', folderPath);
        return folderPath;
    };

    // Ejemplo de uso
    const folderPath = generateImageFolderPath(generalProduct, currentVariant);
    console.log(folderPath); // Esto mostrará la ruta generada en consola



    // Manejar el cambio en un campo de input de imagen

    const handleImageChange = (index, value) => {
        const endpoint = value.trim();
        if (imageUrls.includes(endpoint) && imageUrls[index] !== endpoint) {
            alert("El endpoint ya existe.");
            return;
        }

        const updatedUrls = [...imageUrls];
        updatedUrls[index] = endpoint || '';
        setImageUrls(updatedUrls);

        setCurrentVariant((prevVariant) => ({
            ...prevVariant,
            image: updatedUrls.filter((url) => url !== ''), // Eliminar cualquier valor vacío
        }));
    };


    const handleDeleteImageInput = (index) => {
        const updatedUrls = imageUrls.filter((_, i) => i !== index); // Removemos el índice correspondiente
        setImageUrls(updatedUrls);

        // Sincronizamos con currentVariant.image
        setCurrentVariant((prevVariant) => ({
            ...prevVariant,
            image: updatedUrls,
        }));
    };

    const handleAddImageInput = () => {
        if (imageUrls.includes('')) {
            alert("Ya existe un campo vacío.");
            return;
        }
        setImageUrls((prevUrls) => [...prevUrls, '']);  // Asegúrate de que sea una cadena vacía
    };



    // HANDLE CHANGES

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

    // Cambiar estado para las propiedades generales del producto
    const handleGeneralChange = (e) => {
        const { id, value, type, checked } = e.target;
        setGeneralProduct((prev) => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value,
        }));
    };
    

    // Manejar el envío del producto completo

    const handleChange = (e) => {
        const { id, type, files } = e.target;

        if (type === 'file') {
            const selectedFiles = Array.from(files); // Convierte el FileList a un array

            // Validar archivos: extensión y tamaño (máximo 2 MB)
            const invalidFile = selectedFiles.find(file => file.size > 2 * 1024 * 1024 || !['image/jpeg', 'image/png'].includes(file.type));

            if (invalidFile) {
                alert('Solo se permiten archivos JPEG o PNG de hasta 2 MB.');
                return;
            }

            // Actualizar el estado con el primer archivo seleccionado (o puedes manejar todos los archivos)
            setGeneralProduct((prev) => ({
                ...prev,
                [id]: selectedFiles[0], // Si solo quieres el primer archivo
            }));

            // Guardar los nombres de los archivos seleccionados
            setFileNames(selectedFiles.map(file => file.name)); // Guardar todos los nombres de los archivos
        } else {
            setGeneralProduct((prev) => ({
                ...prev,
                [id]: e.target[type === 'checkbox' ? 'checked' : 'value'],
            }));
        }
    };




    //  LOGICAS PARA EL SUBMIT DE PRODUCTOS Y VARIANTES

    const validateProductData = () => {
        if (!generalProduct.name || !generalProduct.type || variants.length === 0) {
            alert('Por favor, completa los campos obligatorios antes de enviar.');
            return false;
        }
        return true;
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

    const handleSubmit = async () => {
        if (!validateProductData()) return;

        const formData = new FormData();

        // Agregar datos generales del producto
        Object.keys(generalProduct).forEach((key) => {
            formData.append(key, generalProduct[key]);
        });

        // Agregar imágenes
        formData.append('imageUrls', JSON.stringify(imageUrls));
        console.log(formData)

        // Agregar variantes del producto
        formData.append('variants', JSON.stringify(variants));

        // Agregar imágenes de las variantes
        variants.forEach((variant, index) => {
            if (variant.image && variant.image.length > 0) {
                variant.image.forEach((file, idx) => {
                    formData.append(`image_${index}_${idx}`, file);
                });
            }
        });

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${VITE_API_BACKEND}/create-product`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Error al crear el producto.');
            }

            const data = await response.json();
            console.log('Producto creado con éxito:', data);
            navigate('/admin'); // Redirigir a la vista de administración o donde desees
        } catch (err) {
            console.error('Error en la creación del producto:', err);
        }
    };





    // LOGICAS PARA LOS ACORDEONES

    // Lógica para agregar una nueva variante sin reiniciar la variante actual
    const addNewVariantAccordion = (e) => {
        e.preventDefault();

        // Guardar la variante actual
        setVariants((prevVariants) => [...prevVariants, currentVariant]);

        // Incrementar el contador para la variante
        setVariantCount((prevCount) => prevCount + 1);

        // Agregar una nueva variante vacía para continuar trabajando en ella
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



    // LOGICAS PARA NEW ARRIVALS

    // Cambiar el estado de `new_arrival` después de una semana
    useEffect(() => {
        const timer = setTimeout(() => {
            setGeneralProduct((prev) => ({ ...prev, new_arrival: false }));
        }, 7 * 24 * 60 * 60 * 1000); // 1 semana

        return () => clearTimeout(timer);
    }, []);



    return (
        <section className="admin-panel">
            <ProfileImage initials={"ADMIN"} />

            {isAdmin ? (
                <>
                    <div className="createProductContainer">
                        <div className="createProduct">
                            <form onSubmit={handleSubmit}>
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
                                                id="gender"
                                                value={generalProduct.gender}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="mujer">Mujer</option>
                                                <option value="hombre">Hombre</option>
                                                <option value="unisex">Unisex</option>
                                            </select>
                                        </div>

                                        <div className="divForm_Column">
                                            <label htmlFor="brand" className="labelTypeOfProduct">Brand</label>
                                            <input
                                                type="text"
                                                id="brand"
                                                className="inputTypeOfProduct"
                                                placeholder="EXAMPLE: Nike"
                                                value={generalProduct.brand}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="divForm_Column">
                                            <label htmlFor="collection" className="labelTypeOfProduct">Collection</label>
                                            <input
                                                type="text"
                                                id="collection"
                                                className="inputTypeOfProduct"
                                                placeholder="EXAMPLE: Spring 2024"
                                                value={generalProduct.collection}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="divForm_Column">
                                            <label htmlFor="type" className="labelTypeOfProduct">Tipo de Producto</label>
                                            <select
                                                id="type"
                                                value={generalProduct.type}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Type</option>
                                                <option value="camiseta">Camiseta</option>
                                                <option value="abrigo">Abrigo</option>
                                                <option value="zapatillas">Zapatillas</option>
                                                <option value="bolso">Bolso</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>


                    <div className={`accordion ${activeAccordion === 'variant' ? 'open' : ''}`}>
                        <div className="createVariant_Container">
                            <div className="containerTittle_AdminContainer">
                                <div className="containerTittle_Admin">
                                    <h2 className='text_createVariant' onClick={() => setActiveAccordion('variant')}>
                                        Variante {variantCount + 1}
                                    </h2> {/* Aquí mostramos el número de variante */}
                                </div>
                            </div>

                            {/* Mostrar las variantes creadas */}


                            <div className="variant">
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
                                                multiple
                                                id="image"
                                                className="inputImage"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="fileList">
                                            {fileNames.length > 0 && (
                                                <ul>
                                                    {fileNames.map((name, index) => (
                                                        <li key={index}>{name}</li>
                                                    ))}
                                                </ul>
                                            )}
                                            {fileNames.length === 0 && <p>No hay archivos seleccionados.</p>}
                                        </div>
                                    </div>
                                    {/* Agregar imágenes */}
                                    <div className="divForm_Column">
                                        {/* Botón para agregar un nuevo input */}
                                        <div className="buttonContainer_addNew_imageUrl">
                                            <button
                                                className="button_addNew_imageUrl"
                                                type="button"
                                                onClick={handleAddImageInput}
                                            >
                                                Nuevo input
                                            </button>
                                        </div>
                                        <label htmlFor="image">Agregar Endpoint de Imagen:</label>

                                        {/* Lista de inputs dinámicos */}
                                        {imageUrls.map((imageUrl, index) => (
                                            <div key={index} className="imageInputContainer">
                                                <input
                                                    name={`image_${index}`}
                                                    type="text"
                                                    id={`image_${index}`}
                                                    placeholder="Endpoint de la imagen (e.g., /red-shoes)"
                                                    value={imageUrl || ''}  // Asegúrate de que no sea undefined
                                                    onChange={(e) => handleImageChange(index, e.target.value)}
                                                />
                                                <button
                                                    type="button"
                                                    className="button_remove_imageUrl"
                                                    onClick={() => handleDeleteImageInput(index)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Mostrar los endpoints en la lista */}
                                    <div className="divForm_Column">
                                        <div className="imageList">
                                            <strong>Endpoints Agregados:</strong>
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
                            </div>
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


                    {/* <div className="editProductContainer">
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
                    </div> */}
                </>
            ) : (
                <p>No tienes permisos para acceder a esta sección.</p>
            )
            }
        </section >
    );
};
