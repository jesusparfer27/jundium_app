import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/pages/showing_product_page.css';

export const ShowingProductPage = () => {
    const { id } = useParams();
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
            return payload.id;
        } catch (error) {
            console.error('Error al decodificar el token:', error);
            return null;
        }
    };

    const handleAddToCart = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setErrorMessage('Por favor, inicia sesión para añadir productos al carrito.');
            return;
        }

        const userId = getUserIdFromToken(token);
        if (!userId) {
            setErrorMessage('Error al extraer información del usuario.');
            return;
        }

        const productId = product?.id;
        const variantId = selectedVariant?.variant_id;
        if (!productId || !variantId) {
            setErrorMessage('Selecciona un color y tamaño antes de añadir al carrito.');
            return;
        }

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
                    quantity: 1,
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
            fetchProductById(id);
        }
    }, [id, VITE_API_BACKEND, VITE_PRODUCTS_ENDPOINT]);

    const fetchProductById = async (productId) => {
        try {
            const response = await fetch(`${VITE_API_BACKEND}${VITE_PRODUCTS_ENDPOINT}/${productId}`);
            if (!response.ok) throw new Error('Error al obtener el producto');

            const productData = await response.json();
            if (productData && productData._id) {
                productData.id = productData._id;
                productData.variants = productData.variants.map(variant => ({
                    ...variant,
                    product_id: productData.id,
                }));
                setProduct(productData);

                // Obtener `variant_id` de la URL
                const params = new URLSearchParams(location.search);
                const variantIdFromUrl = params.get("variant_id");

                // Buscar la variante por `variant_id` y establecerla como `selectedVariant`
                if (variantIdFromUrl) {
                    const variant = productData.variants.find(v => v.variant_id === variantIdFromUrl);
                    if (variant) {
                        setSelectedVariant(variant);
                    } else {
                        console.warn("No se encontró una variante con el ID especificado.");
                    }
                } else {
                    setSelectedVariant(productData.variants[0]); // Fallback a la primera variante si no hay `variant_id` en la URL
                }
            }
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
                        <h2 className="h2_ShowingPage">{product.name}</h2>

                        <p className="paraphHidden_Accordion">
                            {selectedVariant ? selectedVariant.material : product.description}
                        </p>
                        <p>Precio: {selectedVariant ? selectedVariant.price : product.base_price}</p>

                        <button onClick={toggleAccordion} className="accordion">
                            {accordionOpen ? 'Ocultar materiales' : 'Mostrar materiales'}
                        </button>
                        {accordionOpen && selectedVariant && (
                            <div className="accordionContent">
                                <p>Materiales del producto: {selectedVariant.material}</p>
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
