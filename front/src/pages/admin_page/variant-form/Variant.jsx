import React, { useState, useEffect, useContext } from 'react';
import { ProductContext } from '../context/ProductContext';
import '../../../css/pages/admin.css'

export const Variant = () => {
    const { generalProduct, variants, setVariants } = useContext(ProductContext);

    const [sizes, setSizes] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [error, setError] = useState('');
    const [variantCount, setVariantCount] = useState(0);
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const [activeAccordion, setActiveAccordion] = useState(null);
    const [currentSize, setCurrentSize] = useState('');
    const [imageUrls, setImageUrls] = useState([]);
    const [currentVariant, setCurrentVariant] = useState({
        name: '',
        color: { colorName: '', hexCode: '' },
        size: [''],
        file: [],
        material: '',
        base_price: '',
        discount: 0,
        image: [''],
        is_main: false,
        description: '',
    });
    const { VITE_API_BACKEND } = import.meta.env;

    useEffect(() => {
        localStorage.setItem("variants", JSON.stringify(variants));
    }, [variants]);


    const handleVariantChange = (e) => {
        const index = selectedVariantIndex ?? 0; // Usa 0 como fallback
        if (index < 0 || index >= variants.length) {
            console.error('handleVariantChange Error: Índice de variante no válido.');
            return;
        }
        const { id, checked } = e.target;
        console.log(`handleVariantChange - Index: ${index}, ID: ${id}, Checked: ${checked}`);
        if (index === undefined || index === null) {
            console.error("Invalid index received:", index);
            return;
        }

        setVariants((prevVariants) => {
            const updatedVariants = [...prevVariants];
            const currentVariant = { ...updatedVariants[index] };

            if (id === 'is_main') {
                currentVariant.is_main = checked;
            } else if (id.includes('.')) {
                const [parentKey, childKey] = id.split('.');
                currentVariant[parentKey] = {
                    ...currentVariant[parentKey],
                    [childKey]: e.target.value,
                };
            } else {
                currentVariant[id] = e.target.value;
            }

            updatedVariants[index] = currentVariant;
            return updatedVariants;
        });
    };

    const handleAddImageInput = (index) => {
        setVariants((prevVariants) => {
            const updatedVariants = [...prevVariants];
            // Asegurarte de que `image` es siempre un array.
            if (!Array.isArray(updatedVariants[index].image)) {
                updatedVariants[index].image = [];
            }

            // Evita agregar un campo vacío si el último ya está vacío
            if (updatedVariants[index].image[updatedVariants[index].image.length - 1] === '') {
                return updatedVariants;
            }

            // Agregar un nuevo campo vacío de imagen
            updatedVariants[index].image.push('');
            return updatedVariants;
        });
    };

    const handleImageUploadChange = (e, index) => {
        const files = Array.from(e.target.files);
        console.log(`handleImageUploadChange - Index: ${index}, Files:`, files);
        const newUrls = files.map((file) => URL.createObjectURL(file));
        const newFileNames = files.map((file) => file.name);

        setVariants((prevVariants) => {
            const updatedVariants = [...prevVariants];
            const variant = updatedVariants[index];

            if (!Array.isArray(variant.file)) {
                variant.file = [];
            }
            variant.image = [...new Set([...variant.image, ...newUrls])];
            variant.file = [...new Set([...variant.file, ...newFileNames])];

            console.log(`handleImageUploadChange - Index: ${index}, Updated Variants:`, updatedVariants); // Debug log
            return updatedVariants;
        });
    };

    const handleImageChange = (e, index) => {
        const files = Array.from(e.target.files);
        const imageUrls = files.map((file) => URL.createObjectURL(file));

        setVariants((prevVariants) => {
            const updatedVariants = [...prevVariants];
            updatedVariants[index].image = imageUrls;
            return updatedVariants;
        });

        const fileNames = files.map((file) => file.name);
        setVariants((prevVariants) => {
            const updatedVariants = [...prevVariants];
            updatedVariants[index].file = fileNames;
            return updatedVariants;
        });
    };


    useEffect(() => {
        if (variants.length === 0) {
            setVariants([
                {
                    name: '',
                    color: { colorName: '', hexCode: '' },
                    size: [],
                    file: [],
                    material: '',
                    base_price: '',
                    discount: 0,
                    image: [],
                    is_main: false,
                    description: '',
                },
            ]);
        }
    }, []);

    const generateProductCode = () => {
        const code = 'PROD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        console.log('Generated Product Code:', code);  // Verifica que se genera correctamente
        return code;
    };
    

    const validateData = () => {
        if (!generalProduct.collection || !generalProduct.brand) {
            console.error("Faltan datos del producto.");
            return false;
        }
        for (const variant of variants) {
            if (!variant.name || !variant.base_price) {
                console.error("Faltan datos de una variante.");
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateData()) return;
    
        // Generar el código del producto solo en el frontend
        const updatedVariants = variants.map((variant) => {
            const productCode = generateProductCode();
            if (!productCode) {
                console.error("El código del producto es nulo o vacío");
                return null;
            }
            return {
                ...variant,
                product_code: productCode, // Añadimos el código generado
            };
        });
    
        console.log("Datos de las variantes antes de enviar al backend:", updatedVariants);
    
        if (updatedVariants.includes(null)) return; // Si alguna variante es inválida, no continuar
    
        const totalProducts = {
            ...generalProduct,
            variants: updatedVariants,
        };
    
        console.log("Productos enviados:", totalProducts);
    
        try {
            const response = await fetch(`${VITE_API_BACKEND}/create-product`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
                body: JSON.stringify({ generalProduct, variants: updatedVariants }), // Enviamos el product_code generado
            });
    
            if (!response.ok) throw new Error("Error al crear el producto.");
            console.log("Producto creado con éxito.");
        } catch (error) {
            console.error("Error al enviar el producto:", error);
        }
    };
    

    const handleSizeChange = (e, index) => {
        const size = e.target.value.toUpperCase();
        setVariants((prevVariants) => {
            const updatedVariants = [...prevVariants];
            if (updatedVariants[index]) {
                updatedVariants[index].size = updatedVariants[index].size || [];
                if (!updatedVariants[index].size.includes(size)) {
                    updatedVariants[index].size.push(size);
                }
            }
            return updatedVariants;
        });
    };

    const handleAddSize = (index) => {
        if (!currentSize.trim()) {
            alert('Por favor, ingrese una talla válida.');
            return;
        }

        setVariants((prevVariants) => {
            const updatedVariants = [...prevVariants];
            if (!updatedVariants[index].size) {
                updatedVariants[index].size = [];
            }
            if (updatedVariants[index].size.includes(currentSize)) {
                return updatedVariants;
            }
            updatedVariants[index].size = [...updatedVariants[index].size, currentSize];
            return updatedVariants;
        });

        setCurrentSize('');
    };

    const handleDeleteSize = (sizeToRemove, index) => {
        setVariants((prevVariants) => {
            const updatedVariants = [...prevVariants];
            updatedVariants[index].size = updatedVariants[index].size.filter((size) => size !== sizeToRemove);
            return updatedVariants;
        });
    };

    const generateImageFolderPath = (product, variant) => {
        const type = product?.type || 'unknownType';
        const gender = product?.gender || 'unknownGender';
        const name = variant?.name || 'unknownProduct';
        const colorName = variant?.color?.colorName || 'unknownColor';
        return `${gender}/${type}/${name}/${colorName}`;
    };

    const handleDeleteImageInput = (index, urlIndex) => {
        setVariants((prevVariants) => {
            const updatedVariants = [...prevVariants];
            updatedVariants[index].image = updatedVariants[index].image.filter((_, i) => i !== urlIndex);
            return updatedVariants;
        });
    };

    const handleImageUrlChange = (index, urlIndex, value) => {
        setVariants((prevVariants) => {
            const updatedVariants = [...prevVariants];
            updatedVariants[index].image[urlIndex] = value; // Actualiza el valor de la imagen
            return updatedVariants;
        });
    };

    const saveVariant = (index) => {
        if (validateVariant()) {
            setVariants((prevVariants) => {
                const updatedVariants = [...prevVariants];
                updatedVariants[index] = { ...currentVariant };
                return updatedVariants;
            });

            setCurrentVariant({
                name: '',
                color: { colorName: '', hexCode: '' },
                size: [],
                material: '',
                base_price: '',
                discount: 0,
                image: [],
                is_main: false,
                description: '',
            });
        }
    };

    const resetCurrentVariant = () => {
        setCurrentVariant({
            name: '',
            color: { colorName: '', hexCode: '' },
            size: [],
            material: '',
            base_price: '',
            discount: 0,
            image: [],
            is_main: false,
            description: '',
        });
        setSelectedVariantIndex(null);
    };

    const handleSaveImageUrlsToBackend = (e, index) => {
        const files = Array.from(e.target.files);
        const realImageUrls = files.map((file) => uploadImageToServer(file));

        setVariants((prevVariants) => {
            const updatedVariants = [...prevVariants];
            updatedVariants[index].image = realImageUrls;
            return updatedVariants;
        });
    };

    const handleSaveEdit = () => {
        if (validateVariant(currentVariant)) {
            const updatedVariants = [...variants];
            updatedVariants[selectedVariantIndex] = currentVariant;
            setVariants(updatedVariants);
            resetCurrentVariant();
        }
    };

    const addNewVariantForm = () => {
        setVariants((prevVariants) => [
            ...prevVariants,
            {
                name: '',
                color: { colorName: '', hexCode: '' },
                size: [],
                material: '',
                base_price: '',
                discount: 0,
                image: [''],
                is_main: false,
                description: '',
            },
        ]);
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="godDiv">
                    <div className={`accordionContainer ${activeAccordion === 'variant' ? 'open' : ''}`}>
                        {variants.map((variant, index) => (
                            <div className="godSon" key={index}>
                                <div className="createVariant_Container">
                                    <div className="containerTittle_AdminContainer">
                                        <div className="containerTittle_Admin">
                                            <h2 className='text_createVariant' onClick={() => setActiveAccordion('variant')}>
                                                Variante {index + 1}
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="variant">
                                        <div className="variantForm">
                                            <div className="divForm_Column">
                                                <label htmlFor="colorName">Name:</label>
                                                <input
                                                    name="name"
                                                    type="text"
                                                    id="name"
                                                    value={variants[index]?.name || ''}
                                                    onChange={(e) => handleVariantChange(e, index)}
                                                />
                                            </div>
                                            <div className="divForm_Column">
                                                <label htmlFor="colorName">Color Name:</label>
                                                <input
                                                    name="colorName"
                                                    type="text"
                                                    id="color.colorName"
                                                    value={variants[index]?.color?.colorName || ''}
                                                    onChange={(e) => handleVariantChange(e, index)}
                                                />
                                            </div>
                                            <div className="divForm_Column">
                                                <label htmlFor="hexCode">Hex Code:</label>
                                                <input
                                                    type="text"
                                                    id="color.hexCode"
                                                    value={variants[index]?.color?.hexCode || ''}
                                                    onChange={(e) => handleVariantChange(e, index)}
                                                />
                                            </div>
                                            <div className="divForm_Column">
                                                <label htmlFor="material">Material:</label>
                                                <input
                                                    name='material'
                                                    type="text"
                                                    id="material"
                                                    value={variants[index]?.material || ''}
                                                    onChange={(e) => handleVariantChange(e, index)}
                                                />
                                            </div>
                                            <div className="divForm_Column">
                                                <label htmlFor="size">Talla:</label>
                                                <input
                                                    type="text"
                                                    id="size"
                                                    placeholder="Ej: M"
                                                    value={currentSize}
                                                    onChange={(e) => setCurrentSize(e.target.value.toUpperCase())}
                                                />
                                                <div className="sizeContainer_Button">
                                                    <button
                                                        className="submitEditProductButton"
                                                        onClick={() => handleAddSize(index)}
                                                    >
                                                        Enviar talla
                                                    </button>
                                                </div>
                                                <div className="containerSize_Display">
                                                    <ul className="sizeDisplay">
                                                        {variants[index]?.size.map((size, idx) => (
                                                            <li key={idx} className="sizeSelected_Group">
                                                                {size}
                                                                <button
                                                                    className="deleteSize_Button"
                                                                    onClick={() => handleDeleteSize(size, index)}
                                                                >
                                                                    X
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="divForm_Column">
                                                <div className="introduceImage">
                                                    <label htmlFor={`image-${index}`} className="labelImage">Subir Imagen</label>
                                                    <input
                                                        name="image"
                                                        type="file"
                                                        multiple
                                                        id={`image-${index}`}
                                                        className="inputImage"
                                                        onChange={(e) => handleImageUploadChange(e, index)}
                                                    />
                                                </div>
                                                <div className="containerForPreviews">
                                                    {variants[index]?.image.map((imageUrl, imgIndex) => (
                                                        <div key={imgIndex} className="imagePreview">
                                                            <img
                                                                src={imageUrl}
                                                                alt={`Preview ${imgIndex}`}
                                                                className="previewImage"
                                                            />
                                                            <p className="fileName">{variants[index]?.file[imgIndex]}</p>
                                                            <button
                                                                className="deleteImage_Button"
                                                                onClick={() => handleDeleteImageInput(index, imgIndex)}
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="divForm_Column">
                                                <label htmlFor="img_name">Path to Image</label>
                                                {variants[index]?.image && Array.isArray(variants[index]?.image) && variants[index]?.image.map((image, imgIndex) => (
                                                    <div key={imgIndex}>
                                                        <input
                                                            name={`image-${imgIndex}`}
                                                            type="text"
                                                            value={image}
                                                            onChange={(e) => handleImageUrlChange(index, imgIndex, e.target.value)}
                                                        />
                                                        <button onClick={() => handleDeleteImageInput(index, imgIndex)}>Eliminar casilla</button>
                                                    </div>
                                                ))}
                                                <button onClick={() => handleAddImageInput(index)}>Agregar casilla</button>
                                            </div>


                                            <div className="divForm_Column">
                                                <label htmlFor="price">Precio:</label>
                                                <input
                                                    type="number"
                                                    id="base_price"
                                                    value={variants[index]?.base_price || ''}
                                                    onChange={(e) => handleVariantChange(e, index)}
                                                />
                                            </div>
                                            <div className="divForm_Column">
                                                <label htmlFor="discount">Descuento:</label>
                                                <input
                                                    name='discount'
                                                    type="number"
                                                    id="discount"
                                                    value={variants[index]?.discount || ''}
                                                    onChange={(e) => handleVariantChange(e, index)}
                                                />
                                            </div>
                                            <div className="divForm_Column">
                                                <label htmlFor="description">Descripción:</label>
                                                <textarea
                                                    id="description"
                                                    value={variants[index]?.description || ''}
                                                    onChange={(e) => handleVariantChange(e, index)}
                                                />
                                            </div>
                                            <div className="divForm_Column">
                                                <label htmlFor="is_main">¿Es Principal?</label>
                                                <input
                                                    type="checkbox"
                                                    id="is_main"
                                                    checked={variant.is_main}
                                                    onChange={(e) => handleVariantChange(e, index)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div >
            </form>

            <div className="container_ButtonSubmit">
                <div className="container_ButtonSubmitContainer">
                    <div className="submitEdition">
                        <button className="submitCreateButton" onClick={addNewVariantForm}>Agregar Nueva Variante</button>
                    </div>
                    <div className="submitEdition">
                        <button
                            className="submitCreateButton"
                            onClick={(event) => {
                                console.log('Selected Index:', selectedVariantIndex);
                                handleSubmit(event, selectedVariantIndex);
                            }}
                        >
                            Enviar Producto
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};