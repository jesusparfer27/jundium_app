import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/pages/showing_product_page.css';

export const ShowingProductPage = () => {
    const { id } = useParams();
    console.log("ID del producto desde params:", id);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accordionOpen, setAccordionOpen] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedSize, setSelectedSize] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const { VITE_API_BACKEND, VITE_IMAGES_BASE_URL, VITE_PRODUCTS_ENDPOINT } = import.meta.env;

    const toggleAccordion = () => setAccordionOpen(!accordionOpen);

    
    const handleColorChange = (e) => {
        const selectedColor = e.target.value;
        const variant = product?.variants.find(variant => variant.color.colorName === selectedColor);

        if (variant) {
            setSelectedVariant(variant);
            setSelectedSize("");
            console.log("Product ID:", product?.id);
        } else {
            console.warn(`No se encontró variante para el color: ${selectedColor}`);
        }
    };

    const handleSizeChange = (e) => {
        const selectedSize = e.target.value;
        setSelectedSize(selectedSize);
    
        if (selectedVariant) {
            const variant = product.variants.find(variant =>
                variant.size.includes(selectedSize) &&
                variant.color.colorName === selectedVariant.color.colorName
            );
    
            if (variant) {
                setSelectedVariant(variant);
                console.log("ID de variante seleccionada:", variant.variant_id);
                
            } else {
                console.warn(`Tamaño no disponible para el color seleccionado y la talla ${selectedSize}`);
            }
        } else {
            console.warn('No hay una variante seleccionada previamente.');
        }
    };
    
    const getUserIdFromToken = (token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('Payload del token:', payload);
            return payload.id;
        } catch (error) {
            console.error('Error al decodificar el token:', error);
            return null;
        }
    };

    const handleAddToCart = async () => {

        
        const token = localStorage.getItem('authToken');
    
        if (!token) {
            console.error('No se encontró el token en localStorage');
            setErrorMessage('Por favor, inicia sesión para añadir productos al carrito.');
            return;
        }
        
    
        const userId = getUserIdFromToken(token);
    
        if (!userId) {
            console.error('No se pudo extraer el userId del token');
            setErrorMessage('Error al extraer información del usuario.');
            return;
        }
    
        // Asegúrate de que `product` y `selectedVariant` están definidos
        const productId = product?.id;
        console.log("ID del producto:", productId);
        const variantId = selectedVariant ? selectedVariant.variant_id : null;
    
        if (!productId) {
            console.error('No se ha cargado el producto correctamente');
            setErrorMessage('Error al obtener los datos del producto.');
            return;
        }
    
        if (!variantId) {
            console.error('No se ha seleccionado ninguna variante');
            setErrorMessage('Por favor, selecciona una variante antes de añadir al carrito.');
            return;
        }
    
        const quantity = 1;
    
        // Log del variant_id
        console.log("variant_id a enviar al backend:", variantId);
    
        console.log("Datos a enviar:", {
            user_id: userId,
            product_id: productId,
            variant_id: variantId,
            quantity: quantity,
        });
    
        try {
            const response = await fetch(`${VITE_API_BACKEND}/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    user_id: userId,
                    product_id: productId,
                    variant_id: variantId,
                    quantity: quantity,
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al añadir al carrito');
            }
    
            const data = await response.json();
            console.log('Producto añadido al carrito:', data);
        } catch (error) {
            console.error('Error al añadir al carrito:', error);
            setErrorMessage('Ocurrió un error al añadir el producto al carrito.');
        }
    };
    

    useEffect(() => {
        if (id) {
            console.log("ID del producto:", id);
            fetchProductById(id);
        }
    }, [id, VITE_API_BACKEND, VITE_PRODUCTS_ENDPOINT]);
    
    const fetchProductById = async (productId) => {
        try {
            const response = await fetch(`${VITE_API_BACKEND}${VITE_PRODUCTS_ENDPOINT}/${productId}`);
            if (!response.ok) throw new Error('Error al obtener el producto');
            
            const productData = await response.json();
            console.log('Datos del producto:', productData); // Verifica aquí
    
            // Asegúrate de que el id está en el objeto productData
            if (productData && productData._id) {
                productData.id = productData._id; // Asigna el ID a una propiedad esperada
                productData.variants = productData.variants.map(variant => ({
                    ...variant,
                    product_id: productData.id // Asegúrate de que el ID se almacena correctamente
                }));
                
                // Establecer la primera variante como seleccionada
                if (productData.variants.length > 0) {
                    setSelectedVariant(productData.variants[0]);
                    setSelectedSize(""); // Si quieres que esté vacío al principio
                }
            }
            
            setProduct(productData);
        } catch (error) {
            console.error('Error al obtener el producto:', error);
            setErrorMessage("Hubo un problema al cargar el producto. Inténtalo más tarde.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Cargando producto...</div>;
    if (!product) return <div>Producto no encontrado.</div>;

    const otherImages = selectedVariant?.image.slice(1) || [];

    return (
        <section className="productSection">
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <div className="imageContainer">
                {selectedVariant && selectedVariant.image.length > 0 ? (
                    <div className="productImage_ShowingPage">
                        {otherImages.map((image, index) => (
                            <img
                                key={index}
                                src={`${VITE_IMAGES_BASE_URL}${image}`}
                                alt={`${product.name} - ${selectedVariant.color.colorName}`}
                                className="otherProductImage"
                                onError={(e) => (e.target.src = 'ruta/a/imagen/por/defecto.jpg')}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="productImage">
                        <img src="ruta/a/imagen/por/defecto.jpg" alt="Imagen por defecto" />
                    </div>
                )}
            </div>

            <div className="infoProduct_Container">
                <div className="infoProduct_ShowingProduct">
                    <div className="infoProduct_Row">
                        <h2 className='h2_ShowingPage'>{product.name}</h2>
                        <p className='paraphHidden_Accordion'>{selectedVariant ? selectedVariant.material : product.description}</p>
                        <p>Precio: {selectedVariant ? selectedVariant.price : product.base_price}</p>

                        <button onClick={toggleAccordion} className="accordion">
                            {accordionOpen ? 'Ocultar materiales' : 'Mostrar materiales'}
                        </button>
                        {accordionOpen && (
                            <div className="accordionContent">
                                <p>Materiales del producto: {selectedVariant?.material}</p>
                            </div>
                        )}

                        <br />
                        <label htmlFor="size" className="label_Size">Tamaño:</label>
                        <select
                            id="size"
                            className="select_Size"
                            value={selectedSize}
                            onChange={handleSizeChange}
                        >
                            <option value="">Seleccionar Talla</option>
                            {[...new Set(product.variants.flatMap(variant => variant.size))].map((size, index) => (
                                <option key={index} value={size} className="option_Size">
                                    {size}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="color" className="label_Color">Color:</label>
                        <select id="color" className="select_Color" onChange={handleColorChange}>
                            <option value="">Seleccionar Color</option>
                            {product.variants.map((variant, index) => (
                                <option key={index} value={variant.color.colorName} className="option_Color">
                                    {variant.color.colorName}
                                </option>
                            ))}
                        </select>

                        <button className="addToCart" onClick={handleAddToCart}>Añadir al carrito</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ShowingProductPage;
